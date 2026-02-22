import { CreateExpertRequest } from '../../../../shared/repositories/expert/domain/CreateExpertRequest';

export interface AddExpertService {
	addExpert(request: CreateExpertRequest): Promise<void>;
}
