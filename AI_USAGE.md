# AI usage notes

## Tools and instructions

- **Assistant:** Codex (OpenAI GPT-6 coding agent) in the Codex desktop workspace.
- **Tools:** shell/terminal commands, workspace file editing, npm, Nest/Next, Jest, Supertest, React Testing Library, Docker Compose configuration, official Resend documentation, `pdfinfo`, and Poppler `pdftoppm` for visual PDF review. No other coding agents were used.
- **Repository instructions:** `AGENTS.md` and `apps/web/AGENTS.md`.
- **Plan/spec:** `PHASE1_PLAN.md`, the user-pasted challenge brief, and the four-page `Code Challenge - AI-Native Engineer.pdf`.

## Prompts and moments that shaped the work

1. The user asked for the pasted Product Catalogue challenge to be explained and built.
2. The user required one Nest module per backend feature and feature-parent/presentational-component separation in the frontend, with Redux Toolkit and no Redux Saga.
3. The user required phase-gated work, then defined a Plan, Review, Build, Verify, Understand, Approve cycle for each phase.
4. The user reported the catalogue fallback and then supplied Nest startup output; this redirected troubleshooting from a generic unavailable API to the adapter resolution failure.
5. The user asked to inspect the challenge PDF, extend `.env.example` for a production path, and integrate Resend as a real email provider.

## Review and corrections

- Earlier in the project, the assistant noted that the referenced PDF was not in the files then available. When the PDF was later added to the workspace, it was rendered and visually reviewed. The plan and docs were corrected to include its constraints: a committed `.env.example`, AWS compatibility if infrastructure is included, no reviewer dependency on paid accounts, and delivery notes for decisions and AI usage.
- When the API error was first discussed, the initial diagnosis was that the API process was unavailable. The user's Nest output showed the deeper cause: Nest could not resolve the HTTP adapter in the npm workspace layout. `main.ts` now imports and passes the declared `ExpressAdapter`, and API startup plus HTTP routes were verified.
- The reserved PostgreSQL and SES API variables are clearly marked as future-only. Resend is implemented as a real selectable email adapter; SMTP/Mailpit remains the local default.
- The Resend SDK integration follows Resend's official Node.js guide and is selectable at API startup. The SDK's `{ data, error }` response is checked explicitly; a provider error becomes a generic controlled delivery failure. SMTP/Mailpit remains the local default.
- The user supplied Resend credentials and sender/recipient configuration. The API key is stored only in the ignored API `.env`; it is not copied into documentation or `.env.example`. `@nestjs/config@4.0.4` was selected because it supports Nest 11 and CommonJS Jest/runtime use, and includes the patched lodash dependency.

## Time spent

The challenge asks for a roughly 2–3 hour time-box and an honest split across planning, building, testing, and review. Actual time was not tracked contemporaneously across the project sessions, so a reliable total and phase split cannot be reported. No retrospective estimate is presented as fact.

## Remaining limitations

The current app has no database or enquiry persistence. SMTP/Mailpit is the local default; Resend API is configured in the ignored API `.env`. A live email was not sent. Docker Compose configuration was checked, but image builds could not run because Docker Engine was unavailable in the verification environment. The repository directory did not contain a `.git` directory before the user's push request.
