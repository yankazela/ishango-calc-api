import { randomUUID } from 'crypto';
import { CreateSubscriptionRequest } from '../domain/CreateSubscriptionRequest';
import { Clients, PaymentFrequencies, Subscriptions, SubscriptionStatuses } from '../../entities';
import { Repository } from 'typeorm';
import { SubscriptionRepositoryService } from './SubscriptionRepositoryService';
import { RepositoriesSymbols } from '../../ioc';
import { Inject, InternalServerErrorException } from '@nestjs/common';

export class SubscriptionRepositoryServiceImpl implements SubscriptionRepositoryService {
	private formatDateTime(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
	}
	constructor(
		@Inject(RepositoriesSymbols.SubscriptionRepository)
		private subscriptionRepository: Repository<Subscriptions>,
		@Inject(RepositoriesSymbols.ClientRepository)
		private clientRepository: Repository<Clients>,
		@Inject(RepositoriesSymbols.SubscriptionStatusRepository)
		private subscriptionStatusRepository: Repository<SubscriptionStatuses>,
		@Inject(RepositoriesSymbols.PaymentFrequencyRepository)
		private paymentFrequencyRepository: Repository<PaymentFrequencies>,
	) {}

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
}
