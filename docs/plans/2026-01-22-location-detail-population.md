# Location Detail Data Population Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Populate the detail modal panel with location-specific data from JSON when users click on blocks.

**Architecture:** Create a data.json file containing location definitions with descriptions, security levels, notable items, and active events. Modify the existing JavaScript to fetch and display location-specific data dynamically based on block type and name.

**Tech Stack:** Vanilla JavaScript, JSON, Playwright for testing

---

### Task 1: Create Location Data Structure

**Files:**
- Create: `data.json`

**Step 1: Create data.json with location definitions**

Create a JSON file with location data keyed by location type and name:

```json
{
  "locations": {
    "clinic": {
      "Med-Tech": {
        "description": "A high-end cybernetic enhancement clinic with state-of-the-art surgical equipment and a questionable reputation.",
        "security": {
          "level": "high",
          "guards": 3,
          "cameras": true
        },
        "notableItems": [
          "Military-grade cyberdeck",
          "Prototype neural interface",
          "Stealth augments"
        ],
        "activeEvents": [
          "Corporate raid in progress",
          "Security system offline",
          "Hostage situation"
        ]
      }
    },
    "club": {
      "Neon Nexus": {
        "description": "A pulsing nightclub with holographic dancers and questionable backroom dealings. The bass never stops.",
        "security": {
          "level": "medium",
          "guards": 2,
          "cameras": true
        },
        "notableItems": [
          "Encrypted data chip",
          "Designer drugs",
          "Black market contacts"
        ],
        "activeEvents": [
          "Gang meeting scheduled",
          "VIP section reserved",
          "Underground fight tonight"
        ]
      }
    },
    "business": {
      "Corp Office": {
        "description": "Sterile corporate office with bulletproof windows and aggressive AI security. Everything is monitored.",
        "security": {
          "level": "high",
          "guards": 4,
          "cameras": true
        },
        "notableItems": [
          "Corporate secrets database",
          "Executive access cards",
          "Prototype weapons"
        ],
        "activeEvents": [
          "Board meeting in progress",
          "Security audit ongoing",
          "Insider trading detected"
        ]
      },
      "Shop": {
        "description": "A small street-level shop selling tech parts and information. Cash only.",
        "security": {
          "level": "low",
          "guards": 0,
          "cameras": false
        },
        "notableItems": [
          "Hacking tools",
          "Counterfeit IDs",
          "Street intel"
        ],
        "activeEvents": [
          "New shipment arrived",
          "Police shakedown",
          "Regular customer spotted"
        ]
      },
      "Data Center": {
        "description": "Rows of servers humming in climate-controlled rooms. The digital heart of the district.",
        "security": {
          "level": "high",
          "guards": 5,
          "cameras": true
        },
        "notableItems": [
          "Corporate databases",
          "AI core systems",
          "Quantum processors"
        ],
        "activeEvents": [
          "Data breach detected",
          "System maintenance window",
          "Unauthorized access attempt"
        ]
      }
    },
    "residence": {
      "Apartment": {
        "description": "A cramped apartment with flickering neon lights bleeding through dirty windows. Home to someone.",
        "security": {
          "level": "low",
          "guards": 0,
          "cameras": false
        },
        "notableItems": [
          "Personal terminal",
          "Hidden stash",
          "Family photos"
        ],
        "activeEvents": [
          "Tenant away on business",
          "Rent overdue",
          "Strange noises reported"
        ]
      }
    },
    "warehouse": {
      "Storage": {
        "description": "Dusty warehouse filled with unmarked crates and forgotten cargo. Perfect for hiding things.",
        "security": {
          "level": "medium",
          "guards": 1,
          "cameras": true
        },
        "notableItems": [
          "Stolen goods",
          "Smuggled weapons",
          "Mysterious containers"
        ],
        "activeEvents": [
          "Shipment due tonight",
          "Gang territory dispute",
          "Police surveillance nearby"
        ]
      },
      "Cargo Bay": {
        "description": "Industrial cargo bay with heavy machinery and loading docks. Always busy, day or night.",
        "security": {
          "level": "medium",
          "guards": 2,
          "cameras": true
        },
        "notableItems": [
          "Import manifests",
          "Shipping containers",
          "Forklift access codes"
        ],
        "activeEvents": [
          "Loading in progress",
          "Customs inspection",
          "Worker strike brewing"
        ]
      }
    }
  }
}
```

**Step 2: Commit data structure**

```bash
git add data.json
git commit -m "feat: add location data structure for detail population"
```

---

### Task 2: Update JavaScript to Load Location Data

**Files:**
- Modify: `index.html:123-166`

**Step 1: Add data loading and modal population logic**

Replace the existing script section (lines 123-166) with enhanced version that loads data.json and populates modal:

