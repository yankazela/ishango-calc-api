import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '../database/DatabaseModule';
import { DatabaseSymbols } from '../database/ioc';
import { ApiKeys } from '../repositories/entities';
import { RepositoriesSymbols } from '../repositories/ioc';
import { ApiKeyGuard } from './ApiKeyGuard';

@Module({
	imports: [DatabaseModule],
	providers: [
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.ApiKeyRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(ApiKeys),
		},
		ApiKeyGuard,
	],
	exports: [RepositoriesSymbols.ApiKeyRepository, ApiKeyGuard],
})
export class ApiKeyGuardModule {}
