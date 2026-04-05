import { Module } from '@nestjs/common';

import { ExpertRepositoryModule } from '../../shared/repositories/expert/ExpertRepositoryModule';
import { S3Module } from '../../shared/s3/S3Module';
import { ExpertController } from './ExpertController';
import { ExpertSymbols } from './ioc';
import { ListExpertsServiceImpl } from './service/list/ListExpertsServiceImpl';
import { AddExpertServiceImpl } from './service/add/AddExpertServiceImpl';

@Module({
	imports: [ExpertRepositoryModule, S3Module],
	controllers: [ExpertController],
	providers: [
		{
			provide: ExpertSymbols.ListExpertsService,
			useClass: ListExpertsServiceImpl,
		},
		{
			provide: ExpertSymbols.AddExpertService,
			useClass: AddExpertServiceImpl,
		},
	],
})
export class ExpertModule {}
