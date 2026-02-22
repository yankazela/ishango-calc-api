export interface MortgageRequest {
	details: {
		propertyPrice: number;
		downPayment: number;
		interestRate: number;
		amortizationYears: number;
		paymentFrequency: 'MONTHLY' | 'BI_WEEKLY' | 'ACCELERATED_BI_WEEKLY';
		grossMonthlyIncome?: number;
		netMonthlyIncome?: number;
		loanDurationYears?: number;
		isPrimaryResidence?: boolean;
		isFirstTimeBuyer?: boolean;
		isNewBuild?: boolean;
	};
	countryCode: string;
	year: string;
}
