import { Controller, Get, Inject, Post, Body, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CalculatorTypeItem } from '../../shared/repositories/calculator/domain/CalculatorTypeResponse';
import { CalculatorSymbols } from './ioc';
import type { ListCalculatorService } from './service/list/ListCalculatorsService';
import type { ProcessIncomeTaxInputService } from './service/income-tax/ProcessIncomeTaxInputService';
import { IncomeTaxRequest } from './domain/IncomeTaxTypes';
import { MortgageRequest } from './domain/MortgageTypes';
import type { MortgageCalculatorService } from './service/mortgage/MortgageCalculatorService';
import type { CorporateTaxService } from './service/corporate-tax/CorporateTaxService';
import { CorporateTaxRequest } from './domain/CorporateTaxTypes';
import type { CapitalGainTaxService } from './service/capital-gain/CapitalGainTaxService';
import { CapitalGainTaxRequest } from './domain/CapitalGainTaxTypes';
import type { InheritanceTaxService } from './service/inheritance-tax/InheritanceTaxService';
import { InheritanceTaxRequest } from './domain/InheritanceTaxTypes';

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
		@Inject(CalculatorSymbols.CapitalGainTaxService)
		private readonly capitalGainTaxService: CapitalGainTaxService,
		@Inject(CalculatorSymbols.InheritanceTaxService)
		private readonly inheritanceTaxService: InheritanceTaxService,
	) {}

	@Get('/')
	list(): Promise<CalculatorTypeItem[]> {
		return this.listCalculatorService.list();
	}

	@Post('/process-income-tax')
	async processIncomeTax(@Body() body: IncomeTaxRequest): Promise<unknown> {
		const request = new IncomeTaxRequest(body);
		await request.validate();
		return this.processIncomeTaxInputService.processIncomeTax<unknown>(request);
	}

	@Post('/process-income-tax/private')
	async processIncomeTaxPrivate(@Body() body: IncomeTaxRequest): Promise<unknown> {
		const request = new IncomeTaxRequest(body);
		await request.validate();
		return this.processIncomeTaxInputService.processIncomeTax<unknown>(request);
	}

	@Post('/process-mortgage')
	async processMortgage(@Body() body: MortgageRequest): Promise<unknown> {
		const request = new MortgageRequest(body);
		await request.validate();
		return this.mortgageCalculatorService.processMortgage<unknown>(request);
	}

	@Post('/process-corporate-tax')
	async processCorporateTax(@Body() body: CorporateTaxRequest): Promise<unknown> {
		const request = new CorporateTaxRequest(body);
		await request.validate();
		return this.corporateTaxService.processCorporateTax<unknown>(request);
	}

	@Post('/process-capital-gains-tax')
	async processCapitalGainTax(@Body() body: CapitalGainTaxRequest): Promise<unknown> {
		const request = new CapitalGainTaxRequest(body);
		await request.validate();
		return this.capitalGainTaxService.processCapitalGainTax<unknown>(request);
	}

	@Post('/process-inheritance-tax')
	async processInheritanceTax(@Body() body: InheritanceTaxRequest): Promise<unknown> {
		const request = new InheritanceTaxRequest(body);
		await request.validate();
		return this.inheritanceTaxService.processInheritanceTax<unknown>(request);
	}
}
