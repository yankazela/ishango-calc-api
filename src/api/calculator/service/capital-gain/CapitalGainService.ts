import { CapitalGainRequest } from '../../domain/CapitalGainTypes';

export interface CapitalGainService {
	processCapitalGain<T>(data: CapitalGainRequest): Promise<T>;
}
