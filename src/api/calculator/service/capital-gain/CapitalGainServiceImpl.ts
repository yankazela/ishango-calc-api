import {
	CalculatorType,
	CanadaIncomeTaxService,
	CanadaIncomeTaxRules,
	CanadaComputedIncomeTaxValues,
	FranceIncomeTaxService,
	FranceIncomeTaxRules,
	SouthAfricaIncomeTaxService,
	SouthAfricaIncomeTaxRules,
	AustraliaIncomeTaxService,
	AustraliaIncomeTaxRules,
	UKIncomeTaxService,
	UKIncomeTaxRules,
	USAIncomeTaxService,
	USAIncomeTaxRules,
	GermanyIncomeTaxService,
	GermanyIncomeTaxRules,
} from '@novha/calc-engines';
import { CapitalGainRequest, CapitalGainResponse } from '../../domain/CapitalGainTypes';
import { BaseCalculatorService } from '../BaseCalculatorService';
import { CapitalGainService } from './CapitalGainService';

export class CapitalGainServiceImpl extends BaseCalculatorService implements CapitalGainService {
	processCapitalGain<T>(data: CapitalGainRequest): Promise<T> {
		try {
			switch (data.countryCode.toLocaleLowerCase()) {
				case 'ca':
					return this.processCanadaCapitalGain(data) as Promise<T>;
				case 'fr':
					return this.processFranceCapitalGain(data) as Promise<T>;
				case 'za':
					return this.processSouthAfricaCapitalGain(data) as Promise<T>;
				case 'au':
					return this.processAustraliaCapitalGain(data) as Promise<T>;
				case 'uk':
					return this.processUKCapitalGain(data) as Promise<T>;
				case 'us':
					return this.processUSACapitalGain(data) as Promise<T>;
				case 'ge':
					return this.processGermanyCapitalGain(data) as Promise<T>;
				default:
					throw new Error(`Unsupported country: ${data.countryCode}`);
			}
		} catch (error) {
			throw new Error(`Error processing capital gain input: ${(error as Error).message}`);
		}
	}

	private async processCanadaCapitalGain(data: CapitalGainRequest): Promise<CapitalGainResponse> {
		const capitalGain = data.details.salePrice - data.details.purchasePrice;
		const countryRules = await this.getCountryRules<CanadaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const service = new CanadaIncomeTaxService(capitalGain, countryRules);
		const tax = service.calculateNetIncome();

		let provincialTax: CanadaComputedIncomeTaxValues | null = null;
		if (data.provinceCode) {
			const provinceRules = await this.getProvinceRules<CanadaIncomeTaxRules>(
				data.provinceCode,
				data.year,
				CalculatorType.INCOME_TAX,
			);
			const provinceService = new CanadaIncomeTaxService(capitalGain, provinceRules);
			provincialTax = provinceService.calculateNetIncome();
		}

		return {
			capitalGain,
			tax,
			provincialTax,
		};
	}

	private async processFranceCapitalGain(data: CapitalGainRequest): Promise<CapitalGainResponse> {
		const capitalGain = data.details.salePrice - data.details.purchasePrice;
		const countryRules = await this.getCountryRules<FranceIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const service = new FranceIncomeTaxService(capitalGain, countryRules, data.familyPart || 1);

		return {
			capitalGain,
			tax: service.calculateNetIncome(),
		};
	}

	private async processSouthAfricaCapitalGain(data: CapitalGainRequest): Promise<CapitalGainResponse> {
		const capitalGain = data.details.salePrice - data.details.purchasePrice;
		const countryRules = await this.getCountryRules<SouthAfricaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const service = new SouthAfricaIncomeTaxService(
			capitalGain,
			data.age || 64,
			countryRules,
			data.medicalAidMembers || 0,
		);

		return {
			capitalGain,
			tax: service.calculateNetIncome(),
		};
	}

	private async processAustraliaCapitalGain(data: CapitalGainRequest): Promise<CapitalGainResponse> {
		const capitalGain = data.details.salePrice - data.details.purchasePrice;
		const countryRules = await this.getCountryRules<AustraliaIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const service = new AustraliaIncomeTaxService(
			capitalGain,
			countryRules,
			data.isResident ?? true,
			data.includeMedicareLevy ?? true,
		);

		return {
			capitalGain,
			tax: service.calculateNetIncome(),
		};
	}

	private async processUKCapitalGain(data: CapitalGainRequest): Promise<CapitalGainResponse> {
		const capitalGain = data.details.salePrice - data.details.purchasePrice;
		const countryRules = await this.getCountryRules<UKIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const service = new UKIncomeTaxService(capitalGain, countryRules);

		return {
			capitalGain,
			tax: service.calculateNetIncome(),
		};
	}

	private async processUSACapitalGain(data: CapitalGainRequest): Promise<CapitalGainResponse> {
		const capitalGain = data.details.salePrice - data.details.purchasePrice;
		const countryRules = await this.getCountryRules<USAIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const service = new USAIncomeTaxService(capitalGain, countryRules);

		return {
			capitalGain,
			tax: service.calculateNetIncome(),
		};
	}

	private async processGermanyCapitalGain(data: CapitalGainRequest): Promise<CapitalGainResponse> {
		const capitalGain = data.details.salePrice - data.details.purchasePrice;
		const countryRules = await this.getCountryRules<GermanyIncomeTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INCOME_TAX,
		);
		const service = new GermanyIncomeTaxService(capitalGain, countryRules);

		return {
			capitalGain,
			tax: service.calculateNetIncome(),
		};
	}
}
