import { Inject } from '@nestjs/common';
import { ListCalculatorService } from './ListCalculatorsService';
import { RepositoriesSymbols } from '../../../../shared/repositories/ioc';
import { CalculatorTypeItem } from '../../../../shared/repositories/calculator/domain/CalculatorTypeResponse';
import type { CalculatorRepositoryService } from '../../../../shared/repositories/calculator/service/CalculatorRepositoryService';

export class ListCalculatorsServiceImpl implements ListCalculatorService {
	constructor(
		@Inject(RepositoriesSymbols.CalculatorRepositoryService)
		private calculatorRepositoryService: CalculatorRepositoryService,
	) {}

	async list(): Promise<CalculatorTypeItem[]> {
		return this.calculatorRepositoryService.findAll();
	}
}
