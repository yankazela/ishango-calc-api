import { CreateSubscriptionRequest } from '../domain/CreateSubscriptionRequest';
import { CreateApiKeyRequest } from '../domain/CreateApiKeyRequest';
import { GetSubscriptionDetailsByEmailRequest } from '../domain/GetSubscriptionDetailsByEmailRequest';
import { SubscriptionApiKeyItem } from '../domain/SubscriptionApiKeyItem';
import { SubscriptionDetailsResponse } from '../domain/SubscriptionDetailsResponse';

export interface SubscriptionRepositoryService {
	createSubscription(request: CreateSubscriptionRequest): Promise<void>;
	createApiKey(subscriptionId: string, request: CreateApiKeyRequest): Promise<SubscriptionApiKeyItem>;
	listApiKeys(subscriptionId: string): Promise<SubscriptionApiKeyItem[]>;
	deactivateApiKey(subscriptionId: string, apiKeyId: string): Promise<void>;
	getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetailsResponse>;
	getSubscriptionDetailsByEmail(request: GetSubscriptionDetailsByEmailRequest): Promise<SubscriptionDetailsResponse>;
}
