# Changelog

Notable changes to the Expertise Calculator are documented here.

## 2026-08-03 — Modernized calculator

### Added

- Rebuilt the calculator as a responsive loadout planner for weapons, gear, and skills.
- Added named items, quantities, duplicate and remove actions, current and target levels, quick presets, and plans of up to 12 entries.
- Added combined and per-item material views, complete material previews, contribution breakdowns, and level 10, 15, 20, 25, and 30 checkpoints.
- Added inventory checking with owned amounts, covered or shortfall status, and device-local persistence.
- Added an advanced-material cost visualization, copyable summaries, and System, Light, and Dark themes.

### Changed

- Updated every upgrade schedule to the Y8S1 revision 2 costs, including the reduced weapon and gear costs and separate skill schedule.
- Increased the supported maximum Expertise level to 30.
- Modernized the interface with responsive panels, clearer totals, original game material artwork, and improved mobile layouts.

### Fixed

- Restored reliable delivery of category, material, favicon, and social-preview assets.
- Item previews now show every required material instead of only the first three.
- Enforced valid level, quantity, inventory, and calculation boundaries.

### Accessibility

- Added labelled increment and decrement controls for quantities, levels, and inventory values, including disabled boundary states.
- Added keyboard-friendly controls, visible focus treatment, semantic pressed, switch, and expanded states, descriptive labels, and reduced-motion support.
- Added system color-scheme support with a persistent explicit theme override.
