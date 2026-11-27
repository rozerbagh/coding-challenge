# Phase 1: Architecture and Planning

## Current status

- Phase 1 planning: complete.
- Phase 2 foundation: complete; see the repository root and `apps/` for the scaffold/configuration.
- Phase 3 backend implementation: complete.
- Phase 4 frontend implementation: complete.
- Phase 5 integration and review: Resend integration and configuration complete; user requested publishing to the specified GitHub repository.
- Phase 4 frontend direction: Redux Toolkit owns global/client state; TanStack Query owns server-state caching; feature parents orchestrate state, presentational children remain pure where practical, and a main wrapper composes features.
- The supplied Code Challenge PDF and pasted requirements were both reviewed. The PDF permits Fake Store API for the PoC, expects the product source and email provider to be replaceable, requests AWS-compatible infrastructure if included, and requires `.env.example` without paid services reviewers must create.

## Project in one paragraph

Build a responsive product catalogue where customers can discover products by category or text search, inspect product details, and send a product enquiry. The browser talks to a Next.js frontend, which talks to a NestJS REST API. The API adapts Fake Store API behind a replaceable product-provider contract and sends enquiry mail through a replaceable email-provider contract. Mailpit provides local SMTP capture.

## Source and acceptance criteria

The available sources are the user-pasted **AI-Native Engineer Challenge — Product Catalogue MVP** text and the supplied four-page **Code Challenge: AI-Native Engineer** PDF. Together they require:

- Five featured products on the homepage, chosen by rating descending with product ID as a deterministic tie-breaker.
- Category navigation and category product pages, with top-rated products first and no duplicates.
- Case-insensitive search across title, description, and category; an empty search returns all products.
- Complete product details and a valid enquiry flow with a thank-you confirmation after successful email delivery.
- A NestJS API that owns business logic and all Fake Store API access.
- Product and email provider abstractions wired by dependency injection.
- Validation, controlled errors, Helmet, configurable CORS, and rate limiting for enquiry submission.
- Next.js App Router, React, TypeScript, Tailwind, TanStack Query, React Hook Form, and Zod; NestJS, Nodemailer, Jest, Supertest, React Testing Library, Docker Compose, and Mailpit.
- Documentation, tests, local setup, and an AWS-compatible path for future email-provider replacement.
- A committed `.env.example`; infrastructure must be AWS-compatible if included, and local review must not require paid services or accounts the reviewer has to create.
- Submission documentation covering decisions and assumptions, dropped/simplified requirements, how the design can grow, AI usage, and honest actual time spent.

The separate Code Challenge PDF is now available and was visually reviewed across all four pages. Its additional requirements are reflected here and in the root README: reviewer-friendly local setup, an example environment file, replaceable product and email providers, AWS-compatible infrastructure if included, and submission notes for decisions and AI usage. No database or specific production email vendor is required by the PDF.

## Assumptions and decisions to confirm

1. **Featured selection:** “Exactly five” is satisfied when the upstream catalogue contains at least five products. If it contains fewer, return the available products rather than fabricate catalogue entries; make this behavior explicit in tests and documentation.
2. **Top-rated category products:** Since no count or separate “top-rated” endpoint is specified, show the complete category result sorted by rating descending, then ID ascending. The page can label the first portion “Top rated” and the remainder “More products” without duplicating items. A small fixed top-rated count can be chosen during UI implementation if visual separation requires it.
3. **Product identifier:** Treat Fake Store product IDs as positive integers. Invalid IDs and missing products produce a 404 response.
4. **Search behavior:** Trim the query before matching; matching is substring-based and case-insensitive. No pagination is required for the MVP.
5. **Enquiry fields:** Require productId, name, valid email, phone, and message. Set reasonable length limits in the DTO; exact limits will be documented alongside the form. Return success only after the SMTP transport accepts the message.
6. **API URL:** Browser requests use a configurable public API base URL. Server-side Next.js requests use a separately configurable internal API URL so Docker service discovery can use the API container name.
7. **Local email:** Mailpit captures mail locally. Production email is out of scope; `EmailProvider` remains the seam for a future AWS SES adapter.
8. **Persistence:** The MVP has no database. Products are fetched through the provider; enquiries are delivered as email and are not stored.
9. **Production direction:** Keep provider seams and configuration portable. The MVP has no database; PostgreSQL persistence and a production email provider are deferred, with reserved options documented in `.env.example`.

## Proposed architecture

```text
Browser
  │ pages, forms, client-side server state
  ▼
Next.js App Router (apps/web)
  │ typed HTTP client; public URL in browser, internal URL on server
  ▼
NestJS REST API (apps/api)
  ├── ProductsModule → ProductsService → ProductProvider → FakeStoreProductProvider → Fake Store API
  └── EnquiriesModule → EnquiriesService → EmailProvider → SMTPEmailProvider → Mailpit (local)
```

The API is a modular monolith: modules separate catalogue and enquiry responsibilities while sharing one deployable NestJS process. Controllers handle HTTP mapping, DTO validation handles request boundaries, and services own use cases. Provider tokens bind interfaces to concrete adapters in NestJS dependency injection. The web app does not proxy business logic through Next.js API routes.

### Data and behavior flow

- **Initial page render:** Next.js Server Components fetch categories and featured products from NestJS and render useful HTML without waiting for client hydration.
- **Interactive search and enquiry:** Client Components use a typed API client. TanStack Query owns remote server-state caching; Redux Toolkit owns global/client state. Do not duplicate the same server cache in Redux. A feature parent orchestrates data/state and passes values and callbacks to presentational child components.
- **Enquiry:** React Hook Form + Zod provide immediate form feedback. NestJS independently validates the request, verifies product existence through `ProductsService`, then calls the injected email provider. The UI shows thank-you only for a successful API response.
- **External failures:** Translate upstream/network failures into controlled 502/503-style API errors; translate SMTP failure into a controlled service error. Log diagnostic details server-side without exposing stack traces or secrets.

