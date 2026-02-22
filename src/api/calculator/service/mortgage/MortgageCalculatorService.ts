import { MortgageRequest } from '../../domain/MortgageTypes';

export interface MortgageCalculatorService {
	processMortgage<T>(data: MortgageRequest): Promise<T>;
}
