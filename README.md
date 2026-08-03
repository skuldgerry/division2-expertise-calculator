# SHD Quartermaster

An interactive resource planner for *Tom Clancy's The Division 2* Expertise system. Build a multi-item upgrade plan for weapons, gear, and skills, then see the complete material manifest update instantly.

## Highlights

- Current Expertise range from level 0 through 30
- Y8S1 upgrade costs, including the reduced weapon/gear costs and the skill-material exception
- Live combined totals for up to 12 plan entries
- Item names, categories, quantities, duplicate/remove controls, and target presets
- Expandable per-resource contribution breakdowns
- Optional inventory mode showing covered materials and shortfalls
- Checkpoint comparisons and advanced-material cost trajectory
- Device-local plan persistence and copyable text summaries
- Responsive, keyboard-accessible interface

## Cost data

The calculator uses the community-maintained [Y8S1 Expertise Upgrade Cost Table, revision 2](https://www.reddit.com/r/thedivision/comments/1sasd3y/expertise_upgrades_table_updated_to_y8s1/), published 3 April 2026. The maximum Expertise level of 30 is documented by Ubisoft in [The Division 2: The Pact](https://www.ubisoft.com/en-au/game/the-division/news-updates/3DFEM2OnnbfRsDrQWXsbbO/the-division-2-the-pact).

Skills intentionally use a separate schedule: post-update in-game testing found that their normal crafting-material costs did not receive the same 20% reduction as weapons and gear. Exotic Component costs were reduced for all categories.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local address shown by the development server.

## Validation

```bash
npm test
npm run lint
```

The test suite builds the Cloudflare Worker-compatible output, verifies the server-rendered interface, and checks known 0→30 totals plus calculation boundaries.

## License

MIT. The Division, Ubisoft, and Massive Entertainment names and imagery belong to their respective owners. This is an unofficial community project.
