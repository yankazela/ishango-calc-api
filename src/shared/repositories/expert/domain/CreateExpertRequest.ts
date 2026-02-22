export enum ExpertTypes {
	COMPANY = 'COMPANY',
	INDIVIDUAL = 'INDIVIDUAL',
}

export interface CreateExpertRequest {
	name: string;
	email: string;
	phone: string;
	bio: string;
	profilePictureUrl: string;
	role: string;
	rating: number;
	expertType: ExpertTypes;
	calculatorCountryIds: string[];
}
