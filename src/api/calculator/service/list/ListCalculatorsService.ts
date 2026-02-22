import { CalculatorTypeItem } from '../../../../shared/repositories/calculator/domain/CalculatorTypeResponse';

export interface ListCalculatorService {
	list(): Promise<CalculatorTypeItem[]>;
}
