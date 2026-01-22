# Repository Guidelines

## Project Structure & Module Organization
- `index.html` and `styles.css` hold the UI and styling for the cyberpunk visualization.
- `server.js` is a lightweight Node HTTP server for local preview.
- `data.json` stores location/block data rendered by the UI.
- `verify-location-detail.spec.ts` contains Playwright UI tests.
- `docs/` keeps design notes and plans.
- Generated output lives in `playwright-report/` and `test-results/`.

## Build, Test, and Development Commands
- `npm start` or `npm run dev`: start the local server (set `PORT`/`HOST` as needed).
- `node server.js`: run the server directly when you want to bypass npm.
- `npx playwright test`: run Playwright specs; ensure the app is served or update `playwright.config.ts` as needed.

Example:
```bash
HOST=localhost PORT=3500 npm start
npx playwright test verify-location-detail.spec.ts
```

## Coding Style & Naming Conventions
- Use 2-space indentation in HTML, CSS, and JavaScript to match existing files.
- Prefer descriptive, lowercase, hyphenated CSS class names (e.g., `building-container`).
- Keep data attributes explicit (`data-name`, `data-type`) for UI-driven behavior.
- No formatter/linter is configured; keep changes minimal and consistent.

## Testing Guidelines
- Playwright is the primary test framework (see `verify-location-detail.spec.ts`).
- Name new tests with `.spec.ts` and keep them at the repo root alongside the config.
- If tests require a server, run it on the expected port (the current spec targets `http://localhost:8080`).

## Commit & Pull Request Guidelines
- Use short, imperative commit messages similar to existing history (e.g., "fix location info").
- PRs should include a clear summary, manual test steps, and screenshots/GIFs for UI changes.
- Link relevant issues or design docs in `docs/` when applicable.

## Configuration Tips
- `HOST` and `PORT` control server binding in `server.js`.
- For SSH tunneling, bind `HOST=0.0.0.0` and forward the port locally.
