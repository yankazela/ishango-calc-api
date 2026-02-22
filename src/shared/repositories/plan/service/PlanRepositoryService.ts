import { ListPlansResponseItem } from '../domain/ListPlansResponse';

export interface PlanRepositoryService {
	listPlans(currencyRegionCode: string): Promise<ListPlansResponseItem[]>;
}
