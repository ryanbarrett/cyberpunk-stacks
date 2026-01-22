---
tags: [testing]
summary: testing implementation decisions and patterns
relevantTo: [testing]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 0
  referenced: 0
  successfulFeatures: 0
---
# testing

#### [Pattern] Create temporary Playwright test suite for verification, then delete after passing (2026-01-22)
- **Problem solved:** Created 11 Playwright tests, verified all passed, then deleted verify-cyberpunk-css.spec.ts
- **Why this works:** Provides verification during development without adding permanent test maintenance overhead for early-stage code
- **Trade-offs:** Saves test maintenance time but loses regression protection; changes could break CSS without detection

#### [Pattern] Comprehensive Playwright testing covering viewport edge cases (2026-01-22)
- **Problem solved:** Tooltip positioning logic is complex and manual testing can't reliably verify edge behavior
- **Why this works:** Automated tests catch positioning bugs near viewport boundaries that are tedious to test manually and easily regress
- **Trade-offs:** More test code but ensures positioning logic remains correct and catches future bugs

#### [Gotcha] Feature discovery during exploration revealed complete existing implementation before any coding began (2026-01-22)
- **Situation:** Implementing 'new' settings panel interface feature
- **Root cause:** Previous work had already fully implemented the requirement; exploration phase prevented duplicate effort and wasted time
- **How to avoid:** Exploration consumes time upfront but prevents costly rework; reveals existing patterns and conventions