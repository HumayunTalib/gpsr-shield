import { CATEGORIES, COUNTRIES, LANGS, LABEL_SIZES, checklist, labelHtml, listingText, shopifyCsv, escapeHtml } from "./gpsr-core.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const form = $("#gpsr-form");
const STORE_KEY = "gpsr-shield-v1";

/* ---------- populate selects ---------- */
const catSel = $("#category");
catSel.innerHTML = Object.entries(CATEGORIES).map(([k, c]) => `<option value="${k}">${escapeHtml(c.label)}</option>`).join("");
const countryOpts = `<option value="">Select…</option>` + COUNTRIES.map((c) => `<option>${escapeHtml(c)}</option>`).join("");
$("#origin").innerHTML = countryOpts;
$("#mfrCountry").innerHTML = countryOpts;
$("#langs").innerHTML = Object.entries(LANGS).map(([k, v]) => `<label title="${v}"><input type="checkbox" name="languages" value="${k}"><span>${k}</span></label>`).join("");
const sizeSel = $("#size");
sizeSel.innerHTML = Object.entries(LABEL_SIZES).map(([k, s]) => `<option value="${k}">${escapeHtml(s.label)}</option>`).join("");

/* ---------- state ---------- */
function read() {
  const fd = new FormData(form);
  const extra = {};
  $$("#cat-checks input").forEach((i) => (extra[i.value] = i.checked));
  return {
    productName: fd.get("productName"), category: fd.get("category"), materials: fd.get("materials"),
    origin: fd.get("origin"), identifier: fd.get("identifier"),
    mfrName: fd.get("mfrName"), mfrAddress: fd.get("mfrAddress"), mfrCountry: fd.get("mfrCountry"), mfrEmail: fd.get("mfrEmail"),
    rpName: fd.get("rpName"), rpAddress: fd.get("rpAddress"), rpEmail: fd.get("rpEmail"),
    warnings: fd.get("warnings"), languages: fd.getAll("languages"),
    hasPhoto: fd.get("hasPhoto") === "on", hasTechFile: fd.get("hasTechFile") === "on", extra,
  };
}
function write(d) {
  for (const [k, v] of Object.entries(d)) {
    const el = form.elements[k];
    if (!el || k === "languages" || k === "extra") continue;
    if (el.type === "checkbox") el.checked = !!v; else el.value = v ?? "";
  }
  $$("#langs input").forEach((i) => (i.checked = (d.languages || []).includes(i.value)));
}
const save = (d) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch {} };
const load = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY) || "null"); } catch { return null; } };

/* ---------- category notes + checks ---------- */
let lastCat = null;
function renderCategory(cat, keepExtra = {}) {
  const c = CATEGORIES[cat] || CATEGORIES.general;
  $("#cat-notes").innerHTML = `<h3>${escapeHtml(c.label)} — rules that apply alongside GPSR</h3><ul>${c.law.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>
  <p style="margin:8px 0 0"><button type="button" class="btn-link" id="use-warnings">Insert starter warnings for this category</button></p>`;
  $("#cat-checks").innerHTML = c.checks.map((k) => `<label class="cb"><input type="checkbox" value="${k.id}" ${keepExtra[k.id] ? "checked" : ""}><span>${escapeHtml(k.text)}</span></label>`).join("");
  $("#use-warnings").onclick = () => { form.elements.warnings.value = c.warnings.join("\n"); update(); };
  lastCat = cat;
}

/* ---------- render ---------- */
function update() {
  const d = read();
  if (d.category !== lastCat) { renderCategory(d.category); d.extra = {}; }
  const cl = checklist(d);
  $("#label-stage").innerHTML = labelHtml(d, sizeSel.value);
  $("#rp-box").hidden = !cl.needsRP;
  $("#rp-note").textContent = cl.needsRP ? "Manufacturer is outside the EU — an EU-based responsible person is required (Art. 16)." : "";
  $("#meter").style.width = `${Math.round((cl.passed / cl.total) * 100)}%`;
  $("#score").textContent = `${cl.passed}/${cl.total}`;
  const b = $("#ready");
  b.className = `badge ${cl.ready ? "ok" : "no"}`;
  b.textContent = cl.ready ? "LABEL DATA COMPLETE" : `${cl.blocking} MISSING`;
  const icon = { pass: "✓", fail: "!", todo: "·", info: "i" };
  $("#cl").innerHTML = cl.items.map((i) => `<li><span class="st ${i.status}" aria-label="${i.status}">${icon[i.status]}</span><span>${escapeHtml(i.text)}</span><span class="ref">${escapeHtml(i.ref)}</span></li>`).join("");
  $("#listing").textContent = listingText(d);
  save(d);
}

/* ---------- outputs ---------- */
function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const toast = (m) => { const t = $("#toast"); t.textContent = m; setTimeout(() => (t.textContent = ""), 2600); };

$("#btn-print").onclick = () => {
  const d = read(); const key = sizeSel.value; const s = LABEL_SIZES[key];
  const root = $("#print-root");
  const page = $("#page-style");
  if (key === "a4_63x38") {
    page.textContent = "@page{size:A4;margin:0}";
    root.innerHTML = `<div class="sheet-a4">${Array.from({ length: 21 }, () => labelHtml(d, key)).join("")}</div>`;
  } else {
    page.textContent = `@page{size:${s.w}mm ${s.h}mm;margin:0}`;
    root.innerHTML = `<div class="single">${labelHtml(d, key)}</div>`;
  }
  window.print();
};
$("#btn-csv").onclick = () => { download("gpsr-shopify-metafields.csv", shopifyCsv([read()]), "text/csv;charset=utf-8"); toast("Shopify CSV downloaded — create the metafield definitions first (see FAQ)."); };
$("#btn-copy").onclick = async () => {
  try { await navigator.clipboard.writeText(listingText(read())); toast("Listing text copied."); }
  catch { toast("Copy blocked by browser — select the text and copy manually."); }
};
$("#btn-reset").onclick = () => { form.reset(); try { localStorage.removeItem(STORE_KEY); } catch {} applyDefaults(); update(); };

/* ---------- boot ---------- */
function applyDefaults() {
  const pre = document.body.dataset.category;
  const q = new URLSearchParams(location.search).get("category");
  const cat = CATEGORIES[q] ? q : CATEGORIES[pre] ? pre : "general";
  form.elements.category.value = cat;
  renderCategory(cat);
}
const saved = load();
applyDefaults();
if (saved && (!document.body.dataset.category || saved.category === document.body.dataset.category)) {
  write(saved); renderCategory(saved.category, saved.extra || {});
}
form.addEventListener("input", update);
form.addEventListener("change", update);
sizeSel.addEventListener("change", update);
update();
