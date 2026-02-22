import { CanadaComputedIncomeTaxValues } from '@novha/calc-engines';

export interface IncomeTaxRequest {
	income: number;
	year: string;
	countryCode: string;
	provinceCode?: string;
	familyPart?: number;
	medicalAidMembers?: number;
	age?: number;
}

export interface CanadaIncomeTaxValues {
	federalTax: CanadaComputedIncomeTaxValues;
	provincialTax: CanadaComputedIncomeTaxValues | null;
}

export interface BracketAllocation {
	bracketIndex: number;
	bracketName: string;
	from: number;
	to: number | null;
	rate: number;
	amountInBracket: number;
	taxOnAmount: number;
}

export interface IncomeTaxPrivateResponse {
	grossIncome: number;
	netIncome: number;
	incomeTax: number;
	taxBracketBreakdown: BracketAllocation[];
}
