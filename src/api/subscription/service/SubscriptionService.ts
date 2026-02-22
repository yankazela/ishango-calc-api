import { CreateSubscriptionRequest } from '../../../shared/repositories/subscription/domain/CreateSubscriptionRequest';

export interface SubscriptionService {
	create(request: CreateSubscriptionRequest): Promise<void>;
}
