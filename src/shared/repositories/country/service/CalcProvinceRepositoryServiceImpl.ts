import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CalculatorProvinces } from '../../entities';
import { CalcProvinceRepositoryService } from './CalcProvinceRepositoryService';
import { RepositoriesSymbols } from '../../ioc';
import { CalculatorType } from '@novha/calc-engines';

export class CalcProvinceRepositoryServiceImpl implements CalcProvinceRepositoryService {
	constructor(
		@Inject(RepositoriesSymbols.CalculatorProvinceRepository)
		private calculatorProvinceRepository: Repository<CalculatorProvinces>,
	) {}

	async getCalcProvinceById(calculatorTypeId: string): Promise<CalculatorProvinces | null> {
		return this.calculatorProvinceRepository.findOneBy({
			ID: calculatorTypeId,
		});
	}

	async getProvinceSchema<T>(calculatorProvinceId: string): Promise<T> {
		const calculatorType = await this.getCalcProvinceById(calculatorProvinceId);

		if (!calculatorType) {
			throw new Error(`Calculator not found for ID: ${calculatorProvinceId}`);
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const jsonFormSchema = JSON.parse(calculatorType.JsonSchema || '{}');

		return jsonFormSchema as unknown as T;
	}

	async getSchemaByProvinceAndYear<T>(
		provinceCode: string,
		year: string,
		calculatorType: CalculatorType,
	): Promise<T> {
		const calculatorProvince = await this.calculatorProvinceRepository
			.createQueryBuilder('cp')
			.leftJoinAndSelect('cp.Province', 'province')
			.leftJoinAndSelect('cp.CalculatorType', 'calculatorType')
			.where('LOWER(province.Code) = LOWER(:provinceCode)', { provinceCode })
			.andWhere('cp.Year = :year', { year })
			.andWhere('calculatorType.Name = :calculatorType', { calculatorType: calculatorType.toString() })
			.getOne();

		if (!calculatorProvince) {
			throw new Error(`Schema not found for province: ${provinceCode} and year: ${year}`);
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const jsonFormSchema = JSON.parse(calculatorProvince.JsonSchema || '{}');

		return jsonFormSchema as unknown as T;
	}
}
