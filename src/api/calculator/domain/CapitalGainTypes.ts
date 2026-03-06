import {
	CanadaComputedIncomeTaxValues,
	FranceComputedIncomeTaxValues,
	SouthAfricaComputedIncomeTaxValues,
	AustraliaComputedIncomeTaxValues,
	UKComputedIncomeTaxValues,
	USAComputedIncomeTaxValues,
	GermanyComputedIncomeTaxValues,
} from '@novha/calc-engines';

export interface CapitalGainRequest {
	details: {
		salePrice: number;
		purchasePrice: number;
	};
	countryCode: string;
	year: string;
	provinceCode?: string;
	familyPart?: number;
	medicalAidMembers?: number;
	age?: number;
	includeMedicareLevy?: boolean;
	isResident?: boolean;
}

export interface CapitalGainResponse {
	capitalGain: number;
	tax:
		| CanadaComputedIncomeTaxValues
		| FranceComputedIncomeTaxValues
		| SouthAfricaComputedIncomeTaxValues
		| AustraliaComputedIncomeTaxValues
		| UKComputedIncomeTaxValues
		| USAComputedIncomeTaxValues
		| GermanyComputedIncomeTaxValues;
	provincialTax?: CanadaComputedIncomeTaxValues | null;
}
