export const MAX_EXPERTISE_LEVEL = 30;
export const COST_DATA_VERSION = "Y8S1 (Rev. 2)";
export const COST_DATA_DATE = "2026-04-03";
export const COST_DATA_SOURCE =
  "https://www.reddit.com/r/thedivision/comments/1sasd3y/expertise_upgrades_table_updated_to_y8s1/";
export const OFFICIAL_CAP_SOURCE =
  "https://www.ubisoft.com/en-au/game/the-division/news-updates/3DFEM2OnnbfRsDrQWXsbbO/the-division-2-the-pact";

export const CATEGORIES = {
  weapon: { label: "Weapon", icon: "/resources/weapon-icon.png" },
  gear: { label: "Gear", icon: "/resources/gear-icon.png" },
  skill: { label: "Skill", icon: "/resources/skill-icon.png" },
};

export const RESOURCES = {
  exotic_components: {
    label: "Exotic Components",
    shortLabel: "Exotics",
    icon: "/resources/exotic_components-icon.png",
    group: "advanced",
    color: "#ff6a13",
  },
  shd_calibration: {
    label: "SHD Calibration",
    shortLabel: "SHD Calibration",
    icon: "/resources/shd_calibration-icon.png",
    group: "advanced",
    color: "#ffc857",
  },
  field_recon_data: {
    label: "Field Recon Data",
    shortLabel: "Recon Data",
    icon: "/resources/field_recon_data-icon.png",
    group: "advanced",
    color: "#e5a43a",
  },
  steel: {
    label: "Steel",
    shortLabel: "Steel",
    icon: "/resources/steel-icon.png",
    group: "common",
    color: "#79d65c",
  },
  titanium: {
    label: "Titanium",
    shortLabel: "Titanium",
    icon: "/resources/titanium-icon.png",
    group: "common",
    color: "#5aa9ff",
  },
  receiver_components: {
    label: "Receiver Components",
    shortLabel: "Receiver Parts",
    icon: "/resources/receiver_components-icon.png",
    group: "common",
    color: "#bac7d0",
  },
  polycarbonate: {
    label: "Polycarbonate",
    shortLabel: "Polycarbonate",
    icon: "/resources/polycarbonate-icon.png",
    group: "common",
    color: "#7bd65c",
  },
  carbon_fiber: {
    label: "Carbon Fiber",
    shortLabel: "Carbon Fiber",
    icon: "/resources/carbon_fiber-icon.png",
    group: "common",
    color: "#5ea3ee",
  },
  protective_fabric: {
    label: "Protective Fabric",
    shortLabel: "Protective Fabric",
    icon: "/resources/protective_fabric-icon.png",
    group: "common",
    color: "#c9d0d5",
  },
  ceramic: {
    label: "Ceramics",
    shortLabel: "Ceramics",
    icon: "/resources/ceramics-icon.png",
    group: "common",
    color: "#7bd65c",
  },
  electronics: {
    label: "Electronics",
    shortLabel: "Electronics",
    icon: "/resources/eletronics-icon.png",
    group: "common",
    color: "#5aa9ff",
  },
  printer_filament: {
    label: "Printer Filament",
    shortLabel: "Printer Filament",
    icon: "/resources/printer_filament-icon.png",
    group: "common",
    color: "#f067d7",
  },
};

export const RESOURCE_ORDER = [
  "exotic_components",
  "shd_calibration",
  "field_recon_data",
  "steel",
  "titanium",
  "receiver_components",
  "polycarbonate",
  "carbon_fiber",
  "protective_fabric",
  "ceramic",
  "electronics",
  "printer_filament",
];

const emptySchedule = () =>
  Array.from({ length: MAX_EXPERTISE_LEVEL }, (_, index) => ({
    level: index + 1,
  }));

function addSeries(schedule, resource, values, startLevel = 1) {
  values.forEach((value, index) => {
    if (value) schedule[startLevel + index - 1][resource] = value;
  });
}

