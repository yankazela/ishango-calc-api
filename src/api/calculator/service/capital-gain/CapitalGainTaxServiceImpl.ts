import { CapitalGain } from '@novha/calc-engines';

import { CalculatorType } from '@novha/calc-engines';

import { CapitalGainTaxRequest } from '../../domain/CapitalGainTaxTypes';

import { BaseCalculatorService } from '../BaseCalculatorService';
import { CapitalGainTaxService } from './CapitalGainTaxService';

export class CapitalGainTaxServiceImpl extends BaseCalculatorService implements CapitalGainTaxService {
	processCapitalGainTax<T>(data: CapitalGainTaxRequest): Promise<T> {
		try {
			switch (data.countryCode.toLocaleLowerCase()) {
				case 'ca':
					return this.processCanadaCapitalGainTax(data) as Promise<T>;
				case 'fr':
					return this.processFranceCapitalGainTax(data) as Promise<T>;
				case 'za':
					return this.processSouthAfricaCapitalGainTax(data) as Promise<T>;
				case 'au':
					return this.processAustraliaCapitalGainTax(data) as Promise<T>;
				case 'uk':
					return this.processUKCapitalGainTax(data) as Promise<T>;
				case 'us':
					return this.processUSACapitalGainTax(data) as Promise<T>;
				case 'ge':
					return this.processGermanyCapitalGainTax(data) as Promise<T>;
				default:
					throw new Error(`Unsupported country: ${data.countryCode}`);
			}
		} catch (error) {
			throw new Error(`Error processing calculator input: ${(error as Error).message}`);
		}
	}

	private async processCanadaCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGain.Result> {
		const countryRules = await this.getCountryRules<CapitalGain.CanadaCapitalGainsRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAINS,
		);

		const canadaCapitalGainsService = new CapitalGain.CanadaCapitalGainsService(
			{
				capitalGain: data.details.capitalGain,
				totalTaxableIncome: data.details.totalTaxableIncome || data.details.capitalGain,
			},
			countryRules,
		);

		const taxOnGain = canadaCapitalGainsService.calculate();

		return taxOnGain;
	}

	private async processFranceCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGain.Result> {
		const countryRules = await this.getCountryRules<CapitalGain.FranceCapitalGainsRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAINS,
		);

		const franceCapitalGainsService = new CapitalGain.FranceCapitalGainsService(
			{ capitalGain: data.details.capitalGain },
			countryRules,
		);

		const taxOnGain = franceCapitalGainsService.calculate();

		return taxOnGain;
	}

	private async processSouthAfricaCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGain.Result> {
		const countryRules = await this.getCountryRules<CapitalGain.SouthAfricaCapitalGainsRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAINS,
		);

		const southAfricaCapitalGainsService = new CapitalGain.SouthAfricaCapitalGainsService(
			{
				capitalGain: data.details.capitalGain,
				totalTaxableIncome: data.details.totalTaxableIncome || data.details.capitalGain,
			},
			countryRules,
		);

		const taxOnGain = southAfricaCapitalGainsService.calculate();

		return taxOnGain;
	}

	private async processAustraliaCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGain.Result> {
		const countryRules = await this.getCountryRules<CapitalGain.AustraliaCapitalGainsRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAINS,
		);

		const australiaCapitalGainsService = new CapitalGain.AustraliaCapitalGainsService(
			{
				capitalGain: data.details.capitalGain,
				totalTaxableIncome: data.details.totalTaxableIncome || data.details.capitalGain,
				holdingPeriodMonths: data.details.holdingPeriodMonths || 0,
			},
			countryRules,
		);

		const taxOnGain = australiaCapitalGainsService.calculate();

		return taxOnGain;
	}

	private async processUKCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGain.Result> {
		const countryRules = await this.getCountryRules<CapitalGain.UKCapitalGainsRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAINS,
		);

		const ukCapitalGainsService = new CapitalGain.UKCapitalGainsService(
			{
				capitalGain: data.details.capitalGain,
				totalTaxableIncome: data.details.totalTaxableIncome || data.details.capitalGain,
			},
			countryRules,
		);

		const taxOnGain = ukCapitalGainsService.calculate();

		return taxOnGain;
	}

	private async processUSACapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGain.Result> {
		const countryRules = await this.getCountryRules<CapitalGain.USACapitalGainsRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAINS,
		);

		const usaCapitalGainsService = new CapitalGain.USACapitalGainsService(
			{
				capitalGain: data.details.capitalGain,
				totalTaxableIncome: data.details.totalTaxableIncome || data.details.capitalGain,
				holdingPeriodMonths: data.details.holdingPeriodMonths || 0,
			},
			countryRules,
		);

		const taxOnGain = usaCapitalGainsService.calculate();

		return taxOnGain;
	}

	private async processGermanyCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGain.Result> {
		const countryRules = await this.getCountryRules<CapitalGain.GermanyCapitalGainsRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAINS,
		);

		const germanyCapitalGainsService = new CapitalGain.GermanyCapitalGainsService(
			{
				capitalGain: data.details.capitalGain,
			},
			countryRules,
		);

		const taxOnGain = germanyCapitalGainsService.calculate();

		return taxOnGain;
	}
}
