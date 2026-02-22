import { ListPlansResponseItem } from '../../../shared/repositories/plan/domain/ListPlansResponse';

export interface PlanService {
	listPlans(currencyRegionCode: string): Promise<ListPlansResponseItem[]>;
}
