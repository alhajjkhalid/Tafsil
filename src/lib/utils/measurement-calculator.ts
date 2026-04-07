export type BodyType = "slim" | "regular" | "broad";
export type StandardSize = "S" | "M" | "L" | "XL";

export interface MeasurementResult {
  shoulder: number;
  chest: number;
  waist: number;
  sleeve_length: number;
  thobe_length: number;
  neck: number;
}

/**
 * Body type multipliers for AI estimation adjustments.
 * Values are relative to the "regular" baseline.
 */
const bodyTypeMultipliers: Record<
  BodyType,
  {
    shoulder: number;
    chest: number;
    waist: number;
    neck: number;
  }
> = {
  slim: { shoulder: 0.94, chest: 0.92, waist: 0.88, neck: 0.95 },
  regular: { shoulder: 1.0, chest: 1.0, waist: 1.0, neck: 1.0 },
  broad: { shoulder: 1.08, chest: 1.1, waist: 1.12, neck: 1.06 },
};

/**
 * Calculates estimated thobe measurements from height, weight, and body type
 * using anthropometric approximation formulas.
 */
export function calculateFromAI(
  heightCm: number,
  weightKg: number,
  bodyType: BodyType
): MeasurementResult {
  const multipliers = bodyTypeMultipliers[bodyType];

  // Base calculations from height and weight
  const baseShoulder = heightCm * 0.255;
  const baseChest = weightKg * 0.95 + 10;
  const baseWaist = weightKg * 0.85 + 5;
  const baseSleeveLength = heightCm * 0.345;
  const baseThobeLength = heightCm * 0.82;
  const baseNeck = weightKg * 0.22 + 25;

  // Apply body type adjustments
  const shoulder = Math.round(baseShoulder * multipliers.shoulder * 10) / 10;
  const chest = Math.round(baseChest * multipliers.chest * 10) / 10;
  const waist = Math.round(baseWaist * multipliers.waist * 10) / 10;
  const sleeve_length = Math.round(baseSleeveLength * 10) / 10;
  const thobe_length = Math.round(baseThobeLength * 10) / 10;
  const neck = Math.round(baseNeck * multipliers.neck * 10) / 10;

  return { shoulder, chest, waist, sleeve_length, thobe_length, neck };
}

/**
 * Standard size base measurements (for 175cm reference height).
 * All values in cm.
 */
const standardSizeBase: Record<StandardSize, MeasurementResult> = {
  S: {
    shoulder: 43,
    chest: 96,
    waist: 82,
    sleeve_length: 59,
    thobe_length: 140,
    neck: 37,
  },
  M: {
    shoulder: 46,
    chest: 102,
    waist: 90,
    sleeve_length: 61,
    thobe_length: 143,
    neck: 39,
  },
  L: {
    shoulder: 49,
    chest: 110,
    waist: 98,
    sleeve_length: 63,
    thobe_length: 146,
    neck: 41,
  },
  XL: {
    shoulder: 52,
    chest: 118,
    waist: 108,
    sleeve_length: 65,
    thobe_length: 149,
    neck: 43,
  },
};

const REFERENCE_HEIGHT_CM = 175;

/**
 * Calculates measurements from a standard size, scaled by the customer's height
 * relative to the 175cm reference.
 */
export function calculateFromStandard(
  heightCm: number,
  size: StandardSize
): MeasurementResult {
  const base = standardSizeBase[size];
  const heightRatio = heightCm / REFERENCE_HEIGHT_CM;

  return {
    shoulder: Math.round(base.shoulder * heightRatio * 10) / 10,
    chest: Math.round(base.chest * heightRatio * 10) / 10,
    waist: Math.round(base.waist * heightRatio * 10) / 10,
    sleeve_length: Math.round(base.sleeve_length * heightRatio * 10) / 10,
    thobe_length: Math.round(base.thobe_length * heightRatio * 10) / 10,
    neck: Math.round(base.neck * heightRatio * 10) / 10,
  };
}
