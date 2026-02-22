import { IncomeTaxRequest } from '../../domain/IncomeTaxTypes';

export interface ProcessIncomeTaxInputService {
	processIncomeTax<T>(data: IncomeTaxRequest, isPrivate?: boolean): Promise<T>;
}
