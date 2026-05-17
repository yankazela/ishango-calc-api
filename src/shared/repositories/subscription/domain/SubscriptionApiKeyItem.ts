export interface SubscriptionApiKeyItem {
	id: string;
	name: string;
	apiKey: string;
	isActive: boolean;
	createdAt: string;
	disabledAt: string | null;
	usedThisMonth: number | null;
	remainingThisMonth: number | null;
}
