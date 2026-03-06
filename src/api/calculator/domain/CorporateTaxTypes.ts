import {
	CanadaCorporateTaxResult,
	FranceCorporateTaxResult,
	SouthAfricaCorporateTaxResult,
	AustraliaCorporateTaxResult,
	UKCorporateTaxResult,
	GermanyCorporateTaxResult,
} from '@novha/calc-engines';

export interface CorporateTaxRequest {
	details: {
		taxableIncome: number;
		isSmallBusiness: boolean;
		annualTurnover?: number;
		grossIncome?: number;
	};
	countryCode: string;
	year: string;
	provinceCode?: string; // Optional for countries that don't have provinces
}

export interface CorporateTaxResponse {
	federalTax:
		| CanadaCorporateTaxResult
		| FranceCorporateTaxResult
		| SouthAfricaCorporateTaxResult
		| AustraliaCorporateTaxResult
		| UKCorporateTaxResult
		| GermanyCorporateTaxResult;
	provincialTax?:
		| CanadaCorporateTaxResult
		| FranceCorporateTaxResult
		| SouthAfricaCorporateTaxResult
		| AustraliaCorporateTaxResult
		| UKCorporateTaxResult
		| GermanyCorporateTaxResult;
}
