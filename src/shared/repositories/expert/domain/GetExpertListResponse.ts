export interface ExpertListItem {
	id: string;
	name: string;
	image: string;
	type: string;
	role: string;
	rating: number;
	description: string;
}

export interface ExpertCountryItem {
	id: string;
	name: string;
	image: string;
	type: string;
	role: string;
	rating: number;
	description: string;
	calculators: string[];
}
