# Dynamic Building Regeneration Design

**Date:** 2026-01-22
**Feature ID:** dynamic-building-regeneration
**Status:** Design Phase

---

## Overview

Implement dynamic building regeneration that allows users to rebuild the cyberpunk building visualization when settings change. The system must respect a "layout lock" setting that determines whether to preserve or regenerate the building structure.

---

## Core Requirements

1. **Regenerate Building** when user clicks the "Regenerate Building" button
2. **Respect Layout Lock Setting**:
   - When **locked**: Preserve existing building structure, only re-roll events/content
   - When **unlocked**: Fully regenerate building with new floor count, seed, and density
3. **Settings Integration**: Read floor count, RNG seed, and density values from settings panel
4. **Deterministic Generation**: Use Mulberry32 PRNG with seed for reproducible results

---

## Architecture

### 1. Building Generation System

**Components:**
- `generateBuilding(floorCount, seed, density)` - Main generation orchestrator
- `generateFloor(floorNumber, rng, density)` - Single floor generator
- `createBlockElement(blockData)` - DOM element factory
- `renderBuilding(buildingData)` - DOM renderer

**Flow:**
```
User clicks "Regenerate Building"
  ↓
Read settings (floor count, seed, density, layout lock)
  ↓
Check layout lock status
  ↓
├─ Locked: Re-roll events only (preserve structure)
│   ├─ Keep existing floor/block structure
│   ├─ Use seed to regenerate event data
│   └─ Update modal content only
  ↓
└─ Unlocked: Full regeneration
    ├─ Initialize RNG with seed
    ├─ Generate N floors with density parameter
    ├─ Pack blocks using density-based algorithm
    ├─ Render new DOM structure
    └─ Preserve event handlers
```

### 2. RNG System (Mulberry32)

