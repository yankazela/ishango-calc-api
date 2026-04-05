import {
	Controller,
	Get,
	Post,
	Inject,
	Param,
	Body,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ExpertCountryItem, ExpertListItem } from '../../shared/repositories/expert/domain/GetExpertListResponse';
import type { ListExpertsService } from './service/list/ListExpertsService';
import type { AddExpertService } from './service/add/AddExpertService';
import { ExpertTypes } from '../../shared/repositories/expert/domain/CreateExpertRequest';
import type { S3UploadFile } from '../../shared/s3/service/S3Service';
import { ExpertSymbols } from './ioc';

@Controller('experts')
export class ExpertController {
	constructor(
		@Inject(ExpertSymbols.ListExpertsService)
		private readonly listExpertsService: ListExpertsService,
		@Inject(ExpertSymbols.AddExpertService)
		private readonly addExpertService: AddExpertService,
	) {}

	@Get('/:countryCode/:calculatorType')
	list(
		@Param('countryCode') countryCode: string,
		@Param('calculatorType') calculatorType: string,
	): Promise<ExpertListItem[]> {
		return this.listExpertsService.list(countryCode, calculatorType);
	}

	@Get('/:countryCode')
	listByCountry(@Param('countryCode') countryCode: string): Promise<ExpertCountryItem[]> {
		return this.listExpertsService.listByCountry(countryCode);
	}

	@Post('/')
	@UseInterceptors(FileInterceptor('profilePicture'))
	addExpert(
		@UploadedFile() profilePicture: S3UploadFile | undefined,
		@Body('name') name: string,
		@Body('email') email: string,
		@Body('phone') phone: string,
		@Body('bio') bio: string,
		@Body('role') role: string,
		@Body('rating') rating: string,
		@Body('expertType') expertType: ExpertTypes,
		@Body('calculatorCountryIds') calculatorCountryIds: string,
	): Promise<void> {
		if (!profilePicture) {
			throw new BadRequestException('profilePicture file is required.');
		}

		return this.addExpertService.addExpert({
			name,
			email,
			phone,
			bio,
			profilePicture,
			role,
			rating: Number(rating),
			expertType,
			calculatorCountryIds: Array.isArray(calculatorCountryIds)
				? calculatorCountryIds
				: JSON.parse(calculatorCountryIds),
		});
	}
}
