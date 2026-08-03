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
type Theme = "system" | "light" | "dark";
type PlanItem = {
  id: string;
  category: Category;
  name: string;
  start: number;
  target: number;
  quantity: number;
};
type Totals = Record<string, number>;

const STORAGE_KEY = "expertise-calculator-plan-v3";
const THEME_KEY = "expertise-calculator-theme";
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

type NumberStepperProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function NumberStepper({ label, value, min, max, onChange }: NumberStepperProps) {
  const setValue = (nextValue: number) => onChange(clamp(nextValue, min, max));

  return (
    <div className="number-stepper" role="group" aria-label={`${label} controls`}>
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        disabled={value <= min}
        onClick={() => setValue(value - 1)}
      >
        <span aria-hidden="true">−</span>
      </button>
      <input
        type="number"
        inputMode="numeric"
        step="1"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(event) => setValue(Number(event.target.value))}
      />
      <button
        type="button"
        aria-label={`Increase ${label}`}
        disabled={value >= max}
        onClick={() => setValue(value + 1)}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}

export function ExpertisePlanner() {
  const [items, setItems] = useState<PlanItem[]>([defaultItem]);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);
  const [inventoryMode, setInventoryMode] = useState(false);
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [copyState, setCopyState] = useState("Copy summary");
  const [theme, setTheme] = useState<Theme>("system");
  const [plannerCollapsed, setPlannerCollapsed] = useState(false);
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

        const savedTheme = window.localStorage.getItem(THEME_KEY);
        if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
      } catch {
        // Storage can be unavailable in private browsing; the calculator still works in memory.
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
      // Local persistence is optional.
    }
  }, [hydrated, inventory, inventoryMode, items]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === "system") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", theme);
  }, [hydrated, theme]);

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
  const targetLevel = Math.max(...items.map((item) => item.target));
  const visibleResources = RESOURCE_ORDER.filter((resource) => (totals[resource] || 0) > 0);

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
    setPlannerCollapsed(false);
    setItems((current) => {
      if (current.length >= 12) return current;
      const item: PlanItem = source
        ? {
            ...source,
            id: `item-${Date.now()}-${nextId.current++}`,
            name: source.name ? `${source.name} copy` : "",
          }
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
      current.length === 1 ? [{ ...defaultItem }] : current.filter((item) => item.id !== id),
    );
  }

  function resetPlan() {
    setItems([{ ...defaultItem }]);
    setInventory({});
    setInventoryMode(false);
    setExpandedResource(null);
    setPlannerCollapsed(false);
  }

  function chooseTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    if (nextTheme === "system") {
      try {
        window.localStorage.removeItem(THEME_KEY);
      } catch {
        // Theme still applies for this session.
      }
      return;
    }

    try {
      window.localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Theme still applies for this session.
    }
  }

  async function copySummary() {
    const lines = [
      "Expertise Calculator — The Division 2",
      ...items.map(
        (item, index) =>
          `${item.quantity}x ${itemLabel(item, index)} · ${item.start} → ${item.target}`,
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
        <a className="brand" href="#top" aria-label="Expertise Calculator home">
          Expertise Calculator
        </a>

        <div className="command-actions">
          <div className="theme-switcher" role="group" aria-label="Color theme">
            {(["system", "light", "dark"] as Theme[]).map((value) => (
              <button
                type="button"
                key={value}
                aria-pressed={theme === value}
                className={theme === value ? "active" : ""}
                onClick={() => chooseTheme(value)}
              >
                {value[0].toUpperCase() + value.slice(1)}
              </button>
            ))}
          </div>
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
        <section className="summary-strip" aria-label="Calculator summary">
          <p>
            Calculate the materials and resources required to upgrade your weapons, gear,
            and skills.
          </p>
          <div className="summary-readout" aria-live="polite">
            <div><span>Items</span><strong>{items.length}</strong></div>
            <div><span>Target level</span><strong>{targetLevel}</strong></div>
            <div><span>Max level</span><strong>{MAX_EXPERTISE_LEVEL}</strong></div>
          </div>
        </section>

        <div className="dashboard-grid">
          <div className="left-stack">
            <section className="panel planner-panel" aria-labelledby="plan-heading">
              <div className="panel-heading">
                <h1 id="plan-heading">
                  1. Your loadout <span>({items.length} {items.length === 1 ? "item" : "items"})</span>
                </h1>
                <div className="panel-heading-actions">
                  <button className="compact-action" type="button" onClick={() => addItem()} disabled={items.length >= 12}>
                    <span aria-hidden="true">+</span> Add item
                  </button>
                  <button
                    className="collapse-button"
                    type="button"
                    aria-expanded={!plannerCollapsed}
                    aria-label={plannerCollapsed ? "Expand loadout" : "Collapse loadout"}
                    onClick={() => setPlannerCollapsed((value) => !value)}
                  >
                    <span aria-hidden="true">⌃</span>
                  </button>
                </div>
              </div>

              {!plannerCollapsed && (
                <div className="planner-body">
                  <div className="item-list">
                    {items.map((item, index) => {
                      const { cost } = itemCosts[index];
                      const previewResources = RESOURCE_ORDER.filter((key) => cost[key]).slice(0, 3);
                      return (
                        <article className="item-card" key={item.id}>
                          <div className="item-card-topline">
                            <span className="item-number">{index + 1}</span>
                            <div className="category-tabs" role="group" aria-label={`Category for item ${index + 1}`}>
                              {(Object.keys(CATEGORIES) as Category[]).map((category) => (
                                <button
                                  type="button"
                                  className={item.category === category ? "active" : ""}
                                  aria-pressed={item.category === category}
                                  onClick={() => updateItem(item.id, { category })}
                                  key={category}
                                >
                                  <img src={CATEGORIES[category].icon} alt="" width="28" height="28" />
                                  {CATEGORIES[category].label}
                                </button>
                              ))}
                            </div>
                            <div className="item-actions">
                              <button type="button" onClick={() => addItem(item)} aria-label={`Duplicate ${itemLabel(item, index)}`} title="Duplicate item">
                                <span className="duplicate-icon" aria-hidden="true" />
                              </button>
                              <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${itemLabel(item, index)}`} title="Remove item">
                                <img src="/resources/remove-icon.png" alt="" width="20" height="20" />
                              </button>
                            </div>
                          </div>

                          <div className="item-fields">
                            <label className="name-field">
                              <span>Item name <small>(optional)</small></span>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(event) => updateItem(item.id, { name: event.target.value.slice(0, 60) })}
                                placeholder={item.category === "weapon" ? "e.g. St. Elmo's Engine" : item.category === "gear" ? "e.g. Striker's Kneepads" : "e.g. Assault Turret"}
                              />
                            </label>
                            <div className="quantity-field">
                              <span>Quantity</span>
                              <NumberStepper
                                label={`Quantity for item ${index + 1}`}
                                min={1}
                                max={12}
                                value={item.quantity}
                                onChange={(quantity) => updateItem(item.id, { quantity })}
                              />
                            </div>
                          </div>

                          <div className="level-editor">
                            <div className="level-values">
                              <div className="level-control">
                                <span>Current level</span>
                                <NumberStepper
                                  label={`Current level for ${itemLabel(item, index)}`}
                                  min={0}
                                  max={item.target}
                                  value={item.start}
                                  onChange={(start) => updateItem(item.id, { start })}
                                />
                              </div>
                              <span className="level-arrow" aria-hidden="true">→</span>
                              <div className="level-control">
                                <span>Target level</span>
                                <NumberStepper
                                  label={`Target level for ${itemLabel(item, index)}`}
                                  min={item.start}
                                  max={MAX_EXPERTISE_LEVEL}
                                  value={item.target}
                                  onChange={(target) => updateItem(item.id, { target })}
                                />
                              </div>
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
                                  <img src={RESOURCES[resource as keyof typeof RESOURCES].icon} alt="" width="26" height="26" />
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
                    <span aria-hidden="true">+</span>
                    <span><strong>Add item</strong><small>Weapon, gear, or skill</small></span>
                  </button>
                </div>
              )}
            </section>

            <section className="panel intelligence" aria-labelledby="intelligence-heading">
              <div className="panel-heading">
                <h2 id="intelligence-heading">2. Cost trajectory</h2>
                <span>Planned levels highlighted</span>
              </div>

              <div className="trajectory-body">
                <div className="trajectory-copy">
                  <strong>Advanced<br />material pressure</strong>
                  <p>Field Recon, SHD Calibration, and Exotic Components scale sharply after Expertise 12.</p>
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

              <div className="checkpoint-grid" aria-label="Upgrade cost checkpoints">
                {checkpointTotals.map(({ checkpoint, totals: checkpointCost }) => (
                  <article className={checkpoint === targetLevel ? "featured" : ""} key={checkpoint}>
                    <div><strong>{checkpoint}</strong><span>Target</span></div>
                    <dl>
                      <div><dt>Exotics</dt><dd>{formatNumber(checkpointCost.exotic_components)}</dd></div>
                      <div><dt>SHD</dt><dd>{formatNumber(checkpointCost.shd_calibration)}</dd></div>
                      <div><dt>Recon</dt><dd>{formatNumber(checkpointCost.field_recon_data)}</dd></div>
                    </dl>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className={`panel manifest-panel ${inventoryMode ? "inventory-active" : ""}`} aria-labelledby="manifest-heading">
            <div className="panel-heading manifest-heading">
              <h2 id="manifest-heading">Materials required</h2>
              <div className="inventory-control">
                <button
                  type="button"
                  className="inventory-switch"
                  role="switch"
                  aria-checked={inventoryMode}
                  aria-label="Inventory check"
                  onClick={() => setInventoryMode((value) => !value)}
                >
                  <span aria-hidden="true" />
                </button>
                <span>Inventory check</span>
                <span className="info-button" title="Compare required materials with the amounts you own" aria-label="Inventory check information">i</span>
              </div>
            </div>

            <div className="manifest-summary" aria-live="polite">
              <div><span>Units</span><strong>{items.reduce((sum, item) => sum + item.quantity, 0)}</strong></div>
              <div><span>Levels</span><strong>{totalLevels}</strong></div>
              <div><span>Resources</span><strong>{visibleResources.length}</strong></div>
            </div>

            <div className="resource-columns" aria-hidden="true">
              <span>Material</span>
              <span>Required</span>
              {inventoryMode && <span>Inventory</span>}
              {inventoryMode && <span>Status</span>}
            </div>

            <div className="resource-list">
              {visibleResources.map((resource) => {
                const meta = RESOURCES[resource as keyof typeof RESOURCES];
                const total = totals[resource] || 0;
                const owned = inventory[resource] || 0;
                const covered = owned >= total;
                const open = expandedResource === resource;
                return (
                  <article className={`resource-card ${open ? "expanded" : ""}`} key={resource}>
                    <div className="resource-main">
                      <button
                        className="resource-identity"
                        type="button"
                        aria-expanded={open}
                        onClick={() => setExpandedResource(open ? null : resource)}
                      >
                        <span className="resource-icon-wrap" style={{ "--resource-color": meta.color } as React.CSSProperties}>
                          <img src={meta.icon} alt="" width="38" height="38" />
                        </span>
                        <span className="resource-name">
                          <strong>{meta.label}</strong>
                          <small>{meta.group === "advanced" ? "Advanced material" : "Crafting material"}</small>
                        </span>
                      </button>
                      <strong className="required-value">{formatNumber(total)}</strong>
                      {inventoryMode && (
                        <input
                          className="inventory-input"
                          type="number"
                          min="0"
                          value={owned}
                          aria-label={`${meta.label} in inventory`}
                          onChange={(event) => setInventory((current) => ({ ...current, [resource]: Math.max(0, Number(event.target.value) || 0) }))}
                        />
                      )}
                      {inventoryMode && (
                        <span className={`resource-status ${covered ? "covered" : "shortfall"}`} title={covered ? "Covered" : `${formatNumber(total - owned)} short`}>
                          <span aria-hidden="true">{covered ? "✓" : "!"}</span>
                          <span className="sr-only">{covered ? "Covered" : `${formatNumber(total - owned)} short`}</span>
                        </span>
                      )}
                    </div>

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

            <p className="manifest-note">
              Numbers are per item unless noted. Turn on inventory check to compare what you own with the plan.
            </p>
          </aside>
        </div>
      </main>

      <footer>
        <span>Unofficial community tool. Not affiliated with Ubisoft or Massive Entertainment.</span>
        <div>
          <a href={COST_DATA_SOURCE} target="_blank" rel="noreferrer">Cost table · {COST_DATA_DATE}</a>
          <a href={OFFICIAL_CAP_SOURCE} target="_blank" rel="noreferrer">Level-cap source</a>
          <a href="https://github.com/skuldgerry/division2-expertise-calculator" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
