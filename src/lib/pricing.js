// Pricing engine.
// NOTE (Phase 1): ported as-is from the prototype so the wizard works locally.
// In Phase 3 these calculations move behind the Django API and this module is
// replaced by API calls — the frontend must never be the pricing source of truth.

import { fmtIDR, fmtKg } from './format.js';
import { PARTNERS, PRODUCTS, GLASS, FINISHES, KIT_LIB, SERVICE_RATES } from './data.js';

export function computeLine(line, partner, lang) {
  const prod = PRODUCTS.find((p) => p.id === line.productId);
  const glass = GLASS.find((g) => g.id === line.glassId);
  const finish = FINISHES.find((f) => f.id === line.finishId);
  const P = 2 * (Number(line.w) + Number(line.h)) / 1000; // perimeter m
  const A = (Number(line.w) * Number(line.h)) / 1e6;      // area m²
  const parts = [];

  if (partner.basis === 'kg') {
    const profKg = P * prod.kgPerM;
    parts.push({
      key: 'profiles',
      name: lang === 'id' ? 'Profil aluminium — rangka & daun' : 'Aluminum profiles — frame & sash',
      basis: fmtKg(profKg) + ' × ' + fmtIDR(partner.ratePerKg) + '/kg',
      price: profKg * partner.ratePerKg * finish.factor,
      auto: false
    });
    prod.kit.forEach((k) => {
      const lib = KIT_LIB[k];
      const kg = lib.kgPerM * P;
      parts.push({
        key: k, name: lib.name[lang],
        basis: fmtKg(kg) + ' × ' + fmtIDR(partner.ratePerKg) + '/kg',
        price: kg * partner.ratePerKg, auto: true
      });
    });
  } else {
    parts.push({
      key: 'profiles',
      name: lang === 'id' ? 'Rangka & daun (set pabrik)' : 'Frame & sash (factory set)',
      basis: '1 unit × ' + fmtIDR(prod.unitIDR[partner.id]),
      price: prod.unitIDR[partner.id] * finish.factor,
      auto: false
    });
    prod.kit.forEach((k) => {
      const lib = KIT_LIB[k];
      parts.push({
        key: k, name: lib.name[lang],
        basis: '1 set × ' + fmtIDR(lib.unitIDR),
        price: lib.unitIDR, auto: true
      });
    });
  }

  const glassArea = A * prod.glassFactor;
  parts.push({
    key: 'glass',
    name: glass.name[lang],
    basis: glassArea.toFixed(2).replace('.', ',') + ' m² × ' + fmtIDR(glass.rate) + '/m²',
    price: glassArea * glass.rate,
    auto: false
  });

  const perUnit = parts.reduce((s, p) => s + p.price, 0);
  const smallParts = parts.filter((p) => p.auto).reduce((s, p) => s + p.price, 0);
  return {
    prod, parts,
    perUnit,
    total: perUnit * line.qty,
    smallPartsPerUnit: smallParts
  };
}

export function computeQuote(quote, lang) {
  const partner = PARTNERS.find((p) => p.id === quote.partnerId) || PARTNERS[0];
  const lines = quote.lines.map((l) => ({ line: l, ...computeLine(l, partner, lang) }));
  const totalQty = quote.lines.reduce((s, l) => s + Number(l.qty), 0);
  const materials = lines.reduce((s, l) => s + (l.perUnit - l.smallPartsPerUnit) * l.line.qty, 0);
  const smallParts = lines.reduce((s, l) => s + l.smallPartsPerUnit * l.line.qty, 0);
  const assembly = totalQty * SERVICE_RATES.assemblyPerOpening;
  const logistics = quote.lines.length ? SERVICE_RATES.logisticsFlat : 0;
  const installDays = Math.max(1, Math.ceil(totalQty / SERVICE_RATES.unitsPerInstallDay));
  const installation = quote.lines.length ? installDays * SERVICE_RATES.installPerDay : 0;
  const costSubtotal = materials + smallParts + assembly + logistics + installation;
  const marginAmt = costSubtotal * (quote.marginPct / 100);
  return {
    partner, lines, totalQty,
    materials, smallParts,
    assembly, logistics,
    installation, installDays,
    costSubtotal, marginAmt,
    grandTotal: costSubtotal + marginAmt
  };
}
