import { Inject } from '@nestjs/common';
import { RepositoriesSymbols } from '../../../shared/repositories/ioc';
import type { PlanRepositoryService } from '../../../shared/repositories/plan/service/PlanRepositoryService';
import { PlanService } from './PlanService';

export class PlanServiceImpl implements PlanService {
	constructor(
		@Inject(RepositoriesSymbols.PlanRepositoryService)
		private planRepositoryService: PlanRepositoryService,
	) {}
	async listPlans(currencyRegionCode: string) {
		return this.planRepositoryService.listPlans(currencyRegionCode);
	}
}
