import type { ArticleData, BlogIndexResponse } from '../domain/BlogTypes';

export interface BlogService {
	getIndex(language: string): Promise<BlogIndexResponse>;
	getArticle(slug: string): Promise<ArticleData>;
}
