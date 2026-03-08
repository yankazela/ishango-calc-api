import { InheritanceTaxRequest } from '../../domain/InheritanceTaxTypes';

export interface InheritanceTaxService {
	processInheritanceTax<T>(data: InheritanceTaxRequest): Promise<T>;
}
