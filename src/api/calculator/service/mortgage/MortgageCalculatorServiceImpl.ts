import {
	CalculatorType,
	CanadaMortgageService,
	CanadaMortgageRules,
	CanadaMortgageCalculationResult,
	FranceMortgageRules,
	FranceMortgageCalculationResult,
	FranceMortgageService,
	SouthAfricaMortgageService,
	SouthAfricaMortgageRules,
	SouthAfricaMortgageOutput,
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
		const canadaMortgageService = new CanadaMortgageService();

		return canadaMortgageService.calculate(data.details, countryRules);
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
}
