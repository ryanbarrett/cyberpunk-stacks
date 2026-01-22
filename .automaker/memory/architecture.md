---
tags: [architecture]
summary: architecture implementation decisions and patterns
relevantTo: [architecture]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 0
  referenced: 0
  successfulFeatures: 0
---
# architecture

### CSS-first development with comprehensive custom properties before HTML structure exists (2026-01-22)
- **Context:** Created 10,878 byte styles.css and index.html before actual HTML structure was implemented
- **Why:** Allows building complete theming system with CSS variables for easy customization and avoids hardcoded colors throughout implementation
- **Rejected:** CSS development driven by actual HTML structure (traditional approach)
- **Trade-offs:** Faster visual development, but risks CSS being built around wrong HTML structure assumptions; makes CSS maintenance harder if HTML differs
- **Breaking if changed:** If actual HTML structure differs from assumptions (e.g., different nesting, different class names), significant CSS refactoring required

#### [Pattern] Type-specific block styling through CSS classes rather than data attributes or inline styles (2026-01-22)
- **Problem solved:** Implemented separate CSS classes for residence, business, warehouse, clinic, club building types with distinct neon colors
- **Why this works:** Maintains separation of concerns, keeps HTML clean, allows easy theming through CSS custom properties
- **Trade-offs:** Clean separation but requires known set of block types hardcoded in CSS; new block types need CSS updates

### Separate location data into data.json rather than embed in JavaScript (2026-01-22)
- **Context:** 48 unique locations with structured metadata that could change independently
- **Why:** Maintainability - data can be updated without touching logic, scalable to more locations, enables future API migration
- **Rejected:** Hardcoding in JavaScript would mix concerns and make updates error-prone
- **Trade-offs:** Adds network request at startup, but enables better tooling (JSON validation) and separation of concerns
- **Breaking if changed:** If data is moved inline, loses ability to update content without code changes and deployment