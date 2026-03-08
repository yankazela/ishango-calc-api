export interface InheritanceTaxRequest {
	details: {
		estateValue: number;
		adjustedCostBase?: number;
		relationship?: string;
		deductions?: number;
		charitableGivingPercent?: number;
		taxClass?: string;
	};
	countryCode: string;
	year: string;
}
