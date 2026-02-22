export interface SchemaSource {
	name: string;
	url: string;
}

export interface SchemaInput {
	name: string;
	type: string;
	required: boolean;
	label: string;
	unit?: string;
	isCurrency?: boolean;
}

export interface SchemaOutput {
	name: string;
	type: string;
	unit: string;
}
