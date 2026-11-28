// EU low-value parcel cost engine (B2C distance sales into the EU), shared by the free page and the paid kit.
// Rules modelled (check the sources before relying on them; not legal advice):
//  - Council Regulation (EU) 2026/382: from 1 Jul 2026 to 1 Jul 2028, consignments with an intrinsic value
//    of EUR 150 or less pay a flat EUR 3 customs duty per item, where "item" = goods sharing the same tariff
//    classification (5 identical T-shirts = EUR 3; T-shirts + a watch = EUR 6), whatever the VAT scheme (IOSS or not).
//  - Union handling fee: the Commission lists EUR 2 from 1 Nov 2026 (Delegated Reg. (EU) 2026/2152). Who bears it
//    in practice depends on the carrier, so it is an editable input.
//  - Import VAT without IOSS: the taxable amount includes customs duties and incidental transport costs to the
//    destination (VAT Directive 2006/112/EC Art. 86). With IOSS the seller charges destination VAT at checkout.
//  - Above EUR 150: normal TARIC duty rates apply and IOSS cannot be used; the engine flags this instead of guessing.

export const LOW_VALUE_LIMIT_EUR = 150;
export const FLAT_DUTY_EUR = 3;
export const DEFAULT_HANDLING_FEE_EUR = 2;

// Standard VAT rates (%) as last checked 2026-11-25. Reduced rates exist for some goods (e.g. books,
// children's clothing in IE); the rate is editable in every tool.
export const VAT_RATES = {
  AT: ["Austria", 20], BE: ["Belgium", 21], BG: ["Bulgaria", 20], HR: ["Croatia", 25], CY: ["Cyprus", 19],
  CZ: ["Czechia", 21], DK: ["Denmark", 25], EE: ["Estonia", 24], FI: ["Finland", 25.5], FR: ["France", 20],
  DE: ["Germany", 19], GR: ["Greece", 24], HU: ["Hungary", 27], IE: ["Ireland", 23], IT: ["Italy", 22],
  LV: ["Latvia", 21], LT: ["Lithuania", 21], LU: ["Luxembourg", 17], MT: ["Malta", 18], NL: ["Netherlands", 21],
  PL: ["Poland", 23], PT: ["Portugal", 23], RO: ["Romania", 21], SK: ["Slovakia", 23], SI: ["Slovenia", 22],
  ES: ["Spain", 21], SE: ["Sweden", 25],
};

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const num = (v, d = 0) => (Number.isFinite(Number(v)) && v !== "" && v !== null ? Number(v) : d);

/**
 * @param {object} o
 * @param {{name?:string, qty:number, unitPrice:number, group?:string}[]} o.lines  prices in the sale currency, ex-VAT
 * @param {number} o.shipping   shipping charged to the customer (sale currency)
 * @param {number} o.fxToEur    1 unit of sale currency = fxToEur EUR
 * @param {string} o.country    ISO-2 EU country
 * @param {number} [o.vatRate]  % override
 * @param {boolean} o.ioss      seller collects VAT at checkout via IOSS
 * @param {number} [o.handlingFee] EUR per consignment
 * @param {number} [o.carrierFee]  EUR clearance fee the carrier charges the customer (DAP / no IOSS)
 */
export function calcParcel(o) {
  const fx = num(o.fxToEur, 1);
  const lines = (o.lines || []).filter((l) => num(l.qty) > 0 && num(l.unitPrice) >= 0);
  const goodsEur = r2(lines.reduce((s, l) => s + num(l.qty) * num(l.unitPrice) * fx, 0));
  const shippingEur = r2(num(o.shipping) * fx);
  const vatRate = o.vatRate !== undefined && o.vatRate !== "" ? num(o.vatRate) : (VAT_RATES[o.country] || [null, 0])[1];
  const handlingFee = o.handlingFee !== undefined && o.handlingFee !== "" ? num(o.handlingFee) : DEFAULT_HANDLING_FEE_EUR;
  const carrierFee = num(o.carrierFee);
  // Distinct tariff classifications: lines with the same non-empty group key count once.
  const keys = new Set(lines.map((l, i) => (String(l.group || "").trim().toLowerCase() || `__line${i}`)));
  const tariffItems = keys.size;
  const lowValue = goodsEur <= LOW_VALUE_LIMIT_EUR;
  const notes = [];
  if (!lines.length) notes.push("Add at least one product line.");

  if (!lowValue) {
    notes.push(`Goods value is above EUR ${LOW_VALUE_LIMIT_EUR}: the flat EUR 3 duty does not apply. Normal TARIC duty rates apply, IOSS cannot be used, and import VAT is due on entry. Look up the duty rate for your HS code in TARIC.`);
    const vatBase = goodsEur + shippingEur; // duty unknown, excluded
    return {
      goodsEur, shippingEur, tariffItems, lowValue, vatRate, duty: null, handlingFee, carrierFee: r2(carrierFee),
      vat: r2((vatBase * vatRate) / 100), vatCollectedBy: "customs (customer, unless you ship DDP)",
      extraForCustomer: null, ddpAddOn: null, notes,
    };
  }

  const duty = r2(FLAT_DUTY_EUR * tariffItems);
  let vat, vatCollectedBy, extraForCustomer, ddpAddOn;
  if (o.ioss) {
    vat = r2(((goodsEur + shippingEur) * vatRate) / 100);
    vatCollectedBy = "you, at checkout (IOSS)";
    // With IOSS the VAT is already in what the customer paid you; duty and fee are what's left to settle.
    ddpAddOn = r2(duty + handlingFee);
    extraForCustomer = r2(duty + handlingFee); // if you ship DAP the carrier may still bill these, plus its own fee
    notes.push("IOSS: charge this VAT at checkout and declare it in your monthly IOSS return. The EUR 3 duty applies on top, whatever the VAT scheme.");
  } else {
    vat = r2(((goodsEur + shippingEur + duty) * vatRate) / 100);
    vatCollectedBy = "customs, on delivery (customer, unless you ship DDP)";
    ddpAddOn = r2(duty + handlingFee + vat);
    extraForCustomer = r2(duty + handlingFee + vat + carrierFee);
    notes.push("No IOSS: import VAT is charged on goods + shipping + duty (VAT Directive Art. 86). Carriers usually add their own clearance fee, which the customer pays on delivery.");
  }
  return { goodsEur, shippingEur, tariffItems, lowValue, vatRate, duty, handlingFee, carrierFee: r2(carrierFee), vat, vatCollectedBy, extraForCustomer, ddpAddOn, notes };
}

/** Price per single unit, ex-VAT in the sale currency, needed so that a one-item DDP order still nets `unitPrice`. */
export function ddpUnitUplift({ unitPrice, fxToEur, country, ioss, handlingFee, shipping = 0 }) {
  const res = calcParcel({ lines: [{ qty: 1, unitPrice }], shipping, fxToEur, country, ioss, handlingFee });
  if (!res.lowValue) return null;
  const fx = num(fxToEur, 1);
  return r2(num(unitPrice) + res.ddpAddOn / fx);
}
