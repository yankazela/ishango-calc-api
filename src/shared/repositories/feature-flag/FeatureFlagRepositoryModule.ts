import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { FeatureFlags } from '../entities';
import { RepositoriesSymbols } from '../ioc';
import { DatabaseModule } from '../../database/DatabaseModule';
import { DatabaseSymbols } from '../../database/ioc';
import { FeatureFlagRepositoryServiceImpl } from './service/FeatureFlagRepositoryServiceImpl';

@Module({
	imports: [DatabaseModule],
	providers: [
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.FeatureFlagRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(FeatureFlags),
		},
		{
			provide: RepositoriesSymbols.FeatureFlagRepositoryService,
			useClass: FeatureFlagRepositoryServiceImpl,
		},
	],
	exports: [RepositoriesSymbols.FeatureFlagRepository, RepositoriesSymbols.FeatureFlagRepositoryService],
})
export class FeatureFlagRepositoryModule {}
