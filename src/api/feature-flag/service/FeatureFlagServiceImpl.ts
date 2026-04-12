import { Inject } from '@nestjs/common';
import type { FeatureFlagItem } from '../../../shared/repositories/feature-flag/domain/FeatureFlagResponse';
import type { FeatureFlagRepositoryService } from '../../../shared/repositories/feature-flag/service/FeatureFlagRepositoryService';
import { RepositoriesSymbols } from '../../../shared/repositories/ioc';
import type { FeatureFlagService } from './FeatureFlagService';

export class FeatureFlagServiceImpl implements FeatureFlagService {
	constructor(
		@Inject(RepositoriesSymbols.FeatureFlagRepositoryService)
		private readonly featureFlagRepositoryService: FeatureFlagRepositoryService,
	) {}

	async listActiveFeatureFlags(): Promise<FeatureFlagItem[]> {
		return this.featureFlagRepositoryService.getActiveFeatureFlags();
	}
}
