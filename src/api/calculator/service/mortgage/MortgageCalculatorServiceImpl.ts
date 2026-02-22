import {
	CalculatorType,
	CanadaMortgageService,
	CanadaMortgageRules,
	CanadaMortgageCalculationInput,
	CanadaMortgageCalculationResult,
	FranceMortgageRules,
	FranceMortgageCalculationResult,
	FranceMortgageService,
	SouthAfricaMortgageService,
	SouthAfricaMortgageRules,
	SouthAfricaMortgageOutput,
	AustraliaMortgageService,
	AustraliaMortgageRules,
	AustraliaMortgageOutput,
	AustraliaMortgageInput,
} from '@novha/calc-engines';

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
				default:
					throw new Error(`Unsupported country: ${data.countryCode}`);
			}
		} catch (error) {
			throw new Error(`Error processing mortgage input: ${(error as Error).message}`);
		}
	}

	async processCanadaMortgage(data: MortgageRequest): Promise<CanadaMortgageCalculationResult> {
		const countryRules = await this.getCountryRules<CanadaMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);
		const { propertyPrice, downPayment, interestRate, amortizationYears, paymentFrequency } = data.details;
		const validFrequencies: CanadaMortgageCalculationInput['paymentFrequency'][] = [
			'MONTHLY',
			'BI_WEEKLY',
			'ACCELERATED_BI_WEEKLY',
		];
		const canadaFrequency: CanadaMortgageCalculationInput['paymentFrequency'] = validFrequencies.includes(
			paymentFrequency as CanadaMortgageCalculationInput['paymentFrequency'],
		)
			? (paymentFrequency as CanadaMortgageCalculationInput['paymentFrequency'])
			: 'MONTHLY';
		const canadaInput: CanadaMortgageCalculationInput = {
			propertyPrice,
			downPayment,
			interestRate,
			amortizationYears,
			paymentFrequency: canadaFrequency,
		};
		const canadaMortgageService = new CanadaMortgageService();

		return canadaMortgageService.calculate(canadaInput, countryRules);
	}

	async processSouthAfricaMortgage(data: MortgageRequest): Promise<SouthAfricaMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, grossMonthlyIncome } = data.details;
		const inputs = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			grossMonthlyIncome: grossMonthlyIncome ? grossMonthlyIncome : 0,
		};
		const countryRules = await this.getCountryRules<SouthAfricaMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);
		const southAfricaMortgageService = new SouthAfricaMortgageService(inputs, countryRules);

		return southAfricaMortgageService.calculate();
	}

	async processFranceMortgage(data: MortgageRequest): Promise<FranceMortgageCalculationResult> {
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

		const countryRules = await this.getCountryRules<FranceMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const franceMortgageService = new FranceMortgageService(details, countryRules);

		return franceMortgageService.calculate();
	}

	async processAustraliaMortgage(data: MortgageRequest): Promise<AustraliaMortgageOutput> {
		const { propertyPrice, downPayment, interestRate, amortizationYears, paymentFrequency } = data.details;

		const validFrequencies: AustraliaMortgageInput['paymentFrequency'][] = ['MONTHLY', 'FORTNIGHTLY', 'WEEKLY'];
		const australiaFrequency: AustraliaMortgageInput['paymentFrequency'] = validFrequencies.includes(
			paymentFrequency as AustraliaMortgageInput['paymentFrequency'],
		)
			? (paymentFrequency as AustraliaMortgageInput['paymentFrequency'])
			: 'MONTHLY';

		const input: AustraliaMortgageInput = {
			propertyPrice,
			downPayment,
			annualInterestRate: interestRate,
			amortizationYears,
			paymentFrequency: australiaFrequency,
		};

		const countryRules = await this.getCountryRules<AustraliaMortgageRules>(
			data.countryCode,
			data.year,
			CalculatorType.MORTGAGE,
		);

		const australiaMortgageService = new AustraliaMortgageService();

		return australiaMortgageService.calculate(input, countryRules);
	}
}
