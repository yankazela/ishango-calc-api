import { Controller, Get, Inject, Param } from '@nestjs/common';
import {
	CountryWithCalculatorsItem,
	GetCalCountriesResponse,
} from '../../shared/repositories/country/domain/GetCalCountriesResponse';
import { CountrySymbols } from './ioc';
import type { CountryService } from './service/CountryService';

@Controller('countries')
export class CountryController {
	constructor(
		@Inject(CountrySymbols.CountryService)
		private readonly countryService: CountryService,
	) {}

	@Get('/calculators/:calculatorTypeName/:year')
	listCalcCountries(
		@Param('calculatorTypeName') calculatorTypeName: string,
		@Param('year') year: string,
	): Promise<GetCalCountriesResponse[]> {
		return this.countryService.listCalcCountries(calculatorTypeName, year);
	}

	@Get('/calculators')
	listCountriesWithCalculators(): Promise<CountryWithCalculatorsItem[]> {
		return this.countryService.listCountriesWithCalculators();
	}
}
