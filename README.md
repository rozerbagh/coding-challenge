# AI-Native Product Catalogue

A responsive product catalogue built as a TypeScript monorepo. The Next.js web app talks only to the NestJS API. The API adapts Fake Store API for product data and sends enquiries through SMTP; Mailpit captures local email.

## Requirements

- Node.js `>=24.13 <25` and npm
- Docker Engine and the standalone `docker-compose` command for the container setup

## Run with Docker Compose

From the repository root:

```bash
cp .env.example .env
docker-compose up --build
```

Open the catalogue at [http://localhost:3000](http://localhost:3000), the API health endpoint at [http://localhost:3001/api/v1/health](http://localhost:3001/api/v1/health), and the Mailpit inbox at [http://localhost:8025](http://localhost:8025).

Stop the services with `docker-compose down`.

## Run locally without Docker

Install dependencies once from the repository root:

```bash
npm ci
```

Copy `.env.example` to `.env`. Start the API in one terminal and the web app in another:

```bash
npm run dev:api
```

```bash
API_INTERNAL_BASE_URL=http://localhost:3001/api/v1 npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000). The default `EMAIL_PROVIDER=smtp` sends local messages to Mailpit; without an SMTP server, enquiry delivery returns a controlled error. The Fake Store API must be reachable for catalogue data.

## API routes

All routes use `/api/v1`:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `GET` | `/products/featured` | Five highest-rated products when available |
| `GET` | `/products/categories` | Available categories |
| `GET` | `/products/categories/:category` | Category products, rating descending then ID ascending |
| `GET` | `/products?search=keyword` | Search title, description, and category; empty query returns all |
| `GET` | `/products/:id` | Product details |
| `POST` | `/enquiries` | Validate and deliver a product enquiry |

## Architecture

- `apps/api` is a NestJS modular monolith. Product and enquiry features own separate modules. Enquiries use the exported Products service to validate the product and an `EmailProvider` contract to deliver mail.
- Products depend on the `ProductProvider` contract; the Fake Store adapter is replaceable.
- `apps/web` uses App Router server rendering for catalogue routes and calls only the REST API. Interactive feature parents own orchestration; presentational components receive props and callbacks.
- Redux Toolkit owns shared client state. TanStack Query owns remote server state. The same server cache is not copied into Redux.
- There is no database. Product data comes from Fake Store API and enquiries are emailed, not persisted.
- `EmailProvider` supports SMTP/Mailpit locally and Resend for hosted transactional email. Select the provider with `EMAIL_PROVIDER`; SMTP remains the default.

## Checks

```bash
npm run typecheck:api
npm run typecheck:web
npm run test:api
npm run test:e2e:api
npm run test:web
npm run build:api
npm run build:web
```

The API e2e tests bind a local listener. Docker image builds require a running Docker Engine.

## Configuration

See `.env.example`. Keep real credentials in local environment files and out of source control. `API_INTERNAL_BASE_URL` is the URL the Next.js server uses to call the API: use `http://localhost:3001/api/v1` for local development and `http://api:3001/api/v1` inside Compose. `NEXT_PUBLIC_API_BASE_URL` is the browser-facing API URL and defaults to `http://localhost:3001/api/v1`.

To send with Resend, set `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `SALES_EMAIL`. The API loads and validates these values through Nest `ConfigModule`; `ConfigService` supplies them to the selected email adapter. Keep the API key in a secret manager; never expose it to the browser. SMTP remains the default for Mailpit and local review. The supplied `onboarding@resend.dev` sender is suitable for trying Resend's example flow; use a sender on your verified domain for production and follow Resend's current test-mode limits. See the [Resend Node.js guide](https://resend.com/docs/send-with-nodejs) for account and sender setup.

The sample also includes a commented AWS SES SMTP alternative. PostgreSQL settings remain reserved examples only: the app does not currently connect to a database or persist enquiries. Before production, provision a managed database, implement and validate repositories/migrations, and decide whether to use Resend, SES, or another email provider. This MVP is not a production deployment as-is. Supply secrets through the deployment platform's secret manager; do not commit real credentials or AWS access keys.

## Scope notes

The supplied challenge PDF and pasted brief were reviewed. The PDF requires an AWS-compatible path when infrastructure is included, replaceable product data and email providers, and a committed `.env.example`; it does not require a database or a particular paid production service. PostgreSQL remains future work. Resend is now integrated as a selectable email provider; account setup and a verified sender domain are required to send through it. See [PHASE1_PLAN.md](PHASE1_PLAN.md), [DECISIONS.md](DECISIONS.md), and [AI_USAGE.md](AI_USAGE.md) for decisions and implementation notes.
