import { CalculatorType } from '@novha/calc-engines';

import { CalculatorCountries } from '../../entities';
import { GetCalCountriesResponse, CountryWithCalculatorsItem } from '../domain/GetCalCountriesResponse';

export interface CalcCountryRepositoryService {
	getCalCountries(calculatorTypeName: string, year: string): Promise<GetCalCountriesResponse[]>;
	getCalcCountryById(calculatorTypeId: string): Promise<CalculatorCountries | null>;
	getCountrySchema<T>(calculatorCountryId: string): Promise<T>;
	getSchemaByCountryAndYear<T>(countryCode: string, year: string, calculatorType: CalculatorType): Promise<T>;
	getCountriesWithCalculators(): Promise<CountryWithCalculatorsItem[]>;
}
