import { CreateSubscriptionRequest } from '../domain/CreateSubscriptionRequest';

export interface SubscriptionRepositoryService {
	createSubscription(request: CreateSubscriptionRequest): Promise<void>;
}
