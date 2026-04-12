import type { FeatureFlagItem } from '../domain/FeatureFlagResponse';

export interface FeatureFlagRepositoryService {
	getActiveFeatureFlags(): Promise<FeatureFlagItem[]>;
}
