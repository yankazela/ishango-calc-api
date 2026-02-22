import { Inject } from '@nestjs/common';
import { CalculatorType } from '@novha/calc-engines';
import type { CalcCountryRepositoryService } from '../../../shared/repositories/country/service/CalcCountryRepositoryService';
import type { CalcProvinceRepositoryService } from '../../../shared/repositories/country/service/CalcProvinceRepositoryService';
import { RepositoriesSymbols } from '../../../shared/repositories/ioc';

interface Ruleset<T> {
	rules: T;
}

export class BaseCalculatorService {
	constructor(
		@Inject(RepositoriesSymbols.CalcCountryRepositoryService)
		private readonly calcCountryRepositoryService: CalcCountryRepositoryService,
		@Inject(RepositoriesSymbols.CalculatorProvinceRepositoryService)
		private readonly calcProvinceRepositoryService: CalcProvinceRepositoryService,
	) {}
	async getCountryRules<T>(countryCode: string, year: string, calculatorType: CalculatorType): Promise<T> {
		try {
			const jsonFormSchema = await this.calcCountryRepositoryService.getSchemaByCountryAndYear<Ruleset<T>>(
				countryCode,
				year,
				calculatorType,
			);

			return jsonFormSchema.rules as unknown as T;
		} catch (error) {
			throw new Error(`Error processing country tax: ${(error as Error).message}`);
		}
	}

	async getProvinceRules<T>(provinceCode: string, year: string, calculatorType: CalculatorType): Promise<T> {
		try {
			const jsonFormSchema = await this.calcProvinceRepositoryService.getSchemaByProvinceAndYear<Ruleset<T>>(
				provinceCode,
				year,
				calculatorType,
			);
			if (!jsonFormSchema?.rules) {
				throw new Error('Province rules not found');
			}

			return jsonFormSchema.rules as unknown as T;
		} catch (error) {
			throw new Error(`Error processing province tax: ${(error as Error).message}`);
		}
	}
}
