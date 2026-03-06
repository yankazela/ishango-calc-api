import { Controller, Get, Inject, Post, Body } from '@nestjs/common';
import { CalculatorTypeItem } from '../../shared/repositories/calculator/domain/CalculatorTypeResponse';
import { CalculatorSymbols } from './ioc';
import type { ListCalculatorService } from './service/list/ListCalculatorsService';
import type { ProcessIncomeTaxInputService } from './service/income-tax/ProcessIncomeTaxInputService';
import type { IncomeTaxRequest } from './domain/IncomeTaxTypes';
import type { MortgageRequest } from './domain/MortgageTypes';
import type { MortgageCalculatorService } from './service/mortgage/MortgageCalculatorService';
import type { CorporateTaxService } from './service/corporate-tax/CorporateTaxService';
import type { CorporateTaxRequest } from './domain/CorporateTaxTypes';

@Controller('calculators')
export class CalculatorController {
	constructor(
		@Inject(CalculatorSymbols.ListCalculatorService)
		private readonly listCalculatorService: ListCalculatorService,
		@Inject(CalculatorSymbols.ProcessIncomeTaxInputService)
		private readonly processIncomeTaxInputService: ProcessIncomeTaxInputService,
		@Inject(CalculatorSymbols.MortgageCalculatorService)
		private readonly mortgageCalculatorService: MortgageCalculatorService,
		@Inject(CalculatorSymbols.CorporateTaxService)
		private readonly corporateTaxService: CorporateTaxService,
	) {}

	@Get('/')
	list(): Promise<CalculatorTypeItem[]> {
		return this.listCalculatorService.list();
	}

	@Post('/process-income-tax')
	processIncomeTax(@Body() request: IncomeTaxRequest): Promise<unknown> {
		return this.processIncomeTaxInputService.processIncomeTax<unknown>(request);
	}

	@Post('/process-income-tax/private')
	processIncomeTaxPrivate(@Body() request: IncomeTaxRequest): Promise<unknown> {
		return this.processIncomeTaxInputService.processIncomeTax<unknown>(request, true);
	}

	@Post('/process-mortgage')
	processMortgage(@Body() request: MortgageRequest): Promise<unknown> {
		return this.mortgageCalculatorService.processMortgage<unknown>(request);
	}

	@Post('/process-corporate-tax')
	processCorporateTax(@Body() request: CorporateTaxRequest): Promise<unknown> {
		return this.corporateTaxService.processCorporateTax<unknown>(request);
	}
}
