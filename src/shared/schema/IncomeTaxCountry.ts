import { SchemaInput, SchemaOutput, SchemaSource } from './commons';

export interface IncomeTaxCalculatorSchema {
	meta: SchemaMeta;
	inputs: SchemaInput[];
	outputs: SchemaOutput[];
	rules: SchemaRules;
}

export interface SchemaMeta {
	id: string;
	country: string;
	region: string;
	calculator: string;
	version: string;
	effectiveFrom: string;
	effectiveTo: string | null;
	source: SchemaSource[];
}

export interface SchemaRules {
	taxBrackets: TaxBracket[];
	credits: Record<string, Credit>;
	contributions: Record<string, Contribution>;
}

export interface TaxBracket {
	from: number;
	to: number | null;
	rate: number;
}

export interface Credit {
	amount: number;
	type: string;
	rate: number;
}

export interface Contribution {
	rate: number;
	maxContribution?: number;
	maxInsurableEarnings?: number;
	exemption?: number;
}
