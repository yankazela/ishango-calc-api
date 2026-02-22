import { CreateExpertRequest } from '../domain/CreateExpertRequest';

export interface CreateExpertService {
	createExpert(request: CreateExpertRequest): Promise<void>;
}
