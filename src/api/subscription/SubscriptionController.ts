import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { SubscriptionSymbols } from './ioc';
import type { CreateSubscriptionRequest } from '../../shared/repositories/subscription/domain/CreateSubscriptionRequest';
import type { CreateApiKeyRequest } from '../../shared/repositories/subscription/domain/CreateApiKeyRequest';
import type { GetSubscriptionDetailsByEmailRequest } from '../../shared/repositories/subscription/domain/GetSubscriptionDetailsByEmailRequest';
import type { SubscriptionApiKeyItem } from '../../shared/repositories/subscription/domain/SubscriptionApiKeyItem';
import type { SubscriptionDetailsResponse } from '../../shared/repositories/subscription/domain/SubscriptionDetailsResponse';

@Controller('subscriptions')
export class SubscriptionController {
	private readonly subscriptionService: {
		create(request: CreateSubscriptionRequest): Promise<void>;
		createApiKey(subscriptionId: string, request: CreateApiKeyRequest): Promise<SubscriptionApiKeyItem>;
		listApiKeys(subscriptionId: string): Promise<SubscriptionApiKeyItem[]>;
		deactivateApiKey(subscriptionId: string, apiKeyId: string): Promise<void>;
		getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetailsResponse>;
		getSubscriptionDetailsByEmail(
			request: GetSubscriptionDetailsByEmailRequest,
		): Promise<SubscriptionDetailsResponse>;
	};

	constructor(
		@Inject(SubscriptionSymbols.SubscriptionService)
		subscriptionService: unknown,
	) {
		this.subscriptionService = subscriptionService as {
			create(request: CreateSubscriptionRequest): Promise<void>;
			createApiKey(subscriptionId: string, request: CreateApiKeyRequest): Promise<SubscriptionApiKeyItem>;
			listApiKeys(subscriptionId: string): Promise<SubscriptionApiKeyItem[]>;
			deactivateApiKey(subscriptionId: string, apiKeyId: string): Promise<void>;
			getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetailsResponse>;
			getSubscriptionDetailsByEmail(
				request: GetSubscriptionDetailsByEmailRequest,
			): Promise<SubscriptionDetailsResponse>;
		};
	}

	@Post('/')
	create(@Body() request: CreateSubscriptionRequest): Promise<void> {
		return this.subscriptionService.create(request);
	}

	@Get('/:subscriptionId')
	getSubscriptionDetails(@Param('subscriptionId') subscriptionId: string): Promise<SubscriptionDetailsResponse> {
		return this.subscriptionService.getSubscriptionDetails(subscriptionId);
	}

	@Post('/details')
	getSubscriptionDetailsByEmail(
		@Body() request: GetSubscriptionDetailsByEmailRequest,
	): Promise<SubscriptionDetailsResponse> {
		return this.subscriptionService.getSubscriptionDetailsByEmail(request);
	}

	@Post('/:subscriptionId/api-keys')
	createApiKey(
		@Param('subscriptionId') subscriptionId: string,
		@Body() request: CreateApiKeyRequest,
	): Promise<SubscriptionApiKeyItem> {
		return this.subscriptionService.createApiKey(subscriptionId, request);
	}

	@Get('/:subscriptionId/api-keys')
	listApiKeys(@Param('subscriptionId') subscriptionId: string): Promise<SubscriptionApiKeyItem[]> {
		return this.subscriptionService.listApiKeys(subscriptionId);
	}

	@Patch('/:subscriptionId/api-keys/:apiKeyId/deactivate')
	deactivateApiKey(
		@Param('subscriptionId') subscriptionId: string,
		@Param('apiKeyId') apiKeyId: string,
	): Promise<void> {
		return this.subscriptionService.deactivateApiKey(subscriptionId, apiKeyId);
	}
}
