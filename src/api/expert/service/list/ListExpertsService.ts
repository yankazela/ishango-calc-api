import { ExpertCountryItem, ExpertListItem } from '../../../../shared/repositories/expert/domain/GetExpertListResponse';

export interface ListExpertsService {
	list(countryCode: string, calculatorType: string): Promise<ExpertListItem[]>;
	listByCountry(countryCode: string): Promise<ExpertCountryItem[]>;
}
