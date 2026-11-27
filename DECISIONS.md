# Architecture decisions

## Product data

- The NestJS API owns product business rules and all calls to Fake Store API. The browser does not call the external provider.
- `ProductProvider` is the products module's provider contract; the current adapter uses native `fetch` against Fake Store API and maps provider failures to controlled API errors.
- Featured products are sorted by rating descending and ID ascending, then limited to five. If fewer than five are available, the API returns those available.
- Category results are ordered by rating descending and ID ascending. Search trims the query and matches case-insensitively against title, description, and category.

## Enquiries

- Enquiries are a separate NestJS module. It imports `ProductsModule` and uses its exported service to confirm product existence.
- `EmailProvider` isolates delivery from provider details. SMTP/Mailpit is the default local implementation; `ResendEmailProvider` is selectable with `EMAIL_PROVIDER=resend` for hosted transactional email.
- Resend uses its official Node SDK. The API key is server-only; the sender address and sales recipient are validated at startup when Resend is selected. Provider errors are converted to a generic delivery failure and never returned to the client.
- A successful response follows provider acceptance. Enquiries are not persisted.
- HTTP DTO validation, controlled error mapping, security headers, CORS, and rate limiting are enforced at the API boundary.

## Frontend state and rendering

- Next.js App Router server routes fetch catalogue data through the typed Nest API client. API-backed routes render dynamically so builds do not require a running API.
- Feature parents own data and interaction state; presentational components render passed props and callbacks where practical. `MainWrapper` composes the shared site frame.
- Redux Toolkit is used for global client state (the shared search draft). TanStack Query owns remote server state, as required by the challenge. Server data is not mirrored into Redux; Redux Saga is not used.
- Server requests use `API_INTERNAL_BASE_URL`; browser requests use `NEXT_PUBLIC_API_BASE_URL`. The local server URL and the Compose service URL differ.

## Runtime and tooling

- The repository is an npm workspace monorepo with separate API and web packages and Dockerfiles.
- The API uses global Nest `ConfigModule` for `.env` loading and startup validation; email adapters receive configuration through Nest `ConfigService`.
- `NestFactory` receives an explicit `ExpressAdapter` in `apps/api/src/main.ts`. In the workspace installation, Nest core is hoisted while the adapter can remain under `apps/api/node_modules`; explicitly importing and passing the declared adapter avoids Nest's runtime adapter auto-resolution failing from the core package's location.
- The application has no database. External product API and the selected email provider are runtime dependencies.
- The challenge PDF allows Fake Store API for the proof of concept, but stresses that product data source and email provider are expected to change. Provider contracts preserve those seams.
- The PDF asks for AWS compatibility if infrastructure is included, a committed `.env.example`, and no dependency on paid accounts reviewers must create. Local Compose/Mailpit meets the local review path; no cloud account is needed to run the MVP.

## Future production path

- **Database:** PostgreSQL is the proposed managed relational store for future catalogue overrides, users, or enquiry records. `DATABASE_URL` and `DATABASE_SSL` are reserved examples only; no database package, schema, repository, migrations, or persistence is implemented. Product reads currently come from Fake Store API, and enquiry submissions are not stored.
- **Email:** Resend is now a real selectable provider through the `EmailProvider` contract. It needs a Resend API key and a sender address on a domain verified with Resend. SMTP/Mailpit stays the default so local reviewers need no Resend account. SES remains an alternative future provider; the sample SES API settings are not consumed.
- **Database:** PostgreSQL is still future work. `DATABASE_URL` and `DATABASE_SSL` are reserved examples only; no database package, schema, repository, migrations, or persistence is implemented. Product reads currently come from Fake Store API, and enquiry submissions are not stored.
- **Deployment:** use a supported Node container platform and managed services such as RDS PostgreSQL and SES. Add database migrations, connection pooling, secret management, health/readiness checks, monitoring, and shared rate-limit storage before calling a deployed service production-ready. These are deferred; the current challenge asks for a local, fast PoC that can evolve.
- **Other simplifications:** no user authentication, catalogue administration, pagination, enquiry persistence, or cloud deployment. Category ordering and search behavior follow the assumptions in `PHASE1_PLAN.md`.
- **With another day:** implement and test the PostgreSQL repository and migrations, add durable enquiry records/outbox behavior and shared throttling for multiple API instances, then validate a deployed staging environment with Resend or SES credentials supplied through secret management.

The PDF also asks for a roughly 2-3 hour time-box and an honest actual-time split. Historical time was not recorded contemporaneously across the project sessions, so no total or phase split is reconstructed here.
