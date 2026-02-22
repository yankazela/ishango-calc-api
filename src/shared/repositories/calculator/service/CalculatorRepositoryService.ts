import { CalculatorTypeItem } from '../domain/CalculatorTypeResponse';

export interface CalculatorRepositoryService {
	findAll(): Promise<CalculatorTypeItem[]>;
	findById(calculatorTypeId: string): Promise<CalculatorTypeItem | null>;
	findByName(calculatorTypeName: string): Promise<CalculatorTypeItem | null>;
}
