import { SchemaInput } from '../../../../shared/schema/commons';

export interface GetCalCountriesResponse {
	id: string;
	countryId: string;
	name: string;
	code: string;
	currency: string;
	currencySymbol: string;
	withProvincial: boolean;
	provinces: CountryProvince[];
	formInputs: SchemaInput[];
	taxBrackets: TaxBracket[] | undefined;
}

export interface CountryWithCalculatorsItem {
	id: string;
	name: string;
	code: string;
	currency: string;
	currencySymbol: string;
	calculators: {
		id: string;
		name: string;
	}[];
}

export interface CountryProvince {
	id: string;
	name: string;
	code: string;
}

export interface TaxBracket {
	from: number;
	to: number | null;
	rate: number;
}
