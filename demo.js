(function () {
  "use strict";
  const D = window.GTP_DEMO;
  const T0 = Date.parse(D.capturee), OUVERT = Date.now(), DateVraie = Date;
  class DateDemo extends DateVraie { constructor(...a) { if (a.length) super(...a); else super(T0 + (DateVraie.now() - OUVERT)); } static now() { return T0 + (DateVraie.now() - OUVERT); } }
  window.Date = DateDemo;
  const MSG = { fr: "Démonstration : rien n'est enregistré ni envoyé.", en: "Demo: nothing is saved or sent.", es: "Demostración: no se guarda ni se envía nada.",
    de: "Demo: Es wird nichts gespeichert oder gesendet.", it: "Demo: nulla viene salvato né inviato.", zh: "演示：不会保存或发送任何内容。" };
  const langue = () => (typeof lang === "string" ? lang : "fr");
  const MSG_FICTIF = { fr: "Démonstration : changement fictif, gardé dans cette page jusqu'au rechargement. Rien n'est enregistré ni envoyé ; les conseils ne sont pas recalculés.",
    en: "Demo: simulated change, kept in this page until reload. Nothing is saved or sent; advice is not recalculated.",
    es: "Demostración: cambio ficticio, conservado en esta página hasta recargarla. No se guarda ni se envía nada; los consejos no se recalculan.",
    de: "Demo: simulierte Änderung, bis zum Neuladen nur auf dieser Seite. Nichts wird gespeichert oder gesendet; Empfehlungen werden nicht neu berechnet.",
    it: "Demo: modifica fittizia, conservata in questa pagina fino al ricaricamento. Nulla viene salvato né inviato; i consigli non vengono ricalcolati.",
    zh: "演示：模拟更改，仅保留在本页面直到刷新。不会保存或发送任何内容；建议不会重新计算。" };
  let ETAT = null;
  const etat = () => (ETAT ??= JSON.parse(JSON.stringify(D.reponses["/api/repricer"].body)));
  const ok = (j) => ({ ok: true, status: 200, texte: JSON.stringify(j) });
  const nouvelId = () => "r" + Array.from({ length: 10 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
  function ecrireFictif(route, corps) {
    const E = etat(), B = E.bibliotheque, at = new Date().toISOString();
    setTimeout(() => window.GTP?.toast(MSG_FICTIF[langue()] || MSG_FICTIF.fr), 50);
    if (route.endsWith("/repricer/bibliotheque")) {
      if (corps.op === "creer") { const id = nouvelId(); B.push({ id, nom: corps.nom, modele: corps.modele, regle: corps.regle, pays: corps.pays, version: 1, modifieLe: at, archiveeLe: null, n: 0 }); return ok({ id, version: 1 }); }
      const e = B.find((x) => x.id === corps.id); if (!e) return { ok: false, status: 404, texte: JSON.stringify({ error: "—", code: "INTROUVABLE" }) };
      if (corps.op === "modifier") { Object.assign(e, { nom: corps.nom, modele: corps.modele, regle: corps.regle, pays: corps.pays, version: e.version + 1, modifieLe: at }); return ok({ id: e.id, version: e.version }); }
      if (corps.op === "archiver") { e.archiveeLe = at; return ok({ id: e.id, version: e.version }); }
      if (corps.op === "restaurer") { e.archiveeLe = null; return ok({ id: e.id, version: e.version }); }
    }
    if (route.endsWith("/repricer/affectations")) {
      const ecrites = [];
      for (const l of corps.lignes || []) {
        const r = E.rows.find((x) => x.marketplace === l.marketplace && x.sku === l.sku), g = B.find((x) => x.id === l.id); if (!r) continue;
        r.regle = g ? { ...g.regle, source: "nommee", id: g.id, nom: g.nom, version: 0, versionRegle: g.version, motif: null } : null;
        ecrites.push({ marketplace: l.marketplace, sku: l.sku, id: l.id, version: (l.versionLue || 0) + 1 });
        setTimeout(() => window.dispatchEvent(new CustomEvent("app:geste", { detail: `affecter:${l.marketplace}|${l.sku}` })), 0);
      }
      for (const g of B) g.n = E.rows.filter((r) => r.regle?.id === g.id).length;
      return ok({ ecrites, refusees: [] });
    }
    if (route.endsWith("/repricer/ignores")) {
      const r = E.rows.find((x) => x.marketplace === corps.marketplace && x.sku === corps.sku);
      if (r) r.ignore = corps.op === "ignorer" ? { actif: true, le: at, empreinte: r.ombre?.empreinteIgnore ?? null } : null;
      return ok({});
    }
    if (route.endsWith("/repricer/regles") || route.endsWith("/veille/etat")) return ok({ ecrites: [] });
    return null;
  }
  window.apiTexte = async function (pathname, opts = {}) {
    const m = String(opts.method || "GET").toUpperCase();
    if (m !== "GET") {
      let corps = {}; try { corps = JSON.parse(opts.body || "{}"); } catch {   }
      return ecrireFictif(pathname, corps) ?? { ok: false, status: 403, texte: JSON.stringify({ error: MSG[langue()] || MSG.fr, code: "DEMO" }) };
    }
    if (pathname === "/api/repricer") return ok(etat());
    const r = D.reponses[pathname];
    if (!r) return { ok: false, status: 404, texte: JSON.stringify({ error: "—" }) };
    return { ok: r.status >= 200 && r.status < 300, status: r.status, texte: JSON.stringify(r.body) };
  };
  window.api = async function (pathname, opts = {}) {
    const r = await window.apiTexte(pathname, opts);
    if (!r.ok) { let msg = "HTTP " + r.status; try { const j = JSON.parse(r.texte); if (j && j.error) msg += " — " + j.error; } catch {   } throw new Error(msg); }
    return JSON.parse(r.texte);
  };
  const fetchVrai = window.fetch.bind(window);
  window.fetch = (u, o) => (/\/api\//.test(String(u?.url || u)) ? Promise.reject(new Error(MSG[langue()] || MSG.fr)) : fetchVrai(u, o));
  const TX = {
    fr: { band: "GTINPilot est en cours de développement · données fictives", choix: "Choisissez votre langue et votre affichage", clair: "Clair", sombre: "Sombre",
      visite: "Commencer la visite guidée", libre: "Explorer librement", titre: "Découvrez le Repricer de GTINPilot", sous: "Le vrai logiciel, alimenté par un catalogue fictif. Aucun compte, aucune connexion Amazon.",
      seul: "Démonstration : seule la page Repricer est ouverte.", btnVisite: "Visite", langue: "Langue", theme: "Affichage" },
    en: { band: "GTINPilot is in development · sample data", choix: "Choose your language and display", clair: "Light", sombre: "Dark",
      visite: "Start the guided tour", libre: "Explore freely", titre: "Discover the GTINPilot Repricer", sous: "The real software, fed with a fictitious catalogue. No account, no Amazon connection.",
      seul: "Demo: only the Repricer page is open.", btnVisite: "Tour", langue: "Language", theme: "Display" },
    es: { band: "GTINPilot está en desarrollo · datos ficticios", choix: "Elija su idioma y su visualización", clair: "Claro", sombre: "Oscuro",
      visite: "Empezar la visita guiada", libre: "Explorar libremente", titre: "Descubra el Repricer de GTINPilot", sous: "El software real, con un catálogo ficticio. Sin cuenta, sin conexión con Amazon.",
      seul: "Demostración: solo está abierta la página Repricer.", btnVisite: "Visita", langue: "Idioma", theme: "Visualización" },
    de: { band: "GTINPilot ist in Entwicklung · fiktive Daten", choix: "Wählen Sie Sprache und Darstellung", clair: "Hell", sombre: "Dunkel",
      visite: "Geführte Tour starten", libre: "Frei erkunden", titre: "Entdecken Sie den Repricer von GTINPilot", sous: "Die echte Software mit einem fiktiven Katalog. Kein Konto, keine Amazon-Verbindung.",
      seul: "Demo: Nur die Repricer-Seite ist geöffnet.", btnVisite: "Tour", langue: "Sprache", theme: "Darstellung" },
    it: { band: "GTINPilot è in fase di sviluppo · dati fittizi", choix: "Scegli la lingua e la visualizzazione", clair: "Chiaro", sombre: "Scuro",
      visite: "Inizia la visita guidata", libre: "Esplora liberamente", titre: "Scopri il Repricer di GTINPilot", sous: "Il vero software, alimentato da un catalogo fittizio. Nessun account, nessuna connessione ad Amazon.",
      seul: "Demo: è aperta solo la pagina Repricer.", btnVisite: "Visita", langue: "Lingua", theme: "Visualizzazione" },
    zh: { band: "GTINPilot 正在开发中 · 虚构数据", choix: "选择语言和显示方式", clair: "浅色", sombre: "深色",
      visite: "开始导览", libre: "自由浏览", titre: "了解 GTINPilot 的 Repricer", sous: "真实的软件，使用虚构的商品目录。无需账户，无需连接亚马逊。",
      seul: "演示：仅开放 Repricer 页面。", btnVisite: "导览", langue: "语言", theme: "显示" },
  };
  const NOMS = { fr: "Français", en: "English", es: "Español", de: "Deutsch", it: "Italiano", zh: "中文" };
  const lireP = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const ecrireP = (k, v) => { try { localStorage.setItem(k, v); } catch {   } };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => "&#" + c.charCodeAt(0) + ";");
  const tx = () => TX[langue()] || TX.fr;
  function poserCadre() {
    const c = D.cadre[langue()] || D.cadre.fr, p = c.pieces;
    const met = (nom, html) => {
      const place = document.querySelector(`[data-cadre="${nom}"]`), t = document.createElement("template");
      t.innerHTML = html.replace(/ASINPilot/g, "GTINPilot").trim();
      const el = t.content.firstElementChild; el.dataset.cadre = nom;
      el.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); toast(tx().seul); }, true);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toast(tx().seul); } }, true);
      place.replaceWith(el);
    };
    met("header", p.header); met("tabs", p["#t1Tabs"]); met("brand", p["#t1Brand"]); met("side", p["#t1Side"]); met("mnav", p["#t1MNav"]);
    document.body.className = c.bodyClass.replace(/\bt1-mv-home\b/, "").trim();
    document.documentElement.lang = langue();
  }
  let tId;
  function toast(m) {
    let t = document.getElementById("demoToast");
    if (!t) { t = document.createElement("div"); t.id = "demoToast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = m; t.classList.add("on"); clearTimeout(tId); tId = setTimeout(() => t.classList.remove("on"), 2600);
  }
  function theme(th) { document.documentElement.dataset.theme = th; ecrireP("gtp.demo.theme", th); }
  function bandeau() {
    let b = document.getElementById("demoBand");
    if (!b) { b = document.createElement("div"); b.id = "demoBand"; document.body.prepend(b); }
    const th = document.documentElement.dataset.theme;
    b.innerHTML = `<span class="db-dot" aria-hidden="true"></span><b>${esc(tx().band)}</b><span class="db-grow"></span>
      <label class="db-l"><span class="sr-only">${esc(tx().langue)}</span><select id="dbLang">${Object.entries(NOMS).map(([k, v]) => `<option value="${k}"${k === langue() ? " selected" : ""}>${esc(v)}</option>`).join("")}</select></label>
      <button type="button" class="db-b" id="dbTheme" aria-label="${esc(tx().theme)}">${esc(th === "light" ? tx().sombre : tx().clair)}</button>
      <span class="db-sha" title="version du logiciel">${esc(D.sha)}</span><button type="button" class="db-b db-v" id="dbVisite">${esc(tx().btnVisite)}</button>`;
    b.querySelector("#dbLang").onchange = (e) => changerLangue(e.target.value);
    b.querySelector("#dbTheme").onclick = () => { theme(document.documentElement.dataset.theme === "light" ? "dark" : "light"); bandeau(); window.dispatchEvent(new Event("app:rendu")); };
    b.querySelector("#dbVisite").onclick = () => window.VISITE?.menu?.();
  }
  function changerLangue(lg) {
    lang = lg; ecrireP("gtp.demo.lang", lg);
    poserCadre(); bandeau(); rpPaint();
    window.dispatchEvent(new Event("app:langue")); window.dispatchEvent(new Event("app:rendu"));
  }
  function accueil() {
    const o = document.createElement("div"); o.id = "demoAccueil"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true");
    const dessiner = () => {
      const th = document.documentElement.dataset.theme;
      o.innerHTML = `<div class="da-c"><div class="da-band">${esc(tx().band)}</div><h2>${esc(tx().titre)}</h2><p>${esc(tx().sous)}</p>
        <p class="da-q">${esc(tx().choix)}</p>
        <div class="da-l">${Object.entries(NOMS).map(([k, v]) => `<button type="button" data-lg="${k}" class="${k === langue() ? "on" : ""}">${esc(v)}</button>`).join("")}</div>
        <div class="da-t"><button type="button" data-th="light" class="${th === "light" ? "on" : ""}">${esc(tx().clair)}</button><button type="button" data-th="dark" class="${th !== "light" ? "on" : ""}">${esc(tx().sombre)}</button></div>
        <div class="da-go"><button type="button" class="da-p" data-go="visite">${esc(tx().visite)}</button><button type="button" class="da-s" data-go="libre">${esc(tx().libre)}</button></div></div>`;
    };
    o.onclick = (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.lg) { changerLangue(b.dataset.lg); dessiner(); }
      else if (b.dataset.th) { theme(b.dataset.th); bandeau(); dessiner(); }
      else if (b.dataset.go) { o.remove(); ecrireP("gtp.demo.vu", "1"); if (b.dataset.go === "visite") window.VISITE?.aller?.(1); }
    };
    dessiner(); document.body.appendChild(o); o.querySelector(".da-p")?.focus();
  }
  window.GTP = {
    toast, langue: changerLangue, theme: (th) => { theme(th); bandeau(); },
    rafraichir() { poserCadre(); bandeau(); rpPaint(); },
    demarrer() {
      const nav = (navigator.language || "fr").slice(0, 2), lg = lireP("gtp.demo.lang") || (TX[nav] ? nav : "en");
      lang = TX[lg] ? lg : "fr";
      theme(lireP("gtp.demo.theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"));
      history.replaceState(null, "", location.pathname + location.search + "#prix");
      poserCadre(); bandeau();
      rpEnter();
      accueil();
    },
  };
})();
