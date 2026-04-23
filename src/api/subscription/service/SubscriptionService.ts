import { CreateSubscriptionRequest } from '../../../shared/repositories/subscription/domain/CreateSubscriptionRequest';
import { CreateApiKeyRequest } from '../../../shared/repositories/subscription/domain/CreateApiKeyRequest';
import { GetSubscriptionDetailsByEmailRequest } from '../../../shared/repositories/subscription/domain/GetSubscriptionDetailsByEmailRequest';
import { SubscriptionApiKeyItem } from '../../../shared/repositories/subscription/domain/SubscriptionApiKeyItem';
import { SubscriptionDetailsResponse } from '../../../shared/repositories/subscription/domain/SubscriptionDetailsResponse';

export interface SubscriptionService {
	create(request: CreateSubscriptionRequest): Promise<void>;
	createApiKey(subscriptionId: string, request: CreateApiKeyRequest): Promise<SubscriptionApiKeyItem>;
	listApiKeys(subscriptionId: string): Promise<SubscriptionApiKeyItem[]>;
	deactivateApiKey(subscriptionId: string, apiKeyId: string): Promise<void>;
	getSubscriptionDetails(subscriptionId: string): Promise<SubscriptionDetailsResponse>;
	getSubscriptionDetailsByEmail(request: GetSubscriptionDetailsByEmailRequest): Promise<SubscriptionDetailsResponse>;
}
