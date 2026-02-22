import { Inject } from '@nestjs/common';

import { CreateExpertRequest } from '../../../../shared/repositories/expert/domain/CreateExpertRequest';
import type { CreateExpertService } from '../../../../shared/repositories/expert/service/CreateExpertService';
import { RepositoriesSymbols } from '../../../../shared/repositories/ioc';
import { AddExpertService } from './AddExpertService';

export class AddExpertServiceImpl implements AddExpertService {
	constructor(
		@Inject(RepositoriesSymbols.CreateExpertService)
		private readonly createExpertService: CreateExpertService,
	) {}

	async addExpert(request: CreateExpertRequest): Promise<void> {
		return this.createExpertService.createExpert(request);
	}
}
