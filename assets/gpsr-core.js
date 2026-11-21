/* GPSR Shield — compliance engine (pure functions, no DOM).
 * Regulation (EU) 2023/988 (General Product Safety Regulation), applicable since 13 Dec 2024.
 * Used by: app/index.html, the SEO pages, the kit's offline bulk label printer, and tests.
 * This is an information aid, not legal advice.
 */

export const EU27 = ["Austria","Belgium","Bulgaria","Croatia","Cyprus","Czechia","Denmark","Estonia","Finland","France","Germany","Greece","Hungary","Ireland","Italy","Latvia","Lithuania","Luxembourg","Malta","Netherlands","Poland","Portugal","Romania","Slovakia","Slovenia","Spain","Sweden"];

export const COUNTRIES = ["United States","United Kingdom","China","India","Pakistan","Bangladesh","Turkey","Vietnam","Canada","Australia","Japan","South Korea","Taiwan","Indonesia","Thailand","Mexico","Brazil","Egypt","Morocco","United Arab Emirates", ...EU27].filter((v,i,a)=>a.indexOf(v)===i);

export const isEU = (country) => EU27.includes(String(country || "").trim());

/* Category rules. `law` lines are the main EU instruments that apply alongside GPSR.
 * `warnings` are common starter warnings (English). Sellers must confirm them for their product
 * and translate into the official language(s) of each Member State they sell to. */
