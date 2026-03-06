import { CapitalGainTaxRequest } from '../../domain/CapitalGainTaxTypes';

export interface CapitalGainTaxService {
	processCapitalGainTax<T>(data: CapitalGainTaxRequest): Promise<T>;
}
