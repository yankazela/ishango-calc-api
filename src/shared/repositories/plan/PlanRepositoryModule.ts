import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DatabaseModule } from '../../../shared/database/DatabaseModule';
import { RepositoriesSymbols } from '../ioc';
import { DatabaseSymbols } from '../../../shared/database/ioc';
import { PlanPrices, Plans } from '../entities';
import { PlanRepositoryServiceImpl } from './service/PlanRepositoryServiceImpl';

@Module({
	imports: [DatabaseModule],
	providers: [
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.PlanRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(Plans),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.PlanPriceRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(PlanPrices),
		},
		{
			provide: RepositoriesSymbols.PlanRepositoryService,
			useClass: PlanRepositoryServiceImpl,
		},
	],
	exports: [RepositoriesSymbols.PlanRepositoryService],
})
export class PlanRepositoryModule {}
