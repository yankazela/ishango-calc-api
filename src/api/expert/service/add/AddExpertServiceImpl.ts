import { Inject } from '@nestjs/common';

import { CreateExpertRequest } from '../../../../shared/repositories/expert/domain/CreateExpertRequest';
import type { CreateExpertService } from '../../../../shared/repositories/expert/service/CreateExpertService';
import { RepositoriesSymbols } from '../../../../shared/repositories/ioc';
import type { S3Service } from '../../../../shared/s3/service/S3Service';
import { S3Symbols } from '../../../../shared/s3/ioc';
import { AddExpertService } from './AddExpertService';

export class AddExpertServiceImpl implements AddExpertService {
	constructor(
		@Inject(RepositoriesSymbols.CreateExpertService)
		private readonly createExpertService: CreateExpertService,
		@Inject(S3Symbols.S3Service)
		private readonly s3Service: S3Service,
	) {}

	async addExpert(request: CreateExpertRequest): Promise<void> {
		const uploadResult = await this.s3Service.uploadFile({
			file: request.profilePicture,
			folder: 'experts/profile-pictures',
		});

		return this.createExpertService.createExpert(request, uploadResult.key);
	}
}
