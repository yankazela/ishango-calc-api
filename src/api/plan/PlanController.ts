import { Controller, Get, Inject, Param } from '@nestjs/common';

import { ListPlansResponseItem } from '../../shared/repositories/plan/domain/ListPlansResponse';
import type { PlanService } from './service/PlanService';
import { PlanSymbols } from './ioc';

@Controller('plans')
export class PlanController {
	constructor(
		@Inject(PlanSymbols.PlanService)
		private readonly planService: PlanService,
	) {}

	@Get('/:currencyRegionCode')
	list(@Param('currencyRegionCode') currencyRegionCode: string): Promise<ListPlansResponseItem[]> {
		return this.planService.listPlans(currencyRegionCode);
	}
}
