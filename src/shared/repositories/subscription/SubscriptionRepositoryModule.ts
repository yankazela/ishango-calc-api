import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DatabaseModule } from '../../../shared/database/DatabaseModule';
import { RepositoriesSymbols } from '../ioc';
import { DatabaseSymbols } from '../../../shared/database/ioc';
import { Clients, Subscriptions, SubscriptionStatuses, PaymentFrequencies } from '../entities';
import { SubscriptionRepositoryServiceImpl } from './service/SubscriptionRepositoryServiceImpl';

@Module({
	imports: [DatabaseModule],
	providers: [
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.SubscriptionRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(Subscriptions),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.ClientRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(Clients),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.SubscriptionStatusRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(SubscriptionStatuses),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.PaymentFrequencyRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(PaymentFrequencies),
		},
		{
			provide: RepositoriesSymbols.SubscriptionRepositoryService,
			useClass: SubscriptionRepositoryServiceImpl,
		},
	],
	exports: [RepositoriesSymbols.SubscriptionRepositoryService],
})
export class SubscriptionRepositoryModule {}
