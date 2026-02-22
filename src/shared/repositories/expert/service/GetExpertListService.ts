import { ExpertListItem, ExpertCountryItem } from '../domain/GetExpertListResponse';

export interface GetExpertListService {
	getList(countryCode: string, calculatorType: string): Promise<ExpertListItem[]>;
	getByCountry(countryCode: string): Promise<ExpertCountryItem[]>;
}
