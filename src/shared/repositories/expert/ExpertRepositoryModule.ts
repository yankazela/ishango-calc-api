import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { DatabaseModule } from '../../database/DatabaseModule';
import { DatabaseSymbols } from '../../database/ioc';
import { RepositoriesSymbols } from '../ioc';
import { ExpertiseCountries, Experts, ExpertStatuses, ExpertTypes } from '../entities';
import { GetExpertListServiceImpl } from './service/GetExpertListServiceImpl';
import { CreateExpertServiceImpl } from './service/CreateExpertServiceImpl';

@Module({
	imports: [DatabaseModule],
	providers: [
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.ExpertRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(Experts),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.ExpertiseCountryRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(ExpertiseCountries),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.ExpertTypeRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(ExpertTypes),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.ExpertStatusRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(ExpertStatuses),
		},
		{
			provide: RepositoriesSymbols.GetExpertListService,
			useClass: GetExpertListServiceImpl,
		},
		{
			provide: RepositoriesSymbols.CreateExpertService,
			useClass: CreateExpertServiceImpl,
		},
	],
	exports: [RepositoriesSymbols.GetExpertListService, RepositoriesSymbols.CreateExpertService],
})
export class ExpertRepositoryModule {}
