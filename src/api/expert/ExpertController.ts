import { Controller, Get, Post, Inject, Param, Body } from '@nestjs/common';

import { ExpertCountryItem, ExpertListItem } from '../../shared/repositories/expert/domain/GetExpertListResponse';
import type { ListExpertsService } from './service/list/ListExpertsService';
import type { AddExpertService } from './service/add/AddExpertService';
import type { CreateExpertRequest } from '../../shared/repositories/expert/domain/CreateExpertRequest';
import { ExpertSymbols } from './ioc';

@Controller('experts')
export class ExpertController {
	constructor(
		@Inject(ExpertSymbols.ListExpertsService)
		private readonly listExpertsService: ListExpertsService,
		@Inject(ExpertSymbols.AddExpertService)
		private readonly addExpertService: AddExpertService,
	) {}

	@Get('/:countryCode/:calculatorType')
	list(
		@Param('countryCode') countryCode: string,
		@Param('calculatorType') calculatorType: string,
	): Promise<ExpertListItem[]> {
		return this.listExpertsService.list(countryCode, calculatorType);
	}

	@Get('/:countryCode')
	listByCountry(@Param('countryCode') countryCode: string): Promise<ExpertCountryItem[]> {
		return this.listExpertsService.listByCountry(countryCode);
	}

	@Post('/')
	addExpert(@Body() request: CreateExpertRequest): Promise<void> {
		return this.addExpertService.addExpert(request);
	}
}
