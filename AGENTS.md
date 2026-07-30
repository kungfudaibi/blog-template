# Project: zhujiechong

## Source of truth

- Product specification: `docs/spec.md`
- Approved implementation plan: `tasks/plan.md`
- Ordered task checklist: `tasks/todo.md`
- Update the specification before changing approved behavior or scope.

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
