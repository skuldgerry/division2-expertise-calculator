import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_EXPERTISE_LEVEL,
  calculateUpgradeCost,
  combineCosts,
} from "../app/expertise-data.js";

test("uses Expertise level 30 as the single cap", () => {
  assert.equal(MAX_EXPERTISE_LEVEL, 30);
  assert.throws(() => calculateUpgradeCost("weapon", 0, 31), /between 0 and 30/);
});

test("matches the verified Y8S1 full weapon total", () => {
  assert.deepEqual(calculateUpgradeCost("weapon", 0, 30), {
    steel: 610,
    titanium: 1030,
    receiver_components: 1754,
    field_recon_data: 166,
    shd_calibration: 76,
    exotic_components: 45,
  });
});

test("matches the verified Y8S1 full gear total", () => {
  assert.deepEqual(calculateUpgradeCost("gear", 0, 30), {
    polycarbonate: 305,
    carbon_fiber: 535,
    protective_fabric: 875,
    field_recon_data: 166,
    shd_calibration: 76,
    exotic_components: 45,
  });
});

test("keeps the community-verified skill exception", () => {
  assert.deepEqual(calculateUpgradeCost("skill", 0, 30), {
    ceramic: 770,
    electronics: 1300,
    printer_filament: 2200,
    field_recon_data: 204,
    shd_calibration: 90,
    exotic_components: 45,
  });
});

test("uses exclusive start and inclusive target levels", () => {
  assert.deepEqual(calculateUpgradeCost("weapon", 29, 30), {
    field_recon_data: 13,
    shd_calibration: 8,
    exotic_components: 5,
  });
  assert.deepEqual(calculateUpgradeCost("gear", 10, 12), { field_recon_data: 7 });
  assert.deepEqual(calculateUpgradeCost("skill", 15, 15), {});
});

test("multiplies quantities and combines independent items", () => {
  const twoWeapons = calculateUpgradeCost("weapon", 29, 30, 2);
  const gear = calculateUpgradeCost("gear", 29, 30);
  assert.deepEqual(combineCosts([twoWeapons, gear]), {
    field_recon_data: 39,
    shd_calibration: 24,
    exotic_components: 15,
  });
});

test("rejects reversed and fractional level ranges", () => {
  assert.throws(() => calculateUpgradeCost("weapon", 20, 10), /cannot be lower/);
  assert.throws(() => calculateUpgradeCost("gear", 1.5, 4), /whole numbers/);
});
