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

#### [Pattern] Async initialization pattern: load dynamic data before attaching event listeners (2026-01-22)
- **Problem solved:** Modal component depends on external location data that must be fetched from server
- **Why this works:** Ensures data is available when user clicks, preventing empty/error states in the modal
- **Trade-offs:** Adds small upfront delay to page load, but ensures instant modal response and simpler error handling

### Use composite data attributes (data-type + data-name) instead of unique IDs for modal lookups (2026-01-22)
- **Context:** Locations have natural composite keys (type + name) and don't have unique IDs
- **Why:** Leverages existing data structure, avoids artificial ID generation, more semantic and maintainable
- **Rejected:** Generating unique IDs would require mapping layer and doesn't match the domain model
- **Trade-offs:** Simpler data structure but requires extracting two attributes in click handler instead of one ID
- **Breaking if changed:** If click handler only extracts one attribute, it cannot uniquely identify location data in populateModal

#### [Gotcha] Hardcoded placeholder data in modal templates creates misleading 'works' state during development (2026-01-22)
- **Situation:** Initial implementation showed Med-Tech data for all locations, making the bug hard to spot
- **Root cause:** Developer assumed dynamic data loading was working because the modal displayed content, just the wrong content
- **How to avoid:** Hardcoded content aids visual design but masks data integration bugs

### Replaced linear density slider with discrete dropdown selectors for density preset and stack size (2026-01-22)
- **Context:** Need to control stack size variation and density in visual building generator
- **Why:** Continuous density control has no meaningful analog in stacked building metaphor - discrete presets provide predictable, curated visual outcomes. Users couldn't meaningfully control density gradients via slider.
- **Rejected:** Linear density slider providing fine-grained control over single density parameter
- **Trade-offs:** Lost fine-grained control but gained predictable visual outcomes and simplified user mental model. Reduced implementation complexity significantly.
- **Breaking if changed:** Changing to slider would break preset-specific distribution logic and probability weighting system.

#### [Pattern] Auto-regeneration triggers on all settings changes without explicit save button (2026-01-22)
- **Problem solved:** Users change density preset or stack size via dropdown
- **Why this works:** Settings changes have immediate visual impact. Forcing manual save creates extra friction when users just want to explore options.
- **Trade-offs:** Immediate feedback UX vs potential performance cost. Each dropdown change triggers full building regeneration.

#### [Gotcha] localStorage saves on building regeneration, not on setting change events (2026-01-22)
- **Situation:** User preferences for density preset and stack size need to persist across sessions
- **Root cause:** Prevents saving invalid/intermediate states and ensures only successfully rendered configurations are persisted; also naturally batches writes if user rapidly changes multiple settings
- **How to avoid:** State is always consistent with what's rendered, but user could lose preferences if they crash before regenerating building

#### [Pattern] Three-tier size multiplication: blockSizeFromCombination × userSelectedStackSize × var(--base-block-size) for CSS calc() (2026-01-22)
- **Problem solved:** Need block sizes controlled by density presets, user preferences, and responsive breakpoints simultaneously
- **Why this works:** Each tier serves distinct purpose: preset determines size distribution pattern, user scales overall building height, base-block-size handles viewport responsiveness without changing logic
- **Trade-offs:** Maximum flexibility with clean separation of concerns, but calculation logic must stay synchronized between JS generation and CSS rendering

### Replaced linear density slider with discrete preset dropdown (3 presets: Super Dense, Medium, Mixed) (2026-01-22)
- **Context:** Density controls which block sizes are available and their frequency distribution
- **Why:** Presets create consistent, learnable visual patterns users can recognize and reuse; continuous slider would produce arbitrary combinations that users can't meaningfully select
- **Rejected:** Linear slider with min/max density (rejected because doesn't capture meaningful size distribution patterns - density 2.3 vs 2.7 isn't distinguishable to users)
- **Trade-offs:** UX is simpler and outcomes are predictable, but users lose fine-grained control for edge cases
- **Breaking if changed:** Switching back to slider would require changing DENSITY_PRESETS from object to numeric range and updating generation logic to interpolate distributions