import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import {
	CountryArticle,
	CountryWithCalculatorsItem,
	GetCalCountriesResponse,
} from '../../../shared/repositories/country/domain/GetCalCountriesResponse';
import type { CalcCountryRepositoryService } from '../../../shared/repositories/country/service/CalcCountryRepositoryService';
import { RepositoriesSymbols } from '../../../shared/repositories/ioc';
import { S3Symbols } from '../../../shared/s3/ioc';
import type { S3Service } from '../../../shared/s3/service/S3Service';
import { CountryService } from './CountryService';

export class CountryServiceImpl implements CountryService {
	constructor(
		@Inject(RepositoriesSymbols.CalcCountryRepositoryService)
		private readonly calcCountryRepositoryService: CalcCountryRepositoryService,
		@Inject(S3Symbols.S3Service)
		private readonly s3Service: S3Service,
	) {}

	async listCalcCountries(calculatorTypeName: string, year: string): Promise<GetCalCountriesResponse[]> {
		return this.calcCountryRepositoryService.getCalCountries(calculatorTypeName, year);
	}

	async listCountriesWithCalculators(): Promise<CountryWithCalculatorsItem[]> {
		return this.calcCountryRepositoryService.getCountriesWithCalculators();
	}

	async getCountryArticle(fileName: string): Promise<CountryArticle[]> {
		const normalizedFileName = fileName.trim();

		if (!normalizedFileName || /[\\/]/.test(normalizedFileName)) {
			throw new BadRequestException('Invalid file name.');
		}

		const key = `countries/articles/${normalizedFileName.endsWith('.json') ? normalizedFileName : `${normalizedFileName}.json`}`;

		try {
			const file = await this.s3Service.fetchFile(key);
			return JSON.parse(file.body.toString('utf-8')) as CountryArticle[];
		} catch (error) {
			console.error(`Error fetching country article ${normalizedFileName}:`, error);
			throw new NotFoundException(`Country article not found: ${normalizedFileName}`);
		}
	}
}
