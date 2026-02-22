import { Inject } from '@nestjs/common';
import { CalculatorType } from '@novha/calc-engines';
import { Repository } from 'typeorm';

import { GetCalCountriesResponse, CountryWithCalculatorsItem } from '../domain/GetCalCountriesResponse';
import { CalcCountryRepositoryService } from './CalcCountryRepositoryService';
import { RepositoriesSymbols } from '../../ioc';
import { CalculatorCountries } from '../../entities';
import { Provinces } from '../../entities/Provinces';
import { IncomeTaxCalculatorSchema } from 'src/shared/schema/IncomeTaxCountry';

export class CalcCountryRepositoryServiceImpl implements CalcCountryRepositoryService {
	constructor(
		@Inject(RepositoriesSymbols.CalculatorCountryRepository)
		private calculatorCountryRepository: Repository<CalculatorCountries>,
		@Inject(RepositoriesSymbols.ProvinceRepository)
		private provinceRepository: Repository<Provinces>,
	) {}

	async getCalCountries(calculatorTypeName: string, year: string): Promise<GetCalCountriesResponse[]> {
		const calculatorCountries = await this.calculatorCountryRepository
			.createQueryBuilder('cc')
			.leftJoinAndSelect('cc.Country', 'country')
			.leftJoinAndSelect('cc.CalculatorType', 'calculatorType')
			.where('LOWER(calculatorType.Name) = LOWER(:calculatorTypeName)', { calculatorTypeName })
			.andWhere('cc.Year = :year', { year })
			.getMany();

		const results: GetCalCountriesResponse[] = await Promise.all(
			calculatorCountries.map(async (cc) => {
				const jsonFormSchema = JSON.parse(cc?.JsonSchema || '{}') as IncomeTaxCalculatorSchema;
				const taxBrackets = jsonFormSchema.rules.taxBrackets ? jsonFormSchema.rules.taxBrackets : undefined;
				const data = {
					id: cc.ID,
					countryId: cc.Country.ID,
					name: cc.Country.Name,
					code: cc.Country.Code,
					currency: cc.Country.Currency,
					currencySymbol: cc.Country.CurrencySymbol,
					withProvincial: cc.WithProvincial,
					formInputs: jsonFormSchema.inputs,
				};

				let provinces: { id: string; name: string; code: string }[] = [];

				if (cc.WithProvincial) {
					const provs = await this.provinceRepository
						.createQueryBuilder('p')
						.where('p.CountryID = :countryId', { countryId: cc.Country.ID })
						.getMany();
					provinces = provs.map((p) => ({
						id: p.ID,
						name: p.Name,
						code: p.Code,
					}));
				}

				return { ...data, provinces, taxBrackets };
			}),
		);

		return results.sort((a, b) => a.name.localeCompare(b.name));
	}

	async getCalcCountryById(calculatorTypeId: string): Promise<CalculatorCountries | null> {
		return this.calculatorCountryRepository.findOneBy({ ID: calculatorTypeId });
	}

	async getCountrySchema<T>(calculatorCountryId: string): Promise<T> {
		const calculatorType = await this.getCalcCountryById(calculatorCountryId);

		if (!calculatorType) {
			throw new Error(`Calculator not found for ID: ${calculatorCountryId}`);
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const jsonFormSchema = JSON.parse(calculatorType.JsonSchema || '{}');

		return jsonFormSchema as unknown as T;
	}

	async getSchemaByCountryAndYear<T>(countryCode: string, year: string, calculatorType: CalculatorType): Promise<T> {
		const calculatorCountry = await this.calculatorCountryRepository
			.createQueryBuilder('cc')
			.leftJoinAndSelect('cc.Country', 'country')
			.leftJoinAndSelect('cc.CalculatorType', 'calculatorType')
			.where('LOWER(country.Code) = LOWER(:countryCode)', { countryCode })
			.andWhere('cc.Year = :year', { year })
			.andWhere('calculatorType.Name = :calculatorType', { calculatorType: calculatorType.toString() })
			.getOne();

		if (!calculatorCountry) {
			throw new Error(`Schema not found for country: ${countryCode} and year: ${year}`);
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const jsonFormSchema = JSON.parse(calculatorCountry.JsonSchema || '{}');

		return jsonFormSchema as unknown as T;
	}

	async getCountriesWithCalculators(): Promise<CountryWithCalculatorsItem[]> {
		const calculatorCountries = await this.calculatorCountryRepository
			.createQueryBuilder('cc')
			.leftJoinAndSelect('cc.Country', 'country')
			.leftJoinAndSelect('cc.CalculatorType', 'calculatorType')
			.getMany();

		// Group by country to get unique countries with their calculators
		const countryMap = new Map<string, CountryWithCalculatorsItem>();

		calculatorCountries.forEach((cc) => {
			const countryId = cc.Country.ID;

			if (!countryMap.has(countryId)) {
				countryMap.set(countryId, {
					id: cc.ID,
					name: cc.Country.Name,
					code: cc.Country.Code,
					currency: cc.Country.Currency,
					currencySymbol: cc.Country.CurrencySymbol,
					calculators: [],
				});
			}

			const country = countryMap.get(countryId)!;
			country.calculators.push({
				id: cc.ID,
				name: cc.CalculatorType.Name,
			});
		});

		// Convert map to array and sort by country name
		return Array.from(countryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
	}
}
