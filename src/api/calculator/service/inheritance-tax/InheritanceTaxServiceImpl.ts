import { InheritanceTax } from '@novha/calc-engines';

import { CalculatorType } from '@novha/calc-engines';

import { InheritanceTaxRequest } from '../../domain/InheritanceTaxTypes';

import { BaseCalculatorService } from '../BaseCalculatorService';
import { InheritanceTaxService } from './InheritanceTaxService';

export class InheritanceTaxServiceImpl extends BaseCalculatorService implements InheritanceTaxService {
	processInheritanceTax<T>(data: InheritanceTaxRequest): Promise<T> {
		try {
			switch (data.countryCode.toLocaleLowerCase()) {
				case 'fr':
					return this.processFranceInheritanceTax(data) as Promise<T>;
				case 'za':
					return this.processSouthAfricaInheritanceTax(data) as Promise<T>;
				case 'uk':
					return this.processUKInheritanceTax(data) as Promise<T>;
				case 'us':
					return this.processUSAInheritanceTax(data) as Promise<T>;
				case 'de':
					return this.processGermanyInheritanceTax(data) as Promise<T>;
				case 'es':
					return this.processSpainInheritanceTax(data) as Promise<T>;
				case 'jp':
					return this.processJapanInheritanceTax(data) as Promise<T>;
				case 'nl':
					return this.processNetherlandsInheritanceTax(data) as Promise<T>;
				default:
					throw new Error(`Unsupported country: ${data.countryCode}`);
			}
		} catch (error) {
			throw new Error(`Error processing calculator input: ${(error as Error).message}`);
		}
	}

	private async processFranceInheritanceTax(
		data: InheritanceTaxRequest,
	): Promise<InheritanceTax.FranceInheritanceTaxResult> {
		const countryRules = await this.getCountryRules<InheritanceTax.FranceInheritanceTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INHERITANCE_TAX,
		);

		const franceInheritanceTaxService = new InheritanceTax.FranceInheritanceTaxService(
			{
				estateValue: data.details.estateValue,
				relationship:
					(data.details.relationship as InheritanceTax.FranceInheritanceTaxInput['relationship']) || 'other',
			},
			countryRules,
		);

		const result = franceInheritanceTaxService.calculate();

		return result;
	}

	private async processSouthAfricaInheritanceTax(
		data: InheritanceTaxRequest,
	): Promise<InheritanceTax.SouthAfricaInheritanceTaxResult> {
		const countryRules = await this.getCountryRules<InheritanceTax.SouthAfricaInheritanceTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INHERITANCE_TAX,
		);

		const southAfricaInheritanceTaxService = new InheritanceTax.SouthAfricaInheritanceTaxService(
			{
				estateValue: data.details.estateValue,
				deductions: data.details.deductions || 0,
			},
			countryRules,
		);

		const result = southAfricaInheritanceTaxService.calculate();

		return result;
	}

	private async processUKInheritanceTax(data: InheritanceTaxRequest): Promise<InheritanceTax.UKInheritanceTaxResult> {
		const countryRules = await this.getCountryRules<InheritanceTax.UKInheritanceTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INHERITANCE_TAX,
		);

		const ukInheritanceTaxService = new InheritanceTax.UKInheritanceTaxService(
			{
				estateValue: data.details.estateValue,
				charitableGivingPercent: data.details.charitableGivingPercent || 0,
			},
			countryRules,
		);

		const result = ukInheritanceTaxService.calculate();

		return result;
	}

	private async processUSAInheritanceTax(
		data: InheritanceTaxRequest,
	): Promise<InheritanceTax.USAInheritanceTaxResult> {
		const countryRules = await this.getCountryRules<InheritanceTax.USAInheritanceTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INHERITANCE_TAX,
		);

		const usaInheritanceTaxService = new InheritanceTax.USAInheritanceTaxService(
			{
				estateValue: data.details.estateValue,
			},
			countryRules,
		);

		const result = usaInheritanceTaxService.calculate();

		return result;
	}

	private async processGermanyInheritanceTax(
		data: InheritanceTaxRequest,
	): Promise<InheritanceTax.GermanyInheritanceTaxResult> {
		const countryRules = await this.getCountryRules<InheritanceTax.GermanyInheritanceTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INHERITANCE_TAX,
		);

		const germanyInheritanceTaxService = new InheritanceTax.GermanyInheritanceTaxService(
			{
				estateValue: data.details.estateValue,
				taxClass: (data.details.taxClass as InheritanceTax.GermanyInheritanceTaxInput['taxClass']) || 'I',
			},
			countryRules,
		);

		const result = germanyInheritanceTaxService.calculate();

		return result;
	}

	private async processSpainInheritanceTax(
		data: InheritanceTaxRequest,
	): Promise<InheritanceTax.SpainInheritanceTaxResult> {
		const countryRules = await this.getCountryRules<InheritanceTax.SpainInheritanceTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INHERITANCE_TAX,
		);

		const spainInheritanceTaxService = new InheritanceTax.SpainInheritanceTaxService(
			{
				estateValue: data.details.estateValue,
			},
			countryRules,
		);

		const result = spainInheritanceTaxService.calculate();

		return result;
	}

	private async processJapanInheritanceTax(
		data: InheritanceTaxRequest,
	): Promise<InheritanceTax.JapanInheritanceTaxResult> {
		const countryRules = await this.getCountryRules<InheritanceTax.JapanInheritanceTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INHERITANCE_TAX,
		);

		const japanInheritanceTaxService = new InheritanceTax.JapanInheritanceTaxService(
			{
				estateValue: data.details.estateValue,
				numberOfStatutoryHeirs: data.details.numberOfStatutoryHeirs || 1,
			},
			countryRules,
		);

		const result = japanInheritanceTaxService.calculate();

		return result;
	}

	private async processNetherlandsInheritanceTax(
		data: InheritanceTaxRequest,
	): Promise<InheritanceTax.NetherlandsInheritanceTaxResult> {
		const countryRules = await this.getCountryRules<InheritanceTax.NetherlandsInheritanceTaxRules>(
			data.countryCode,
			data.year,
			CalculatorType.INHERITANCE_TAX,
		);

		const netherlandsInheritanceTaxService = new InheritanceTax.NetherlandsInheritanceTaxService(
			{
				estateValue: data.details.estateValue,
				taxClass:
					(data.details.taxClass as InheritanceTax.NetherlandsInheritanceTaxInput['taxClass']) || 'Other',
			},
			countryRules,
		);

		const result = netherlandsInheritanceTaxService.calculate();

		return result;
	}
}
