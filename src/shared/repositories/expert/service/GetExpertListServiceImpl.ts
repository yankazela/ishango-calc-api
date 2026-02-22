import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ExpertListItem, ExpertCountryItem } from '../domain/GetExpertListResponse';
import { GetExpertListService } from './GetExpertListService';
import { RepositoriesSymbols } from '../../ioc';
import { ExpertiseCountries } from '../../entities';

export class GetExpertListServiceImpl implements GetExpertListService {
	constructor(
		@Inject(RepositoriesSymbols.ExpertiseCountryRepository)
		private expertiseCountryRepository: Repository<ExpertiseCountries>,
	) {}

	async getList(countryCode: string, calculatorType: string): Promise<ExpertListItem[]> {
		const expertiseCountries = await this.expertiseCountryRepository
			.createQueryBuilder('ec')
			.leftJoinAndSelect('ec.Expert', 'expert')
			.leftJoinAndSelect('expert.ExpertType', 'expertType')
			.leftJoinAndSelect('ec.CalculatorCountry', 'calcCountry')
			.leftJoinAndSelect('calcCountry.Country', 'country')
			.leftJoinAndSelect('calcCountry.CalculatorType', 'calculatorType')
			.where('LOWER(country.Code) = LOWER(:countryCode)', { countryCode })
			.andWhere('LOWER(calculatorType.Name) = LOWER(:calculatorTypeName)', { calculatorTypeName: calculatorType })
			.andWhere('ec.DisabledAt IS NULL')
			.andWhere('expert.DisabledAt IS NULL')
			.andWhere('calcCountry.DisabledAt IS NULL')
			.andWhere('country.DisabledAt IS NULL')
			.andWhere('calculatorType.DisabledAt IS NULL')
			.getMany();

		const resultsByExpert = new Map<string, ExpertListItem>();

		for (const expertise of expertiseCountries) {
			const expert = expertise.Expert;
			if (!expert || resultsByExpert.has(expert.ID)) {
				continue;
			}

			resultsByExpert.set(expert.ID, {
				id: expert.ID,
				name: expert.Name,
				image: expert.ProfilePictureUrl,
				type: expert.ExpertType ? expert.ExpertType.Name : '',
				role: expert.Role,
				rating: expert.Rating,
				description: expert.Bio,
			});
		}

		return Array.from(resultsByExpert.values()).sort((a, b) => a.name.localeCompare(b.name));
	}

	async getByCountry(countryCode: string): Promise<ExpertCountryItem[]> {
		const expertiseCountries = await this.expertiseCountryRepository
			.createQueryBuilder('ec')
			.leftJoinAndSelect('ec.Expert', 'expert')
			.leftJoinAndSelect('expert.ExpertType', 'expertType')
			.leftJoinAndSelect('ec.CalculatorCountry', 'calcCountry')
			.leftJoinAndSelect('calcCountry.Country', 'country')
			.leftJoinAndSelect('calcCountry.CalculatorType', 'calculatorType')
			.where('LOWER(country.Code) = LOWER(:countryCode)', { countryCode })
			.andWhere('ec.DisabledAt IS NULL')
			.andWhere('expert.DisabledAt IS NULL')
			.andWhere('calcCountry.DisabledAt IS NULL')
			.andWhere('country.DisabledAt IS NULL')
			.andWhere('calculatorType.DisabledAt IS NULL')
			.getMany();

		const resultsByExpert = new Map<string, ExpertCountryItem>();

		for (const expertise of expertiseCountries) {
			const expert = expertise.Expert;
			if (!expert || resultsByExpert.has(expert.ID)) {
				continue;
			}

			resultsByExpert.set(expert.ID, {
				id: expert.ID,
				name: expert.Name,
				image: expert.ProfilePictureUrl,
				type: expert.ExpertType ? expert.ExpertType.Name : '',
				role: expert.Role,
				rating: expert.Rating,
				description: expert.Bio,
				calculators: expertise.CalculatorCountry ? [expertise.CalculatorCountry.CalculatorType.Name] : [],
			});
		}

		return Array.from(resultsByExpert.values()).sort((a, b) => a.name.localeCompare(b.name));
	}
}
