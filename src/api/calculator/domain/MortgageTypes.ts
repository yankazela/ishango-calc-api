import { IsDefined, IsString } from 'class-validator';
import { ValidationServiceImpl } from 'src/shared/validations/ValidationServiceImpl';

export class MortgageRequest extends ValidationServiceImpl {
	@IsDefined()
	details: {
		propertyPrice: number;
		downPayment: number;
		interestRate: number;
		amortizationYears: number;
		paymentFrequency: 'MONTHLY' | 'BI_WEEKLY' | 'ACCELERATED_BI_WEEKLY' | 'FORTNIGHTLY' | 'WEEKLY';
		grossMonthlyIncome?: number;
		netMonthlyIncome?: number;
		loanDurationYears?: number;
		isPrimaryResidence?: boolean;
		isFirstTimeBuyer?: boolean;
		isNewBuild?: boolean;
	};

	@IsDefined()
	@IsString()
	countryCode: string;

	@IsDefined()
	@IsString()
	year: string;

	public constructor(props: MortgageRequest) {
		super();
		this.details = props?.details;
		this.countryCode = props?.countryCode;
		this.year = props?.year;
	}
}
