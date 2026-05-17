import {
	APIGatewayClient,
	CreateApiKeyCommand,
	CreateUsagePlanKeyCommand,
	DeleteApiKeyCommand,
	GetApiKeyCommand,
	GetUsageCommand,
	GetUsagePlansCommand,
	UpdateApiKeyCommand,
} from '@aws-sdk/client-api-gateway';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
	ApiGatewayApiKeyResponse,
	ApiGatewayService,
	ApiKeyUsage,
	CreateApiGatewayApiKeyRequest,
} from './ApiGatewayService';

@Injectable()
export class ApiGatewayServiceImpl implements ApiGatewayService {
	private readonly apiGatewayClient: APIGatewayClient;
	private readonly usagePlanId: string;

	constructor(private readonly configService: ConfigService) {
		const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
		const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
		this.usagePlanId = this.configService.get<string>('AWS_API_GATEWAY_USAGE_PLAN_ID')?.trim() || '';

		this.apiGatewayClient = new APIGatewayClient({
			region: this.configService.get<string>('AWS_REGION') ?? 'us-east-2',
			endpoint: this.configService.get<string>('AWS_API_GATEWAY_ENDPOINT') || undefined,
			credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
		});
	}

	async createApiKey(request: CreateApiGatewayApiKeyRequest): Promise<ApiGatewayApiKeyResponse> {
		if (!request.name?.trim()) {
			throw new BadRequestException('API Gateway API key name is required.');
		}

		const resolvedUsagePlanId = request.usagePlanId?.trim() || this.usagePlanId;

		if (!resolvedUsagePlanId) {
			throw new InternalServerErrorException('No usage plan ID is configured for this API key.');
		}

		let createdApiKeyId: string | undefined;

		try {
			const response = await this.apiGatewayClient.send(
				new CreateApiKeyCommand({
					name: request.name.trim(),
					description: request.description?.trim() || undefined,
					enabled: request.enabled ?? true,
					value: request.value,
					customerId: request.customerId,
					generateDistinctId: request.generateDistinctId,
					stageKeys: request.stageKeys?.map((stageKey) => ({
						restApiId: stageKey.restApiId,
						stageName: stageKey.stageName,
					})),
					tags: request.tags,
				}),
			);

			if (!response.id || !response.name) {
				throw new InternalServerErrorException('AWS API Gateway returned an incomplete API key response.');
			}

			createdApiKeyId = response.id;

			await this.apiGatewayClient.send(
				new CreateUsagePlanKeyCommand({
					usagePlanId: resolvedUsagePlanId,
					keyId: response.id,
					keyType: 'API_KEY',
				}),
			);

			return {
				id: response.id,
				name: response.name,
				value: response.value,
				enabled: response.enabled ?? false,
				description: response.description,
			};
		} catch (error) {
			if (createdApiKeyId) {
				try {
					await this.apiGatewayClient.send(
						new DeleteApiKeyCommand({
							apiKey: createdApiKeyId,
						}),
					);
				} catch (cleanupError) {
					console.error('Error deleting API Gateway API key after usage plan binding failure:', cleanupError);
				}
			}

			throw this.mapError(error, 'Unable to create API Gateway API key.');
		}
	}

	async activateApiKey(apiKeyId: string): Promise<void> {
		await this.updateApiKeyEnabled(apiKeyId, true);
	}

	async deactivateApiKey(apiKeyId: string): Promise<void> {
		await this.updateApiKeyEnabled(apiKeyId, false);
	}

	async deleteApiKey(apiKeyId: string): Promise<void> {
		if (!apiKeyId.trim()) {
			throw new BadRequestException('API Gateway API key id is required.');
		}

		try {
			await this.apiGatewayClient.send(
				new DeleteApiKeyCommand({
					apiKey: apiKeyId,
				}),
			);
		} catch (error) {
			throw this.mapError(error, 'Unable to delete API Gateway API key.');
		}
	}

	private async updateApiKeyEnabled(apiKeyId: string, enabled: boolean): Promise<void> {
		if (!apiKeyId.trim()) {
			throw new BadRequestException('API Gateway API key id is required.');
		}

		try {
			await this.apiGatewayClient.send(
				new GetApiKeyCommand({
					apiKey: apiKeyId,
					includeValue: false,
				}),
			);

			await this.apiGatewayClient.send(
				new UpdateApiKeyCommand({
					apiKey: apiKeyId,
					patchOperations: [
						{
							op: 'replace',
							path: '/enabled',
							value: String(enabled),
						},
					],
				}),
			);
		} catch (error) {
			throw this.mapError(
				error,
				enabled ? 'Unable to activate API Gateway API key.' : 'Unable to deactivate API Gateway API key.',
			);
		}
	}

	async getApiKeysUsage(usagePlanId: string, startDate: string, endDate: string): Promise<Record<string, ApiKeyUsage>> {
		try {
			const response = await this.apiGatewayClient.send(
				new GetUsageCommand({ usagePlanId, startDate, endDate }),
			);

			console.log('API Gateway usage response:', JSON.stringify(response), usagePlanId, startDate, endDate);
			const result: Record<string, ApiKeyUsage> = {};

			for (const [keyId, dailyEntries] of Object.entries(response.items ?? {})) {
				let used = 0;
				let remaining: number | null = null;

				for (const entry of dailyEntries) {
					if (Array.isArray(entry) && entry.length >= 1) {
						used += entry[0] ?? 0;
						if (entry[1] != null) {
							remaining = entry[1];
						}
					}
				}

				result[keyId] = { used, remaining };
			}

			return result;
		} catch {
			return {};
		}
	}

	private mapError(error: unknown, fallbackMessage: string): Error {
		if (error instanceof BadRequestException || error instanceof NotFoundException) {
			return error;
		}

		if (error instanceof Error) {
			if (['NotFoundException', 'NotFound'].includes(error.name)) {
				return new NotFoundException('API Gateway API key not found.');
			}

			if (['BadRequestException', 'ConflictException', 'UnauthorizedException', 'ForbiddenException'].includes(error.name)) {
				return new BadRequestException(error.message || fallbackMessage);
			}
		}

		return new InternalServerErrorException(fallbackMessage);
	}
}