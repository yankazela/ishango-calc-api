import {
	CountryArticle,
	CountryWithCalculatorsItem,
	GetCalCountriesResponse,
} from '../../../shared/repositories/country/domain/GetCalCountriesResponse';

export interface CountryService {
	listCalcCountries(calculatorTypeName: string, year: string): Promise<GetCalCountriesResponse[]>;
	listCountriesWithCalculators(): Promise<CountryWithCalculatorsItem[]>;
	getCountryArticle(fileName: string): Promise<CountryArticle[]>;
}
