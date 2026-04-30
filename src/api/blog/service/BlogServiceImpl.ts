import { Inject, NotFoundException } from '@nestjs/common';
import type { S3Service } from '../../../shared/s3/service/S3Service';
import { S3Symbols } from '../../../shared/s3/ioc';
import type { ArticleData, BlogArticle, BlogIndexResponse } from '../domain/BlogTypes';
import type { BlogService } from './BlogService';

export class BlogServiceImpl implements BlogService {
	constructor(
		@Inject(S3Symbols.S3Service)
		private readonly s3Service: S3Service,
	) {}

	async getIndex(language: string): Promise<BlogIndexResponse> {
		const key = `blog/indexes/index_${language}.json`;

		try {
			const file = await this.s3Service.fetchFile(key);
			return JSON.parse(file.body.toString('utf-8')) as BlogIndexResponse;
		} catch(error) {
			console.error(`Error fetching blog index for language ${language}:`, error);
			throw new NotFoundException(`Blog index not found for language: ${language}`);
		}
	}

	async getArticle(slug: string): Promise<ArticleData> {
		const key = `blog/articles/${slug}.mdx`;

		try {
			const file = await this.s3Service.fetchFile(key);
			return this.parseArticle(file.body.toString('utf-8'));
		} catch(error) {
			console.error(`Error fetching article with slug ${slug}:`, error);
			throw new NotFoundException(`Article not found: ${slug}`);
		}
	}

	private parseArticle(raw: string): ArticleData {
		const fmRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
		const match = raw.match(fmRegex);

		if (!match) {
			return {
				frontmatter: this.emptyFrontmatter(),
				content: raw,
			};
		}

		const yamlBlock = match[1];
		const content = raw.slice(match[0].length).trim();
		const frontmatter = this.parseYaml(yamlBlock);

		return { frontmatter: frontmatter as unknown as BlogArticle, content };
	}

	private parseYaml(yaml: string): Record<string, unknown> {
		const result: Record<string, unknown> = {};

		for (const line of yaml.split('\n')) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) continue;

			const colonIdx = trimmed.indexOf(':');
			if (colonIdx === -1) continue;

			const key = trimmed.slice(0, colonIdx).trim();
			let value: string | string[] = trimmed.slice(colonIdx + 1).trim();

			// Remove surrounding quotes
			if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
				value = value.slice(1, -1);
			}

			// Handle arrays like [tag1, tag2]
			if (value.startsWith('[') && value.endsWith(']')) {
				value = value
					.slice(1, -1)
					.split(',')
					.map((v) => v.trim().replace(/^["']|["']$/g, ''));
			}

			result[key] = value;
		}

		return result;
	}

	private emptyFrontmatter(): BlogArticle {
		return {
			title: 'Untitled',
			slug: '',
			description: '',
			country: '',
			countryCode: '',
			calculator: 'income-tax',
			date: new Date().toISOString().slice(0, 10),
			author: 'Ishango Engine Team',
			tags: [],
			locale: 'en',
			readingTime: 0,
		};
	}
}
