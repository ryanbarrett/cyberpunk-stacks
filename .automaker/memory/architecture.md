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

### Two-tier sizing system: responsive base size (viewport-based) multiplied by user-selected stack size (0.5-6) (2026-01-22)
- **Context:** Need sizing that works across devices and allows user customization
- **Why:** Viewport-based sizing ensures readability on small screens (30px mobile vs 45px large). User-selected stack size provides intentional artistic control. Combining them gives responsive baseline with user multiplier.
- **Rejected:** Single sizing system based only on viewport or only on user selection
- **Trade-offs:** More complex sizing calculation but provides both responsiveness AND user control. Maintains consistency across viewports while allowing artistic expression.
- **Breaking if changed:** Removing either tier breaks either responsive design or user customization requirements.

#### [Gotcha] Hard floor space constraint (12 units) forces coupling between density presets, stack sizes, and spacing multipliers (2026-01-22)
- **Situation:** Building floor generation must fit blocks within available horizontal space
- **Root cause:** Fixed floor width is fundamental to visual metaphor. Presets can't just be random distributions - must account for maximum block size + spacing to prevent overflow.
- **How to avoid:** Constrained design space but predictable, contained visual outputs. Requires careful preset design.

#### [Pattern] Floor generation fails gracefully: blocks that don't fit remaining space are silently skipped (2026-01-22)
- **Problem solved:** Variable-sized blocks with spacing may not fit exactly in 12-unit floor
- **Why this works:** Better to have slightly sparse floor than overflow layout that breaks visual metaphor. No good way to force-fit without compromising spacing integrity.
- **Trade-offs:** Accepts occasional uneven distribution vs compromising spacing consistency. Simpler implementation.

#### [Pattern] localStorage auto-save on every regeneration, not just on settings change (2026-01-22)
- **Problem solved:** User preferences should persist across sessions
- **Why this works:** Captures all relevant state (density + stack size). Saves happen during normal user flow (regeneration) without requiring explicit save action.
- **Trade-offs:** More frequent writes but automatic persistence. No user thinking required.

### Implemented backtracking algorithm to generate only valid block combinations that exactly fill 16-unit levels, rather than generating randomly and adjusting post-generation (2026-01-22)
- **Context:** Need to generate floors where blocks must sum to exactly LEVEL_WIDTH (16 units) without gaps or overflow
- **Why:** Pre-generation filtering ensures all combinations are valid from the start, avoiding expensive retry loops or last-block adjustment hacks that could create visually awkward sizes
- **Rejected:** Generate random blocks then adjust final block size to fill gap (rejected because creates inconsistent visual patterns) or generate-then-filter (rejected because valid space is small relative to total search space)
- **Trade-offs:** Generation is deterministic and all outputs valid, but algorithm complexity increases with wider level widths and more size options
- **Breaking if changed:** Removing backtracking would require alternative validation approach; current floor/building generation logic assumes only valid combinations

#### [Gotcha] Validation happens at combination generation time (backtracking) rather than after floor generation (2026-01-22)
- **Situation:** Floors must exactly fill 16 units width with no gaps or overflow
- **Root cause:** Generating only valid combinations upfront is more efficient when valid space is small (exact 16-unit constraint) vs generating many invalid combinations and filtering them out
- **How to avoid:** Efficient generation of valid floors, but requires backtracking algorithm upfront and limits flexibility to add constraints later