export const CATEGORIES = {
  general: {
    label: "General consumer product",
    law: ["GPSR (EU) 2023/988 is the main safety framework for non-harmonised consumer products."],
    warnings: ["Keep out of reach of children.", "Use only as intended. Read instructions before use."],
    checks: [],
  },
  candles: {
    label: "Candles & home fragrance",
    law: [
      "EN 15494: safety warnings & pictograms for candles (general safety warning, burn within sight, etc.).",
      "EN 15493 (fire safety) and EN 15426 (sooting) are the reference test standards.",
      "Scented candles, wax melts & diffusers may need CLP (EC) 1272/2008 hazard labelling, depending on the fragrance. Check your fragrance supplier's SDS / CLP statement.",
    ],
    warnings: [
      "Never leave a burning candle unattended.",
      "Burn within sight. Keep away from things that catch fire.",
      "Keep out of reach of children and pets.",
      "Place on a heat-resistant surface, away from draughts.",
    ],
    checks: [
      { id: "clp", text: "Fragrance checked against CLP (SDS / supplier CLP statement on file)" },
      { id: "en15494", text: "EN 15494 safety pictograms / warning text on candle or packaging" },
    ],
  },
  apparel: {
    label: "Apparel & textiles",
    law: [
      "Textile Labelling Regulation (EU) 1007/2011: fibre composition label using EU fibre names (e.g. \"100% cotton\").",
      "REACH (EC) 1907/2006 Annex XVII restrictions apply (e.g. certain azo dyes, nickel on metal parts in skin contact).",
      "Children's clothing: cords & drawstrings should follow EN 14682.",
      "Care symbols are voluntary in the EU but widely expected.",
    ],
    warnings: ["Keep away from fire and flames."],
    checks: [
      { id: "fibre", text: "Fibre composition label with EU fibre names, durably attached" },
      { id: "reach", text: "Supplier declaration on REACH restricted substances (azo dyes etc.) on file" },
    ],
  },
  toys: {
    label: "Toys (incl. wooden toys)",
    law: [
      "Toy Safety Directive 2009/48/EC applies (a new Toy Safety Regulation has been adopted and will replace it after its transition period).",
      "CE marking, EU Declaration of Conformity and safety assessment are required before sale.",
      "Reference standards: EN 71-1 (mechanical), EN 71-2 (flammability), EN 71-3 (migration of elements, e.g. paints and finishes).",
      "GPSR online-listing information duties (Art. 19) still apply to toys sold online.",
    ],
    warnings: [
      "Warning. Not suitable for children under 36 months. Small parts. Choking hazard.",
      "Adult supervision recommended.",
    ],
    checks: [
      { id: "ce", text: "CE marking affixed and EU Declaration of Conformity signed" },
      { id: "en71", text: "EN 71-1/-2/-3 test reports (or equivalent) on file" },
    ],
  },
  jewelry: {
    label: "Jewelry & accessories",
    law: [
      "REACH Annex XVII entry 27 (nickel): release limit 0.5 µg/cm²/week for items in prolonged skin contact; 0.2 µg/cm²/week for piercing posts.",
      "REACH Annex XVII entry 23 (cadmium): max 0.01% by weight in metal parts of jewellery.",
      "REACH Annex XVII entry 63 (lead): max 0.05% by weight in jewellery articles.",
      "Jewellery designed for children may be classed as a toy (Toy Safety Directive).",
    ],
    warnings: ["Not suitable for children under 3 years. Small parts.", "Remove before swimming or showering."],
    checks: [
      { id: "metals", text: "Nickel / cadmium / lead test report or supplier declaration on file" },
    ],
  },
  cosmetics: {
    label: "Cosmetics & skincare",
    law: [
      "Cosmetics are mainly governed by the Cosmetics Regulation (EC) 1223/2009, not GPSR.",
      "You need an EU Responsible Person, a Cosmetic Product Safety Report, a Product Information File and CPNP notification before sale.",
      "Labelling (INCI ingredient list, nominal content, PAO / best-before, batch, precautions) follows Art. 19 of 1223/2009.",
      "GPSR only covers safety aspects not addressed by 1223/2009 (and its general online-sale principles). Use this label for packaging/shipping info, not as your cosmetic label.",
    ],
    warnings: ["For external use only.", "Avoid contact with eyes. If irritation occurs, discontinue use."],
    checks: [
      { id: "cpnp", text: "CPNP notification done by your EU Responsible Person" },
      { id: "cpsr", text: "Cosmetic Product Safety Report (CPSR) & PIF available" },
    ],
  },
  electronics: {
    label: "Electronics & electrical",
    law: [
      "CE marking under the applicable directives: Low Voltage 2014/35/EU, EMC 2014/30/EU, RoHS 2011/65/EU; Radio Equipment 2014/53/EU for wireless products.",
      "WEEE 2012/19/EU: crossed-out wheeled-bin symbol and producer registration in each country you sell to.",
      "Batteries Regulation (EU) 2023/1542 labelling and producer obligations if batteries are included.",
    ],
    warnings: ["Read the instructions before use. Do not use with a damaged cable or plug.", "Do not dispose of with household waste."],
    checks: [
      { id: "ce", text: "CE marking affixed and EU Declaration of Conformity signed" },
      { id: "weee", text: "WEEE bin symbol + producer registration for target countries" },
    ],
  },
  home: {
    label: "Home, kitchen & decor",
    law: [
      "Items that touch food must comply with the Food Contact Materials Regulation (EC) 1935/2004 (and specific measures, e.g. (EU) 10/2011 for plastics). Label 'for food contact' or the glass-and-fork symbol.",
      "Furniture and decor fall under GPSR general safety (stability, sharp edges, flammability).",
    ],
    warnings: ["Use only as intended.", "Keep out of reach of children."],
    checks: [
      { id: "fcm", text: "If food-contact: Declaration of Compliance (FCM) from supplier on file" },
    ],
  },
};

export const LANGS = { EN: "English", DE: "German", FR: "French", ES: "Spanish", IT: "Italian", NL: "Dutch", PL: "Polish", SV: "Swedish", PT: "Portuguese", DA: "Danish" };

