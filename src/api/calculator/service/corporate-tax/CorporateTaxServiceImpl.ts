import { CorporateTax } from '@novha/calc-engines';
import { CalculatorType } from '../../../../shared/domain/CalculatorType';
import { CorporateTaxRequest, CorporateTaxResponse } from '../../domain/CorporateTaxTypes';
import { BaseCalculatorService } from '../BaseCalculatorService';
import { CorporateTaxService } from './CorporateTaxService';

export class CorporateTaxServiceImpl extends BaseCalculatorService implements CorporateTaxService {
	processCorporateTax<T>(data: CorporateTaxRequest): Promise<T> {
		// Implement corporate tax calculation logic here
		try {
			switch (data.countryCode.toLocaleLowerCase()) {
				case 'ca':
					return this.processCanadaCorporateTax(data) as Promise<T>;
				case 'fr':
					return this.processFranceCorporateTax(data) as Promise<T>;
				case 'za':
					return this.processSouthAfricaCorporateTax(data) as Promise<T>;
				case 'au':
					return this.processAustraliaCorporateTax(data) as Promise<T>;
				case 'uk':
					return this.processUKCorporateTax(data) as Promise<T>;
				case 'ge':
					return this.processGermanyCorporateTax(data) as Promise<T>;
				case 'br':
					return this.processBrazilCorporateTax(data) as Promise<T>;
				case 'es':
					return this.processSpainCorporateTax(data) as Promise<T>;
				case 'in':
					return this.processIndiaCorporateTax(data) as Promise<T>;
				case 'jp':
					return this.processJapanCorporateTax(data) as Promise<T>;
				default:
					throw new Error(`Unsupported country: ${data.countryCode}`);
			}
		} catch (error) {
			throw new Error(`Error processing calculator input: ${(error as Error).message}`);
		}
	}

	private async processCanadaCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.CanadaCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);
		const canadaInput: CorporateTax.CanadaCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
			isSmallBusiness: data.details.isSmallBusiness,
		};

		const canadaService = new CorporateTax.CanadaCorporateTaxService(canadaInput, countryRules);

		if (!data.provinceCode) {
			throw new Error('Province code is required for Canada corporate tax calculation');
		}
		const provinceRules = await this.getProvinceRules<CorporateTax.CanadaCorporateTaxRules>(
			data.provinceCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);
		const provinceService = new CorporateTax.CanadaCorporateTaxService(canadaInput, provinceRules);
		const provinceResult = provinceService.calculate();

		return {
			federalTax: canadaService.calculate(),
			provincialTax: provinceResult,
		};
	}

	private async processFranceCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.FranceCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const franceInput: CorporateTax.FranceCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
			isSmallBusiness: data.details.isSmallBusiness,
			annualTurnover: data.details.annualTurnover || 0,
		};

		const franceService = new CorporateTax.FranceCorporateTaxService(franceInput, countryRules);

		return {
			federalTax: franceService.calculate(),
		};
	}

	private async processSouthAfricaCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.SouthAfricaCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const southAfricaInput: CorporateTax.SouthAfricaCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
			regime: data.details.isSmallBusiness ? 'SBC' : 'LARGE',
		};

		const southAfricaService = new CorporateTax.SouthAfricaCorporateTaxService(southAfricaInput, countryRules);

		return {
			federalTax: southAfricaService.calculate(),
		};
	}

	private async processAustraliaCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.AustraliaCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const australiaInput: CorporateTax.AustraliaCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
			isSmallBusiness: data.details.isSmallBusiness,
			annualTurnover: data.details.annualTurnover || 0,
		};

		const australiaService = new CorporateTax.AustraliaCorporateTaxService(australiaInput, countryRules);

		return {
			federalTax: australiaService.calculate(),
		};
	}

	private async processUKCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.UKCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const ukInput: CorporateTax.UKCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
		};

		const ukService = new CorporateTax.UKCorporateTaxService(ukInput, countryRules);

		return {
			federalTax: ukService.calculate(),
		};
	}

	private async processGermanyCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.GermanyCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const germanyInput: CorporateTax.GermanyCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
		};

		const germanyService = new CorporateTax.GermanyCorporateTaxService(germanyInput, countryRules);

		return {
			federalTax: germanyService.calculate(),
		};
	}

	private async processBrazilCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.BrazilCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const brazilInput: CorporateTax.BrazilCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
		};

		const brazilService = new CorporateTax.BrazilCorporateTaxService(brazilInput, countryRules);

		return {
			federalTax: brazilService.calculate(),
		};
	}

	private async processSpainCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.SpainCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const spainInput: CorporateTax.SpainCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
		};

		const spainService = new CorporateTax.SpainCorporateTaxService(spainInput, countryRules);

		return {
			federalTax: spainService.calculate(),
		};
	}

	private async processIndiaCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.IndiaCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const indiaInput: CorporateTax.IndiaCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
		};

		const indiaService = new CorporateTax.IndiaCorporateTaxService(indiaInput, countryRules);

		return {
			federalTax: indiaService.calculate(),
		};
	}

	private async processJapanCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CorporateTax.JapanCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const japanInput: CorporateTax.JapanCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
		};

		const japanService = new CorporateTax.JapanCorporateTaxService(japanInput, countryRules);

		return {
			federalTax: japanService.calculate(),
		};
	}
}
