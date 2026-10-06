# Project: blog-template

## Template contract

- On `feature/disco-customization`, `zhujiechong` is the approved public pseudonym. The former visitor-question Agent has been removed; template consumers must replace the pseudonym before treating the repository as their own identity.
- Before personalizing behavior or public content, update `docs/spec.md`, then update the relevant plan/checklist.
- Search the repository for `zhujiechong`, `咕咕嘎嘎`, `【示例】`, and `【待填写】`; do not silently leave demo claims in a derived production site.
- Treat `content/profile/` as public source material. A `private` metadata value is filtering behavior, not a secret vault; never commit sensitive data.
- Treat `content/capabilities/` as public site content. Capability bodies use author-defined Markdown structure with no mandatory headings; never fill blank or unfinished content with invented evidence, limitations, or plans.
- Treat `content/projects/` and every project URL as public. Only add exact HTTPS links approved in `docs/spec.md`; project-link approval does not authorize a profile page, unrelated repository, or private service URL.
- Preserve the author's current project copy. The FPGA car must identify itself as a team project and OctodayMenu as a fork; do not restore attribution or reference-source sentences the author explicitly removed.
- Do not reintroduce visitor question handling, model credentials, conversation persistence, or automatic billing unless the specification changes and the user explicitly approves it.
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
- Never add model API tokens, visitor question handling, conversation persistence, or automatic billing without an approved specification change.
- Do not invent personal facts when public sources are insufficient.

## Verification

- Use test-driven development for behavior changes: failing test, minimal implementation, refactor.
- Run focused tests during a task and the full relevant gates before checking it off.
- Do not mark a task complete until acceptance criteria and the project Definition of Done are satisfied.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
