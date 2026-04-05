import type { S3UploadFile } from '../../../s3/service/S3Service';

export enum ExpertTypes {
	COMPANY = 'COMPANY',
	INDIVIDUAL = 'INDIVIDUAL',
}

export interface CreateExpertRequest {
	name: string;
	email: string;
	phone: string;
	bio: string;
	profilePicture: S3UploadFile;
	role: string;
	rating: number;
	expertType: ExpertTypes;
	calculatorCountryIds: string[];
}
