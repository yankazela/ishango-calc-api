import { Mortgage } from '@novha/calc-engines';
import { CalculatorType } from '../../../../shared/domain/CalculatorType';

import { MortgageRequest } from '../../domain/MortgageTypes';
import { MortgageCalculatorService } from '../mortgage/MortgageCalculatorService';
import { BaseCalculatorService } from '../BaseCalculatorService';

export class MortgageCalculatorServiceImpl extends BaseCalculatorService implements MortgageCalculatorService {
	async processMortgage<T>(data: MortgageRequest): Promise<T> {
		try {
			switch (data.countryCode.toLocaleLowerCase()) {
				case 'ca':
					return (await this.processCanadaMortgage(data)) as T;
				case 'za':
					return (await this.processSouthAfricaMortgage(data)) as T;
				case 'fr':
					return (await this.processFranceMortgage(data)) as T;
				case 'au':
					return (await this.processAustraliaMortgage(data)) as T;
				case 'uk':
					return (await this.processUKMortgage(data)) as T;
				case 'de':
					return (await this.processGermanyMortgage(data)) as T;
				case 'br':
					return (await this.processBrazilMortgage(data)) as T;
				case 'es':
					return (await this.processSpainMortgage(data)) as T;
				case 'in':
					return (await this.processIndiaMortgage(data)) as T;
				case 'jp':
					return (await this.processJapanMortgage(data)) as T;
				default:
					throw new Error(`Unsupported country: ${data.countryCode}`);
			}
		} catch (error) {
			throw new Error(`Error processing mortgage input: ${(error as Error).message}`);
		}
	}

	async processCanadaMortgage(data: MortgageRequest): Promise<Mortgage.CanadaMortgageCalculationResult> {
		const countryRules = await this.getCountryRules<Mortgage.CanadaMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);
		const { propertyPrice, downPayment, interestRate, amortizationYears, paymentFrequency } = data.details;
		const validFrequencies: Mortgage.CanadaMortgageCalculationInput['paymentFrequency'][] = [
			'MONTHLY',
			'BI_WEEKLY',
			'ACCELERATED_BI_WEEKLY',
		];
		const canadaFrequency: Mortgage.CanadaMortgageCalculationInput['paymentFrequency'] = validFrequencies.includes(
			paymentFrequency as Mortgage.CanadaMortgageCalculationInput['paymentFrequency'],
		)
			? (paymentFrequency as Mortgage.CanadaMortgageCalculationInput['paymentFrequency'])
			: 'MONTHLY';
		const canadaInput: Mortgage.CanadaMortgageCalculationInput = {
			propertyPrice,
			downPayment,
			interestRate,
			amortizationYears,
			paymentFrequency: canadaFrequency,
		};
		const canadaMortgageService = new Mortgage.CanadaMortgageService();

