import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SubscriptionSymbols } from './ioc';
import type { SubscriptionService } from './service/SubscriptionService';
import type { CreateSubscriptionRequest } from 'src/shared/repositories/subscription/domain/CreateSubscriptionRequest';

@Controller('subscriptions')
export class SubscriptionController {
	constructor(
		@Inject(SubscriptionSymbols.SubscriptionService)
		private readonly subscriptionService: SubscriptionService,
	) {}

	@Post('/')
	create(@Body() request: CreateSubscriptionRequest): Promise<void> {
		return this.subscriptionService.create(request);
	}
}
