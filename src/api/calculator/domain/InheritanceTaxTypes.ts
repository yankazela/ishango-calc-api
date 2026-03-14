export interface InheritanceTaxRequest {
	details: {
		estateValue: number;
		adjustedCostBase?: number;
		relationship?: string;
		deductions?: number;
		charitableGivingPercent?: number;
		taxClass?: string;
		numberOfStatutoryHeirs?: number;
	};
	countryCode: string;
	year: string;
}
