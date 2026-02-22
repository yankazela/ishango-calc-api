import {
	CalculatorType,
	CanadaIncomeTaxService,
	CanadaComputedIncomeTaxValues,
	CanadaIncomeTaxRules,
	FranceComputedIncomeTaxValues,
	FranceIncomeTaxService,
	FranceIncomeTaxRules,
	SouthAfricaIncomeTaxService,
	SouthAfricaIncomeTaxRules,
	SouthAfricaComputedIncomeTaxValues,
	AustraliaIncomeTaxService,
	AustraliaIncomeTaxRules,
	AustraliaComputedIncomeTaxValues,
} from '@novha/calc-engines';

import { CanadaIncomeTaxValues, IncomeTaxPrivateResponse, IncomeTaxRequest } from '../../domain/IncomeTaxTypes';
import { ProcessIncomeTaxInputService } from './ProcessIncomeTaxInputService';
import { BaseCalculatorService } from '../BaseCalculatorService';

export class ProcessIncomeTaxInputServiceImpl extends BaseCalculatorService implements ProcessIncomeTaxInputService {
	async processIncomeTax<T>(data: IncomeTaxRequest, isPrivate: boolean = false): Promise<T> {
		try {
			switch (data.countryCode.toLocaleLowerCase()) {
				case 'ca':
					return (await this.processCanadaIncomeTax(data, isPrivate)) as T;
				case 'fr':
					return (await this.processFranceIncomeTax(data, isPrivate)) as T;
				case 'za':
					return (await this.processSouthAfricaIncomeTax(data, isPrivate)) as T;
				case 'au':
					return (await this.processAustraliaIncomeTax(data, isPrivate)) as T;
				default:
					throw new Error(`Unsupported country: ${data.countryCode}`);
			}
		} catch (error) {
			throw new Error(`Error processing calculator input: ${(error as Error).message}`);
		}
	}

	async processCanadaIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<CanadaIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<CanadaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const canadaIncomeTaxService = new CanadaIncomeTaxService(data.income, countryRules);
		const countryTax = canadaIncomeTaxService.calculateNetIncome();
		let provinceTax: CanadaComputedIncomeTaxValues | null = null;

		if (!data.provinceCode) {
			throw new Error('Province code is required for Canada income tax calculation');
		}
		const provinceRules = await this.getProvinceRules<CanadaIncomeTaxRules>(
			data.provinceCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const provinceIncomeTaxService = new CanadaIncomeTaxService(data.income, provinceRules);
		provinceTax = provinceIncomeTaxService.calculateNetIncome();

		const result = {
			federalTax: countryTax,
			provincialTax: provinceTax,
		};

		if (isPrivate) {
			const totalIncomeTax = countryTax.incomeTax + (provinceTax ? provinceTax.incomeTax : 0);
			return {
				grossIncome: result.federalTax.grossIncome,
				netIncome: result.federalTax.grossIncome - totalIncomeTax,
				incomeTax: totalIncomeTax,
				taxBracketBreakdown: countryTax.taxBracketBreakdown,
			};
		}

		return result;
	}

	async processFranceIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<FranceComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<FranceIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const franceIncomeTaxService = new FranceIncomeTaxService(data.income, countryRules, data.familyPart || 1);

		const result = franceIncomeTaxService.calculateNetIncome();

		if (isPrivate) {
			return {
				grossIncome: result.grossIncome,
				netIncome: result.netIncome,
				incomeTax: result.incomeTax,
				taxBracketBreakdown: result.taxBracketBreakdown,
			};
		}

		return result;
	}

	async processSouthAfricaIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<SouthAfricaComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<SouthAfricaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const southAfricaIncomeTaxService = new SouthAfricaIncomeTaxService(
			data.income,
			data.age || 64,
			countryRules,
			data.medicalAidMembers || 0,
		);

		const result = southAfricaIncomeTaxService.calculateNetIncome();

		if (isPrivate) {
			return {
				grossIncome: result.grossIncome,
				netIncome: result.netIncome,
				incomeTax: result.incomeTax,
				taxBracketBreakdown: result.taxBracketBreakdown,
			};
		}

		return result;
	}

	async processAustraliaIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<AustraliaComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<AustraliaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const australiaIncomeTaxService = new AustraliaIncomeTaxService(data.income, countryRules);

		const result = australiaIncomeTaxService.calculateNetIncome();

		if (isPrivate) {
			return {
				grossIncome: result.grossIncome,
				netIncome: result.netIncome,
				incomeTax: result.incomeTax,
				taxBracketBreakdown: result.taxBracketBreakdown,
			};
		}

		return result;
	}
}
