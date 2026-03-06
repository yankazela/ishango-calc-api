export interface CapitalGainTaxRequest {
	details: {
		capitalGain: number;
		holdingPeriodMonths: number;
		annualIncome?: number;
		isResident?: boolean;
	};
	countryCode: string;
	year: string;
	provinceCode?: string;
}

export interface CapitalGainTaxResult {
	capitalGain: number;
	taxableGain: number;
	taxOnGain: number;
	effectiveRate: number;
}

export interface CapitalGainTaxResponse {
	federalTax: CapitalGainTaxResult;
	provincialTax?: CapitalGainTaxResult;
}

export interface CanadaCapitalGainTaxRules {
	inclusionRate: number;
	taxBrackets: {
		from: number;
		to: number | null;
		rate: number;
	}[];
}

export interface FranceCapitalGainTaxRules {
	flatTaxRate: number;
	socialContributionsRate: number;
	holdingPeriodDiscounts: {
		minMonths: number;
		maxMonths: number | null;
		discountRate: number;
	}[];
}

export interface SouthAfricaCapitalGainTaxRules {
	inclusionRate: number;
	annualExclusion: number;
	taxBrackets: {
		from: number;
		to: number | null;
		rate: number;
	}[];
}

export interface AustraliaCapitalGainTaxRules {
	cgtDiscountRate: number;
	cgtDiscountMinHoldingMonths: number;
	taxBrackets: {
		from: number;
		to: number | null;
		rate: number;
	}[];
}

export interface UKCapitalGainTaxRules {
	annualExemptAmount: number;
	basicRate: number;
	higherRate: number;
	basicRateThreshold: number;
}

export interface USACapitalGainTaxRules {
	shortTermBrackets: {
		from: number;
		to: number | null;
		rate: number;
	}[];
	longTermBrackets: {
		from: number;
		to: number | null;
		rate: number;
	}[];
	longTermThresholdMonths: number;
}

export interface GermanyCapitalGainTaxRules {
	flatTaxRate: number;
	solidaritySurchargeRate: number;
	saverAllowance: number;
}
