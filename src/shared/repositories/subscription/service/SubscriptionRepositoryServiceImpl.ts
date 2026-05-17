import { randomBytes, randomUUID } from 'crypto';
import { CreateSubscriptionRequest } from '../domain/CreateSubscriptionRequest';
import { CreateApiKeyRequest } from '../domain/CreateApiKeyRequest';
import { GetSubscriptionDetailsByEmailRequest } from '../domain/GetSubscriptionDetailsByEmailRequest';
import { ApiKeys, Clients, PaymentFrequencies, Plans, Subscriptions, SubscriptionStatuses } from '../../entities';
import { IsNull, Repository } from 'typeorm';
import { SubscriptionRepositoryService } from './SubscriptionRepositoryService';
import { RepositoriesSymbols } from '../../ioc';
import { ApiGatewaySymbols } from '../../../../shared/api-gateway/ioc';
import type { ApiGatewayService, ApiKeyUsage } from '../../../../shared/api-gateway/service/ApiGatewayService';
import { BadRequestException, Inject, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SubscriptionApiKeyItem } from '../domain/SubscriptionApiKeyItem';
import { SubscriptionDetailsResponse } from '../domain/SubscriptionDetailsResponse';

export class SubscriptionRepositoryServiceImpl implements SubscriptionRepositoryService {
	private formatDateTime(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
	}
	constructor(
		@Inject(ApiGatewaySymbols.ApiGatewayService)
		private readonly apiGatewayService: ApiGatewayService,
		@Inject(RepositoriesSymbols.ApiKeyRepository)
		private apiKeyRepository: Repository<ApiKeys>,
		@Inject(RepositoriesSymbols.PlanRepository)
		private planRepository: Repository<Plans>,
		@Inject(RepositoriesSymbols.SubscriptionRepository)
		private subscriptionRepository: Repository<Subscriptions>,
		@Inject(RepositoriesSymbols.ClientRepository)
		private clientRepository: Repository<Clients>,
		@Inject(RepositoriesSymbols.SubscriptionStatusRepository)
		private subscriptionStatusRepository: Repository<SubscriptionStatuses>,
		@Inject(RepositoriesSymbols.PaymentFrequencyRepository)
		private paymentFrequencyRepository: Repository<PaymentFrequencies>,
	) {}

	private parseSelectedCalculators(selectedCalculators: string): string[] {
		if (!selectedCalculators?.trim()) {
			return [];
		}

		try {
			const parsed = JSON.parse(selectedCalculators) as unknown;
			return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
		} catch {
			return [];
		}
	}

	private mapApiKey(apiKey: ApiKeys, usage?: ApiKeyUsage): SubscriptionApiKeyItem {
		return {
			id: apiKey.ID,
			name: apiKey.Name,
			apiKey: apiKey.ApiKey,
			isActive: apiKey.IsActive,
			createdAt: apiKey.CreatedAt,
			disabledAt: apiKey.DisabledAt ?? null,
			usedThisMonth: usage?.used ?? 0,
			remainingThisMonth: usage?.remaining ?? 0,
		};
	}

	private async getSubscriptionOrFail(subscriptionId: string): Promise<Subscriptions> {
		const subscription = await this.subscriptionRepository.findOneBy({ ID: subscriptionId });

		if (!subscription) {
			throw new NotFoundException('Subscription not found');
		}

		return subscription;
	}

	private async fetchUsageMap(plan: Plans | null): Promise<Record<string, ApiKeyUsage>> {
		if (!plan?.AwsUsagePlanId) {
			return {};
		}
		const now = new Date();
		const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
		const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
		return this.apiGatewayService.getApiKeysUsage(plan.AwsUsagePlanId, startDate, endDate);
	}

