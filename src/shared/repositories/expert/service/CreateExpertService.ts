import { CreateExpertRequest } from '../domain/CreateExpertRequest';

export interface CreateExpertService {
	createExpert(request: CreateExpertRequest, profilePictureUrl: string): Promise<void>;
}
