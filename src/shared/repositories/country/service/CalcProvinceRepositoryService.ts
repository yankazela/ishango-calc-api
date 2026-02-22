import { CalculatorType } from '@novha/calc-engines';
import { CalculatorProvinces } from '../../entities';

export interface CalcProvinceRepositoryService {
	getCalcProvinceById(calculatorTypeId: string): Promise<CalculatorProvinces | null>;
	getProvinceSchema<T>(calculatorProvinceId: string): Promise<T>;
	getSchemaByProvinceAndYear<T>(provinceCode: string, year: string, calculatorType: CalculatorType): Promise<T>;
}
