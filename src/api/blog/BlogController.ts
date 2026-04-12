import { Controller, Get, Inject, Param } from '@nestjs/common';
import type { Response } from 'express';
import type { ArticleData, BlogIndexResponse } from './domain/BlogTypes';
import { BlogSymbols } from './ioc';
import type { BlogService } from './service/BlogService';

@Controller('blog')
export class BlogController {
	constructor(
		@Inject(BlogSymbols.BlogService)
		private readonly blogService: BlogService,
	) {}

	@Get('/index/:language')
	getIndex(@Param('language') language: string): Promise<BlogIndexResponse> {
		return this.blogService.getIndex(language);
	}

	@Get('/article/:slug')
	async getArticle(@Param('slug') slug: string): Promise<ArticleData> {
		return await this.blogService.getArticle(slug);
	}
}
