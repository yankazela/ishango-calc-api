import { Module } from '@nestjs/common';

import { ExpertRepositoryModule } from '../../shared/repositories/expert/ExpertRepositoryModule';
import { ExpertController } from './ExpertController';
import { ExpertSymbols } from './ioc';
import { ListExpertsServiceImpl } from './service/list/ListExpertsServiceImpl';
import { AddExpertServiceImpl } from './service/add/AddExpertServiceImpl';

@Module({
	imports: [ExpertRepositoryModule],
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
