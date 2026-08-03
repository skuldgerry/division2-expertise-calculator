"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CATEGORIES,
  COST_DATA_DATE,
  COST_DATA_SOURCE,
  COST_DATA_VERSION,
  EXPERTISE_COSTS,
  MAX_EXPERTISE_LEVEL,
  OFFICIAL_CAP_SOURCE,
  RESOURCES,
  RESOURCE_ORDER,
  calculateUpgradeCost,
  combineCosts,
  formatNumber,
} from "./expertise-data";

type Category = keyof typeof CATEGORIES;
type PlanItem = {
  id: string;
  category: Category;
  name: string;
  start: number;
  target: number;
  quantity: number;
};
type Totals = Record<string, number>;

const STORAGE_KEY = "shd-quartermaster-plan-v2";
const CHECKPOINTS = [10, 15, 20, 25, 30];

const defaultItem: PlanItem = {
  id: "item-1",
  category: "weapon",
  name: "",
  start: 0,
  target: 30,
  quantity: 1,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function itemLabel(item: PlanItem, index: number) {
  return item.name.trim() || `${CATEGORIES[item.category].label} ${index + 1}`;
}

export function ExpertisePlanner() {
  const [items, setItems] = useState<PlanItem[]>([defaultItem]);
  const [filter, setFilter] = useState<"all" | "advanced" | "common">("all");
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [inventoryMode, setInventoryMode] = useState(false);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [copyState, setCopyState] = useState("Copy summary");
  const [hydrated, setHydrated] = useState(false);
  const nextId = useRef(2);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.items) && parsed.items.length) setItems(parsed.items);
          if (parsed.inventory && typeof parsed.inventory === "object") {
            setInventory(parsed.inventory);
          }
          if (typeof parsed.inventoryMode === "boolean") setInventoryMode(parsed.inventoryMode);
        }
      } catch {
        // A private browsing policy can disable storage; the planner still works in memory.
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items, inventory, inventoryMode }),
      );
    } catch {
      // Local persistence is an enhancement, not a requirement.
    }
  }, [hydrated, inventory, inventoryMode, items]);

  const itemCosts = useMemo(
    () =>
      items.map((item) => ({
        item,
        cost: calculateUpgradeCost(item.category, item.start, item.target, item.quantity) as Totals,
      })),
    [items],
  );

  const totals = useMemo<Totals>(
    () => combineCosts(itemCosts.map(({ cost }) => cost)) as Totals,
    [itemCosts],
  );
  const totalLevels = items.reduce(
    (sum, item) => sum + (item.target - item.start) * item.quantity,
    0,
  );
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  const visibleResources = RESOURCE_ORDER.filter((resource) => {
    const meta = RESOURCES[resource as keyof typeof RESOURCES];
    return (totals[resource] || 0) > 0 && (filter === "all" || meta.group === filter);
  });

  const timeline = useMemo(() => {
    const rows = Array.from({ length: MAX_EXPERTISE_LEVEL }, (_, index) => ({
      level: index + 1,
      score: 0,
      exotic: 0,
      shd: 0,
      recon: 0,
      active: false,
    }));

    for (const item of items) {
      for (let level = item.start + 1; level <= item.target; level += 1) {
        const cost = EXPERTISE_COSTS[item.category][level - 1] as Record<string, number>;
        const row = rows[level - 1];
        row.active = true;
        row.exotic += (cost.exotic_components || 0) * item.quantity;
        row.shd += (cost.shd_calibration || 0) * item.quantity;
        row.recon += (cost.field_recon_data || 0) * item.quantity;
        row.score +=
          ((cost.exotic_components || 0) * 4 +
            (cost.shd_calibration || 0) * 1.5 +
            (cost.field_recon_data || 0)) *
          item.quantity;
      }
    }
    return rows;
  }, [items]);

  const maxTimelineScore = Math.max(1, ...timeline.map((row) => row.score));

  const checkpointTotals = useMemo(
    () =>
      CHECKPOINTS.map((checkpoint) => {
        const costs = items.map((item) =>
          calculateUpgradeCost(
            item.category,
            item.start,
            Math.max(item.start, checkpoint),
            item.quantity,
          ),
        );
        return { checkpoint, totals: combineCosts(costs) as Totals };
      }),
    [items],
  );

  function updateItem(id: string, patch: Partial<PlanItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function addItem(source?: PlanItem) {
    setItems((current) => {
      if (current.length >= 12) return current;
      const item: PlanItem = source
        ? { ...source, id: `item-${Date.now()}-${nextId.current++}`, name: `${source.name} copy`.trim() }
        : {
            ...defaultItem,
            id: `item-${Date.now()}-${nextId.current++}`,
            category: current.at(-1)?.category || "weapon",
          };
      return [...current, item];
    });
  }

  function removeItem(id: string) {
    setItems((current) =>
      current.length === 1 ? [defaultItem] : current.filter((item) => item.id !== id),
    );
  }

  function resetPlan() {
    setItems([defaultItem]);
    setInventory({});
    setInventoryMode(false);
    setExpandedResource(null);
  }

  async function copySummary() {
    const lines = [
      "SHD Quartermaster — Expertise calculator",
      ...items.map(
        (item, index) =>
          `${item.quantity}× ${itemLabel(item, index)} · ${item.start} → ${item.target}`,
      ),
      "",
      ...RESOURCE_ORDER.filter((resource) => totals[resource]).map(
        (resource) =>
          `${RESOURCES[resource as keyof typeof RESOURCES].label}: ${formatNumber(totals[resource])}`,
      ),
      "",
      `Costs: ${COST_DATA_VERSION}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopyState("Copied");
    } catch {
      setCopyState("Copy unavailable");
    }
    window.setTimeout(() => setCopyState("Copy summary"), 1800);
  }

  return (
    <div className="app-shell">
      <header className="command-bar">
        <a className="brand" href="#top" aria-label="SHD Quartermaster home">
          <span className="shd-mark" aria-hidden="true"><span /></span>
          <span>
            <strong>SHD Quartermaster</strong>
            <small>Expertise calculator</small>
          </span>
        </a>
        <div className="command-actions">
          <span className="data-status" title="Current Expertise upgrade cost dataset">
            <i aria-hidden="true" /> {COST_DATA_VERSION}
          </span>
          <button className="button button-ghost" type="button" onClick={resetPlan}>
            Reset
          </button>
          <button className="button button-primary" type="button" onClick={copySummary}>
            {copyState}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="page-title">
          <div>
            <p className="eyebrow"><span>ISAC</span> Requisition planning online</p>
            <h1 id="page-title">Expertise<br /><em>Calculator</em></h1>
            <p className="hero-copy">
              Calculate the exact materials needed to upgrade weapons, gear, and skills
              from Expertise 0 to 30.
            </p>
          </div>
          <div className="hero-readout" aria-label="Current plan summary">
            <div><span>Items</span><strong>{totalUnits}</strong></div>
            <div><span>Levels</span><strong>{totalLevels}</strong></div>
            <div><span>Cap</span><strong>30</strong></div>
          </div>
        </section>

        <div className="workspace-grid">
          <section className="planner-panel" aria-labelledby="plan-heading">
            <div className="section-heading">
              <div>
                <p className="section-index">01 / Upgrade plan</p>
                <h2 id="plan-heading">Your loadout</h2>
              </div>
              <span className="section-note">Up to 12 entries</span>
            </div>

            <div className="item-list">
              {items.map((item, index) => {
                const { cost } = itemCosts[index];
                const previewResources = RESOURCE_ORDER.filter((key) => cost[key]).slice(0, 3);
                return (
                  <article className="item-card" key={item.id}>
                    <div className="item-card-topline">
                      <span className="item-number">{String(index + 1).padStart(2, "0")}</span>
                      <div className="category-tabs" role="group" aria-label={`Category for item ${index + 1}`}>
                        {(Object.keys(CATEGORIES) as Category[]).map((category) => (
                          <button
                            type="button"
                            className={item.category === category ? "active" : ""}
                            aria-pressed={item.category === category}
                            onClick={() => updateItem(item.id, { category })}
                            key={category}
                          >
                            <img src={CATEGORIES[category].icon} alt="" width="26" height="26" />
                            {CATEGORIES[category].label}
                          </button>
                        ))}
                      </div>
                      <div className="item-actions">
                        <button type="button" onClick={() => addItem(item)} aria-label={`Duplicate ${itemLabel(item, index)}`} title="Duplicate item">⧉</button>
                        <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${itemLabel(item, index)}`} title="Remove item">×</button>
                      </div>
                    </div>

                    <div className="item-fields">
                      <label className="name-field">
                        <span>Item name <small>optional</small></span>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(event) => updateItem(item.id, { name: event.target.value.slice(0, 60) })}
                          placeholder={item.category === "weapon" ? "e.g. St. Elmo's Engine" : item.category === "gear" ? "e.g. Striker's Kneepads" : "e.g. Assault Turret"}
                        />
                      </label>
                      <label className="quantity-field">
                        <span>Qty</span>
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={item.quantity}
                          onChange={(event) => updateItem(item.id, { quantity: clamp(Number(event.target.value), 1, 12) })}
                        />
                      </label>
                    </div>

                    <div className="level-editor">
                      <div className="level-values">
                        <label>
                          <span>Current</span>
                          <input
                            type="number"
                            min="0"
                            max={item.target}
                            value={item.start}
                            onChange={(event) => updateItem(item.id, { start: clamp(Number(event.target.value), 0, item.target) })}
                          />
                        </label>
                        <span className="level-arrow" aria-hidden="true">→</span>
                        <label>
                          <span>Target</span>
                          <input
                            type="number"
                            min={item.start}
                            max={MAX_EXPERTISE_LEVEL}
                            value={item.target}
                            onChange={(event) => updateItem(item.id, { target: clamp(Number(event.target.value), item.start, MAX_EXPERTISE_LEVEL) })}
                          />
                        </label>
                      </div>
                      <label className="range-label">
                        <span className="sr-only">Target Expertise level for {itemLabel(item, index)}</span>
                        <input
                          type="range"
                          min={item.start}
                          max={MAX_EXPERTISE_LEVEL}
                          value={item.target}
                          style={{ "--range-progress": `${((item.target - item.start) / Math.max(1, MAX_EXPERTISE_LEVEL - item.start)) * 100}%` } as React.CSSProperties}
                          onChange={(event) => updateItem(item.id, { target: Number(event.target.value) })}
                        />
                      </label>
                      <div className="quick-targets" aria-label="Quick target levels">
                        {CHECKPOINTS.map((level) => (
                          <button
                            type="button"
                            key={level}
                            disabled={level < item.start}
                            className={item.target === level ? "active" : ""}
                            onClick={() => updateItem(item.id, { target: level })}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="item-cost-preview">
                      <span>{(item.target - item.start) * item.quantity} levels queued</span>
                      <div>
                        {previewResources.length ? previewResources.map((resource) => (
                          <span key={resource} title={RESOURCES[resource as keyof typeof RESOURCES].label}>
                            <img src={RESOURCES[resource as keyof typeof RESOURCES].icon} alt="" width="22" height="22" />
                            {formatNumber(cost[resource])}
                          </span>
                        )) : <span>No materials required</span>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <button className="add-item" type="button" onClick={() => addItem()} disabled={items.length >= 12}>
              <span aria-hidden="true">＋</span>
              <span><strong>Add another item</strong><small>Weapon, gear, or skill</small></span>
            </button>
          </section>

          <aside className="manifest-panel" aria-labelledby="manifest-heading">
            <div className="manifest-sticky">
              <div className="section-heading manifest-heading">
                <div>
                  <p className="section-index">02 / Resource manifest</p>
                  <h2 id="manifest-heading">Requisition</h2>
                </div>
              </div>

              <button
                type="button"
                className={`inventory-toggle ${inventoryMode ? "active" : ""}`}
                aria-pressed={inventoryMode}
                onClick={() => setInventoryMode((value) => !value)}
              >
                <span aria-hidden="true" />
                <span className="inventory-toggle-copy">
                  <strong>Inventory check</strong>
                  <small>Compare what you own against the plan</small>
                </span>
                <b>{inventoryMode ? "On" : "Off"}</b>
              </button>

              <div className="manifest-summary" aria-live="polite">
                <div><span>Units</span><strong>{totalUnits}</strong></div>
                <div><span>Levels purchased</span><strong>{totalLevels}</strong></div>
                <div><span>Resources</span><strong>{RESOURCE_ORDER.filter((key) => totals[key]).length}</strong></div>
              </div>

              <div className="filter-tabs" role="tablist" aria-label="Resource groups">
                {(["all", "advanced", "common"] as const).map((value) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={filter === value}
                    className={filter === value ? "active" : ""}
                    onClick={() => setFilter(value)}
                    key={value}
                  >
                    {value === "all" ? "All" : value === "advanced" ? "Advanced" : "Common"}
                  </button>
                ))}
              </div>

              <div className="resource-list">
                {visibleResources.map((resource) => {
                  const meta = RESOURCES[resource as keyof typeof RESOURCES];
                  const total = totals[resource] || 0;
                  const owned = inventory[resource] || 0;
                  const remaining = Math.max(0, total - owned);
                  const open = expandedResource === resource;
                  return (
                    <article className={`resource-card ${open ? "expanded" : ""}`} key={resource}>
                      <button
                        className="resource-main"
                        type="button"
                        aria-expanded={open}
                        onClick={() => setExpandedResource(open ? null : resource)}
                      >
                        <span className="resource-icon-wrap" style={{ "--resource-color": meta.color } as React.CSSProperties}>
                          <img src={meta.icon} alt="" width="34" height="34" />
                        </span>
                        <span className="resource-name"><strong>{meta.label}</strong><small>{meta.group === "advanced" ? "Advanced material" : "Crafting material"}</small></span>
                        <span className="resource-total">
                          <strong>{formatNumber(inventoryMode ? remaining : total)}</strong>
                          <small>{inventoryMode ? "remaining" : "required"}</small>
                        </span>
                        <span className="chevron" aria-hidden="true">⌄</span>
                      </button>
                      {inventoryMode && (
                        <label className="inventory-row">
                          <span>In your inventory</span>
                          <input
                            type="number"
                            min="0"
                            value={owned}
                            onClick={(event) => event.stopPropagation()}
                            onChange={(event) => setInventory((current) => ({ ...current, [resource]: Math.max(0, Number(event.target.value) || 0) }))}
                          />
                          <span className={owned >= total ? "covered" : "shortfall"}>
                            {owned >= total ? "Covered" : `${formatNumber(remaining)} short`}
                          </span>
                        </label>
                      )}
                      {open && (
                        <div className="resource-breakdown">
                          {itemCosts.filter(({ cost }) => cost[resource]).map(({ item, cost }) => {
                            const index = items.findIndex((entry) => entry.id === item.id);
                            return (
                              <div key={item.id}>
                                <span>{itemLabel(item, index)}</span>
                                <strong>{formatNumber(cost[resource])}</strong>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>

        <section className="intelligence" aria-labelledby="intelligence-heading">
          <div className="section-heading">
            <div>
              <p className="section-index">03 / Upgrade intelligence</p>
              <h2 id="intelligence-heading">Cost trajectory</h2>
            </div>
            <span className="section-note">Planned levels highlighted</span>
          </div>

          <div className="trajectory-card">
            <div className="trajectory-copy">
              <p>Advanced material pressure</p>
              <span>Field Recon, SHD Calibration, and Exotic Components scale sharply after Expertise 12.</span>
            </div>
            <div className="timeline" role="img" aria-label="Advanced material pressure across Expertise levels 1 through 30">
              {timeline.map((row) => (
                <div className={`timeline-cell ${row.active ? "active" : ""}`} key={row.level} title={`Level ${row.level}: ${row.exotic} Exotic, ${row.shd} SHD, ${row.recon} Recon`}>
                  <span style={{ height: `${Math.max(row.active ? 8 : 3, (row.score / maxTimelineScore) * 100)}%` }} />
                  <small>{row.level % 5 === 0 || row.level === 1 ? row.level : ""}</small>
                </div>
              ))}
            </div>
          </div>

          <div className="checkpoint-grid">
            {checkpointTotals.map(({ checkpoint, totals: checkpointCost }) => (
              <article className={checkpoint === 30 ? "featured" : ""} key={checkpoint}>
                <div><span>Target</span><strong>{checkpoint}</strong></div>
                <dl>
                  <div><dt>Exotics</dt><dd>{formatNumber(checkpointCost.exotic_components)}</dd></div>
                  <div><dt>SHD</dt><dd>{formatNumber(checkpointCost.shd_calibration)}</dd></div>
                  <div><dt>Recon</dt><dd>{formatNumber(checkpointCost.field_recon_data)}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

      </main>

      <footer>
        <div>
          <strong>SHD Quartermaster</strong>
          <span>Unofficial community tool. Not affiliated with Ubisoft or Massive Entertainment.</span>
        </div>
        <div>
          <a href={COST_DATA_SOURCE} target="_blank" rel="noreferrer">Cost table · {COST_DATA_DATE}</a>
          <a href={OFFICIAL_CAP_SOURCE} target="_blank" rel="noreferrer">Official level-cap source</a>
          <a href="https://github.com/skuldgerry/division2-expertise-calculator" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
