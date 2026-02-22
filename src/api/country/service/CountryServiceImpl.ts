import { Inject } from '@nestjs/common';
import {
	CountryWithCalculatorsItem,
	GetCalCountriesResponse,
} from '../../../shared/repositories/country/domain/GetCalCountriesResponse';
import type { CalcCountryRepositoryService } from '../../../shared/repositories/country/service/CalcCountryRepositoryService';
import { RepositoriesSymbols } from '../../../shared/repositories/ioc';
import { CountryService } from './CountryService';

export class CountryServiceImpl implements CountryService {
	constructor(
		@Inject(RepositoriesSymbols.CalcCountryRepositoryService)
		private readonly calcCountryRepositoryService: CalcCountryRepositoryService,
	) {}

	async listCalcCountries(calculatorTypeName: string, year: string): Promise<GetCalCountriesResponse[]> {
		return this.calcCountryRepositoryService.getCalCountries(calculatorTypeName, year);
	}

	async listCountriesWithCalculators(): Promise<CountryWithCalculatorsItem[]> {
		return this.calcCountryRepositoryService.getCountriesWithCalculators();
	}
}