	private async buildSubscriptionDetails(
		subscription: Subscriptions,
		clientOverride?: Clients,
	): Promise<SubscriptionDetailsResponse> {
		const [client, plan, paymentFrequency, status, apiKeys] = await Promise.all([
			clientOverride
				? Promise.resolve(clientOverride)
				: this.clientRepository.findOneBy({ SubscriptionId: subscription.ID }),
			this.planRepository.findOneBy({ ID: subscription.PlanId }),
			this.paymentFrequencyRepository.findOneBy({ ID: subscription.PaymentFrequencyId }),
			this.subscriptionStatusRepository.findOneBy({ ID: subscription.StatusId }),
			this.apiKeyRepository.find({
				where: { SubscriptionID: subscription.ID },
				order: { CreatedAt: 'DESC' },
			}),
		]);

		if (!client) {
			throw new NotFoundException('Client not found for subscription');
		}

		if (!plan) {
			throw new NotFoundException('Plan not found for subscription');
		}

		if (!paymentFrequency) {
			throw new NotFoundException('Payment frequency not found for subscription');
		}

		if (!status) {
			throw new NotFoundException('Subscription status not found for subscription');
		}

		return {
			client: {
				id: client.ID,
				firstName: client.Firstname,
				lastName: client.Lastname,
				email: client.Email,
				phone: client.Phone,
				countryDialCode: client.CountryDialCode,
				company: client.Company,
				companySize: client.CompanySize,
				isSso: client.IsSso,
				createdAt: client.CreatedAt,
				disabledAt: client.DisabledAt ?? null,
			},
			subscription: {
				id: subscription.ID,
				startDate: subscription.StartDate,
				currentCost: Number(subscription.CurrentCost),
				currencyRegionCode: subscription.CurrencyRegionCode,
				selectedCalculators: this.parseSelectedCalculators(subscription.SelectedCalculators),
				createdAt: subscription.CreatedAt,
				disabledAt: subscription.DisabledAt ?? null,
			},
			plan: {
				id: plan.ID,
				description: plan.Description,
				code: plan.Code,
				maxApiCalculationsPerMonth: plan.MaxApiCalculationsPerMonth ?? null,
				maxCountries: plan.MaxCountries ?? null,
				maxCalculators: plan.MaxCalculators ?? null,
				apiType: plan.ApiType,
				isMostPopular: plan.IsMostPopular,
				isCustomPrice: plan.IsCustomPrice,
				createdAt: plan.CreatedAt,
				disabledAt: plan.DisabledAt ?? null,
			},
			paymentFrequency: {
				id: paymentFrequency.ID,
				description: paymentFrequency.Description,
				code: paymentFrequency.Code,
			},
			status: {
				id: status.ID,
				description: status.Description,
				code: status.Code,
			},
			apiKeys: await this.mapApiKeysWithUsage(apiKeys, plan),
		};
	}

	private async mapApiKeysWithUsage(apiKeys: ApiKeys[], plan: Plans | null): Promise<SubscriptionApiKeyItem[]> {
		const usageMap = await this.fetchUsageMap(plan);
		return apiKeys.map((apiKey) =>
			this.mapApiKey(apiKey, apiKey.ApiGatewayKeyId ? usageMap[apiKey.ApiGatewayKeyId] : undefined),
		);
	}

	private generateApiKey(): string {
		return `isha_${randomBytes(24).toString('hex')}`;
	}

	private rethrowKnownError(error: unknown, fallbackMessage: string): never {
		if (
			error instanceof BadRequestException ||
			error instanceof NotFoundException ||
			error instanceof InternalServerErrorException
		) {
			throw error;
		}

		throw new InternalServerErrorException(fallbackMessage);
	}

	async createSubscription(request: CreateSubscriptionRequest): Promise<void> {
		try {
			const existingClient = await this.clientRepository.findOneBy({ Email: request.client.email });
			if (existingClient) {
				throw new Error(`Client already exists with email: ${request.client.email}`);
			}

			const status = await this.subscriptionStatusRepository.findOneBy({ Code: 'ACTIVE' });
			if (!status) {
				throw new Error('Active subscription status not found');
			}

			const paymentFrequency = await this.paymentFrequencyRepository.findOneBy({
				Code: request.subscription.paymentFrequencyCode,
			});
			if (!paymentFrequency) {
				throw new Error(`Payment frequency not found for code: ${request.subscription.paymentFrequencyCode}`);
			}

			const subscription = this.subscriptionRepository.create({
				ID: randomUUID(),
				PlanId: request.subscription.planId,
				PaymentFrequencyId: paymentFrequency.ID,
				StatusId: status.ID,
				StartDate: this.formatDateTime(new Date()),
				NextRenewalAt: request.subscription.nextRenewalAt,
				CurrentCost: request.subscription.currentCost,
				CurrencyRegionCode: request.subscription.currencyRegionCode,
				SelectedCalculators: request.subscription.selectedCalculators,
				CreatedAt: this.formatDateTime(new Date()),
			});

			const client = this.clientRepository.create({
				ID: randomUUID(),
				SubscriptionId: subscription.ID,
				Email: request.client.email,
				Firstname: request.client.firstName,
				Lastname: request.client.lastName,
				Phone: request.client.phone,
				CountryDialCode: request.client.countryDialCode,
				Company: request.client.company,
				CompanySize: request.client.companySize,
				IsSso: request.client.isSso,
				CreatedAt: this.formatDateTime(new Date()),
			});

			await this.subscriptionRepository.save(subscription);
			await this.clientRepository.save(client);

			if (request.client.password && !request.client.isSso) {
				// Send temporary password via email
				// This is a placeholder for password handling logic
				console.log(`Storing password for client ${client.Email} temporarily: ${request.client.password}`);
			}
		} catch (error) {
			console.error('Error creating subscription and client:', error);
			throw new InternalServerErrorException();
		}
	}

