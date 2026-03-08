export interface CapitalGainTaxRequest {
	details: {
		capitalGain: number;
		holdingPeriodMonths?: number;
		totalTaxableIncome?: number;
		annualExemption?: number;
	};
	countryCode: string;
	year: string;
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
