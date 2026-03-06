import { CalculatorType } from '../../../../shared/domain/CalculatorType';
import {
	CapitalGainTaxRequest,
	CapitalGainTaxResponse,
	CapitalGainTaxResult,
	CanadaCapitalGainTaxRules,
	FranceCapitalGainTaxRules,
	SouthAfricaCapitalGainTaxRules,
	AustraliaCapitalGainTaxRules,
	UKCapitalGainTaxRules,
	USACapitalGainTaxRules,
	GermanyCapitalGainTaxRules,
} from '../../domain/CapitalGainTaxTypes';
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

	private calculateTaxFromBrackets(
		taxableGain: number,
		brackets: { from: number; to: number | null; rate: number }[],
	): number {
		let tax = 0;
		let remaining = taxableGain;

		for (const bracket of brackets) {
			if (remaining <= 0) break;

			const bracketSize = bracket.to !== null ? bracket.to - bracket.from : remaining;
			const taxable = Math.min(remaining, bracketSize);
			tax += taxable * bracket.rate;
			remaining -= taxable;
		}

		return tax;
	}

	private buildResult(capitalGain: number, taxableGain: number, taxOnGain: number): CapitalGainTaxResult {
		return {
			capitalGain,
			taxableGain,
			taxOnGain,
			effectiveRate: capitalGain > 0 ? taxOnGain / capitalGain : 0,
		};
	}

	private async processCanadaCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGainTaxResponse> {
		const countryRules = await this.getCountryRules<CanadaCapitalGainTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAIN_TAX,
		);

		const taxableGain = data.details.capitalGain * countryRules.inclusionRate;
		const taxOnGain = this.calculateTaxFromBrackets(taxableGain, countryRules.taxBrackets);

		const result: CapitalGainTaxResponse = {
			federalTax: this.buildResult(data.details.capitalGain, taxableGain, taxOnGain),
		};

		if (data.provinceCode) {
			const provinceRules = await this.getProvinceRules<CanadaCapitalGainTaxRules>(
				data.provinceCode,
				data.year,
				CalculatorType.CAPITAL_GAIN_TAX,
			);
			const provincialTax = this.calculateTaxFromBrackets(taxableGain, provinceRules.taxBrackets);
			result.provincialTax = this.buildResult(data.details.capitalGain, taxableGain, provincialTax);
		}

		return result;
	}

	private async processFranceCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGainTaxResponse> {
		const countryRules = await this.getCountryRules<FranceCapitalGainTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAIN_TAX,
		);

		let discountRate = 0;
		for (const discount of countryRules.holdingPeriodDiscounts) {
			if (
				data.details.holdingPeriodMonths >= discount.minMonths &&
				(discount.maxMonths === null || data.details.holdingPeriodMonths <= discount.maxMonths)
			) {
				discountRate = discount.discountRate;
				break;
			}
		}

		const taxableGain = data.details.capitalGain * (1 - discountRate);
		const taxOnGain = taxableGain * (countryRules.flatTaxRate + countryRules.socialContributionsRate);

		return {
			federalTax: this.buildResult(data.details.capitalGain, taxableGain, taxOnGain),
		};
	}

	private async processSouthAfricaCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGainTaxResponse> {
		const countryRules = await this.getCountryRules<SouthAfricaCapitalGainTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAIN_TAX,
		);

		const gainAfterExclusion = Math.max(0, data.details.capitalGain - countryRules.annualExclusion);
		const taxableGain = gainAfterExclusion * countryRules.inclusionRate;
		const taxOnGain = this.calculateTaxFromBrackets(taxableGain, countryRules.taxBrackets);

		return {
			federalTax: this.buildResult(data.details.capitalGain, taxableGain, taxOnGain),
		};
	}

	private async processAustraliaCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGainTaxResponse> {
		const countryRules = await this.getCountryRules<AustraliaCapitalGainTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAIN_TAX,
		);

		const eligibleForDiscount = data.details.holdingPeriodMonths >= countryRules.cgtDiscountMinHoldingMonths;
		const taxableGain = eligibleForDiscount
			? data.details.capitalGain * (1 - countryRules.cgtDiscountRate)
			: data.details.capitalGain;
		const taxOnGain = this.calculateTaxFromBrackets(taxableGain, countryRules.taxBrackets);

		return {
			federalTax: this.buildResult(data.details.capitalGain, taxableGain, taxOnGain),
		};
	}

	private async processUKCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGainTaxResponse> {
		const countryRules = await this.getCountryRules<UKCapitalGainTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAIN_TAX,
		);

		const taxableGain = Math.max(0, data.details.capitalGain - countryRules.annualExemptAmount);
		const annualIncome = data.details.annualIncome || 0;
		const remainingBasicBand = Math.max(0, countryRules.basicRateThreshold - annualIncome);

		const gainAtBasicRate = Math.min(taxableGain, remainingBasicBand);
		const gainAtHigherRate = Math.max(0, taxableGain - remainingBasicBand);
		const taxOnGain = gainAtBasicRate * countryRules.basicRate + gainAtHigherRate * countryRules.higherRate;

		return {
			federalTax: this.buildResult(data.details.capitalGain, taxableGain, taxOnGain),
		};
	}

	private async processUSACapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGainTaxResponse> {
		const countryRules = await this.getCountryRules<USACapitalGainTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAIN_TAX,
		);

		const isLongTerm = data.details.holdingPeriodMonths >= countryRules.longTermThresholdMonths;
		const brackets = isLongTerm ? countryRules.longTermBrackets : countryRules.shortTermBrackets;
		const taxableGain = data.details.capitalGain;
		const taxOnGain = this.calculateTaxFromBrackets(taxableGain, brackets);

		return {
			federalTax: this.buildResult(data.details.capitalGain, taxableGain, taxOnGain),
		};
	}

	private async processGermanyCapitalGainTax(data: CapitalGainTaxRequest): Promise<CapitalGainTaxResponse> {
		const countryRules = await this.getCountryRules<GermanyCapitalGainTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.CAPITAL_GAIN_TAX,
		);

		const taxableGain = Math.max(0, data.details.capitalGain - countryRules.saverAllowance);
		const baseTax = taxableGain * countryRules.flatTaxRate;
		const solidaritySurcharge = baseTax * countryRules.solidaritySurchargeRate;
		const taxOnGain = baseTax + solidaritySurcharge;

		return {
			federalTax: this.buildResult(data.details.capitalGain, taxableGain, taxOnGain),
		};
	}
}
