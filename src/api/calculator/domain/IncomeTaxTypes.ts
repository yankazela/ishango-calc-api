import { IncomeTax } from '@novha/calc-engines';
import {
	IsBoolean,
	IsDefined,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';
import { ValidationServiceImpl } from 'src/shared/validations/ValidationServiceImpl';

export interface CanadaIncomeTaxValues {
	federalTax: IncomeTax.CanadaComputedIncomeTaxValues;
	provincialTax: IncomeTax.CanadaComputedIncomeTaxValues | null;
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

export class IncomeTaxRequest extends ValidationServiceImpl{
	@IsDefined()
	@IsNumber()
	public income: number;

	@IsDefined()
	@IsString()
	year: string;

	@IsDefined()
	@IsString()
	countryCode: string;

	@IsOptional()
	@IsString()
	provinceCode?: string;

	@IsOptional()
	@IsNumber()
	familyPart?: number;

	@IsOptional()
	@IsNumber()
	medicalAidMembers?: number;

	@IsOptional()
	@IsNumber()
	age?: number;

	@IsOptional()
	@IsBoolean()
	includeMedicareLevy?: boolean;

	@IsOptional()
	@IsBoolean()
	isResident?: boolean;

	public constructor(props: IncomeTaxRequest) {
		super();
		this.income = props?.income;
		this.year = props?.year;
		this.countryCode = props?.countryCode;
		this.provinceCode = props?.provinceCode;
		this.familyPart = props?.familyPart;
		this.medicalAidMembers = props?.medicalAidMembers;
		this.age = props?.age;
		this.includeMedicareLevy = props?.includeMedicareLevy;
		this.isResident = props?.isResident;
	}
}
