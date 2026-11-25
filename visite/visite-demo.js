window.GTP_ICONES = (function () {   const IC = {
    i: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>', ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', dn: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="8" cy="8" r="1.6"/>', mail: '<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/>',
    cfg: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    ch: '<path d="M9 6l6 6-6 6"/>', back: '<path d="M15 6l-6 6 6 6"/>', search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    moon: '<path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/>', sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    star: '<path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"/>', users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 4.5a3 3 0 010 6M21 20c0-3-1.8-5.2-4.5-5.8"/>',
    calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2"/>', list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>', play: '<path d="M7 5l12 7-12 7z"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 19V5"/>', hand: '<path d="M8 13V5.5a1.5 1.5 0 013 0V12M11 11V4.5a1.5 1.5 0 013 0V11M14 11V6a1.5 1.5 0 013 0v7c0 4-2.5 7-6 7s-5-2-6.5-4.5L3 12.5a1.5 1.5 0 012.4-1.7L8 13"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', redo: '<path d="M20 12a8 8 0 11-2.4-5.7M20 4v5h-5"/>', eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  }; return IC; })();
(function () {
  "use strict";
  const D = window.GTP_DEMO;
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);
  const U = (k, v) => { let s = window.OB_TX?.[lang]?.ui?.[k] ?? window.OB_TX?.fr?.ui?.[k] ?? k; if (v) for (const [a, b] of Object.entries(v)) s = s.split(`{${a}}`).join(b); return s; };
  const IC = window.GTP_ICONES || {};
  const ic = (k, c = "i") => `<svg class="${c}" viewBox="0 0 24 24">${IC[k] || ""}</svg>`;
  const ONGLET = { actions: "conseils", offres: "tous", regles: "regles", journal: "journal" };
  const ligne = (cle) => (rp.d?.rows || []).find((r) => `${r.marketplace}|${r.sku}` === cle);
  const inconnu = () => (window.__DEMO_CTL ? "⟦inconnu⟧" : U("inconnu"));
  const argent = (v, dev) => (typeof v === "number" ? fmtUnitPriceNative(v, dev || "EUR") : inconnu());
  function val(t, a, b) {
    if (t === "c") {
      const rows = (rp.d?.rows || []).filter((r) => rpPorteLigne(r) === "repricer"), I = rpIndicDe(rows, rpFileDe(rows));
      const suivies = rows.filter((r) => I.de[`${r.marketplace}|${r.sku}`]);
      if (a === "lignes") return String(rows.length);
      if (a === "offres") return String(I.offres);
      if (a === "produits") return String(new Set(rows.map((r) => r.asin)).size);
      if (a === "marches") return String(new Set(rows.map((r) => r.marketplace)).size);
      if (["tenue", "perdue", "aucune", "inconnue"].includes(a)) return String(suivies.filter((r) => rpVedEtat(r) === a).length);
      return inconnu();
    }
    if (t === "r") { const r = (rp.d?.bibliotheque || []).find((x) => x.id === a); return r ? r[b || "nom"] : inconnu(); }
    const r = ligne(a); if (!r) return inconnu();
    const dv = r.devise, o = r.ombre || {};
    const det = D.reponses[`/api/repricer/detail?marketplace=${encodeURIComponent(r.marketplace)}&sku=${encodeURIComponent(r.sku)}`]?.body;
    const vdr = D.reponses[`/api/repricer/vendeurs?marketplace=${encodeURIComponent(r.marketplace)}&sku=${encodeURIComponent(r.sku)}`]?.body;
    switch (b) {
      case "actuel": return argent(r.prixActuel, dv);
      case "propose": return argent(r.conseil?.prix ?? o.prixPropose, dv);
      case "plancher": return argent(o.plancher, dv);
      case "plafond": return argent(o.plafond, dv);
      case "var": { const p = r.conseil?.prix ?? o.prixPropose; return typeof p === "number" && r.prixActuel ? fmtPct(p / r.prixActuel - 1) : inconnu(); }
      case "vedPrix": return argent(o.vedette?.prixVedette, dv);
      case "configure": return argent(r.prixConfigure?.prix, dv);
      case "stock": return r.stockVendable != null ? String(r.stockVendable) : inconnu();
      case "ctbA": return argent(det?.avant?.beneficeAvantPub, dv);
      case "ctbP": return argent(o.margeProposee, dv);
      case "vj": return det?.ventesParJour?.valeur != null ? String(det.ventesParJour.valeur).replace(".", lang === "en" || lang === "zh" ? "." : ",") : inconnu();
      case "vedL": return "●";
      case "nv": return vdr?.vendeurs ? String(vdr.vendeurs.length) : inconnu();
      case "regle": return r.regle?.nom ?? inconnu();
      default: return inconnu();
    }
  }
  const remplir = (s) => String(s).replace(/\{([ocr]):([^:}]+(?:\|[^:}]+)?)(?::([^}]+))?\}/g, (_, t, a, b) => esc(val(t, a, b)));
  const S = {
    get lang() { return lang; }, set lang(v) { window.GTP.langue(v); },
    get theme() { return document.documentElement.dataset.theme; }, set theme(v) { window.GTP.theme(v); },
    get onglet() { return Object.keys(ONGLET).find((k) => ONGLET[k] === rp.tab) || rp.tab; }, get detail() { return rp.sel ?? null; },
  };
  function set(e) {
    tel();
    if (e.onglet && ONGLET[e.onglet]) rp.tab = ONGLET[e.onglet];
    rp.sel = e.detail || undefined;
    rpPaint();
  }
  function tel() { document.body.classList.toggle("phone", innerWidth < 760); }
  const reset = () => { rp.tab = "conseils"; rp.sel = undefined; rpPaint(); };
  window.APP = { S, U, esc, ic, remplir, set, reset, rendre: () => window.GTP.rafraichir() };
  const peindre = rpPaint;
  let selAvant = null;
  window.rpPaint = rpPaint = function () {
    const r = peindre.apply(this, arguments);
    if (rp.sel && rp.sel !== selAvant) window.dispatchEvent(new CustomEvent("app:geste", { detail: "open:" + rp.sel }));
    selAvant = rp.sel ?? null;
    window.dispatchEvent(new Event("app:rendu"));
    return r;
  };
  addEventListener("resize", tel); tel();
})();
(function () {
  const A = window.APP, S = A.S;
  const REPAS = "FR|LUNCH-1L-BK", GOURDE = "FR|GOURDE-750-NR";
  const ACT = { onglet: "actions", detail: null, recap: false, voirIgnores: false, niveau: "propose", regle: null };
  const OFF = { onglet: "offres", detail: null, recap: false, q: "", mp: "tous", sit: "tous", niveau: "propose" };
  const det = (k, base = ACT) => ({ ...base, detail: k });
  const ETAPES = [
    { id: "bienvenue", ch: "ess", etat: { ...ACT }, large: true, special: "debut" },
    { id: "onglets", ch: "ess", etat: { ...ACT }, sel: ["#t1Repricer .rp-tabs"] },
    { id: "niveau", ch: "ess", etat: { ...ACT }, sel: ["#t1Repricer .rp-reniv"] },
    { id: "observer", ch: "ess", etat: { ...ACT }, sel: ["#t1Repricer .rp-ind"] },
    { id: "comprendre", ch: "ess", etat: det(GOURDE), sel: ["#t1Repricer .rp-rf"] },
    { id: "regler", ch: "ess", etat: { ...ACT, onglet: "regles" }, sel: ['#t1Repricer [data-rb-id="r0000000002"]'] },
    { id: "controler", ch: "ess", etat: { ...ACT, onglet: "journal" }, sel: ["#t1Repricer .rp-jt"] },
    { id: "suite", ch: "ess", etat: { ...ACT }, large: true, special: "suite" },
    { id: "a_ligne", ch: "act", etat: { ...ACT }, sel: [`#t1Repricer [data-rp-fk="${GOURDE}"]`] },
    { id: "a_essai", ch: "act", etat: { ...ACT }, sel: [`#t1Repricer [data-rp-fk="${GOURDE}"]`], attendre: "open:" + GOURDE },
    { id: "a_sens", ch: "act", etat: det(GOURDE), sel: ["#t1Repricer .rp-rf"] },
    { id: "a_plancher", ch: "act", etat: det("DE|STAND-ALU-SV"), sel: ["#t1Repricer .rp-rf"] },
    { id: "a_plafond", ch: "act", etat: det("IT|PACK-CUBE-6"), sel: ["#t1Repricer .rp-rf"] },
    { id: "a_debloquer", ch: "act", etat: { ...ACT }, sel: ["#t1Repricer .rp-sec-warn"] },
    { id: "a_sans", ch: "act", etat: { ...ACT }, sel: ["#t1Repricer .rp-sec-neu"] },
    { id: "o_liste", ch: "off", etat: { ...OFF }, sel: ["#t1Repricer .rp-offres"] },
    { id: "o_marches", ch: "off", etat: { ...OFF }, sel: ['#t1Repricer [data-rp-k="FR|GOURDE-750-NR"]', '#t1Repricer [data-rp-k="DE|GOURDE-750-NR"]', '#t1Repricer [data-rp-k="ES|GOURDE-750-NR"]'] },
    { id: "o_sku", ch: "off", etat: { ...OFF }, sel: ['#t1Repricer [data-rp-k="FR|LUNCH-1L-BK"]', '#t1Repricer [data-rp-k="FR|LUNCH-1L-BK-UPC"]'] },
    { id: "o_calcul", ch: "off", etat: det("DE|STAND-ALU-SV", OFF), sel: ["#t1Repricer .rp-rf, #t1Repricer .rp-insp"] },
    { id: "o_vendeurs", ch: "off", etat: det("FR|USBC-2M-BR", OFF), sel: ["#t1Repricer .rp-rf, #t1Repricer .rp-insp"] },
    { id: "r_biblio", ch: "reg", etat: { ...ACT, onglet: "regles" }, sel: ["#t1Repricer .rb-card"] },
    { id: "o_affecter", ch: "reg", etat: { ...ACT, onglet: "regles" }, sel: ["#t1Repricer [data-rb-aff]"], attendre: "affecter:FR|DESKMAT-XXL" },
    { id: "r_marge", ch: "reg", etat: { ...ACT, onglet: "regles" }, sel: ['#t1Repricer [data-rb-id="r0000000001"]'] },
    { id: "r_bbe", ch: "reg", etat: { ...ACT, onglet: "regles" }, sel: ['#t1Repricer [data-rb-id="r0000000002"]'] },
    { id: "r_q4", ch: "reg", etat: { ...ACT, onglet: "regles" }, sel: ['#t1Repricer [data-rb-id="r0000000003"]'] },
    { id: "r_dest", ch: "reg", etat: { ...ACT, onglet: "regles" }, sel: ['#t1Repricer [data-rb-id="r0000000004"]'] },
    { id: "j_vue", ch: "jou", etat: { ...ACT, onglet: "journal" }, sel: ["#t1Repricer .rp-jt"] },
    { id: "s_fiche", ch: "sim", etat: det(GOURDE), sel: ["#t1Repricer .rp-rf"] },
    { id: "fin", ch: "sim", etat: { ...ACT }, large: true, special: "fin" },
  ];
  const CHAP = ["ess", "act", "off", "reg", "jou", "sim"];
  const TX = () => window.OB_TX[S.lang] || window.OB_TX.fr, FR = () => window.OB_TX.fr;
  const tx = (id) => ({ ...FR().v[id], ...(TX().v?.[id] || {}) });
  const chT = (c) => (TX().ch?.[c] || FR().ch[c]);
  const ui = (k, v) => A.U(k, v);
  const lire = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const ecrire = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {   } };
  let n = -1, card, spot, veil, block, menuEl, fait = false;
  const vus = new Set(lire("gtp.ob.chap", []));
  const para = (s) => A.remplir(s).replace(/\[k\[(.+?)\]\]/g, "<b class='k'>$1</b>").replace(/\[w\[(.+?)\]\]/g, "<b class='w'>$1</b>").replace(/\[i\[(.+?)\]\]/g, "<b class='in'>$1</b>").replace(/\[\[(.+?)\]\]/g, "<b>$1</b>");
  const enListe = (h) => { const re = /<b>[^<]{1,48}<\/b>\s?[:：]/g, idx = [...h.matchAll(re)].map((m) => m.index);
    if (idx.length < 2) return `<p>${h}</p>`;
    const tete = h.slice(0, idx[0]).trim(), items = idx.map((d, j) => h.slice(d, idx[j + 1] ?? h.length).trim());
    return (tete ? `<p>${tete}</p>` : "") + `<ul class="vs-liste">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`; };
  const nb = (h) => (S.lang === "fr" ? h.replace(/ ([:;?!»%])/g, " $1").replace(/« /g, "« ") : h);
  function aller(i) {
    n = Math.max(0, Math.min(ETAPES.length - 1, i)); fait = false;
    const e = ETAPES[n];
    if (e.etat) { if (e.etat.onglet !== S.onglet || e.etat.detail !== S.detail) S._scrollDet = 0; A.set({ ...e.etat }); }
    vus.add(e.ch); ecrire("gtp.ob.chap", [...vus]); ecrire("gtp.ob.pos", n);
    try { history.replaceState(null, "", `#v=${e.id}`); } catch {   }
    dessiner();
  }
  function quitter() { const M = document.getElementById("main"); if (M) M.style.paddingBottom = ""; [card, spot, veil, block, menuEl].forEach((x) => x?.remove()); card = spot = veil = block = menuEl = null; n = -1; ecrire("gtp.ob.vue", true); try { history.replaceState(null, "", location.pathname + location.search); } catch {} }
  function dansChap(e) { const l = ETAPES.filter((x) => x.ch === e.ch); return [l.indexOf(e) + 1, l.length]; }
  const debutChap = (c) => ETAPES.findIndex((x) => x.ch === c);
  function dessiner() {
    const e = ETAPES[n], t = tx(e.id), [k, tot] = dansChap(e), last = n === ETAPES.length - 1;
    const finChap = k === tot, prochain = finChap && !last ? ETAPES[n + 1].ch : null;
    card?.remove(); card = document.createElement("div"); card.className = "vs-card" + (e.large ? " large" : ""); card.setAttribute("role", "dialog"); card.setAttribute("aria-live", "polite");
    const rows = [["eye", "voir"], ["hand", "cliquer"], ["cfg", "modifier"], ["star", "pourquoi"], ["flag", "consq"]].filter(([, f]) => t[f]);
    let corps = ((document.body.classList.contains("phone") && t.xTel) || t.x || "").split("||").map((p) => enListe(nb(para(p)))).join("");
    if (rows.length) corps += `<div class="vs-why">${rows.map(([i, f]) => `<div>${A.ic(i)}<span><b>${A.esc(ui("w_" + f))}</b> ${nb(para(t[f]))}</span></div>`).join("")}</div>`;
    { const df = window.OB_DIFF?.[S.lang]?.[e.id] ?? null, du = window.OB_DIFF_UI?.[S.lang] || window.OB_DIFF_UI?.fr || {}; if (df) corps += `<div class="vs-diff"><div class="vs-diff-q"><svg class="vs-diff-st" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"/></svg><b>${A.esc(df.q)}</b></div><div class="vs-diff-o"><span>${A.esc(du.oui)} :</span> <b>${df.oui.map(A.esc).join(" · ")}</b></div><div class="vs-diff-n"><span>${A.esc(du.non)} :</span> ${df.non.map(A.esc).join(" · ")}</div><small>${A.esc(du.releve)}</small></div>`; }
    if (e.attendre) corps += `<div class="vs-try${fait ? " fait" : ""}">${A.ic(fait ? "ok" : "hand")}<span>${nb(para(fait ? ui("essaiFait") : t.essai || ""))}</span></div>`;
    if (e.special === "debut") corps = `<div class="vs-pref" style="margin:0 0 14px"><div><span>${A.esc(ui("langue"))}</span><div class="seg">${["fr", "en", "es", "de", "it", "zh"].map((l) => `<button data-lang="${l}" class="${S.lang === l ? "on" : ""}">${l.toUpperCase()}</button>`).join("")}</div></div>
      <div><span>${A.esc(ui("theme"))}</span><div class="seg"><button data-th="light" class="${S.theme === "light" ? "on" : ""}">${A.ic("sun")}${A.esc(ui("clair"))}</button><button data-th="dark" class="${S.theme === "dark" ? "on" : ""}">${A.ic("moon")}${A.esc(ui("sombre"))}</button></div></div></div>` + corps;
    if (e.special === "debut") corps += `<div class="vs-start"><button data-v="rapide">${A.ic("play")}<span><b>${A.esc(ui("vRapide"))}</b><small>${A.esc(ui("vRapideD"))}</small></span></button>
      <button data-v="menu">${A.ic("list")}<span><b>${A.esc(ui("vDetail"))}</b><small>${A.esc(ui("vDetailD"))}</small></span></button>
      <button data-v="seul">${A.ic("hand")}<span><b>${A.esc(ui("vSeul"))}</b><small>${A.esc(ui("vSeulD"))}</small></span></button></div>`;
    if (e.special === "suite" || e.special === "fin") corps += `<div class="vs-start">${CHAP.slice(1).map((c) => `<button data-chap="${c}">${A.ic(vus.has(c) ? "ok" : "ch")}<span><b>${A.esc(chT(c).t)}</b><small>${A.esc(chT(c).d)}</small></span></button>`).join("")}</div>`;
    const seg = `<div class="vs-seg">${Array.from({ length: tot }, (_, j) => `<i class="${j + 1 === k ? "on" : j + 1 < k ? "fait" : ""}"></i>`).join("")}</div>`;
    const pied = e.special === "debut" ? "" : `<div class="vs-f">${!finChap ? `<button class="sk" data-v="passer">${A.esc(ui("passerChap"))}</button>` : `<span style="margin-right:auto"></span>`}
      ${n > 0 ? `<button class="btn" data-v="prec">${A.esc(ui("precedent"))}</button>` : ""}
      <button class="btn pri" data-v="suiv">${A.esc(last ? ui("terminer") : finChap && e.special !== "suite" ? ui("chapSuivant", { c: chT(prochain).t }) : e.special === "suite" ? ui("continuer") : e.attendre && !fait ? ui("suivantSans") : ui("suivant"))}${A.ic("ch")}</button></div>`;
    card.innerHTML = `<div class="vs-h"><div class="tt"><div class="ch">${A.esc(chT(e.ch).t)}</div><h3>${nb(A.esc(A.remplir(t.t || "")))}</h3></div><span class="nb">${k} / ${tot}</span>
      <button class="mn" data-v="menu" title="${A.esc(ui("chapitres"))}" aria-label="${A.esc(ui("chapitres"))}">${A.ic("menu")}</button><button class="mn" data-v="quitter" title="${A.esc(ui("quitter"))}" aria-label="${A.esc(ui("quitter"))}">${A.ic("x")}</button></div>
      <div class="vs-b">${corps}${e.special ? "" : seg}</div>${pied}`;
    document.body.appendChild(card);
    card.addEventListener("click", clic);
    placer();
  }
  function clic(ev) {
    const p = ev.target.closest("[data-lang],[data-th]");
    if (p) { ev.stopPropagation(); if (p.dataset.lang) { S.lang = p.dataset.lang; try { localStorage.setItem("gtp.ob.lang", S.lang); } catch {} } else { S.theme = p.dataset.th; try { localStorage.setItem("gtp.ob.theme", S.theme); } catch {} } A.rendre(); dessiner(); return; }
    const b = ev.target.closest("[data-v],[data-chap]"); if (!b) return; ev.stopPropagation();
    const v = b.dataset.v, c = b.dataset.chap;
    if (c) { menuEl?.remove(); menuEl = null; aller(debutChap(c)); return; }
    if (v === "suiv") { if (n === ETAPES.length - 1) { A.reset(); A.rendre(); quitter(); return; } if (ETAPES[n].special === "suite") { aller(debutChap("act")); return; } aller(n + 1); }
    else if (v === "prec") aller(n - 1);
    else if (v === "passer") { const c2 = CHAP[CHAP.indexOf(ETAPES[n].ch) + 1]; aller(c2 ? debutChap(c2) : ETAPES.length - 1); }
    else if (v === "rapide") aller(1);
    else if (v === "menu") menu(b);
    else if (v === "seul" || v === "quitter") { A.reset(); A.rendre(); quitter(); }
    else if (v === "recommencer") { menuEl?.remove(); menuEl = null; vus.clear(); A.reset(); aller(0); }
  }
  function menu(ancre) {
    if (menuEl) { menuEl.remove(); menuEl = null; return; }
    menuEl = document.createElement("div"); menuEl.className = "vs-menu";
    const cur = n >= 0 ? ETAPES[n].ch : null;
    menuEl.innerHTML = CHAP.map((c, i) => `<button class="mi${c === cur ? " on" : ""}" data-chap="${c}"><span class="k">${vus.has(c) ? "✓" : i + 1}</span><span><b>${A.esc(chT(c).t)}</b><small>${A.esc(chT(c).d)} · ${ETAPES.filter((x) => x.ch === c).length} ${A.esc(ui("etapes"))}</small></span></button>`).join("")
      + `<hr><button class="mi" data-v="recommencer"><span class="k">${A.ic("redo")}</span><span><b>${A.esc(ui("recommencer"))}</b></span></button>`
      + (n >= 0 ? `<button class="mi" data-v="quitter"><span class="k">${A.ic("x")}</span><span><b>${A.esc(ui("quitter"))}</b><small>${A.esc(ui("quitterD"))}</small></span></button>` : "");
    document.body.appendChild(menuEl);
    menuEl.addEventListener("click", clic);
    if (!document.body.classList.contains("phone")) { const r = (ancre && ancre.getBoundingClientRect()) || { right: innerWidth - 20, bottom: 60 }; menuEl.style.left = Math.max(8, Math.min(innerWidth - 348, r.right - 340)) + "px"; menuEl.style.top = Math.min(innerHeight - 100, r.bottom + 8) + "px"; } { const h = menuEl.offsetHeight, t0 = parseFloat(menuEl.style.top) || 0, r0 = (ancre && ancre.getBoundingClientRect()) || { top: innerHeight }; if (t0 + h > innerHeight - 8) menuEl.style.top = Math.max(8, Math.min(r0.top - h - 8, innerHeight - h - 8)) + "px"; }
  }
  const union = (els) => { const r = els.map((x) => x.getBoundingClientRect()).filter((b) => b.width > 0 && b.height > 0); if (!r.length) return null;
    const l = Math.min(...r.map((b) => b.left)), t = Math.min(...r.map((b) => b.top)), rr = Math.max(...r.map((b) => b.right)), bb = Math.max(...r.map((b) => b.bottom)); return { left: l, top: t, right: rr, bottom: bb, width: rr - l, height: bb - t }; };
  function placer() {
    if (n < 0 || !card) return;
    const e = ETAPES[n], tel = document.body.classList.contains("phone");
    let sels = [...(e.sel || [])], els = sels.flatMap((q) => [...document.querySelectorAll(q)]);
    while (tel && sels.length > 1 && (union(els)?.height || 0) > innerHeight - card.offsetHeight - 90) { sels.pop(); els = sels.flatMap((q) => [...document.querySelectorAll(q)]); }
    const panneau = document.getElementById("detail"), dansPanneau = els.length && panneau && els.every((x) => panneau.contains(x));
    if (els.length && union(els)) {
      const haut = tel ? 64 : 90, basLibre = tel ? innerHeight - card.offsetHeight - 24 : innerHeight - 24;
      if (dansPanneau) { const r0 = union(els), pr = panneau.getBoundingClientRect(); const d = r0.top - pr.top - (tel ? 56 : 24); if (r0.bottom > basLibre || r0.top < pr.top + 10) panneau.scrollTop += d; }
      else { const r0 = union(els), large = !tel && r0.width > innerWidth * 0.55;
        const dy = r0.top - haut - (tel || large ? 0 : Math.max(0, (basLibre - haut - r0.height) / 3));
        if (large || r0.top < haut || r0.bottom > basLibre) {
          const manque = scrollY + dy + innerHeight - document.documentElement.scrollHeight;
          const M = document.getElementById("main"); if (manque > 0 && M) M.style.paddingBottom = 80 + manque + "px";
          window.scrollBy(0, dy); } }
    }
    const r = els.length ? union(els) : null;
    veil?.remove(); spot?.remove(); block?.remove(); veil = spot = block = null;
    if (!e.attendre) { block = document.createElement("div"); block.className = "vs-block"; document.body.appendChild(block); }
    if (!r) { veil = document.createElement("div"); veil.className = "vs-veil"; document.body.appendChild(veil); }
    else { const m = 6; spot = document.createElement("div"); spot.className = "vs-spot";
      Object.assign(spot.style, { left: r.left - m + "px", top: r.top - m + "px", width: r.width + 2 * m + "px", height: r.height + 2 * m + "px" }); document.body.appendChild(spot); }
    if (tel) return;
    const W = innerWidth, H = innerHeight, cw = card.offsetWidth, ch = card.offsetHeight, g = 18, cl = (v, a, b) => Math.max(a, Math.min(v, b));
    let pos = [cl((W - cw) / 2 + 118, 16, W - cw - 16), cl((H - ch) / 2, 16, H - ch - 16)];
    if (r) {
      const y0 = cl(r.top, 70, H - ch - 16), x0 = cl(r.left, 16, W - cw - 16);
      const O = { d: [r.right + g, y0], g: [r.left - g - cw, y0], b: [x0, r.bottom + g], h: [x0, r.top - g - ch] };
      const libre = ([x, y]) => x >= 8 && x + cw <= W - 8 && y >= 56 && y + ch <= H - 8;
      const ordre = dansPanneau ? ["g", "b", "h"] : r.width > W * 0.55 ? ["b", "h", "d", "g"] : ["d", "g", "b", "h"];
      const ok = ordre.map((k) => O[k]).find(libre);
      pos = ok || (dansPanneau ? [cl(r.left - cw - g, 8, W - cw - 8), cl(H - ch - 16, 8, H)] : [W - cw - 20, H - ch - 20]);
    }
    card.style.left = Math.round(pos[0]) + "px"; card.style.top = Math.round(pos[1]) + "px";
  }
  window.addEventListener("app:rendu", () => { if (n >= 0) requestAnimationFrame(placer); });
  window.addEventListener("app:geste", (ev) => {
    if (ev.detail === "lang" || ev.detail === "theme") { if (n >= 0) dessiner(); return; }
    const e = ETAPES[n]; if (!e || !e.attendre || fait) return;
    if (String(ev.detail).startsWith(e.attendre)) { fait = true; dessiner(); setTimeout(() => { if (ETAPES[n] === e) aller(n + 1); }, 1100); }
  });
  window.VISITE = { aller, menu: () => (n >= 0 ? menu(card?.querySelector('[data-v="menu"]')) : (aller(0))), ETAPES, quitter };
  const m = /#v=([\w]+)/.exec(location.hash), i = m ? ETAPES.findIndex((x) => x.id === m[1]) : -1;
  const auto = new URLSearchParams(location.search).get("visite") !== "0";
  document.fonts.ready.then(() => { if (i >= 0) aller(i);  });
})();
