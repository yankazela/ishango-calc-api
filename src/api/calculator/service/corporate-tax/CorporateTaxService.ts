import { CorporateTaxRequest } from '../../domain/CorporateTaxTypes';

export interface CorporateTaxService {
	processCorporateTax<T>(data: CorporateTaxRequest): Promise<T>;
}