```javascript
<script>
  let locationData = {};

  // Load location data from JSON
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      locationData = data.locations;
    })
    .catch(error => {
      console.error('Failed to load location data:', error);
    });

  const blocks = document.querySelectorAll('.block');
  const modal = document.getElementById('detailModal');
  const modalClose = document.querySelector('.modal-close');

  // Function to populate modal with location data
  function populateModal(type, name) {
    const location = locationData[type]?.[name];

    if (!location) {
      console.warn(`No data found for ${type} - ${name}`);
      return;
    }

    // Update modal title
    document.querySelector('.modal-title').textContent = name;

    // Update description
    const descSection = document.querySelector('.detail-section:nth-child(1) .detail-section-content');
    descSection.textContent = location.description;

    // Update security level
    const securitySection = document.querySelector('.detail-section:nth-child(2) .detail-section-content');
    const threatLevel = location.security.level;
    const threatClass = `tag--threat-${threatLevel}`;
    securitySection.innerHTML = `
      <span class="tag ${threatClass}">${threatLevel.charAt(0).toUpperCase() + threatLevel.slice(1)}</span>
      <span class="tag">Guards: ${location.security.guards}</span>
      <span class="tag">Cameras: ${location.security.cameras ? 'Yes' : 'No'}</span>
    `;

    // Update notable items
    const itemsSection = document.querySelector('.detail-section:nth-child(3) .detail-section-content');
    itemsSection.textContent = location.notableItems.join(', ');

    // Update active events
    const eventsSection = document.querySelector('.detail-section:nth-child(4) .detail-section-content');
    eventsSection.textContent = location.activeEvents.join(', ');
  }

  blocks.forEach(block => {
    block.addEventListener('click', () => {
      const type = block.dataset.type;
      const name = block.dataset.name;
      populateModal(type, name);
      modal.classList.add('active');
    });

    block.addEventListener('mouseenter', (e) => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip active';
      tooltip.innerHTML = `<strong>${block.dataset.name}</strong><br>Type: ${block.dataset.type}`;
      tooltip.style.left = `${e.pageX + 10}px`;
      tooltip.style.top = `${e.pageY + 10}px`;
      tooltip.id = 'active-tooltip';
      document.body.appendChild(tooltip);
    });

    block.addEventListener('mouseleave', () => {
      const tooltip = document.getElementById('active-tooltip');
      if (tooltip) tooltip.remove();
    });

    block.addEventListener('mousemove', (e) => {
      const tooltip = document.getElementById('active-tooltip');
      if (tooltip) {
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
      }
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
</script>
```

**Step 2: Test manually in browser**

Run a local web server and verify:
```bash
npx http-server -p 8080
```

Expected: Clicking on blocks should open modal with location-specific data

**Step 3: Commit the changes**

```bash
git add index.html
git commit -m "feat: populate detail modal with location-specific data from JSON"
```

---

### Task 3: Create Playwright Verification Test

**Files:**
- Create: `verify-location-detail.spec.ts`

**Step 1: Write Playwright test to verify feature**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Location Detail Population', () => {
  test('should populate modal with clinic data when Med-Tech is clicked', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Wait for data to load
    await page.waitForTimeout(500);

    // Click on Med-Tech clinic block
    await page.click('[data-name="Med-Tech"]');

    // Wait for modal to appear
    await expect(page.locator('#detailModal')).toHaveClass(/active/);

    // Verify modal title
    await expect(page.locator('.modal-title')).toHaveText('Med-Tech');

    // Verify description
    await expect(page.locator('.detail-section:nth-child(1) .detail-section-content'))
      .toContainText('high-end cybernetic enhancement clinic');

    // Verify security level contains "High"
    await expect(page.locator('.detail-section:nth-child(2) .detail-section-content'))
      .toContainText('High');

    // Verify guards count
    await expect(page.locator('.detail-section:nth-child(2) .detail-section-content'))
      .toContainText('Guards: 3');

    // Verify notable items
    await expect(page.locator('.detail-section:nth-child(3) .detail-section-content'))
      .toContainText('Military-grade cyberdeck');

    // Verify active events
    await expect(page.locator('.detail-section:nth-child(4) .detail-section-content'))
      .toContainText('Corporate raid in progress');
  });

  test('should populate modal with different data for Neon Nexus club', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.waitForTimeout(500);

    // Click on Neon Nexus club block
    await page.click('[data-name="Neon Nexus"]');

    await expect(page.locator('#detailModal')).toHaveClass(/active/);

    // Verify different content for club
    await expect(page.locator('.modal-title')).toHaveText('Neon Nexus');
    await expect(page.locator('.detail-section:nth-child(1) .detail-section-content'))
      .toContainText('pulsing nightclub');
    await expect(page.locator('.detail-section:nth-child(2) .detail-section-content'))
      .toContainText('Guards: 2');
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    await page.goto('http://localhost:8080');

    await page.waitForTimeout(500);
    await page.click('[data-name="Med-Tech"]');
    await expect(page.locator('#detailModal')).toHaveClass(/active/);

    // Click close button
    await page.click('.modal-close');

    // Modal should not have active class
    await expect(page.locator('#detailModal')).not.toHaveClass(/active/);
  });
});
```

**Step 2: Run the test**

Start the server in background and run test:
```bash
npx http-server -p 8080 &
npx playwright test verify-location-detail.spec.ts
```

Expected: All tests pass

**Step 3: Stop the server and delete test file**

```bash
pkill -f http-server
rm verify-location-detail.spec.ts
```

**Step 4: Commit final verification**

```bash
git add -A
git commit -m "test: verify location detail population feature works correctly"
```

---

## Implementation Notes

- **Data Structure:** JSON uses nested objects keyed by type and name for quick lookups
- **Error Handling:** Console warnings for missing data, graceful degradation
- **Security Levels:** Support low/medium/high with corresponding CSS classes
- **Data Format:** Arrays for items/events joined with commas for display
- **Testing:** Playwright validates both data population and modal interaction

## Success Criteria

- ✅ Clicking any block opens modal with correct location-specific data
- ✅ Description, security level, items, and events all populate correctly
- ✅ Different locations show different data
- ✅ Modal close functionality still works
- ✅ Playwright tests pass validating the feature
