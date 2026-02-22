import { SubscriptionSymbols } from './ioc';
import { Module } from '@nestjs/common';
import { SubscriptionServiceImpl } from './service/SubscriptionServiceImpl';
import { SubscriptionController } from './SubscriptionController';
import { SubscriptionRepositoryModule } from '../../shared/repositories/subscription/SubscriptionRepositoryModule';

@Module({
	imports: [SubscriptionRepositoryModule],
	controllers: [SubscriptionController],
	providers: [
		{
			provide: SubscriptionSymbols.SubscriptionService,
			useClass: SubscriptionServiceImpl,
		},
	],
	exports: [SubscriptionSymbols.SubscriptionService],
})
export class SubscriptionModule {}
