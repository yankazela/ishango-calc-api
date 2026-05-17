import { IsDefined, IsString } from 'class-validator';
import { ValidationServiceImpl } from 'src/shared/validations/ValidationServiceImpl';

export class CapitalGainTaxRequest extends ValidationServiceImpl {
	@IsDefined()
	details: {
		capitalGain: number;
		holdingPeriodMonths?: number;
		totalTaxableIncome?: number;
		annualExemption?: number;
	};

	@IsDefined()
	@IsString()
	countryCode: string;

	@IsDefined()
	@IsString()
	year: string;

	public constructor(props: CapitalGainTaxRequest) {
		super();
		this.details = props?.details;
		this.countryCode = props?.countryCode;
		this.year = props?.year;
	}
}

export interface CapitalGainTaxResponse {
	capitalGainsTax: number;
	netInvestmentIncomeTax: number;
	totalTax: number;
	effectiveRate: number;
	breakdowns: Breakdown[];
}

export interface Breakdown {
	from: string;
	to: string;
	rate: number;
	amount: number;
}
