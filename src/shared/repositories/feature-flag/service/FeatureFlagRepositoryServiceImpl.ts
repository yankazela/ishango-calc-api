import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FeatureFlags } from '../../entities';
import { RepositoriesSymbols } from '../../ioc';
import type { FeatureFlagItem } from '../domain/FeatureFlagResponse';
import type { FeatureFlagRepositoryService } from './FeatureFlagRepositoryService';

export class FeatureFlagRepositoryServiceImpl implements FeatureFlagRepositoryService {
	constructor(
		@Inject(RepositoriesSymbols.FeatureFlagRepository)
		private readonly featureFlagRepository: Repository<FeatureFlags>,
	) {}

	async getActiveFeatureFlags(): Promise<FeatureFlagItem[]> {
		const flags = await this.featureFlagRepository.find();

		return flags.map((flag) => ({
			id: flag.ID,
			name: flag.Name,
			description: flag.Description,
			isEnabled: flag.IsEnabled,
		}));
	}
}
