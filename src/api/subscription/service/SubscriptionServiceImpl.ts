import { CreateSubscriptionRequest } from '../../../shared/repositories/subscription/domain/CreateSubscriptionRequest';
import { CreateApiKeyRequest } from '../../../shared/repositories/subscription/domain/CreateApiKeyRequest';
import { GetSubscriptionDetailsByEmailRequest } from '../../../shared/repositories/subscription/domain/GetSubscriptionDetailsByEmailRequest';
import { SubscriptionApiKeyItem } from '../../../shared/repositories/subscription/domain/SubscriptionApiKeyItem';
import { SubscriptionDetailsResponse } from '../../../shared/repositories/subscription/domain/SubscriptionDetailsResponse';
import { RepositoriesSymbols } from '../../../shared/repositories/ioc';
import type { SubscriptionRepositoryService } from '../../../shared/repositories/subscription/service/SubscriptionRepositoryService';
import { SubscriptionService } from './SubscriptionService';
import { Inject } from '@nestjs/common';

export class SubscriptionServiceImpl implements SubscriptionService {
	constructor(
		@Inject(RepositoriesSymbols.SubscriptionRepositoryService)
		private readonly subscriptionRepositoryService: SubscriptionRepositoryService,
	) {}

	async create(request: CreateSubscriptionRequest): Promise<void> {
		// Implementation for creating a subscription
		await this.subscriptionRepositoryService.createSubscription(request);
	}

	createApiKey(subscriptionId: string, request: CreateApiKeyRequest): Promise<SubscriptionApiKeyItem> {
		return this.subscriptionRepositoryService.createApiKey(subscriptionId, request);
	}

	listApiKeys(subscriptionId: string): Promise<SubscriptionApiKeyItem[]> {
		return this.subscriptionRepositoryService.listApiKeys(subscriptionId);
	}

	deactivateApiKey(subscriptionId: string, apiKeyId: string): Promise<void> {
		return this.subscriptionRepositoryService.deactivateApiKey(subscriptionId, apiKeyId);
	}

	getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetailsResponse> {
		return this.subscriptionRepositoryService.getSubscriptionDetails(subscriptionId);
	}

	getSubscriptionDetailsByEmail(request: GetSubscriptionDetailsByEmailRequest): Promise<SubscriptionDetailsResponse> {
		return this.subscriptionRepositoryService.getSubscriptionDetailsByEmail(request);
	}
}
