import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CalculatorTypeItem } from '../domain/CalculatorTypeResponse';
import { RepositoriesSymbols } from '../../ioc';
import { CalculatorRepositoryService } from './CalculatorRepositoryService';
import { CalculatorTypes } from '../../entities';

export class CalculatorRepositoryServiceImpl implements CalculatorRepositoryService {
	constructor(
		@Inject(RepositoriesSymbols.CalculatorRepository)
		private calculatorTypesRepository: Repository<CalculatorTypes>,
	) {}

	async findAll(): Promise<CalculatorTypeItem[]> {
		const calculatorTypes = await this.calculatorTypesRepository.find();
		return calculatorTypes
			.filter((ct) => !ct.DisabledAt)
			.map((ct) => ({
				id: ct.ID,
				code: ct.Name,
				description: ct.Description,
			}));
	}

	async findById(calculatorTypeId: string): Promise<CalculatorTypeItem | null> {
		const calculatorType = await this.calculatorTypesRepository.findOneBy({ ID: calculatorTypeId });
		if (!calculatorType || calculatorType.DisabledAt) {
			return null;
		}
		return {
			id: calculatorType.ID,
			code: calculatorType.Name,
			description: calculatorType.Description,
		};
	}

	async findByName(calculatorTypeName: string): Promise<CalculatorTypeItem | null> {
		const calculatorType = await this.calculatorTypesRepository.findOneBy({ Name: calculatorTypeName });
		if (!calculatorType || calculatorType.DisabledAt) {
			return null;
		}
		return {
			id: calculatorType.ID,
			code: calculatorType.Name,
			description: calculatorType.Description,
		};
	}
}
