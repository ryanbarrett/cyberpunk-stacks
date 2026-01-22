---
tags: [ui]
summary: ui implementation decisions and patterns
relevantTo: [ui]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 0
  referenced: 0
  successfulFeatures: 0
---
# ui

### Using position: fixed with clientX/clientY for tooltip positioning instead of position:absolute (2026-01-22)
- **Context:** Tooltips must appear accurately regardless of parent element positioning contexts
- **Why:** position: fixed ensures tooltips are always relative to viewport, not nearest positioned ancestor, preventing incorrect positioning when blocks are inside containers with position:relative/absolute
- **Rejected:** position:absolute would cause tooltips to appear at wrong coordinates when blocks are nested in positioned containers
- **Trade-offs:** Easier reliable positioning across complex layouts but requires explicit viewport boundary detection logic
- **Breaking if changed:** If changed to absolute positioning, tooltips would appear at incorrect screen locations when blocks are inside positioned parent containers

#### [Pattern] Viewport boundary detection to dynamically reposition tooltips near edges (2026-01-22)
- **Problem solved:** Hovering near screen edges causes tooltips to overflow and become partially invisible
- **Why this works:** Detects when tooltip would exceed viewport bounds and adjusts position to keep content fully visible
- **Trade-offs:** More complex positioning logic but ensures tooltips are always readable regardless of hover position

### Semantic data-threat attributes for styling instead of hardcoded CSS classes (2026-01-22)
- **Context:** Threat levels need consistent color coding across blocks and tooltips
- **Why:** Decouples data from presentation - allows CSS to define threat colors once and reuse everywhere without repeating styling rules or modifying HTML structure
- **Rejected:** Inline styles or element-specific classes would require duplicating color values and changing multiple files when updating threat colors
- **Trade-offs:** Cleaner separation of concerns but requires CSS selectors that read data attributes
- **Breaking if changed:** If replaced with classes/colors, updating threat color scheme would require changes in multiple files and could lead to inconsistency

#### [Gotcha] Smooth animations require both opacity AND transform properties (2026-01-22)
- **Situation:** Tooltip fade-in appeared jerky in some browsers with only opacity transition
- **Root cause:** Opacity-only transitions can trigger visual glitches in certain browsers; adding transform (translateY) ensures hardware-accelerated rendering for smoother animation
- **How to avoid:** Slightly more CSS but provides consistent smooth animation across browsers

### Pre-configured deterministic defaults for all settings controls (24 floors, 'cyberpunk-2077' seed, density 7, theme checked, lock unchecked) (2026-01-22)
- **Context:** Settings panel interface requiring multiple configurable parameters
- **Why:** Ensures consistent first-run user experience and predictable visual output, reducing support burden and onboarding confusion
- **Rejected:** Random defaults or blank fields which would create unpredictable initial states
- **Trade-offs:** Reduces user agency on initial load but provides immediate working demo; easier to support, harder to discover full parameter space
- **Breaking if changed:** Changing defaults would alter user's first experience and require updating test assertions, potentially breaking automated verification

#### [Pattern] Cyberpunk aesthetic validated as functional requirement via Playwright tests checking 'cyberpunk styling' on all controls (2026-01-22)
- **Problem solved:** UI feature with explicit visual design requirements
- **Why this works:** Visual styling is part of the product's core value proposition, not just decoration - automated validation prevents style regressions
- **Trade-offs:** More comprehensive test coverage but increases test maintenance when styling evolves; catches regressions earlier but tests can be fragile