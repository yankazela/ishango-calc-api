import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { CalculatorTypes } from '../entities';
import { RepositoriesSymbols } from '../ioc';
import { DatabaseModule } from '../../database/DatabaseModule';
import { DatabaseSymbols } from '../../database/ioc';

@Module({
	imports: [DatabaseModule],
	providers: [
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.CalculatorRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(CalculatorTypes),
		},
	],

	exports: [RepositoriesSymbols.CalculatorRepository],
})
export class CalculatorRepositoryModule {}
