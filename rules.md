# CLAUDE.md

Project-specific guidance for working in this repo. This is a **static, zero-build storefront** — read this before making changes.

## Stack (intentional, not a gap)

- Raw HTML pages (`/pages/*.html`, `index.html`) + Tailwind CSS via CDN + vanilla JS ES modules (`<script type="module">`).
- No npm, no Node frontend runtime, no `package.json`, no bundler, no `node_modules`, no linter, no test runner.
- **Do NOT introduce npm, Vite, React, a bundler, or any build system unless explicitly requested.** This zero-build setup is a deliberate architectural decision, not unfinished tooling — don't "fix" it.

## Architecture

- `components/` — pure render functions (`createX()`), return HTML strings. No event listeners, no state.
- `features/` — DOM behavior: event handling, state, `initX()` functions. Wires up markup produced by `components/`.
- `pages/` (in `src/pages`) — page-level orchestration; composes features/components for one HTML entry point.
- `services/` — API/backend communication.
- `services/apiClient.js` — the **preferred shared API client** (handles JSON headers, bearer token, error unwrapping, and FormData bodies). New backend calls should use it rather than reimplementing fetch/error/token handling.
- `main.js` — page detection (via `document.getElementById(...)` checks) and lazy per-page initialization via dynamic `import()`. This is the app's manual router/code-splitting mechanism.
- `constants/` — static/reference data.

Preserve this separation by default. Do not blur component/feature responsibilities or add new hand-rolled `fetch` calls outside `apiClient.js`.

Architectural changes are allowed when the current pattern prevents a correct, reliable implementation or when the task explicitly requires a redesign. Before making a significant architectural change, inspect affected callers/dependencies and explain the reason and compatibility impact. Do not redesign the application merely for stylistic preference.

### Known boundary exceptions

The following existing files do not fully follow the components/features separation and should **not** be treated as templates for new code:

- `components/navbar/mobileNav.js` contains unused/dead event-listener and state logic that duplicates the live implementation in `features/navbar/mobileDrawer.js`. Do not copy this behavior into new components.
- `components/footer/footerAccordion.js` contains active DOM/event-listener behavior even though it lives under `components/`. This is an existing exception; new DOM behavior should normally live under `features/`.

## API configuration (`src/config.js`)

`src/config.js` intentionally contains **two backend base URLs**: a development DevTunnel URL and a live production URL. The manager currently switches between them by commenting/uncommenting the active value.

- This is an intentional project convention, not misconfiguration.
- **Do NOT replace it with `.env`, Vite env variables, or any other config system unless explicitly requested.**
- Do not silently change which URL is active.
- Treat the currently active URL as an environment/deployment decision controlled by the project workflow.

## Resilience rule: backend-dependent UI must fail gracefully

**Backend availability must never be a prerequisite for rendering static/core UI.**

This applies to **every backend-hydrated section**, including but not limited to:

- Navbar
- Hero
- Category showcases
- Product showcases
- Footer
- Social/Instagram sections
- Announcement/marquee sections
- CMS-managed content
- Contact information
- Policies
- Any other section that retrieves data from the backend

An API failure must remain isolated to the feature/section that depends on that API. One failed request must never prevent unrelated sections or the rest of the page from rendering.

### Required pattern for backend-driven sections

1. Render the static/base structure first.
2. Attempt to hydrate dynamic data from the backend.
3. On success, update only the dynamic portion.
4. On failure, retain or use sensible local fallback content where appropriate.
5. If no valid fallback exists, show an intentional degraded/empty state rather than removing the entire section.
6. Log the failure appropriately without allowing the exception to break unrelated UI.
7. Do not make `createFooter()`, `createNavbar()`, or equivalent base render functions dependent on a successful API request.

**Important:** This is a required resilience behavior, not a statement that every existing section currently complies with it. Existing violations should be fixed when working on the affected section.

Avoid page-level initialization where one API failure can abort the entire page. Prefer independent section initialization and appropriate error isolation (`try/catch`, `Promise.allSettled()`, or equivalent) where multiple independent sections are initialized together.

**Never invent dynamic business data as a fallback.** If real backend data is unavailable and no trustworthy local fallback exists, degrade gracefully instead.

## Known technical debt

These are known issues, **not preferred patterns**. Do not "fix" them opportunistically while working on unrelated tasks.

- `features/productDetails` (and `recentlyViewed`/`relatedProducts`) still resolve products from the static `constants/products.js` array, while the product listing/showcase now link using backend `_id`s. IDs don't match — product-detail navigation from a live product card is currently broken. Do not delete `constants/products.js` until all affected consumers are migrated to the backend.
- `services/customizeService.js` and `services/customizeProductService.js` bypass `apiClient.js` with hand-rolled `fetch` calls, duplicating header/error-handling logic.
- `customizeProductService` re-implements product filtering client-side (fetches the full public product list and filters in JS) instead of using server-side filtering.
- The `localStorage` key `"token"` is duplicated as a string literal across multiple files, including `apiClient.js`, `customizeService.js`, `authState.js`, and `features/auth/validation.js`. Centralize this key before attempting to remove the duplication.
- API response envelope unwrapping is inconsistent across services (each guesses the backend response shape independently).
- Backend-sourced strings are frequently inserted via `innerHTML` template literals without escaping. Do not extend this pattern with untrusted/user-generated content; use appropriate escaping/safe rendering when introducing or modifying such code.

**Not technical debt — do not flag or "fix":**

- The zero-build setup
- Tailwind via CDN
- Native ES modules
- The manager-controlled dev/live URL switch in `src/config.js`

## Rules for changes

- Preserve the existing architecture by default.
- Do not introduce frameworks, build tooling, or dependencies unnecessarily.
- Do not refactor unrelated code while implementing a feature or bug fix.
- Prefer minimal, isolated changes.
- Do not delete existing static data (e.g. `constants/products.js`) until all affected consumers are migrated.
- Do not change API contracts casually. Before changing `apiClient.js`, service method signatures, endpoint shapes, or response contracts, inspect all callers and assess compatibility impact.
- Do not install dependencies unless explicitly requested.
- Do not silently change the active backend environment.
- Do not weaken existing error handling or resilience behavior.
- Do not make one backend-dependent section responsible for rendering unrelated sections.
- Do not expose secrets, credentials, or sensitive backend information in frontend code.

## Verification checklist

Before considering a backend-dependent UI change complete:

- Test the affected page with the backend available.
- Test the affected page with the backend unavailable/erroring.
- Confirm the static/base UI still renders when the API fails.
- Confirm only the dependent section degrades.
- Confirm unrelated sections continue to initialize.
- Check the browser console for unexpected errors.
- Check affected mobile behavior.
- Verify that no new hard-coded backend calls bypass `apiClient.js`.

For changes involving multiple independent sections, verify that failure of one API request does not prevent the others from rendering.

Do not declare a backend-dependent feature complete until its failure state has been tested.
