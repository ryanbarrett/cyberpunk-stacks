---
tags: [performance]
summary: performance implementation decisions and patterns
relevantTo: [performance]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 0
  referenced: 0
  successfulFeatures: 0
---
# performance

### CSS transitions (250ms) for size changes instead of instant resize (2026-01-22)
- **Context:** Density/stack size changes trigger block size updates
- **Why:** Visual feedback for settings changes. Prevents jarring jumps in UI when blocks resize. Makes system feel more responsive and polished.
- **Rejected:** Instant size change without transitions
- **Trade-offs:** Minor animation cost vs significantly better perceived UX. Can be disabled if performance becomes issue.
- **Breaking if changed:** Removing transitions wouldn't break functionality but would degrade user experience.

#### [Pattern] Auto-regenerate building immediately when density or stack size settings change (2026-01-22)
- **Problem solved:** Users need visual feedback when changing settings to understand their effect
- **Why this works:** Eliminates confusion about whether settings took effect; makes system feel responsive and interactive
- **Trade-offs:** Immediate feedback creates responsive feel, but could be expensive with complex buildings or rapid setting changes