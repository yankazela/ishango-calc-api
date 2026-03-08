import { CorporateTax } from '@novha/calc-engines';

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
		| CorporateTax.CanadaCorporateTaxResult
		| CorporateTax.FranceCorporateTaxResult
		| CorporateTax.SouthAfricaCorporateTaxResult
		| CorporateTax.AustraliaCorporateTaxResult
		| CorporateTax.UKCorporateTaxResult
		| CorporateTax.GermanyCorporateTaxResult;
	provincialTax?:
		| CorporateTax.CanadaCorporateTaxResult
		| CorporateTax.FranceCorporateTaxResult
		| CorporateTax.SouthAfricaCorporateTaxResult
		| CorporateTax.AustraliaCorporateTaxResult
		| CorporateTax.UKCorporateTaxResult
		| CorporateTax.GermanyCorporateTaxResult;
}
