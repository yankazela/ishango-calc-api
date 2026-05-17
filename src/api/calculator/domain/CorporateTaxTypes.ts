import { CorporateTax } from '@novha/calc-engines';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ValidationServiceImpl } from 'src/shared/validations/ValidationServiceImpl';

export class CorporateTaxRequest extends ValidationServiceImpl {
	@IsDefined()
	details: {
		taxableIncome: number;
		isSmallBusiness: boolean;
		annualTurnover?: number;
		grossIncome?: number;
	};

	@IsDefined()
	@IsString()
	countryCode: string;

	@IsDefined()
	@IsString()
	year: string;

	@IsOptional()
	@IsString()
	provinceCode?: string;

	public constructor(props: CorporateTaxRequest) {
		super();
		this.details = props?.details;
		this.countryCode = props?.countryCode;
		this.year = props?.year;
		this.provinceCode = props?.provinceCode;
	}
}

export interface CorporateTaxResponse {
	federalTax:
		| CorporateTax.CanadaCorporateTaxResult
		| CorporateTax.FranceCorporateTaxResult
		| CorporateTax.SouthAfricaCorporateTaxResult
		| CorporateTax.AustraliaCorporateTaxResult
		| CorporateTax.UKCorporateTaxResult
		| CorporateTax.GermanyCorporateTaxResult
		| CorporateTax.BrazilCorporateTaxResult
		| CorporateTax.SpainCorporateTaxResult
		| CorporateTax.IndiaCorporateTaxResult
		| CorporateTax.JapanCorporateTaxResult
		| CorporateTax.IsraelCorporateTaxResult
		| CorporateTax.NetherlandsCorporateTaxResult
		| CorporateTax.SwitzerlandCorporateTaxResult;
	provincialTax?:
		| CorporateTax.CanadaCorporateTaxResult
		| CorporateTax.FranceCorporateTaxResult
		| CorporateTax.SouthAfricaCorporateTaxResult
		| CorporateTax.AustraliaCorporateTaxResult
		| CorporateTax.UKCorporateTaxResult
		| CorporateTax.GermanyCorporateTaxResult
		| CorporateTax.BrazilCorporateTaxResult
		| CorporateTax.SpainCorporateTaxResult
		| CorporateTax.IndiaCorporateTaxResult
		| CorporateTax.JapanCorporateTaxResult
		| CorporateTax.IsraelCorporateTaxResult
		| CorporateTax.NetherlandsCorporateTaxResult
		| CorporateTax.SwitzerlandCorporateTaxResult;
}
