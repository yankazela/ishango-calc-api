import { CreateSubscriptionRequest } from '../../../shared/repositories/subscription/domain/CreateSubscriptionRequest';
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
}
