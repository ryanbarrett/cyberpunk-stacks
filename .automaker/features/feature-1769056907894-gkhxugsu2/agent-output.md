I'll continue implementing the fix. Let me update the todo list and add the necessary code to load and display location-specific data.

Now I'll add the data loading and populateModal function. First, let me add the data loading code after the RNG system:

Now I'll add the `populateModal` function after the modal close event listeners:

Now I'll update the click handler to populate the modal with location-specific data:

Now I'll update the initialization section to load the location data:

<summary>
## Summary: Fix Location Detail Display Bug

### Changes Implemented
- Created `data.json` with detailed location definitions for all 8 location types (48 unique locations total)
- Added `loadLocationData()` function to fetch and parse `data.json` from server
- Implemented `populateModal(locationType, locationName)` function to dynamically update modal content based on clicked location
- Updated click handler in `attachBlockEventListeners()` to extract `data-type` and `data-name` attributes and call `populateModal()`
- Modified initialization to load location data asynchronously before attaching event listeners

### Files Modified
- `/home/ansible/automaker-workspace/cyberpunk-stacks/index.html` - Added data loading, populateModal function, and updated click handler
- `/home/ansible/automaker-workspace/cyberpunk-stacks/data.json` - Created new file with comprehensive location data
- `/home/ansible/automaker-workspace/cyberpunk-stacks/verify-location-detail.spec.ts` - Created test file to verify fix

### Notes for Developer
The bug occurred because the previous implementation was incomplete - it showed hardcoded HTML with Med-Tech clinic data for every clicked location. The fix implements the full feature:
1. Data is loaded from JSON at startup
2. When a block is clicked, the handler extracts its type and name
3. `populateModal()` looks up the location data and updates all modal sections dynamically
4. All 3 Playwright tests now pass, confirming different locations show different data
</summary>