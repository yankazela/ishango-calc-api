import { Module } from '@nestjs/common';
import { CalculatorRepositoryModule } from '../../shared/repositories/calculator/CalculatorRepositoryModule';
import { RepositoriesSymbols } from '../../shared/repositories/ioc';
import { CalculatorRepositoryServiceImpl } from '../../shared/repositories/calculator/service/CalculatorRepositoryServiceImpl';
import { CalculatorController } from './CalculatorController';
import { CalculatorSymbols } from './ioc';
import { ListCalculatorsServiceImpl } from './service/list/ListCalculatorsServiceImpl';
import { ProcessIncomeTaxInputServiceImpl } from './service/income-tax/ProcessIncomeTaxInputServiceImpl';
import { CountryRepositoryModule } from '../../shared/repositories/country/CountryRepositoryModule';
import { MortgageCalculatorServiceImpl } from './service/mortgage/MortgageCalculatorServiceImpl';
import { CorporateTaxServiceImpl } from './service/corporate-tax/CorporateTaxServiceImpl';

@Module({
	imports: [CalculatorRepositoryModule, CountryRepositoryModule],
	controllers: [CalculatorController],
	providers: [
		{
			provide: RepositoriesSymbols.CalculatorRepositoryService,
			useClass: CalculatorRepositoryServiceImpl,
		},
		{
			provide: CalculatorSymbols.ListCalculatorService,
			useClass: ListCalculatorsServiceImpl,
		},
		{
			provide: CalculatorSymbols.ProcessIncomeTaxInputService,
			useClass: ProcessIncomeTaxInputServiceImpl,
		},
		{
			provide: CalculatorSymbols.MortgageCalculatorService,
			useClass: MortgageCalculatorServiceImpl,
		},
		{
			provide: CalculatorSymbols.CorporateTaxService,
			useClass: CorporateTaxServiceImpl,
		},
	],
})
export class CalculatorModule {}
