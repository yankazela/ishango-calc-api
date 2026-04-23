import { SubscriptionApiKeyItem } from './SubscriptionApiKeyItem';

export interface SubscriptionDetailsResponse {
	client: {
		id: string;
		firstName: string;
		lastName: string;
		email: string;
		phone: string;
		countryDialCode: string;
		company: string;
		companySize: string;
		isSso: boolean;
		createdAt: string;
		disabledAt: string | null;
	};
	subscription: {
		id: string;
		startDate: string;
		currentCost: number;
		currencyRegionCode: string;
		selectedCalculators: string[];
		createdAt: string;
		disabledAt: string | null;
	};
	plan: {
		id: string;
		description: string;
		code: string;
		maxApiCalculationsPerMonth: number | null;
		maxCountries: number | null;
		maxCalculators: number | null;
		apiType: string;
		isMostPopular: boolean;
		isCustomPrice: boolean;
		createdAt: string;
		disabledAt: string | null;
	};
	paymentFrequency: {
		id: string;
		description: string;
		code: string;
	};
	status: {
		id: string;
		description: string;
		code: string;
	};
	apiKeys: SubscriptionApiKeyItem[];
}
