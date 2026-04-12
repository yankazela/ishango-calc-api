import { Controller, Get, Inject } from '@nestjs/common';
import type { FeatureFlagItem } from '../../shared/repositories/feature-flag/domain/FeatureFlagResponse';
import { FeatureFlagSymbols } from './ioc';
import type { FeatureFlagService } from './service/FeatureFlagService';

@Controller('feature-flags')
export class FeatureFlagController {
	constructor(
		@Inject(FeatureFlagSymbols.FeatureFlagService)
		private readonly featureFlagService: FeatureFlagService,
	) {}

	@Get('/')
	listActive(): Promise<FeatureFlagItem[]> {
		return this.featureFlagService.listActiveFeatureFlags();
	}
}
