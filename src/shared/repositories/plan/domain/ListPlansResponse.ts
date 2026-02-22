export interface ListPlansResponseItem {
	id: string;
	code: string;
	monthlyCost: number | null;
	yearlyCost: number | null;
	description: string;
	maxApiCalculationsPerMonth: number | null;
	maxCountries: number | null;
	maxCalculators: number | null;
	apiType: string;
	currencySymbol: string;
	isMostPopular?: boolean;
	isCustomPrice?: boolean;
}
