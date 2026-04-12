import { Module } from '@nestjs/common';
import { FeatureFlagRepositoryModule } from '../../shared/repositories/feature-flag/FeatureFlagRepositoryModule';
import { FeatureFlagController } from './FeatureFlagController';
import { FeatureFlagSymbols } from './ioc';
import { FeatureFlagServiceImpl } from './service/FeatureFlagServiceImpl';

@Module({
	imports: [FeatureFlagRepositoryModule],
	controllers: [FeatureFlagController],
	providers: [
		{
			provide: FeatureFlagSymbols.FeatureFlagService,
			useClass: FeatureFlagServiceImpl,
		},
	],
})
export class FeatureFlagModule {}
