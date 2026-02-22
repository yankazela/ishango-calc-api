import {
	CalculatorType,
	CanadaCorporateTaxInput,
	CanadaCorporateTaxService,
	CanadaCorporateTaxRules,
	FranceCorporateTaxInput,
	FranceCorporateTaxService,
	FranceCorporateTaxRules,
	SouthAfricaCorporateTaxInput,
	SouthAfricaCorporateTaxService,
	SouthAfricaCorporateTaxRules,
	AustraliaCorporateTaxInput,
	AustraliaCorporateTaxService,
	AustraliaCorporateTaxRules,
} from '@novha/calc-engines';
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
				default:
					throw new Error(`Unsupported country: ${data.countryCode}`);
			}
		} catch (error) {
			throw new Error(`Error processing calculator input: ${(error as Error).message}`);
		}
	}

	private async processCanadaCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<CanadaCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);
		const canadaInput: CanadaCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
			isSmallBusiness: data.details.isSmallBusiness,
		};

		const canadaService = new CanadaCorporateTaxService(canadaInput, countryRules);

		if (!data.provinceCode) {
			throw new Error('Province code is required for Canada corporate tax calculation');
		}
		const provinceRules = await this.getProvinceRules<CanadaCorporateTaxRules>(
			data.provinceCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);
		const provinceService = new CanadaCorporateTaxService(canadaInput, provinceRules);
		const provinceResult = provinceService.calculate();

		return {
			federalTax: canadaService.calculate(),
			provincialTax: provinceResult,
		};
	}

	private async processFranceCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<FranceCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const franceInput: FranceCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
			isSmallBusiness: data.details.isSmallBusiness,
			annualTurnover: data.details.annualTurnover || 0,
		};

		const franceService = new FranceCorporateTaxService(franceInput, countryRules);

		return {
			federalTax: franceService.calculate(),
		};
	}

	private async processSouthAfricaCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<SouthAfricaCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const southAfricaInput: SouthAfricaCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
			regime: data.details.isSmallBusiness ? 'SBC' : 'LARGE',
		};

		const southAfricaService = new SouthAfricaCorporateTaxService(southAfricaInput, countryRules);

		return {
			federalTax: southAfricaService.calculate(),
		};
	}

	private async processAustraliaCorporateTax(data: CorporateTaxRequest): Promise<CorporateTaxResponse> {
		const countryRules = await this.getCountryRules<AustraliaCorporateTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CORPORATE_TAX,
		);

		const australiaInput: AustraliaCorporateTaxInput = {
			taxableIncome: data.details.taxableIncome,
			isSmallBusiness: data.details.isSmallBusiness,
			annualTurnover: data.details.annualTurnover || 0,
		};

		const australiaService = new AustraliaCorporateTaxService(australiaInput, countryRules);

		return {
			federalTax: australiaService.calculate(),
		};
	}
}