export const LABEL_SIZES = {
  thermal_100x150: { label: "Thermal 100 × 150 mm (4 × 6 in)", w: 100, h: 150 },
  a4_63x38: { label: "A4 63.5 × 38.1 mm, 21-up (ID sticker)", w: 63.5, h: 38.1 },
  thermal_57x32: { label: "Thermal 57 × 32 mm (ID sticker)", w: 57, h: 32 },
};

const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const cleanMulti = (s) => (Array.isArray(s) ? s : String(s ?? "").split(/\r?\n/)).map(clean).filter(Boolean);

/** Normalise raw form / CSV input into a product record. */
export function normalise(input = {}) {
  const cat = CATEGORIES[input.category] ? input.category : "general";
  return {
    productName: clean(input.productName),
    category: cat,
    materials: clean(input.materials),
    origin: clean(input.origin),
    identifier: clean(input.identifier),
    mfrName: clean(input.mfrName),
    mfrAddress: clean(input.mfrAddress),
    mfrCountry: clean(input.mfrCountry || input.origin),
    mfrEmail: clean(input.mfrEmail),
    rpName: clean(input.rpName),
    rpAddress: clean(input.rpAddress),
    rpEmail: clean(input.rpEmail),
    warnings: cleanMulti(input.warnings),
    languages: Array.isArray(input.languages) ? input.languages : clean(input.languages).split(/[,;\s]+/).filter(Boolean),
    hasPhoto: !!input.hasPhoto,
    hasTechFile: !!input.hasTechFile,
    extra: input.extra && typeof input.extra === "object" ? input.extra : {},
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+(\/\S*)?$/i;
export const isElectronicAddress = (s) => EMAIL_RE.test(s) || URL_RE.test(s);

/** Compliance checklist. status: pass | fail | todo | info */
export function checklist(input) {
  const p = normalise(input);
  const needsRP = !isEU(p.mfrCountry);
  const items = [];
  const add = (id, text, status, ref) => items.push({ id, text, status, ref });

  add("mfr_name", "Manufacturer name, registered trade name or trademark", p.mfrName ? "pass" : "fail", "Art. 9(6)");
  add("mfr_postal", "Manufacturer postal address", p.mfrAddress.length >= 8 ? "pass" : "fail", "Art. 9(6)");
  add("mfr_electronic", "Manufacturer electronic address (email or website)", isElectronicAddress(p.mfrEmail) ? "pass" : "fail", "Art. 9(6)");
  if (needsRP) {
    const rpOk = p.rpName && p.rpAddress.length >= 8 && isElectronicAddress(p.rpEmail);
    add("eu_rp", "EU-based responsible person (name, postal & electronic address) — required: manufacturer is outside the EU", rpOk ? "pass" : "fail", "Art. 16 · Art. 19(b)");
  } else {
    add("eu_rp", "EU responsible person — manufacturer is established in the EU, so the manufacturer can fulfil this role", "info", "Art. 16");
  }
  add("identifier", "Type, batch or serial number to identify the product", p.identifier ? "pass" : "fail", "Art. 9(5)");
  add("warnings", "Warnings / safety information for the product", p.warnings.length ? "pass" : "fail", "Art. 9(7) · Art. 19(d)");
  const langOk = p.languages.length > 0;
  add("language", langOk ? `Safety info language(s): ${p.languages.join(", ")} — must match each Member State you sell to` : "Choose the language(s) of the Member States you sell to", langOk ? "pass" : "todo", "Art. 9(7)");
  add("photo", "Listing shows a product picture and type/identifier", p.hasPhoto ? "pass" : "todo", "Art. 19(c)");
  add("techfile", "Technical documentation incl. internal risk analysis (keep 10 years)", p.hasTechFile ? "pass" : "todo", "Art. 9(2)–(3)");
  for (const c of CATEGORIES[p.category].checks) {
    add(`cat_${c.id}`, c.text, p.extra[c.id] ? "pass" : "todo", CATEGORIES[p.category].label);
  }
  const required = items.filter((i) => i.status !== "info");
  const passed = required.filter((i) => i.status === "pass").length;
  const blocking = items.filter((i) => i.status === "fail").length;
  return { items, passed, total: required.length, blocking, ready: blocking === 0, needsRP };
}

/** Structured label content (what goes on the product / packaging). */
export function labelModel(input) {
  const p = normalise(input);
  const needsRP = !isEU(p.mfrCountry);
  return {
    title: p.productName || "Product name",
    identifier: p.identifier || "—",
    materials: p.materials,
    origin: p.origin ? `Made in ${p.origin}` : "",
    manufacturer: [p.mfrName, p.mfrAddress, p.mfrEmail].filter(Boolean),
    responsible: needsRP ? [p.rpName, p.rpAddress, p.rpEmail].filter(Boolean) : [],
    showRP: needsRP,
    warnings: p.warnings,
    languages: p.languages,
    categoryLabel: CATEGORIES[p.category].label,
  };
}

/** Plain-text block for marketplace listings (Art. 19 information for distance sales). */
export function listingText(input) {
  const p = normalise(input);
  const m = labelModel(p);
  const lines = ["PRODUCT SAFETY INFORMATION (EU GPSR)"];
  lines.push(`Product: ${m.title}${p.identifier ? ` — Type/Batch: ${p.identifier}` : ""}`);
  if (m.manufacturer.length) lines.push(`Manufacturer: ${m.manufacturer.join(", ")}`);
  if (m.showRP && m.responsible.length) lines.push(`EU Responsible Person: ${m.responsible.join(", ")}`);
  if (p.materials) lines.push(`Materials: ${p.materials}`);
  if (m.origin) lines.push(`Origin: ${m.origin}`);
  if (m.warnings.length) lines.push(`Warnings: ${m.warnings.join(" ")}`);
  return lines.join("\n");
}

/* Shopify metafields — header format matches Shopify's product CSV export:
 * "<Name> (product.metafields.<namespace>.<key>)". Create the definitions first
 * (Settings → Custom data → Products), then import with "Overwrite products with matching handles". */
export const SHOPIFY_FIELDS = [
  ["GPSR manufacturer name", "gpsr_manufacturer_name", "mfrName", "single_line_text_field"],
  ["GPSR manufacturer address", "gpsr_manufacturer_address", "mfrAddress", "single_line_text_field"],
  ["GPSR manufacturer email", "gpsr_manufacturer_email", "mfrEmail", "single_line_text_field"],
  ["GPSR EU responsible person", "gpsr_eu_rp_name", "rpName", "single_line_text_field"],
  ["GPSR EU RP address", "gpsr_eu_rp_address", "rpAddress", "single_line_text_field"],
  ["GPSR EU RP email", "gpsr_eu_rp_email", "rpEmail", "single_line_text_field"],
  ["GPSR product identifier", "gpsr_product_identifier", "identifier", "single_line_text_field"],
  ["GPSR materials", "gpsr_materials", "materials", "single_line_text_field"],
  ["GPSR country of origin", "gpsr_country_of_origin", "origin", "single_line_text_field"],
  ["GPSR warnings", "gpsr_warnings", "warnings", "multi_line_text_field"],
];

export const csvEscape = (v) => {
  const s = String(v ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export function shopifyCsv(records) {
  const head = ["Handle", "Title", ...SHOPIFY_FIELDS.map(([n, k]) => `${n} (product.metafields.custom.${k})`)];
  const rows = records.map((r) => {
    const p = normalise(r);
    const handle = clean(r.handle) || slugify(p.productName) || "product-handle";
    return [handle, p.productName, ...SHOPIFY_FIELDS.map(([, , f]) => (f === "warnings" ? p.warnings.join("\n") : p[f]))];
  });
  return [head, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n") + "\r\n";
}

export const slugify = (s) => clean(s).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

/** Minimal RFC 4180 CSV parser (quotes, escaped quotes, CRLF, newlines in fields). */
export function parseCsv(text) {
  const rows = []; let row = []; let f = ""; let q = false;
  const s = String(text).replace(/^﻿/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && s[i + 1] === "\n") i++;
      row.push(f); f = ""; if (row.some((x) => x !== "")) rows.push(row); row = [];
    } else f += c;
  }
  row.push(f); if (row.some((x) => x !== "")) rows.push(row);
  return rows;
}

/** Map a Shopify GPSR CSV (as produced by shopifyCsv) back to product records. */
export function recordsFromShopifyCsv(text) {
  const [head, ...rows] = parseCsv(text);
  if (!head) return [];
  const idx = {};
  head.forEach((h, i) => {
    const m = /product\.metafields\.custom\.([a-z0-9_]+)/i.exec(h);
    if (m) { const f = SHOPIFY_FIELDS.find(([, k]) => k === m[1]); if (f) idx[f[2]] = i; }
    if (/^handle$/i.test(h.trim())) idx.handle = i;
    if (/^title$/i.test(h.trim())) idx.productName = i;
    if (/^category$/i.test(h.trim())) idx.category = i;
  });
  return rows.map((r) => {
    const o = {};
    for (const [k, i] of Object.entries(idx)) o[k] = r[i] ?? "";
    if (!o.productName) o.productName = (o.handle || "").replace(/-/g, " ");
    o.mfrCountry = o.mfrCountry || guessCountry(o.mfrAddress);
    return o;
  });
}

/** Best-effort: last comma-separated token of an address that matches a known country. */
export function guessCountry(address) {
  const parts = String(address || "").split(",").map((x) => x.trim()).reverse();
  for (const p of parts) { const hit = COUNTRIES.find((c) => c.toLowerCase() === p.toLowerCase()); if (hit) return hit; }
  return "";
}

export const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Label HTML (used for live preview and printing). */
export function labelHtml(input, sizeKey = "thermal_100x150") {
  const m = labelModel(input);
  const size = LABEL_SIZES[sizeKey] || LABEL_SIZES.thermal_100x150;
  const compact = size.h < 60;
  const e = escapeHtml;
  const block = (title, lines) => lines.length ? `<div class="lbl-sec"><div class="lbl-k">${e(title)}</div>${lines.map((l) => `<div>${e(l)}</div>`).join("")}</div>` : "";
  const head = `<div class="lbl-head"><span class="lbl-seal">EU</span><div><div class="lbl-title">${e(m.title)}</div><div class="lbl-id">${e(m.identifier)}</div></div></div>`;
  if (compact) {
    // Small products: GPSR Art. 9(5)-(6) allow details on packaging or an accompanying document.
    // The compact size is an ID sticker: identifier + who to contact, full details on the insert.
    const p = normalise(input);
    const line = (k, parts) => parts.filter(Boolean).length ? `<div class="lbl-line"><b>${k}</b> ${e(parts.filter(Boolean).join(" · "))}</div>` : "";
    return `<div class="gpsr-label is-compact" style="--lw:${size.w}mm;--lh:${size.h}mm">${head}
  ${line("Mfr", [p.mfrName, p.mfrEmail])}
  ${m.showRP ? line("EU RP", [p.rpName || "required", p.rpEmail]) : ""}
  ${line("", [m.origin])}
  <div class="lbl-warn">Full address &amp; safety information on packaging / insert.</div>
</div>`;
  }
  return `<div class="gpsr-label" style="--lw:${size.w}mm;--lh:${size.h}mm">${head}
  ${block("Manufacturer", m.manufacturer)}
  ${m.showRP ? block("EU Responsible Person", m.responsible.length ? m.responsible : ["Required — add EU address"]) : ""}
  ${block("Details", [m.materials && `Materials: ${m.materials}`, m.origin].filter(Boolean))}
  ${block("Safety information", m.warnings)}
</div>`;
}
