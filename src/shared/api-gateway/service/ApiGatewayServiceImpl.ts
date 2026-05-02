import {
	APIGatewayClient,
	CreateApiKeyCommand,
	CreateUsagePlanKeyCommand,
	DeleteApiKeyCommand,
	GetApiKeyCommand,
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

		if (!this.usagePlanId) {
			throw new InternalServerErrorException('AWS_API_GATEWAY_USAGE_PLAN_ID is not configured.');
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
					usagePlanId: this.usagePlanId,
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