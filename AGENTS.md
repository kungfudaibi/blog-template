# Project: blog-template

## Template contract

- On `feature/disco-customization`, `zhujiechong` is the approved public pseudonym and `阿竹` is the site Agent name. Template consumers must replace both before treating the repository as their own identity.
- Before personalizing behavior or public content, update `docs/spec.md`, then update the relevant plan/checklist.
- Search the repository for `zhujiechong`, `阿竹`, `【示例】`, and `【待填写】`; do not silently leave demo claims in a derived production site.
- Treat `content/profile/` as public source material. A `private` metadata value is filtering behavior, not a secret vault; never commit sensitive data.
- Treat `content/capabilities/` as public Agent source material. Every record must retain evidence, limitations/failures, and next steps; a plan is not a completed achievement.
- Treat `content/projects/` and every project URL as public. Only add exact HTTPS links approved in `docs/spec.md`; project-link approval does not authorize a profile page, unrelated repository, or private service URL.
- Preserve safe refusal, server-only credentials, no conversation persistence, and no automatic billing unless the specification changes and the user explicitly approves it.
- Repository publication or template use does not authorize preview or production deployment.

## Source of truth

- Product specification: `docs/spec.md`
- Approved implementation plan: `tasks/plan.md`
- Ordered task checklist: `tasks/todo.md`
- Update the specification before changing approved behavior or scope.
- The checked task files describe the shipped demo baseline. Append or revise tasks for new work; do not erase historical verification evidence.

## Tech stack

- Next.js App Router, React, TypeScript strict mode
- Tailwind CSS and MDX content
- Vitest with Testing Library; Playwright for browser flows
- Cloudflare Workers AI through a server-only provider adapter

## Commands

- Install: `npm ci`
- Develop: `npm run dev`
- Type check: `npm run typecheck`
- Lint: `npm run lint`
- Test: `npm run test -- --run`
- E2E: `npx playwright test`
- Build: `npm run build`

## Code conventions

- Prefer named exports for project modules and components.
- Use PascalCase for components and types; use camelCase for functions and variables.
- Keep server-only code out of client components.
- Validate content metadata, environment variables, and API input before use.
- Keep each task scoped to the files and acceptance criteria in `tasks/todo.md`.
- Keep README customization steps accurate whenever a placeholder, path, environment variable, or required command changes.

## Safety boundaries

- Never commit secrets, private profile data, `.env` files, tokens, or model credentials.
- Never expose the model API token in client code or responses.
- Never persist complete visitor questions or answers without a specification change and approval.
- Never enable a paid model plan or automatic billing without explicit approval.
- The Agent must not invent personal facts when authorized sources are insufficient.

## Verification

- Use test-driven development for behavior changes: failing test, minimal implementation, refactor.
- Run focused tests during a task and the full relevant gates before checking it off.
- Do not mark a task complete until acceptance criteria and the project Definition of Done are satisfied.
