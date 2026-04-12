import type { FeatureFlagItem } from '../../../shared/repositories/feature-flag/domain/FeatureFlagResponse';

export interface FeatureFlagService {
	listActiveFeatureFlags(): Promise<FeatureFlagItem[]>;
}
