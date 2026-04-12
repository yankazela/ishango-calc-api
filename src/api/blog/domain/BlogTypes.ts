export interface BlogArticle {
	title: string;
	slug: string;
	description: string;
	country: string;
	countryCode: string;
	calculator: string;
	date: string;
	author: string;
	tags: string[];
	locale: string;
	readingTime: number;
}

export interface BlogIndexResponse {
	articles: BlogArticle[];
	updatedAt: string;
}

export interface ArticleData {
	frontmatter: BlogArticle;
	content: string; // raw markdown body (frontmatter stripped)
}
