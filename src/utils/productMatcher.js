import { PRODUCT_CATALOG } from '../data/productCatalog';

// ═══════════════════════════════════════════
//  產品型號匹配引擎
//  根據 calcSystem() 的計算結果，為每個品牌匹配最適合的產品型號
//  規則：向上取整 — 找到規格 >= 需求的最小型號
// ═════════════════════════���═════════════════

function findSmallest(models, key, minVal) {
  const candidates = models.filter(m => m[key] >= minVal);
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => a[key] - b[key]);
  return candidates[0];
}

// ─── 泵匹配 ─────────────────────────────────
export function matchPumps(calcResult) {
  const requiredDisp = calcResult.pump.disp;
  const requiredPressure = calcResult.meta.pressure;
  const results = {};

  for (const [brandKey, brandData] of Object.entries(PRODUCT_CATALOG.pump)) {
    const brandResults = [];
    for (const series of brandData.series) {
      const candidates = series.models.filter(
        m => m.displacement >= requiredDisp && m.maxPressure >= requiredPressure
      );
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.displacement - b.displacement);
        brandResults.push({
          series: series.name,
          type: series.type,
          matched: candidates[0],
          allModels: series.models,
        });
      }
    }
    results[brandKey] = {
      brand: brandData.brand,
      origin: brandData.origin,
      grade: brandData.grade,
      matches: brandResults,
      noMatch: brandResults.length === 0,
    };
  }
  return results;
}

// ─── 方向閥匹配 ──────���──────────────────────
export function matchDirectionalValves(calcResult) {
  const requiredFlow = calcResult.valve.Q;
  const requiredPressure = calcResult.valve.P;
  const results = {};

  for (const [brandKey, brandData] of Object.entries(PRODUCT_CATALOG.directionalValve)) {
    const brandResults = [];
    for (const series of brandData.series) {
      const candidates = series.models.filter(
        m => m.maxFlow >= requiredFlow && m.maxPressure >= requiredPressure
      );
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.maxFlow - b.maxFlow);
        brandResults.push({
          series: series.name,
          matched: candidates[0],
        });
      }
    }
    results[brandKey] = {
      brand: brandData.brand,
      origin: brandData.origin,
      grade: brandData.grade,
      matches: brandResults,
      noMatch: brandResults.length === 0,
    };
  }
  return results;
}

// ─── 溢流閥匹配 ─────────────────────────────
export function matchReliefValves(calcResult) {
  const requiredFlow = calcResult.valve.Q;
  const requiredPressure = Number(calcResult.valve.relief);
  const results = {};

  for (const [brandKey, brandData] of Object.entries(PRODUCT_CATALOG.reliefValve)) {
    const brandResults = [];
    for (const series of brandData.series) {
      const candidates = series.models.filter(
        m => m.maxFlow >= requiredFlow && m.maxPressure >= requiredPressure
      );
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.maxFlow - b.maxFlow);
        brandResults.push({
          series: series.name,
          matched: candidates[0],
        });
      }
    }
    results[brandKey] = {
      brand: brandData.brand,
      origin: brandData.origin,
      grade: brandData.grade,
      matches: brandResults,
      noMatch: brandResults.length === 0,
    };
  }
  return results;
}

// ─── 油壓缸匹配 ─────────────────────────────
export function matchCylinders(calcResult) {
  const requiredBore = calcResult.cyl.bore;
  const requiredStroke = calcResult.cyl.stroke;
  const requiredPressure = calcResult.meta.pressure;
  const results = {};

  for (const [brandKey, brandData] of Object.entries(PRODUCT_CATALOG.cylinder)) {
    const brandResults = [];
    for (const series of brandData.series) {
      const candidates = series.models.filter(
        m => m.bore >= requiredBore && m.maxStroke >= requiredStroke && m.maxPressure >= requiredPressure
      );
      if (candidates.length > 0) {
        candidates.sort((a, b) => a.bore - b.bore);
        const matched = { ...candidates[0] };
        // 用計算出的行程取代預設行程（油壓缸行程是可定製的）
        matched.actualStroke = requiredStroke;
        // 更新型號字串中的行程值
        matched.displayModel = matched.model.replace(/\d+$/, requiredStroke);
        brandResults.push({
          series: series.name,
          matched,
        });
      }
    }
    results[brandKey] = {
      brand: brandData.brand,
      origin: brandData.origin,
      grade: brandData.grade,
      matches: brandResults,
      noMatch: brandResults.length === 0,
    };
  }
  return results;
}

// ─── 電機匹配 ─────────────────────────────
export function matchMotors(calcResult) {
  const requiredPower = calcResult.motor.kW;
  const isServo = calcResult.motor.isServo;
  const results = {};

  for (const [brandKey, brandData] of Object.entries(PRODUCT_CATALOG.motor)) {
    const brandResults = [];
    for (const series of brandData.series) {
      if (series.isServo !== isServo) continue;
      const match = findSmallest(series.models, 'power_kW', requiredPower);
      if (match) {
        brandResults.push({
          series: series.name,
          matched: match,
        });
      }
    }
    results[brandKey] = {
      brand: brandData.brand,
      origin: brandData.origin,
      grade: brandData.grade,
      matches: brandResults,
      noMatch: brandResults.length === 0,
    };
  }
  return results;
}

// ─── 全套匹配 ─────────────────────────────
export function matchAll(calcResult) {
  return {
    pumps: matchPumps(calcResult),
    directionalValves: matchDirectionalValves(calcResult),
    reliefValves: matchReliefValves(calcResult),
    cylinders: matchCylinders(calcResult),
    motors: matchMotors(calcResult),
  };
}
