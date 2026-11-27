# Project Working Agreement

## Scope and workflow

- This repository is an AI-Native Product Catalogue MVP implemented as a TypeScript monorepo.
- Follow the approved phase sequence in `PHASE1_PLAN.md`. Do not begin a later phase until the user approves the preceding phase.
- Keep the initial implementation within the challenge's 2–3 hour time-box. Record actual time honestly; never estimate past work as fact.
- Treat the supplied Code Challenge PDF and pasted challenge brief as the source of requirements. Record unresolved conflicts as explicit decisions; do not invent requirements beyond either source.
- Before making a change, inspect the relevant files and preserve existing user work.

## Architecture boundaries

- `apps/web` is the Next.js App Router frontend. It calls only the NestJS REST API; it must never call Fake Store API directly.
- `apps/api` is the NestJS modular monolith and owns validation, product business rules, external product API integration, and enquiry email delivery.
- Each backend feature/functionality owns a NestJS module. Cross-feature service calls must happen through the target module's public exports and the consumer module's `imports`, not through implementation-file imports or duplicated rules.
- Products business logic depends on the `ProductProvider` contract, not the Fake Store implementation.
- Enquiry business logic depends on the `EmailProvider` contract, not Nodemailer or SMTP details.
- In the frontend, feature state and data orchestration belong to that feature's parent/container. Keep child JSX components presentational and pure where practical, and compose features through a main wrapper component.
- Use Redux Toolkit for global/client state; do not add Redux Saga. Retain TanStack Query for remote server state because it is an explicit challenge requirement; do not mirror the same server cache in Redux.
- Keep modules cohesive. Avoid duplicating business rules in Next.js routes, adding unnecessary abstraction layers, or introducing dependencies without a clear requirement.
- Keep secrets out of source control. Configuration comes from environment variables and is validated at application startup where practical.

## Coding standards

- Use TypeScript with strict checking, clear names, small focused functions, and explicit API types.
- Keep services and business rules inside feature modules; expose only the operations another module needs.
- Validate HTTP input at the API boundary using DTOs, `class-validator`, `class-transformer`, and a global whitelist-enabled validation pipe.
- Return controlled HTTP errors; never expose stack traces or credentials to clients.
- Make product ordering deterministic. Handle empty values, provider failures, and email failures deliberately.
- Use accessible semantic HTML, responsive layouts, and clear loading, error, and empty states in the web app.
- Keep product data sourced through the API. Do not hardcode catalogue items in the UI.

## Testing expectations

- Add tests for business rules and failure paths, with external product and email dependencies mocked.
- Use Jest for unit tests, Supertest for API-level tests, and React Testing Library for frontend behavior.
- Never state that tests pass unless they were run and the result was observed.
- Do not add or run tests outside the approved implementation phase; report the actual commands and outcomes when testing is in scope.

## Agent instructions

- Read `PHASE1_PLAN.md` and relevant package-specific instructions before implementation.
- Work only on the current user-approved phase. Phase approval is a user decision, not something inferred from elapsed time.
- At each phase boundary, report completed work, changed files, decisions, actual verification results, and known issues, then wait for approval.
- Keep documentation aligned with the implemented behavior. Clearly label assumptions and deferred work.
