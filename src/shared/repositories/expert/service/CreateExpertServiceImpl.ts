import { randomUUID } from 'crypto';
import { CreateExpertRequest } from '../domain/CreateExpertRequest';
import { Experts, ExpertiseCountries, ExpertStatuses, ExpertTypes } from '../../entities';
import { Repository } from 'typeorm';
import { CreateExpertService } from './CreateExpertService';
import { RepositoriesSymbols } from '../../ioc';
import { Inject, InternalServerErrorException, BadRequestException } from '@nestjs/common';

export class CreateExpertServiceImpl implements CreateExpertService {
	private formatDateTime(date: Date): string {
		const pad = (n: number) => n.toString().padStart(2, '0');
		return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
	}

	constructor(
		@Inject(RepositoriesSymbols.ExpertRepository)
		private expertRepository: Repository<Experts>,
		@Inject(RepositoriesSymbols.ExpertiseCountryRepository)
		private expertiseCountryRepository: Repository<ExpertiseCountries>,
		@Inject(RepositoriesSymbols.ExpertTypeRepository)
		private expertTypeRepository: Repository<ExpertTypes>,
		@Inject(RepositoriesSymbols.ExpertStatusRepository)
		private expertStatusRepository: Repository<ExpertStatuses>,
	) {}

	async createExpert(request: CreateExpertRequest): Promise<void> {
		try {
			const existingExpert = await this.expertRepository.findOneBy({ Email: request.email });
			if (existingExpert) {
				throw new Error(`Expert already exists with email: ${request.email}`);
			}

			// Get expert type by code
			const expertType = await this.expertTypeRepository.findOneBy({ Code: request.expertType });
			if (!expertType) {
				throw new BadRequestException(`Expert type not found for code: ${request.expertType}`);
			}

			// Get expert status with code PENDING
			const expertStatus = await this.expertStatusRepository.findOneBy({ Code: 'PENDING' });
			if (!expertStatus) {
				throw new BadRequestException('Expert status PENDING not found');
			}

			const expert = this.expertRepository.create({
				ID: randomUUID(),
				Name: request.name,
				Email: request.email,
				Phone: request.phone,
				Bio: request.bio,
				ProfilePictureUrl: request.profilePictureUrl,
				Role: request.role,
				Rating: request.rating,
				ExpertTypeID: expertType.ID,
				ExpertStatusID: expertStatus.ID,
				CreatedAt: this.formatDateTime(new Date()),
			});

			await this.expertRepository.save(expert);

			// Create expertise country relationships
			if (request.calculatorCountryIds && request.calculatorCountryIds.length > 0) {
				const expertiseCountries = request.calculatorCountryIds.map((calculatorCountryId) =>
					this.expertiseCountryRepository.create({
						ID: randomUUID(),
						ExpertID: expert.ID,
						CalculatorCountryID: calculatorCountryId,
						CreatedAt: this.formatDateTime(new Date()),
					}),
				);

				await this.expertiseCountryRepository.save(expertiseCountries);
			}
		} catch (error) {
			console.error('Error creating expert:', error);
			throw new InternalServerErrorException();
		}
	}
}