**Implementation:**
```javascript
function mulberry32(seed) {
  let state = 0;
  for (let i = 0; i < seed.length; i++) {
    state = Math.imul(state ^ seed.charCodeAt(i), 0x5bd1e995);
  }
  return function() {
    state = Math.imul(state, 0x6c078965);
    let t = state ^ (state >>> 15);
    t = Math.imul(t, t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Provides deterministic randomness for reproducible building generation.

### 3. Floor Generation Algorithm

**Parameters:**
- `floorNumber`: Position from bottom (1 = ground floor)
- `rng`: Seeded random number generator
- `density`: 1-10 scale affecting block count and variety

**Logic:**
```javascript
function generateFloor(floorNumber, rng, density) {
  const blockTypes = ['residence', 'business', 'warehouse', 'clinic',
                      'temple', 'club', 'restaurant', 'tech-shop'];

  // Density affects block count (2-8 blocks per floor)
  const blockCount = Math.floor(2 + (density / 10) * 6);

  const blocks = [];
  for (let i = 0; i < blockCount; i++) {
    const typeIndex = Math.floor(rng() * blockTypes.length);
    blocks.push({
      type: blockTypes[typeIndex],
      name: generateLocationName(blockTypes[typeIndex], rng),
      threat: generateThreatLevel(rng)
    });
  }

  return {
    floorNumber,
    blocks
  };
}
```

### 4. Layout Lock Behavior

**When Layout Lock is CHECKED:**
- Preserve existing floor structure (count, block types, positions)
- Re-roll events and dynamic content only
- Update threat levels and active events
- Keep building DOM structure intact

**When Layout Lock is UNCHECKED:**
- Clear existing building DOM
- Generate fresh floors based on settings
- Create new block structure
- Apply all settings (floor count, seed, density)

---

## Implementation Strategy

### Phase 1: Core Generation (Minimal)

1. Implement Mulberry32 RNG
2. Create basic floor generation with fixed block types
3. Implement building renderer that clears and rebuilds DOM
4. Wire up "Regenerate Building" button

**Outcome:** Manual regeneration works, creates new building structure

### Phase 2: Layout Lock

1. Detect layout lock checkbox state
2. Implement locked mode: preserve structure, re-roll events
3. Implement unlocked mode: full regeneration

**Outcome:** Layout lock toggle changes regeneration behavior

### Phase 3: Settings Integration

1. Read all settings values on regeneration
2. Apply floor count (1-100 validation)
3. Apply density to block generation
4. Apply seed to RNG initialization

**Outcome:** All settings affect building generation

---

## Data Structures

### Building Data
```javascript
{
  seed: "cyberpunk-2077",
  floorCount: 24,
  density: 7,
  floors: [
    {
      floorNumber: 1,
      blocks: [
        {
          type: "club",
          name: "Neon Nexus",
          threat: "medium",
          events: ["Corpo raid", "Gang meeting"]
        }
      ]
    }
  ]
}
```

### Settings State
```javascript
{
  floorCount: 24,
  seed: "cyberpunk-2077",
  density: 7,
  neonTheme: true,
  layoutLock: false
}
```

---

## Edge Cases

1. **Invalid Floor Count**: Clamp to 1-100 range
2. **Empty Seed**: Default to "cyberpunk-2077"
3. **Density Out of Range**: Clamp to 1-10
4. **Layout Lock with Changed Floor Count**:
   - If locked but floor count differs, unlock automatically and notify user
   - Or disable floor count input when locked
   - **Decision**: Disable floor count/seed/density inputs when locked

---

## User Experience

### Regeneration Flow
1. User adjusts settings (floor count: 50, seed: "neon-city", density: 9)
2. User clicks "Regenerate Building"
3. Brief visual feedback (button state, optional loading indicator)
4. Building DOM updates with new structure
5. Scroll resets to top or maintains position (TBD)

### Layout Lock Flow
1. User generates a building they like
2. User checks "Layout Lock"
3. User clicks "Regenerate Building" or "Next Beat"
4. Events re-roll but structure stays the same

---

## Testing Strategy

### Playwright Verification Tests

1. **Basic Regeneration**:
   - Set floor count to 10
   - Click regenerate
   - Verify 10 floors rendered

2. **Seed Determinism**:
   - Set seed "test-123", regenerate
   - Note building structure
   - Change seed "test-456", regenerate, verify difference
   - Reset seed "test-123", regenerate, verify matches original

3. **Layout Lock**:
   - Generate building with lock unchecked
   - Check layout lock
   - Click regenerate
   - Verify floor count unchanged
   - Verify block structure preserved

4. **Density Effect**:
   - Set density to 1, regenerate
   - Count blocks per floor (should be fewer)
   - Set density to 10, regenerate
   - Count blocks per floor (should be more)

---

## Open Questions

1. **Performance**: Should we limit floor count for performance? (100 floors * 8 blocks = 800 DOM elements)
   - **Decision**: Keep 100 max, optimize if needed

2. **Scroll Behavior**: After regeneration, should we:
   - Reset scroll to top
   - Maintain current scroll position (if possible)
   - Scroll to specific floor (e.g., middle)
   - **Decision**: Reset to top for clarity

3. **Visual Feedback**: Should regeneration show:
   - Instant swap (no animation)
   - Fade out/in transition
   - Loading spinner for large buildings
   - **Decision**: Instant for MVP, enhance later

4. **Next Beat Button**: Should it:
   - Re-roll events for entire building
   - Re-roll events for currently viewed block only
   - **Decision**: Re-roll for entire building (simpler)

---

## Success Criteria

- [ ] Clicking "Regenerate Building" rebuilds the building DOM
- [ ] Floor count setting controls number of floors generated
- [ ] Seed setting produces deterministic, reproducible buildings
- [ ] Density setting affects block count per floor
- [ ] Layout lock preserves building structure when checked
- [ ] Layout lock allows full regeneration when unchecked
- [ ] All Playwright verification tests pass
- [ ] No console errors during regeneration

---

## Future Enhancements (Out of Scope)

- Auto-regenerate on settings change (currently manual only)
- Animated transitions during regeneration
- Export/import building configurations
- Share building seed URLs
- Special floor template integration (slum bazaar, data-center, etc.)
