import { Repository } from 'typeorm';
import { PlanPrices, Plans } from '../../entities';
import { PlanRepositoryService } from './PlanRepositoryService';
import { ListPlansResponseItem } from '../domain/ListPlansResponse';
import { RepositoriesSymbols } from '../../ioc';
import { Inject } from '@nestjs/common';

export class PlanRepositoryServiceImpl implements PlanRepositoryService {
	constructor(
		@Inject(RepositoriesSymbols.PlanRepository)
		private planRepository: Repository<Plans>,
		@Inject(RepositoriesSymbols.PlanPriceRepository)
		private planPriceRepository: Repository<PlanPrices>,
	) {}
	async listPlans(currencyRegionCode: string): Promise<ListPlansResponseItem[]> {
		const plans = await this.planRepository.find();

		const planPrices = await this.planPriceRepository
			.createQueryBuilder('pp')
			.leftJoinAndSelect('pp.Region', 'region')
			.where('LOWER(region.Code) = LOWER(:currencyRegionCode)', { currencyRegionCode })
			.getMany();

		const response: ListPlansResponseItem[] = plans.map((plan) => {
			const planPrice = planPrices.find((pp) => pp.PlanID === plan.ID);
			return {
				id: plan.ID,
				code: plan.Code,
				monthlyCost: planPrice ? parseFloat(planPrice.Price.toString()) : null,
				yearlyCost: planPrice ? parseFloat(planPrice.Price.toString()) * 11 : null,
				description: plan.Description,
				maxApiCalculationsPerMonth: plan.MaxApiCalculationsPerMonth,
				maxCountries: plan.MaxCountries,
				apiType: plan.ApiType,
				currencySymbol: planPrice && planPrice.Region ? planPrice.Region.Currency : '$',
				isMostPopular: plan.IsMostPopular,
				isCustomPrice: plan.IsCustomPrice,
				maxCalculators: plan.MaxCalculators,
			};
		});

		response.sort((a, b) => {
			if (a.monthlyCost === null && b.monthlyCost === null) return 0;
			if (a.monthlyCost === null) return 1;
			if (b.monthlyCost === null) return -1;
			return a.monthlyCost - b.monthlyCost;
		});

		return response;
	}
}
