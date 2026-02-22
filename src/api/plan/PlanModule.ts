import { Module } from '@nestjs/common';
import { PlanServiceImpl } from './service/PlanServiceImpl';
import { PlanSymbols } from './ioc';
import { PlanController } from './PlanController';
import { PlanRepositoryModule } from '../../shared/repositories/plan/PlanRepositoryModule';

@Module({
	imports: [PlanRepositoryModule],
	controllers: [PlanController],
	providers: [
		{
			provide: PlanSymbols.PlanService,
			useClass: PlanServiceImpl,
		},
	],
})
export class PlanModule {}