		return canadaMortgageService.calculate(canadaInput, countryRules);
	}

	async processSouthAfricaMortgage(data: MortgageRequest): Promise<Mortgage.SouthAfricaMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, grossMonthlyIncome } = data.details;
		const inputs = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			grossMonthlyIncome: grossMonthlyIncome ? grossMonthlyIncome : 0,
		};
		const countryRules = await this.getCountryRules<Mortgage.SouthAfricaMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);
		const southAfricaMortgageService = new Mortgage.SouthAfricaMortgageService(inputs, countryRules);

		return southAfricaMortgageService.calculate();
	}

	async processFranceMortgage(data: MortgageRequest): Promise<Mortgage.FranceMortgageCalculationResult> {
		const {
			propertyPrice,
			downPayment,
			netMonthlyIncome,
			amortizationYears,
			interestRate,
			isPrimaryResidence,
			isFirstTimeBuyer,
			isNewBuild,
		} = data.details;

		const details = {
			propertyPrice,
			downPayment,
			netMonthlyIncome: netMonthlyIncome || 0,
			loanDurationYears: amortizationYears || 0,
			annualInterestRate: interestRate,
			isPrimaryResidence: isPrimaryResidence || false,
			isFirstTimeBuyer: isFirstTimeBuyer || false,
			isNewBuild: isNewBuild || false,
		};

		const countryRules = await this.getCountryRules<Mortgage.FranceMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const franceMortgageService = new Mortgage.FranceMortgageService(details, countryRules);

		return franceMortgageService.calculate();
	}

	async processAustraliaMortgage(data: MortgageRequest): Promise<Mortgage.AustraliaMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, paymentFrequency } = data.details;

		const validFrequencies: Mortgage.AustraliaMortgageInput['paymentFrequency'][] = [
			'MONTHLY',
			'FORTNIGHTLY',
			'WEEKLY',
		];
		const australiaFrequency: Mortgage.AustraliaMortgageInput['paymentFrequency'] = validFrequencies.includes(
			paymentFrequency as Mortgage.AustraliaMortgageInput['paymentFrequency'],
		)
			? (paymentFrequency as Mortgage.AustraliaMortgageInput['paymentFrequency'])
			: 'MONTHLY';

		const input: Mortgage.AustraliaMortgageInput = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			paymentFrequency: australiaFrequency,
		};

		const countryRules = await this.getCountryRules<Mortgage.AustraliaMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const australiaMortgageService = new Mortgage.AustraliaMortgageService();

		return australiaMortgageService.calculate(input, countryRules);
	}

	async processUKMortgage(data: MortgageRequest): Promise<Mortgage.UKMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, isFirstTimeBuyer } = data.details;

		const input: Mortgage.UKMortgageInput = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			isFirstTimeBuyer: isFirstTimeBuyer || false,
		};

		const countryRules = await this.getCountryRules<Mortgage.UKMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const ukMortgageService = new Mortgage.UKMortgageService();

		return ukMortgageService.calculate(input, countryRules);
	}

	async processGermanyMortgage(data: MortgageRequest): Promise<Mortgage.GermanyMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears } = data.details;

		const input: Mortgage.GermanyMortgageInput = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
		};

		const countryRules = await this.getCountryRules<Mortgage.GermanyMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const germanyMortgageService = new Mortgage.GermanyMortgageService();

		return germanyMortgageService.calculate(input, countryRules);
	}

	async processBrazilMortgage(data: MortgageRequest): Promise<Mortgage.BrazilMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, isFirstTimeBuyer } = data.details;

		const input: Mortgage.BrazilMortgageInput = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			isFirstTimeBuyer: isFirstTimeBuyer || false,
		};

		const countryRules = await this.getCountryRules<Mortgage.BrazilMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const brazilMortgageService = new Mortgage.BrazilMortgageService();

		return brazilMortgageService.calculate(input, countryRules);
	}

	async processSpainMortgage(data: MortgageRequest): Promise<Mortgage.SpainMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, isFirstTimeBuyer } = data.details;

		const input: Mortgage.SpainMortgageInput = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			isFirstTimeBuyer: isFirstTimeBuyer || false,
		};

		const countryRules = await this.getCountryRules<Mortgage.SpainMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const spainMortgageService = new Mortgage.SpainMortgageService();

		return spainMortgageService.calculate(input, countryRules);
	}

	async processIndiaMortgage(data: MortgageRequest): Promise<Mortgage.IndiaMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, isFirstTimeBuyer } = data.details;

		const input: Mortgage.IndiaMortgageInput = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			isFirstTimeBuyer: isFirstTimeBuyer || false,
		};

		const countryRules = await this.getCountryRules<Mortgage.IndiaMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const indiaMortgageService = new Mortgage.IndiaMortgageService();

		return indiaMortgageService.calculate(input, countryRules);
	}

	async processJapanMortgage(data: MortgageRequest): Promise<Mortgage.JapanMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, isFirstTimeBuyer } = data.details;

		const input: Mortgage.JapanMortgageInput = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			isFirstTimeBuyer: isFirstTimeBuyer || false,
		};

		const countryRules = await this.getCountryRules<Mortgage.JapanMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const japanMortgageService = new Mortgage.JapanMortgageService();

		return japanMortgageService.calculate(input, countryRules);
	}
}