function addLateGame(schedule, shdValues, reconValues) {
  addSeries(schedule, "shd_calibration", shdValues, 13);
  addSeries(schedule, "field_recon_data", reconValues, 13);
  addSeries(
    schedule,
    "exotic_components",
    [0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5],
    13,
  );
}

function createWeaponSchedule() {
  const schedule = emptySchedule();
  addSeries(schedule, "steel", [38, 68, 110, 164, 230]);
  addSeries(schedule, "titanium", [45, 52, 61, 72, 85, 105, 122, 141, 162, 185]);
  addSeries(
    schedule,
    "receiver_components",
    [76, 90, 106, 125, 147, 162, 198, 238, 282, 330],
  );
  addSeries(schedule, "field_recon_data", [1, 2, 3, 3, 4], 8);
  addLateGame(
    schedule,
    [1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8],
    [4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13],
  );
  return schedule;
}

function createGearSchedule() {
  const schedule = emptySchedule();
  addSeries(schedule, "polycarbonate", [47, 54, 61, 68, 75]);
  addSeries(schedule, "carbon_fiber", [35, 38, 41, 44, 47, 58, 62, 66, 70, 74]);
  addSeries(
    schedule,
    "protective_fabric",
    [49, 58, 67, 76, 85, 92, 100, 108, 116, 124],
  );
  addSeries(schedule, "field_recon_data", [1, 2, 3, 3, 4], 8);
  addLateGame(
    schedule,
    [1, 1, 2, 2, 2, 3, 3, 4, 4, 4, 5, 5, 6, 6, 6, 7, 7, 8],
    [4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13],
  );
  return schedule;
}

function createSkillSchedule() {
  const schedule = emptySchedule();
  addSeries(schedule, "ceramic", [122, 138, 154, 170, 186]);
  addSeries(
    schedule,
    "electronics",
    [76, 88, 100, 112, 124, 136, 148, 160, 172, 184],
  );
  addSeries(
    schedule,
    "printer_filament",
    [130, 150, 170, 190, 210, 230, 250, 270, 290, 310],
  );
  addSeries(schedule, "field_recon_data", [1, 2, 3, 3, 4], 8);
  addLateGame(
    schedule,
    [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9],
    [5, 5, 6, 7, 7, 8, 9, 10, 10, 11, 12, 12, 13, 14, 14, 15, 16, 17],
  );
  return schedule;
}

export const EXPERTISE_COSTS = {
  weapon: createWeaponSchedule(),
  gear: createGearSchedule(),
  skill: createSkillSchedule(),
};

export function calculateUpgradeCost(category, startLevel, targetLevel, quantity = 1) {
  if (!EXPERTISE_COSTS[category]) throw new Error(`Unknown category: ${category}`);
  if (!Number.isInteger(startLevel) || !Number.isInteger(targetLevel)) {
    throw new Error("Expertise levels must be whole numbers.");
  }
  if (startLevel < 0 || targetLevel > MAX_EXPERTISE_LEVEL) {
    throw new Error(`Expertise levels must be between 0 and ${MAX_EXPERTISE_LEVEL}.`);
  }
  if (targetLevel < startLevel) {
    throw new Error("Target level cannot be lower than start level.");
  }

  const multiplier = Math.max(1, Number.isFinite(quantity) ? Math.floor(quantity) : 1);
  const totals = {};
  for (let level = startLevel + 1; level <= targetLevel; level += 1) {
    for (const [resource, amount] of Object.entries(EXPERTISE_COSTS[category][level - 1])) {
      if (resource === "level") continue;
      totals[resource] = (totals[resource] || 0) + amount * multiplier;
    }
  }
  return totals;
}

export function combineCosts(costs) {
  return costs.reduce((totals, cost) => {
    for (const [resource, amount] of Object.entries(cost)) {
      totals[resource] = (totals[resource] || 0) + amount;
    }
    return totals;
  }, {});
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

