import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { ApiKeys } from '../repositories/entities';
import { RepositoriesSymbols } from '../repositories/ioc';

/** Maps the second URL segment under /calculators to a CalculatorType enum value. */
const ROUTE_TO_CALCULATOR_TYPE: Record<string, string> = {
	'process-income-tax': 'INCOME_TAX',
	'process-mortgage': 'MORTGAGE',
	'process-corporate-tax': 'CORPORATE_TAX',
	'process-capital-gains-tax': 'CAPITAL_GAINS',
	'process-inheritance-tax': 'INHERITANCE_TAX',
};

const CACHE_TTL_MS = 60 * 60 * 1_000; // 1 hour for valid entries
const NEGATIVE_CACHE_TTL_MS = 30 * 60 * 1_000; // 30 minutes for invalid/not-found entries

interface CacheEntry {
	isValid: boolean;
	selectedCalculators: string[];
	expiresAt: number;
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
	private readonly cache = new Map<string, CacheEntry>();

	constructor(
		@Inject(RepositoriesSymbols.ApiKeyRepository)
		private readonly apiKeyRepository: Repository<ApiKeys>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest<Request>();
		const authHeader = req.headers['authorization'];

		if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException('Missing or invalid Authorization header');
		}

		const apiKey = authHeader.slice(7);
		const entry = await this.getOrFetchEntry(apiKey);

		if (!entry.isValid) {
			throw new UnauthorizedException('Invalid or inactive API key');
		}

		const calculatorType = this.resolveCalculatorType(req.path);
		if (calculatorType && !entry.selectedCalculators.includes(calculatorType)) {
			throw new ForbiddenException(`Access to '${calculatorType}' is not included in your subscription plan`);
		}

		return true;
	}

	private resolveCalculatorType(path: string): string | null {
		// path examples: /calculators/process-income-tax, /calculators/process-income-tax/private
		const segments = path.split('/').filter(Boolean);
		const routeSegment = segments[1]; // second segment, after 'calculators'
		return routeSegment ? (ROUTE_TO_CALCULATOR_TYPE[routeSegment] ?? null) : null;
	}

	private async getOrFetchEntry(apiKey: string): Promise<CacheEntry> {
		const now = Date.now();
		const cached = this.cache.get(apiKey);

		if (cached && cached.expiresAt > now) {
			return cached;
		}

		const keyRecord = await this.apiKeyRepository.findOne({
			where: { ApiKey: apiKey, IsActive: true },
			relations: ['Subscription', 'Subscription.Status'],
		});

		if (!keyRecord?.Subscription) {
			const entry: CacheEntry = { isValid: false, selectedCalculators: [], expiresAt: now + NEGATIVE_CACHE_TTL_MS };
			this.cache.set(apiKey, entry);
			return entry;
		}

		const sub = keyRecord.Subscription;
		const isValid = sub.Status?.Code === 'ACTIVE' && !sub.DisabledAt;

		const entry: CacheEntry = {
			isValid,
			selectedCalculators: this.parseSelectedCalculators(sub.SelectedCalculators),
			expiresAt: now + (isValid ? CACHE_TTL_MS : NEGATIVE_CACHE_TTL_MS),
		};

		this.cache.set(apiKey, entry);
		return entry;
	}

	private parseSelectedCalculators(raw: string): string[] {
		if (!raw?.trim()) return [];
		try {
			const parsed = JSON.parse(raw) as unknown;
			return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
		} catch {
			return [];
		}
	}
}
