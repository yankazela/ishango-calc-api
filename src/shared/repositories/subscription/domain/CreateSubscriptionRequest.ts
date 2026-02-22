export interface Subscription {
	planId: string;
	paymentFrequencyCode: string;
	currencyRegionCode: string;
	currentCost: number;
	selectedCalculators: string;
}

export interface Client {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	countryDialCode: string;
	company: string;
	companySize: string;
	isSso: boolean;
	password?: string;
}

export interface CreateSubscriptionRequest {
	subscription: Subscription;
	client: Client;
}
