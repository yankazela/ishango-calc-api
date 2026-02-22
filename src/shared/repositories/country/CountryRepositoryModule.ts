import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { Countries, CalculatorCountries, Provinces, CalculatorProvinces } from '../entities';
import { RepositoriesSymbols } from '../ioc';
import { DatabaseModule } from '../../database/DatabaseModule';
import { DatabaseSymbols } from '../../database/ioc';
import { CalcCountryRepositoryServiceImpl } from './service/CalcCountryRepositoryServiceImpl';
import { CalcProvinceRepositoryServiceImpl } from './service/CalcProvinceRepositoryServiceImpl';

@Module({
	imports: [DatabaseModule],
	providers: [
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.CountryRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(Countries),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.CalculatorCountryRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(CalculatorCountries),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.ProvinceRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(Provinces),
		},
		{
			inject: [DatabaseSymbols.DatabaseSource],
			provide: RepositoriesSymbols.CalculatorProvinceRepository,
			useFactory: (dataSource: DataSource) => dataSource.getRepository(CalculatorProvinces),
		},
		{
			provide: RepositoriesSymbols.CalcCountryRepositoryService,
			useClass: CalcCountryRepositoryServiceImpl,
		},
		{
			provide: RepositoriesSymbols.CalculatorProvinceRepositoryService,
			useClass: CalcProvinceRepositoryServiceImpl,
		},
	],

	exports: [
		RepositoriesSymbols.CountryRepository,
		RepositoriesSymbols.CalculatorCountryRepository,
		RepositoriesSymbols.ProvinceRepository,
		RepositoriesSymbols.CalcCountryRepositoryService,
		RepositoriesSymbols.CalculatorProvinceRepository,
		RepositoriesSymbols.CalculatorProvinceRepositoryService,
	],
})
export class CountryRepositoryModule {}
