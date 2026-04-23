import { IncomeTax } from '@novha/calc-engines';
import { CalculatorType } from '../../../../shared/domain/CalculatorType';

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
				case 'uk':
					return (await this.processUKIncomeTax(data, isPrivate)) as T;
				case 'de':
					return (await this.processGermanyIncomeTax(data, isPrivate)) as T;
				case 'br':
					return (await this.processBrazilIncomeTax(data, isPrivate)) as T;
				case 'es':
					return (await this.processSpainIncomeTax(data, isPrivate)) as T;
				case 'in':
					return (await this.processIndiaIncomeTax(data, isPrivate)) as T;
				case 'jp':
					return (await this.processJapanIncomeTax(data, isPrivate)) as T;
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
		const countryRules = await this.getCountryRules<IncomeTax.CanadaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const canadaIncomeTaxService = new IncomeTax.CanadaIncomeTaxService(data.income, countryRules);
		const countryTax = canadaIncomeTaxService.calculateNetIncome();
		let provinceTax: IncomeTax.CanadaComputedIncomeTaxValues | null = null;

		if (!data.provinceCode) {
			throw new Error('Province code is required for Canada income tax calculation');
		}
		const provinceRules = await this.getProvinceRules<IncomeTax.CanadaIncomeTaxRules>(
			data.provinceCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const provinceIncomeTaxService = new IncomeTax.CanadaIncomeTaxService(data.income, provinceRules);
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
	): Promise<IncomeTax.FranceComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.FranceIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const franceIncomeTaxService = new IncomeTax.FranceIncomeTaxService(
			data.income,
			countryRules,
			data.familyPart || 1,
		);

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
	): Promise<IncomeTax.SouthAfricaComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.SouthAfricaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const southAfricaIncomeTaxService = new IncomeTax.SouthAfricaIncomeTaxService(
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
	): Promise<IncomeTax.AustraliaComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.AustraliaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);

		const australiaIncomeTaxService = new IncomeTax.AustraliaIncomeTaxService(
			data.income,
			countryRules,
			data.isResident || true,
			data.includeMedicareLevy || true,
		);

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

	async processUKIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<IncomeTax.UKComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.UKIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);

		const ukIncomeTaxService = new IncomeTax.UKIncomeTaxService(data.income, countryRules);

		const result = ukIncomeTaxService.calculateNetIncome();

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

	async processGermanyIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<IncomeTax.GermanyComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.GermanyIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);

		const germanyIncomeTaxService = new IncomeTax.GermanyIncomeTaxService(data.income, countryRules);

		const result = germanyIncomeTaxService.calculateNetIncome();

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

	async processBrazilIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<IncomeTax.BrazilComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.BrazilIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);

		const brazilIncomeTaxService = new IncomeTax.BrazilIncomeTaxService(data.income, countryRules);

		const result = brazilIncomeTaxService.calculateNetIncome();

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

	async processSpainIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<IncomeTax.SpainComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.SpainIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);

		const spainIncomeTaxService = new IncomeTax.SpainIncomeTaxService(data.income, countryRules);

		const result = spainIncomeTaxService.calculateNetIncome();

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

	async processIndiaIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<IncomeTax.IndiaComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.IndiaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);

		const indiaIncomeTaxService = new IncomeTax.IndiaIncomeTaxService(data.income, countryRules);

		const result = indiaIncomeTaxService.calculateNetIncome();

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

	async processJapanIncomeTax(
		data: IncomeTaxRequest,
		isPrivate: boolean,
	): Promise<IncomeTax.JapanComputedIncomeTaxValues | IncomeTaxPrivateResponse> {
		const countryRules = await this.getCountryRules<IncomeTax.JapanIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);

		const japanIncomeTaxService = new IncomeTax.JapanIncomeTaxService(data.income, countryRules);

		const result = japanIncomeTaxService.calculateNetIncome();

		if (isPrivate) {
			return {
				grossIncome: result.grossIncome,
				netIncome: result.netIncome,
				incomeTax: result.nationalIncomeTax,
				taxBracketBreakdown: result.taxBracketBreakdown,
			};
		}

		return result;
	}
}
