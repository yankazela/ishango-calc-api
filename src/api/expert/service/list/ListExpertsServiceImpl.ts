import { Inject } from '@nestjs/common';

import { ExpertCountryItem, ExpertListItem } from '../../../../shared/repositories/expert/domain/GetExpertListResponse';
import type { GetExpertListService } from '../../../../shared/repositories/expert/service/GetExpertListService';
import { RepositoriesSymbols } from '../../../../shared/repositories/ioc';
import { ListExpertsService } from './ListExpertsService';

export class ListExpertsServiceImpl implements ListExpertsService {
	constructor(
		@Inject(RepositoriesSymbols.GetExpertListService)
		private readonly getExpertListService: GetExpertListService,
	) {}

	async list(countryCode: string, calculatorType: string): Promise<ExpertListItem[]> {
		return this.getExpertListService.getList(countryCode, calculatorType);
	}

	async listByCountry(countryCode: string): Promise<ExpertCountryItem[]> {
		return this.getExpertListService.getByCountry(countryCode);
	}
}