	async createApiKey(subscriptionId: string, request: CreateApiKeyRequest): Promise<SubscriptionApiKeyItem> {
		const subscription = await this.getSubscriptionOrFail(subscriptionId);

		if (!request.name?.trim()) {
			throw new BadRequestException('API key name is required');
		}

		const activeKeyCount = await this.apiKeyRepository.count({
			where: {
				SubscriptionID: subscriptionId,
				DisabledAt: IsNull(),
				IsActive: true,
			},
		});

		if (activeKeyCount >= 2) {
			throw new BadRequestException('A subscription can only have up to 2 active API keys');
		}

		const generatedApiKey = this.generateApiKey();
		let apiGatewayKeyId: string | undefined;

		const plan = await this.planRepository.findOneBy({ ID: subscription.PlanId });

		try {
			const gatewayApiKey = await this.apiGatewayService.createApiKey({
				name: request.name.trim(),
				value: generatedApiKey,
				enabled: true,
				usagePlanId: plan?.AwsUsagePlanId || undefined,
				tags: {
					subscriptionId,
				},
			});

			apiGatewayKeyId = gatewayApiKey.id;

			const apiKey = this.apiKeyRepository.create({
				ID: randomUUID(),
				SubscriptionID: subscriptionId,
				ApiKey: gatewayApiKey.value ?? generatedApiKey,
				ApiGatewayKeyId: gatewayApiKey.id,
				Name: request.name.trim(),
				IsActive: true,
				CreatedAt: this.formatDateTime(new Date()),
			});

			const savedApiKey = await this.apiKeyRepository.save(apiKey);

			return this.mapApiKey(savedApiKey);
		} catch (error) {
			if (apiGatewayKeyId) {
				try {
					await this.apiGatewayService.deleteApiKey(apiGatewayKeyId);
				} catch (cleanupError) {
					console.error('Error deleting API Gateway API key after database failure:', cleanupError);
				}
			}

			this.rethrowKnownError(error, 'Unable to create API key');
		}
	}

	async listApiKeys(subscriptionId: string): Promise<SubscriptionApiKeyItem[]> {
		const subscription = await this.getSubscriptionOrFail(subscriptionId);

		const [apiKeys, plan] = await Promise.all([
			this.apiKeyRepository.find({
				where: { SubscriptionID: subscriptionId },
				order: { CreatedAt: 'DESC' },
			}),
			this.planRepository.findOneBy({ ID: subscription.PlanId }),
		]);

		return this.mapApiKeysWithUsage(apiKeys, plan);
	}

	async deactivateApiKey(subscriptionId: string, apiKeyId: string): Promise<void> {
		await this.getSubscriptionOrFail(subscriptionId);

		const apiKey = await this.apiKeyRepository.findOneBy({
			ID: apiKeyId,
			SubscriptionID: subscriptionId,
		});

		if (!apiKey) {
			throw new NotFoundException('API key not found');
		}

		if (!apiKey.IsActive || apiKey.DisabledAt) {
			throw new BadRequestException('API key is already deactivated');
		}

		try {
			if (apiKey.ApiGatewayKeyId) {
				await this.apiGatewayService.deactivateApiKey(apiKey.ApiGatewayKeyId);
			}

			apiKey.IsActive = false;
			apiKey.DisabledAt = this.formatDateTime(new Date());

			await this.apiKeyRepository.save(apiKey);
		} catch (error) {
			this.rethrowKnownError(error, 'Unable to deactivate API key');
		}
	}

	async getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetailsResponse> {
		const subscription = await this.getSubscriptionOrFail(subscriptionId);

		return this.buildSubscriptionDetails(subscription);
	}

	async getSubscriptionDetailsByEmail(
		request: GetSubscriptionDetailsByEmailRequest,
	): Promise<SubscriptionDetailsResponse> {
		if (!request.email?.trim()) {
			throw new BadRequestException('Email is required');
		}

		const client = await this.clientRepository.findOneBy({ Email: request.email.trim() });

		if (!client) {
			throw new NotFoundException('Client not found');
		}

		const subscription = await this.getSubscriptionOrFail(client.SubscriptionId);
		
		return this.buildSubscriptionDetails(subscription, client);
	}
}