## API contract proposal

Base path: `/api/v1`. JSON responses; API owns all product data and business rules.

| Method and path | Request | Success response | Failure behavior |
|---|---|---|---|
| `GET /health` | None | `{ "status": "ok" }` | Non-200 if API cannot serve requests |
| `GET /products/featured` | None | `Product[]`, max/exactly five if provider has at least five | Controlled upstream error |
| `GET /products/categories` | None | `string[]` | Controlled upstream error |
| `GET /products/categories/:category` | URL-encoded category | `Product[]`, category-filtered and ordered rating desc, ID asc | `400` for invalid category input if rejected; otherwise empty list for unknown category |
| `GET /products?search=keyword` | Optional search string | `Product[]`; empty/missing search returns all | Controlled upstream error |
| `GET /products/:id` | Positive integer ID | Full `Product` | `400` malformed ID; `404` valid ID not found |
| `POST /enquiries` | `{ productId, name, email, phone, message }` | `201 { "message": "Enquiry sent" }` | `400` validation, `404` product missing, controlled `5xx` delivery/provider error, `429` rate limit |

Product response:

```json
{
  "id": 1,
  "title": "Product title",
  "price": 10.5,
  "description": "Product description",
  "category": "category name",
  "image": "https://example.invalid/product.png",
  "rating": { "rate": 4.2, "count": 120 }
}
```

Implementation notes: preserve the specified product shape; validate and normalize upstream payloads at the adapter boundary. Featured and category sort comparators should include ID as a stable tie-breaker. Search text is trimmed, then matched case-insensitively against title, description, and category.

## Proposed repository structure

```text
AGENTS.md
PHASE1_PLAN.md
apps/
  api/
    src/
      main.ts
      app.module.ts
      config/
      common/             # filters, shared response/error utilities
      modules/
        products/         # controller, service, DTOs/types, module
        enquiries/        # controller, service, DTO, module
      providers/
        product/          # provider token/contract, Fake Store adapter
        email/            # provider token/contract, SMTP adapter, template
    test/
    Dockerfile
  web/
    src/
      app/                # routes/layout/loading/error states
      components/         # header, nav, product card/grid, search
      features/enquiries/ # form and confirmation UI
      hooks/              # focused TanStack Query hooks
      services/           # typed API client and URL configuration
      types/
    Dockerfile
docker-compose.yml
.env.example
README.md
DECISIONS.md
AI_USAGE.md
```

Do not create these application or infrastructure files in Phase 1; this was the target structure, subject to refinement after the PDF review and approval of later phases.

## Implementation plan and phase gates

1. **Phase 1 — Architecture and planning (complete):** inspect repository and supplied brief; document assumptions, architecture, API contracts, structure, and plan; create `AGENTS.md`. No application implementation.
2. **Phase 2 — Project foundation (complete):** initialize workspace and independent Next.js/NestJS applications; configure TypeScript, lint/format, environment variables, Dockerfiles, Docker Compose and Mailpit. Stop for user approval at phase end.
3. **Phase 3 — Backend (complete):** implement each API feature in its own module; expose cross-module operations through module imports/exports; products provider and business rules; enquiry DTO, product check and email provider; global validation, errors, security middleware and rate limit; backend unit/API tests.
4. **Phase 4 — Frontend (complete):** server-rendered, request-time homepage; feature parent/container with presentational components and a main wrapper; category, search, detail and enquiry flows; Redux Toolkit global/client state, TanStack Query server state, no Redux Saga; responsive/accessibility states; frontend tests. Verified: `npm run typecheck:web`, `npm run lint:web`, `npm run test:web` (6 suites, 10 tests), and `npm run build:web` passed. Stop for approval.
5. **Phase 5 — Integration and review (complete; publishing requested):** integrate Resend behind `EmailProvider`, preserve SMTP/Mailpit as local default, validate configuration through global Nest `ConfigModule`, add provider tests, and update setup/architecture documentation. Verified: API unit tests passed (7 suites, 22 tests), API HTTP e2e tests passed (1 suite, 7 tests), API lint/typecheck/build passed, Compose configuration passed, and `npm audit --omit=dev --workspace=api` reported zero vulnerabilities. API startup using the supplied local Resend configuration succeeded on a temporary port and `/api/v1/health` returned 200; no email was sent. Web checks from the previous Phase 5 review remain passing (6 suites, 10 tests; typecheck/lint/build passed). The local API `.env` is ignored and holds the Resend key, sender, and recipient. Full audit reports 19 moderate advisories in development dependencies. Docker image build could not run because the Docker daemon socket was unavailable. The Resend onboarding sender is a test sender; production should use a verified domain.

At each gate, report files changed, decisions, actual commands/results, outstanding issues, and wait for explicit approval before proceeding.

## Risks and open items

- The challenge PDF does not prescribe a production database or production email vendor. Keep any production service choice explicit and avoid requiring reviewer accounts for local verification.
- Fake Store API availability and payload quality are external dependencies; local deterministic provider mocks are needed for tests.
- “Top-rated products” has no specified count. Current proposal uses a sorted full list with a visually separated leading subset.
- Exact rate-limit thresholds, field lengths, and SMTP timeout/retry policy should be set during implementation and documented.
- Docker frontend/API networking needs separate internal and browser-facing API URLs; a browser cannot resolve a Compose-only service hostname.
- The challenge expects provider changes to be possible and AWS compatibility if infrastructure is included. Keep provider seams/config portable; defer database implementation, SES API implementation, and cloud deployment.
