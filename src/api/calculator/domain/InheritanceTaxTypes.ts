import { IsDefined, IsString } from 'class-validator';
import { ValidationServiceImpl } from 'src/shared/validations/ValidationServiceImpl';

export class InheritanceTaxRequest extends ValidationServiceImpl {
	@IsDefined()
	details: {
		estateValue: number;
		adjustedCostBase?: number;
		relationship?: string;
		deductions?: number;
		charitableGivingPercent?: number;
		taxClass?: string;
		numberOfStatutoryHeirs?: number;
	};

	@IsDefined()
	@IsString()
	countryCode: string;

	@IsDefined()
	@IsString()
	year: string;

	public constructor(props: InheritanceTaxRequest) {
		super();
		this.details = props?.details;
		this.countryCode = props?.countryCode;
		this.year = props?.year;
	}
}
