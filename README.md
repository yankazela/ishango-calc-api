# Ishango Calc API

REST API backend for the **Ishango** SaaS tax and financial calculator platform. Provides multi-country income tax, mortgage, and corporate tax calculation endpoints, along with subscription management, plan pricing, and an expert marketplace.

## Related Repositories

| Repository | Description |
|---|---|
| [novha-calc-engines](https://github.com/yankazela/novha-calc-engines) | TypeScript calculation engine library (`@novha/calc-engines`) |
| [ishango-web](https://github.com/yankazela/ishango-web) | Next.js web frontend |
| **ishango-calc-api** (this repo) | NestJS REST API backend |

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) 11
- **Language:** TypeScript 5
- **Database:** MySQL via [TypeORM](https://typeorm.io/) 0.3
- **Authentication:** [Clerk](https://clerk.com/)
- **Calculator Engines:** `@novha/calc-engines`

## API Endpoints

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/ping` | Health check |
| `GET` | `/calculators` | List calculator types |
| `POST` | `/calculators/process-income-tax` | Calculate income tax (detailed) |
| `POST` | `/calculators/process-income-tax/private` | Calculate income tax (simplified) |
| `POST` | `/calculators/process-mortgage` | Calculate mortgage |
| `POST` | `/calculators/process-corporate-tax` | Calculate corporate tax |
| `POST` | `/calculators/process-capital-gain` | Calculate capital gain tax |
| `GET` | `/countries/calculators/:name/:year` | List countries for a calculator type & year |
| `GET` | `/countries/calculators` | List all countries with calculators |
| `GET` | `/experts/:countryCode/:calculatorType` | List experts by country & type |
| `GET` | `/experts/:countryCode` | List experts by country |
| `POST` | `/experts` | Add an expert |
| `GET` | `/plans/:currencyRegionCode` | List pricing plans by region |
| `POST` | `/subscriptions` | Create a subscription |

## Supported Countries

Canada, France, South Africa, Australia, the United Kingdom, the United States, and Germany — each supporting income tax, mortgage, corporate tax, and capital gain calculations.

## Project Setup

```bash
npm install
```

## Running the Application

```bash
# development (watch mode)
npm run start:dev

# production
npm run start:prod
```

The API starts on port `3001` by default (or `PORT` environment variable).

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Production Roadmap

See [PRODUCTION_ROADMAP.md](./PRODUCTION_ROADMAP.md) for the full MVP-phased plan to get this project production-ready and earning revenue.
