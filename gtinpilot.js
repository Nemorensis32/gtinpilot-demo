// GTINPilot — écran Repricer découpé de api/dashboard.html au commit d1b70009023e4067977aa6d3b3245d1e461b7a0d, sans retouche à la main (construire/construire.mjs).
const I18N = { fr: {}, en: {}, es: {}, de: {}, it: {}, zh: {} };
Object.assign(I18N.fr, { "pfPpNoQty": (n) => `${n} ligne(s) d\'article sans quantité : non comptées, jamais comme zéro.`, "loading": "chargement…" });
Object.assign(I18N.en, { "pfPpNoQty": (n) => `${n} item line(s) without a quantity: not counted, never as zero.`, "loading": "loading…" });
Object.assign(I18N.es, { "pfPpNoQty": (n) => `${n} línea(s) de artículo sin cantidad: no contadas, nunca como cero.`, "loading": "cargando…" });
Object.assign(I18N.de, { "pfPpNoQty": (n) => `${n} Artikelzeile(n) ohne Menge: nicht gezählt, nie als null.`, "loading": "lädt…" });
Object.assign(I18N.it, { "pfPpNoQty": (n) => `${n} riga/e articolo senza quantità: non contate, mai come zero.`, "loading": "caricamento…" });
Object.assign(I18N.zh, { "pfPpNoQty": (n) => `${n} 条商品行没有数量：未计入，绝不按零计算。`, "loading": "加载中…" });
function detectLang() {
  for (const l of (navigator.languages || [navigator.language || ""])) {
    const code = String(l).toLowerCase().split("-")[0];
    if (I18N[code]) return code;
  }
  return "fr";
}
let lang = localStorage.getItem("dashLang") || detectLang();
const t = (k, ...a) => {
  const v = (I18N[lang] && I18N[lang][k] !== undefined) ? I18N[lang][k]
    : (I18N.en[k] !== undefined ? I18N.en[k] : I18N.fr[k]);
  return typeof v === "function" ? v(...a) : (v ?? k);
};
let region = localStorage.getItem("dashRegion") || "EU";
let lastSummary = null;
const LOCALES = { fr: "fr-FR", en: "en-GB", es: "es-ES", de: "de-DE", it: "it-IT", zh: "zh-CN" };
const LOCALE = () => LOCALES[lang] || "en-GB";
function montrerCentimes(v) { return Math.round(Math.abs(v) * 100) < 50 * 100; }
function centimesSousUnite(v) { const a = Math.abs(v); return Math.round(a * 100) > 0 && Math.round(a) === 0; }
function fmtMoney(v, cur, unitaire = false, entier = false) {
  if (entier && Math.round(Math.abs(v) * 100) === 0) v = 0;
  const noCents = !unitaire && (entier ? !centimesSousUnite(v) : !montrerCentimes(v));
  try { return new Intl.NumberFormat(LOCALE(), { style: "currency", currency: cur, currencyDisplay: "narrowSymbol", ...(noCents ? { minimumFractionDigits: 0, maximumFractionDigits: 0 } : {}) }).format(v); }
  catch { return (noCents ? v.toFixed(0) : v.toFixed(2)) + " " + cur; }
}
const PRICE_DOLLAR_PREFIX = { USD: "US$", CAD: "CA$", MXN: "MX$", BRL: "R$", AUD: "AU$", NZD: "NZ$", SGD: "SG$", HKD: "HK$" };
function fmtPriceNative(v, cur, unitaire = false) {
  const px = PRICE_DOLLAR_PREFIX[cur];
  if (!px) return fmtMoney(v, cur, unitaire);
  const d = unitaire || montrerCentimes(v) ? 2 : 0;
  return `${px} ${new Intl.NumberFormat(LOCALE(), { minimumFractionDigits: d, maximumFractionDigits: d }).format(v)}`;
}
function fmtUnitPriceNative(v, cur) { return fmtPriceNative(v, cur, true); }
function fmtInt(v) { return new Intl.NumberFormat(LOCALE()).format(v); }
function fmtPct(v) { return new Intl.NumberFormat(LOCALE(), { style: "percent", maximumFractionDigits: 1 }).format(v); }
const FLAGSVG = (() => {
  const H = 21, W = 30;
  const r = (x, w, c) => `<rect x="${x}" width="${w}" height="${H}" fill="${c}"/>`;
  const h = (y, ht, c) => `<rect y="${y}" width="${W}" height="${ht}" fill="${c}"/>`;
  const wrap = (inner) => `<svg class="flg" viewBox="0 0 30 21" aria-hidden="true">${inner}</svg>`;
  const v3 = (a, b, c) => wrap(r(0, 10, a) + r(10, 10, b) + r(20, 10, c));
  const h3 = (a, b, c) => wrap(h(0, 7, a) + h(7, 7, b) + h(14, 7, c));
  const M = {
    FR: v3("#0055A4", "#fff", "#EF4135"), IT: v3("#009246", "#fff", "#CE2B37"),
    BE: v3("#000", "#FDDA24", "#EF3340"), MX: v3("#006847", "#fff", "#CE1126"),
    DE: h3("#000", "#DD0000", "#FFCC00"), NL: h3("#AE1C28", "#fff", "#21468B"),
    ES: wrap(h(0, 5.5, "#AA151B") + h(5.5, 10, "#F1BF00") + h(15.5, 5.5, "#AA151B")),
    PL: wrap(h(0, 10.5, "#fff") + h(10.5, 10.5, "#DC143C")),
    SE: wrap(`<rect width="30" height="21" fill="#006AA7"/><rect x="9" width="4" height="21" fill="#FECC02"/><rect y="8.5" width="30" height="4" fill="#FECC02"/>`),
    UK: wrap(`<rect width="30" height="21" fill="#012169"/><path d="M0 0L30 21M30 0L0 21" stroke="#fff" stroke-width="4.2"/><path d="M0 0L30 21M30 0L0 21" stroke="#C8102E" stroke-width="1.8"/><rect x="12.6" width="4.8" height="21" fill="#fff"/><rect y="8.1" width="30" height="4.8" fill="#fff"/><rect x="13.8" width="2.4" height="21" fill="#C8102E"/><rect y="9.3" width="30" height="2.4" fill="#C8102E"/>`),
    US: wrap(`<rect width="30" height="21" fill="#fff"/>${[0, 2, 4, 6, 8, 10, 12].map((i) => `<rect y="${(i * 21 / 13).toFixed(2)}" width="30" height="${(21 / 13).toFixed(2)}" fill="#B22234"/>`).join("")}<rect width="13" height="9.7" fill="#3C3B6E"/>`),
    CA: wrap(r(0, 8, "#D80621") + r(8, 14, "#fff") + r(22, 8, "#D80621") + `<path d="M15 5l1 2.2 2-.6-.7 2.2 2 1.4-2.2.6.2 2.2-2.3-1-2.3 1 .2-2.2-2.2-.6 2-1.4-.7-2.2 2 .6z" fill="#D80621"/>`),
  };
  const star = (cx, cy, R, c) => `<path d="${[...Array(10)].map((_, k) => { const a = (-90 + 36 * k) * Math.PI / 180, q = k % 2 ? R * .42 : R;
    return (k ? "L" : "M") + (cx + q * Math.cos(a)).toFixed(2) + " " + (cy + q * Math.sin(a)).toFixed(2); }).join("")}z" fill="${c}"/>`;
  const ukInner = M.UK.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  Object.assign(M, {
    IE: v3("#169B62", "#fff", "#FF883E"),
    BR: wrap(`<rect width="30" height="21" fill="#009C3B"/><path d="M15 2.6L27.4 10.5 15 18.4 2.6 10.5z" fill="#FFDF00"/><circle cx="15" cy="10.5" r="4.6" fill="#002776"/>`),
    TR: wrap(`<rect width="30" height="21" fill="#E30A17"/><circle cx="11.5" cy="10.5" r="5.2" fill="#fff"/><circle cx="12.9" cy="10.5" r="4.2" fill="#E30A17"/>${star(18.6, 10.5, 2.4, "#fff")}`),
    AE: wrap(`<rect x="8" width="22" height="7" fill="#00732F"/><rect x="8" y="7" width="22" height="7" fill="#fff"/><rect x="8" y="14" width="22" height="7" fill="#000"/><rect width="8" height="21" fill="#FF0000"/>`),
    SA: wrap(`<rect width="30" height="21" fill="#006C35"/><path d="M9 7.6h12M10.5 10.2h9" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><rect x="8.5" y="13.4" width="13" height="1.4" rx=".7" fill="#fff"/>`),
    EG: wrap(h(0, 7, "#CE1126") + h(7, 7, "#fff") + h(14, 7, "#000") + `<circle cx="15" cy="10.5" r="2" fill="#C09300"/>`),
    ZA: wrap(`<rect width="30" height="10.5" fill="#E03C31"/><rect y="10.5" width="30" height="10.5" fill="#001489"/><path d="M0 0H9L19 7.4H30V13.6H19L9 21H0z" fill="#fff"/>`
      + `<path d="M0 2H7.6L17.6 9H30V12H17.6L7.6 19H0z" fill="#007749"/><path d="M0 4.2L8.6 10.5 0 16.8z" fill="#FFB612"/><path d="M0 5.8L6.6 10.5 0 15.2z" fill="#000"/>`),
    IN: wrap(h(0, 7, "#FF9933") + h(7, 7, "#fff") + h(14, 7, "#138808") + `<circle cx="15" cy="10.5" r="2.5" fill="none" stroke="#000080" stroke-width=".9"/>`),
    JP: wrap(`<rect width="30" height="21" fill="#fff"/><circle cx="15" cy="10.5" r="5.8" fill="#BC002D"/>`),
    AU: wrap(`<rect width="30" height="21" fill="#012169"/><g transform="scale(.5)">${ukInner}</g>${star(7.5, 15.8, 2.2, "#fff")}${star(22.5, 4.2, 1.3, "#fff")}${star(19.4, 9.6, 1.3, "#fff")}${star(25.6, 8.2, 1.3, "#fff")}${star(22.5, 17, 1.4, "#fff")}`),
    SG: wrap(`<rect width="30" height="10.5" fill="#EF3340"/><rect y="10.5" width="30" height="10.5" fill="#fff"/><circle cx="7" cy="5.25" r="3.6" fill="#fff"/><circle cx="8.4" cy="5.25" r="3.3" fill="#EF3340"/>`
      + `${star(11.2, 3.3, 1, "#fff")}${star(13.4, 5.3, 1, "#fff")}${star(9.4, 5.3, 1, "#fff")}${star(10.2, 7.6, 1, "#fff")}${star(12.4, 7.6, 1, "#fff")}`),
  });
  M.GB = M.UK;
  return M;
})();
function flagSvg(mp) { return FLAGSVG[mp === "UK" ? "UK" : mp] || `<b>${escapeHtml(mp)}</b>`; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function ppcMkts(data, reg) {
  if (reg === "all") return null;
  const ids = String(reg).split(","), zs = ((data && data.meta && data.meta.zones) || []).filter((x) => x && ids.includes(x.id));
  if (zs.length === ids.length && zs.every((z) => Array.isArray(z.pays))) return new Set(zs.flatMap((z) => z.pays));
  const s = new Set();
  for (const Q of Object.values((data && data.periods) || {})) for (const mp of Object.keys((Q && Q.byMarketplace) || {})) s.add(mp);
  return s;
}
function zoneMpsAffichee() {
  if (region === "all" || typeof lastSummary === "undefined" || !lastSummary) return null;
  return ppcMkts(lastSummary, region);
}
Object.assign(I18N.fr, { t1pPrice: "Repricer", rpTitle: "Repricer", t1pSmart: "SmartPrice", rpSp_videT: "Aucune offre ne suit SmartPrice", rpSp_videD: "SmartPrice place le prix de votre marque face à des produits concurrents que vous choisissez. Trois étapes, dans l'ordre, pour l'activer.", rpSp_aria: "Trois étapes pour activer SmartPrice", rpSp_e_1: "Règle", rpSp_e_1d: "écart et limites", rpSp_e_1a: "Créer une règle", rpSp_e_2: "Offres", rpSp_e_2d: "appliquer la règle", rpSp_e_3: "Concurrents", rpSp_e_3d: "par offre et par pays",
  rpCrumb: "Produits", rpLvl_ombre: "Simulation", rpLvl_propose: "Envoi sur validation", rpLvl_auto: "Automatique",
  rpLvlAria: "Niveau du repricer", rpLvlTip: "Niveau du compte : Simulation tant que le verrou prix est fermé (aucun prix envoyé à Amazon), Envoi sur validation quand il est ouvert. Automatique n'existe pas encore.", rpLvlUnk: "Niveau inconnu : verrou prix non lu.", rpEtatN: (s, n) => `${s} ${n > 1 ? "offres" : "offre"}`, rpRe_c_expl: (s, n) => `${s} exploitable${n > 1 ? "s" : ""}`, rpRe_c_bloq: (s, n) => `${s} bloquée${n > 1 ? "s" : ""}`, rpRe_c_inact: (s, n) => `${s} inactive${n > 1 ? "s" : ""}`, rpRe_c_nonAch: (s, n) => `${s} non achetable${n > 1 ? "s" : ""}`, rpRe_c_nonConf: (s, n) => `${s} non confirmée${n > 1 ? "s" : ""}`, rpRe_c_sansOffre: (s) => `${s} sans offre à vous`, rpRe_c_ecart: (s, n) => `${s} masquée${n > 1 ? "s" : ""} ou désactivée${n > 1 ? "s" : ""}`, rpRe_decTip: "Exploitables : prix relevé, calcul possible. Bloquées : suivies, mais une donnée manque au calcul (coût, frais, limites). Inactives : annonce inactive chez Amazon. Sans offre à vous : la fiche existe dans ce pays, sans annonce ni prix à vous. Non achetables : annonce active, mais aucune offre achetable relevée ou stock vendable nul. Non confirmées : prix relevé, mais annonce absente du rapport des annonces. Masquées ou désactivées : par vous. Toutes sont listées dans « Toutes les offres ».", rpRe_mode: "Mode :", rpEtatCalc: (h) => `calculé à ${h}`,
  rpFPays: "Pays", rpFSit: "Situation", rpFAll: "Tous", rpFAllF: "Toutes", rpTabConseils: "Actions", rpTabTous: "Toutes les offres", rpTabJournal: "Journal", rpTabRegles: "Règles",
  rpTabsCount: (p, c) => `${p} produit${p > 1 ? "s" : ""} · ${c} pays`, rpSoon: "Lot suivant",
  rpTh_prod: "Produit", rpTh_pays: "Pays", rpTh_prix: "Prix", rpTh_conseil: "Conseil",
  rpC_garder: "Garder", rpC_pause_promo: "En pause · promo", rpC_cout_inconnu: "Coût inconnu", rpC_bornes_en_conflit: "Limites en conflit", rpC_frais_inconnus: "Frais inconnus",
  rpC_sans_prix: "Prix non relevé", rpC_bloque: "Bloqué", rpC_aucun: "Pas encore conseillé", rpC_desactive: "Désactivé", rpC_aValider: "à valider",
  rpErr: "Indisponible.", rpNone: "Aucun produit vendu ces 7 derniers jours.", rpNoneFiltre: "Aucune ligne pour ces filtres.",
  rpP_perdue: (d, n) => `offre vedette perdue depuis le ${d} · ${n} vendeurs`, rpP_perdueX: "offre vedette perdue", rpP_detenue: (n) => `offre vedette détenue · ${n} vendeurs`,
  rpP_seul: "seul vendeur · aucune autre offre", rpP_inconnue: "offre vedette : situation inconnue", rpP_sans_offre: "aucune offre active", rpP_close: "Fermer",
  rpSim: "Simulation", rpSimTest: "Tester un autre prix", rpSimPrix: "prix testé", rpSimPlancher: "plancher", rpSimPlafond: "plafond", rpSimAttendu: "attendu", rpSimAttNon: "non relevé", rpSimAttSeul: "aucune concurrente",
  rpL_ttc: "Prix TTC", rpL_tva: (p) => `TVA ${p}`, rpL_tvaX: "TVA", rpL_frais: "Frais Amazon à ce prix", rpL_cout: "Coût d'achat (moyenne du stock restant)", rpL_coutProv: "provisoire",
  rpL_pub: "Publicité par unité", rpL_pubNon: "non calculée", rpL_ben: "Bénéfice par unité", rpL_benAv: "avant pub", rpL_acos: "ACOS d'équilibre", rpL_ench: "Enchère d'équilibre",
  rpL_enchAu: "Enchères au-dessus", rpL_inconnu: "inconnu", rpL_nonReleve: "non relevé", rpL_pxInactive: "annonce inactive", rpL_pxSansOffre: "pas d'offre à vous", rpL_pxNonLu: "rapport des annonces pas encore lu", rpL_pxFiche: "prix de la fiche, référence non identifiée", rpL_pxConf: (p, d) => `Prix configuré : ${p} (rapport des annonces, ${d})`, rpRe_c_nonLu: (s) => `${s} à vérifier (annonces non lues)`, rpL_pxNonAch: "aucune offre achetable relevée", rpL_avant: "Avant", rpL_parU: "/ unité", rpL_vjPerte: "Ventes / jour avant la perte",
  rpL_vj: "Ventes / jour", rpL_vjCumul: "Ventes / jour cumulées (toutes références du produit)", rpL_moy14: "moyenne 14 j", rpE_attente: "En attente de validation", rpE_conseil: (p) => `Conseil : ${p}`, rpProposer: "Proposer ce prix",
  rpPropBusy: "Envoi…", rpPropGele: "Verrou prix fermé : aucun prix ne peut partir chez Amazon.", rpPropErr: (m) => `Non proposé : ${m}`, rpPropSousMarge: "Prix sous la marge minimale : il apparaît en rouge dans la barre en bas, et ne part qu'après « Passer outre la marge ».", rpPropRelu: (p) => `Prix relu chez Amazon : ${p}`,
  rpDetErr: "Détail indisponible.", rpGrilleVide: "Aucun prix estimé par Amazon pour ce produit.",
  rpJErr: "Journal indisponible.", rpJ_vide: "Aucune entrée ces 30 derniers jours.", rpJ_th_date: "Date", rpJ_th_evt: "Évènement", rpJ_cpt: (n) => `${n} relevé(s) sans changement (au plus un par jour et par produit, tous pays)`, rpJ_cout: "Coût d'achat (figé)", rpJ_estime: "(estimé)", rpJ_roi: "Retour sur coût", rpJ_marge: "Marge", rpJ_bb: "Offre vedette", rpJ_bbOui: "détenue", rpJ_bbNon: "non détenue", rpJ_bornes: "Plancher / plafond", rpJ_bas: "Prix le plus bas Prime / non Prime", rpJ_raison: "Raison", rpJ_fige: "Figé le", rpJ_nonFige: "Proposition antérieure à l'instantané : économie non figée.", rpJ_regleNonFigee: "règle non figée", rpJ_voir: "Voir le détail", rpJ_auPa: (p) => `Au prix actuel (${p})`, rpJ_auPaC: "au prix actuel", rpJ_contrib: "Contribution", rpJ_nonEnr: "non enregistré", rpJ_indispo0: "indisponible", rpJ_causes: "Causes", rpJ_consq: "Conséquence", rpJ_consqV: (v) => `${v} : indisponibles`, rpJ_filS: (s, n) => `Offres suivies par le Repricer · ${s} entrée${n > 1 ? "s" : ""} d'autres offres masquée${n > 1 ? "s" : ""}`, rpJ_filT: "Tout l'historique", rpJ_voirTout: "Afficher tout l'historique", rpJ_voirSuiv: "Revenir aux offres suivies", rpJA_prix_inconnu: "prix non relevé", rpJA_frais_absents: "frais Amazon absents", rpJA_cout_achat_absent: "coût d'achat absent",
  rpJ_ombre: "Conseil (simulation)", rpJ_prop: "Proposition de prix", rpJ_via_barre: "barre", rpJ_via_mcp: "MCP",
  rpJ_St_PENDING: "En attente", rpJ_St_CONFIRMED: "Confirmé", rpJ_St_SENDING: "Envoi en cours", rpJ_St_APPLIED: "Appliqué", rpJ_St_NOT_APPLIED: "Non appliqué",
  rpJ_St_REFUSED: "Refusé", rpJ_St_CANCELLED: "Annulé", rpJ_St_EXPIRED: "Expiré", rpJ_St_UNKNOWN: "Résultat inconnu",
  rpR_def: "Par défaut (compte)", rpR_defNone: "Aucune règle par défaut : aucun conseil calculé.", rpR_src: "Règle", rpR_propre: "Propre", rpR_defaut: "par défaut",
  rpR_margeMin: "Marge mini", rpR_roiMin: "Retour sur coût mini", rpR_profitMin: "Bénéfice mini / unité", rpR_margeMax: "Marge maxi", rpR_mode: "Mode",
  rpR_mode_tous: "Tous les minimums", rpR_mode_au_moins_un: "Au moins un", rpR_revenir: "Revenir au défaut", rpR_garder: "Garder la sienne", rpR_auDefaut: "→ par défaut",
  rpR_sansSku: "sans référence vendeur", rpR_n: (n) => `${n} règle(s) modifiée(s)`, rpR_ou: "dans GTINPilot, rien chez Amazon", rpR_cancel: "Annuler", rpR_save: "Enregistrer",
  rpR_busy: "Enregistrement…", rpR_ok: "Enregistré · conseils au prochain calcul", rpR_ko: (m) => `Non enregistré : ${m}`,
  rpR_e_champ: (w) => `${w} : nombre > 0 attendu`, rpR_e_vide: (w) => `${w} : au moins un minimum (marge, retour sur coût ou bénéfice)`,
  rpR_e_maxi: (w) => `${w} : marge maxi ≤ marge mini`, rpR_e_trop: () => "50 règles au plus par enregistrement",
  rpTh_situation: "Situation", rpTh_situationTip: "Position actuelle de l'offre. La colonne Conseil, elle, dit le prix à viser : les deux libellés diffèrent exprès.",
  rpTh_ventes: "Ventes 30 j", rpTh_ventesTip: "Unités vendues ces 30 derniers jours, hors Vine (Vine à part) : même calcul que la page Ventes (jour du compte, commandes annulées exclues).",
  rpSit_seul_vendeur: "Seul vendeur", rpSit_detenue: "Offre vedette détenue", rpSit_perdue: "Offre vedette perdue", rpSit_au_plancher: "Au plancher", rpSit_cout_inconnu: "Coût inconnu",
  rpSit_sans_offre: "Sans offre active", rpSit_inconnue: "Inconnue", rpV_aucune: "Aucune commande relevée dans ce pays", rpV_sansArt: (n) => `${n} commande(s) du pays sans détail d'article : ce chiffre est un minimum`, rpV_vine: (n) => `+${n} Vine`, rpV_jours: (n) => `sur ${n} j`,
  rpV_tip: (u, j) => `Ventes ${j} j : ${u}`,
  rpPli_inactifs: (n) => `Sans offre active (${n})`, rpPli_inactifsD: "Aucun prix relevé ou annonce inactive chez Amazon : rien à conseiller tant que l'offre ne vend pas.",
  rpPli_masques: (n) => `Produits masqués (${n})`, rpPli_masquesD: "Masqué dans Stock › Listings : retiré des listes seulement, toujours suivi.",
  rpPli_desactives: (n) => `Désactivés (${n})`, rpPli_desactivesD: "Désactivé dans tout GTINPilot : le repricer ne le conseille plus. Se réactive dans Stock › Listings.",
  rpNoneActif: "Aucune offre en vente pour ces filtres.",rpC_non_achetable: "Non achetable · stock nul",
  rpL_pubTip: (a, b) => `dépense pub ÷ unités vendues, du ${a} au ${b}`, rpPubR_rapport_pub_absent: "rapport pub absent pour ce pays", rpPubR_rapport_pub_incomplet: "rapport pub incomplet sur 30 jours",
  rpPubR_aucune_vente: "aucune unité vendue sur 30 jours", rpPubR_devise_pub_differente: "dépense pub dans une autre devise", rpPubR_quantite_absente: "quantité absente d'une commande", rpPubR_tables_absentes: "données absentes",
  rpL_enchN: (n, m) => `${n} enchère(s) au-dessus de ${m}`, rpL_ench0: (m) => `aucune enchère au-dessus de ${m}`,
  rpLb_dateInc: "date inconnue", rpLb_voirJournal: "Voir le journal", rpLb_voirN: (n) => `Voir les ${n}`, rpLb_horsListe: (n) => `${n} hors de cette page (pays ou produits sans relevé récent)`, rpEd_e_choix: "Choisir la valeur à garder pour chaque champ changé des deux côtés.", rpEd_cflAucunDeux: "Aucun champ n'a changé des deux côtés ; s'il y en avait, il serait à choisir ici avant d'enregistrer.", rpEd_cflDeux: "Un champ a changé des deux côtés : choisir la valeur à garder avant d'enregistrer.", rpEd_inchanges: "inchangés", rpEd_aChoisir: "à choisir", rpEd_oIdentiques: "identiques", rpPp_calcAvec: (r, a) => `calculé avec ${r} il y a ${a}`, rpPp_stale: (r, a) => `Conseil calculé avec ${r} il y a ${a} — recalcul au prochain passage`, rpPp_ageMin: (n) => `${n}\u00a0min`, rpPp_ageHM: (h, m) => `${h}\u00a0h\u00a0${String(m).padStart(2, "0")}`, rpPp_ageH: (n) => `${n}\u00a0h`, rpPp_nonNotee: "règle non notée", rpPp_fxD_conflitAvec: (r) => `: les barrières de ${r} ne laissent aucun prix de la grille.`, rpPp_recalcul: "Ce n'est plus la règle actuelle : recalcul au prochain passage.", rpPp_reaffecter: "Réaffecter", rpPp_compteNonModif: "règle du compte : non modifiable ici", rpLb_simT: "Simulation uniquement.", rpLb_simD: "Ces règles calculent des recommandations. Aucun prix Amazon n'est modifié par elles.",
  rpLb_ordre: "Ordre :", rpLb_o1: "règle propre du produit", rpLb_o2: "règle nommée affectée", rpLb_o3: "règle du compte",
  rpLb_titre: "Bibliothèque de règles", rpLb_sous: "Règles réutilisables, affectées par produit × pays", rpLb_defs: "Définitions", rpLb_affecter: "Affecter une règle", rpLb_nouvelle: "Nouvelle règle",
  rpLb_thRegle: "Règle", rpLb_thBar: "Barrières de prix", rpLb_thEcart: "Écart", rpLb_thAff: "Affectée à", rpLb_thPays: "Pays", rpLb_thActs: "Actions",
  rpLb_compte: "Règle du compte", rpLb_tagDef: "Défaut", rpLb_compteD: "s'applique à tout produit × pays sans autre règle",
  rpLb_compteAbs: "Aucune règle du compte : sans règle nommée ni propre, aucune recommandation.",
  rpLb_compteLock: "Non modifiable ici · fixée dans la configuration du compte, sans écran aujourd'hui",
  rpLb_mini: "Mini", rpLb_maxi: "Maxi", rpLb_sansPlafond: "aucun plafond", rpLb_et: "ET", rpLb_ou: "OU",
  rpLb_c_profit: "Bénéfice", rpLb_c_marge: "Marge", rpLb_c_roi: "Retour sur coût", rpLb_ecNon: "non réglé", rpLb_ecNonT: "Aucun écart réglé : le moteur n'applique aucun écart avec cette règle.", rpLb_ecClasserT: "Façon à classer : le moteur n'applique aucun écart.", rpLb_ecT: "Écart appliqué par le moteur pour cette façon de viser.",
  rpLb_pxp: "produits × pays", rpLb_dontApp: (n) => `dont ${n} appliqué(s)`, rpLb_tousPays: "Tous les pays", rpLb_nNommees: (n) => `${n} nommée(s)`,
  rpLb_version: (v, le, par) => `version ${v}${le ? ` · ${le}` : ""}${par ? ` · ${par}` : ""}`,
  rpLb_appliquer: "Appliquer partout", rpLb_modifier: "Modifier", rpLb_dupliquer: "Dupliquer", rpLb_supprimer: "Supprimer", rpLb_supprT: "Supprimer (archive, récupérable)",
  rpLb_autres: (nom) => `Autres actions · ${nom}`, rpLb_copie: (nom) => `${nom} (copie)`,
  rpLb_arch: (n) => `Archivées (${n})`, rpLb_archD: "récupérable", rpLb_restaurer: "Restaurer",
  rpLb_s_personnalise: "Personnalisé", rpLb_s_prudent: "Prudent", rpLb_s_equilibre: "Équilibré", rpLb_s_offensif: "Offensif", rpLb_s_destockage: "Déstockage",
  rpLb_n_prudent: "Marge protégée", rpLb_n_equilibre: "Buy Box équilibrée", rpLb_n_offensif: "Conquête (Q4)", rpLb_n_destockage: "Déstockage",
  rpLb_videT: "Aucune règle nommée", rpLb_videD: (n, p) => `La règle du compte s'applique aux ${n} produits × pays (${p} pays).`,
  rpLb_videD2: "Une règle nommée se crée une fois et s'affecte à plusieurs produits × pays ; la modifier crée une nouvelle version que ses produits suivent.",
  rpLb_partir: "Partir de ce modèle", rpLb_lecture: "Lecture des règles du compte…",
  rpLb_errT: "Règles illisibles", rpLb_errD: "Le fichier des règles de ce compte n'a pas pu être lu. Tant qu'il ne l'est pas, aucune règle n'est appliquée : rien ne repasse en silence sur la règle du compte.",
  rpLb_errD2: (d) => `Les recommandations affichées datent du dernier calcul réussi (${d}) et sont périmées.`, rpLb_reessayer: "Réessayer",
  rpLb_lockT: "Écritures désactivées", rpLb_lockD: "tant que le fichier n'est pas lisible : écrire sur un fichier illisible pourrait effacer les règles qu'il contient.",
  rpLb_detail: "Détail :", rpLb_offT: "Écritures désactivées : fichier des règles illisible",
  rpLb_apT: (nom, v) => `Appliquer « ${nom} » v${v} partout`, rpLb_apBig: "produits × pays changent de règle",
  rpLb_apNote: (n, p) => `Sur les ${n} produits × pays des ${p} pays couverts par la règle. Simulation uniquement : aucun prix Amazon modifié.`,
  rpLb_apChg: "changent de règle : la règle nommée devient effective", rpLb_apDeja: (nom) => `déjà sur « ${nom} » : inchangés`,
  rpLb_apProp: "gardent leur règle propre : affectation enregistrée, remplacée par la règle propre", rpLb_apHors: (p) => `non touchés : ${p}, pays non couvert(s) par la règle`,
  rpLb_apSans: "sans référence vendeur : non touchés", rpLb_rien: (nom) => `Rien à changer : tous les produits × pays couverts sont déjà sur « ${nom} ».`,
  rpLb_resOk: (n) => `${n} produit(s) × pays affecté(s) · simulation seulement, rien chez Amazon.`,
  rpLb_resPart: (ok, tot, ko) => `${ok} affecté(s) sur ${tot} · ${ko} non affecté(s)`, rpLb_resPartD: "les autres affectations sont enregistrées.",
  rpLb_r_CONFLIT: "affectation modifiée entre-temps ; rien n'a changé pour ce produit", rpLb_r_PAYS_NON_COUVERT: "pays non couvert par la règle ; rien n'a changé pour ce produit",
  rpLb_r_ARCHIVEE: "règle archivée entre-temps ; rien n'a changé pour ce produit", rpLb_r_INTROUVABLE: "règle introuvable ; rien n'a changé pour ce produit",
  rpLb_reessayerN: (n) => `Réessayer les ${n}`,
  rpLb_suppRefus: (n, nom) => `Suppression refusée : ${n} produit(s) × pays utilisent « ${nom} ». Les réaffecter d'abord ; supprimer archive la règle, récupérable.`,
  rpLb_vbT: "Modification à valider — 1 en attente", rpLb_annuler: "Annuler", rpLb_valider: "Valider", rpLb_enCours: "Enregistrement…",
  rpLb_vbSim: "simulation uniquement · aucun prix Amazon modifié",
  rpLb_vb_affect: (nom, v, n, p) => `Affecter « ${nom} » v${v} : ${n} produit(s) × pays${p ? ` · ${p} restent sur leur règle propre` : ""}`,
  rpLb_vb_affectD: "Les produits suivront chaque nouvelle version de la règle.", rpLb_vb_affMulti: (n, p) => `${n} produit(s) × ${p} pays choisis`,
  rpLb_vb_aucune: (qui) => `Retirer l'affectation de ${qui} : la règle du compte s'appliquera`,
  rpLb_vb_archiver: (nom) => `Archiver « ${nom} »`, rpLb_vb_archiverD: "Archivée, elle reste récupérable ; aucun produit ne l'utilise.",
  rpLb_vb_restaurer: (nom) => `Restaurer « ${nom} »`, rpLb_vb_retirer: (qui) => `Retirer la règle propre de ${qui}`,
  rpLb_vb_retirerD: "La règle nommée affectée, sinon la règle du compte, s'appliquera. Rien d'autre n'est effacé.",
  rpLb_okMsg: "Règle enregistrée · simulation seulement, rien chez Amazon.", rpLb_ko: (m) => `Rien n'a été enregistré : ${m}`,
  rpLb_archOk: (nom) => `« ${nom} » archivée (récupérable).`, rpLb_restOk: (nom) => `« ${nom} » restaurée.`, rpLb_retOk: "Règle propre retirée.",
  rpEd_titreMod: "Modifier la règle", rpEd_titreNew: "Nouvelle règle", rpEd_titreProp: (qui) => `Règle propre · ${qui}`,
  rpEd_metaMod: (nom, v, le) => `${nom} · version ${v}${le ? ` · modifiée le ${le}` : ""}`, rpEd_metaNew: "brouillon · rien n'est enregistré", rpEd_metaProp: (v) => `version ${v}`,
  rpEd_fermer: "Fermer", rpEd_ident: "Nom", rpEd_nom: "Nom de la règle", rpEd_affA: "Affectée à", rpEd_affN: (n) => `${n} produit(s) × pays`, rpEd_aucunProd: "aucun produit",
  rpEd_vInfo: (a, b) => `version ${a} → ${b}`, rpEd_vNew: "nouvelle",
  rpEd_hintMod: (v, n) => `Enregistrer crée la version ${v} ; les ${n} produit(s) × pays affectés la suivent. Chaque simulation note la version utilisée.`,
  rpEd_hintNew: "Nouvelle règle : version 1 à l'enregistrement, affectée à aucun produit.",
  rpEd_style: "Style de la règle", rpEd_styleH: "Un style pré-remplit les barrières ci-dessous ; Personnalisé garde les valeurs saisies.", rpEd_rec: "Recommandé",
  rpEd_sd_personnalise: "ne change rien", rpEd_sd_prudent: "marge d'abord", rpEd_sd_equilibre: "marge et offre vedette", rpEd_sd_offensif: "minimums bas", rpEd_sd_destockage: "jamais sous le coût",
  rpEd_bar: "Barrières de prix", rpEd_defH: "Définitions — les mêmes que le calcul",
  rpEd_dBen: "prix HT − frais Amazon à ce prix − coût d'achat (moyenne pondérée), par unité, avant publicité", rpEd_dMarge: "bénéfice ÷ prix HT", rpEd_dRoi: "bénéfice ÷ coût d'achat",
  rpEd_mins: "Minimums", rpEd_maxs: "Maximums", rpEd_aucun: "Aucun", rpEd_devPays: "devise du pays",
  rpEd_f_profitMin: "Bénéfice mini par vente", rpEd_f_margeMin: "Marge mini", rpEd_f_roiMin: "Retour sur coût mini",
  rpEd_f_profitMax: "Bénéfice maxi par vente", rpEd_f_margeMax: "Marge maxi", rpEd_f_roiMax: "Retour sur coût maxi",
  rpEd_modeMin: "Minimums : ET / OU", rpEd_modeMax: "Maximums : ET / OU", rpEd_tousMin: "tous les minimums posés", rpEd_tousMax: "tous les maximums posés", rpEd_auMoins: "au moins un",
  rpEd_maxH0: "Aucun maximum posé : aucun plafond.", rpEd_maxH1: "Un maximum posé ne fait que restreindre les prix permis.", rpEd_maxH2: "Un maximum ne lève jamais un minimum ni une protection.",
  rpEd_exDes: "prix permis dès", rpEd_exSans: "· sans plafond", rpEd_exJusq: (m) => `· jusqu'à ${m}`, rpEd_ok: "barrières compatibles", rpEd_exCout: "coût",
  rpEd_exAucun: "aucun prix de sa grille ne respecte ces barrières", rpEd_exNone: "Exemple chiffré : lecture de la grille de prix d'un produit…",
  rpEd_vide: "Aucun prix autorisé", rpEd_videD: (x) => `: ${x} ne peuvent pas tenir ensemble. Vrai pour tous les produits ; corriger l'un des deux pour enregistrer.`,
  rpEd_contra: "Bornes contradictoires", rpEd_contraD: (x) => `: ${x}. Un maximum doit dépasser le minimum du même critère ; corriger pour enregistrer.`,
  rpEd_saveImp: "Enregistrement impossible : aucun prix autorisé", rpEd_saveImpT: "Aucun prix autorisé : corriger les barrières",
  rpEd_pays: "Pays où la règle s'applique", rpEd_tousPays: "Tous les pays du compte", rpEd_tousPaysD: "y compris ceux ajoutés plus tard", rpEd_certains: "Certains pays", rpEd_certainsD: "cochés ci-dessous",
  rpEd_paysH: "Pays non coché : la règle n'y est jamais appliquée. Un produit qui y reste affecté est signalé « affectée, mais non applicable », et la règle réellement appliquée est nommée.",
  rpEd_soon: "Prévu, pas encore actif", rpEd_soonN: (n) => `${n} réglages`,
  rpEd_x_pause: "Pause récurrente", rpEd_xd_pause: "Garder le prix tel quel sur une plage horaire choisie.", rpEd_xf_pause: [["Plages", "+ Ajouter une plage"]],
  rpEd_x_conc: "Concurrence", rpEd_xd_conc: "Comment se placer face à Amazon et aux vendeurs qui expédient eux-mêmes.",
  rpEd_xf_conc: [["Face à Amazon", "S'aligner si rentable, sinon laisser"], ["Vendeurs qui expédient eux-mêmes", "Les prendre en compte"], ["Écart avec le prix à battre", "0 · s'aligner"], ["Hausse et baisse maxi par jour", "—"]],
  rpEd_x_cas: "Cas particuliers", rpEd_xd_cas: "Que faire quand l'offre vedette est retirée, quand la concurrence passe sous le plancher, quand l'offre est seule ou a déjà l'offre vedette.",
  rpEd_xf_cas: [["Offre vedette retirée par Amazon", "Ne pas toucher au prix"], ["Concurrence sous le plancher", "Ne pas toucher au prix"], ["Seule offre sur l'annonce", "Ne pas toucher au prix"], ["Offre vedette déjà détenue", "Ne pas toucher au prix"]],
  rpEd_x_battre: "Prix à battre", rpEd_xd_battre: "Quel prix viser, et quels concurrents compter.", rpEd_xf_battre: [["Prix visé", "Prix de l'offre vedette"], ["Avis positifs mini du vendeur", "—"]],
  rpEd_x_yoyo: "Protections anti-yo-yo", rpEd_xd_yoyo: "Si le prix monte et descend en boucle face à un autre logiciel, mise en pause qui s'allonge à chaque répétition, cause écrite au journal.",
  rpEd_xf_yoyo: [["Pause", "6 h › 24 h › 72 h si le conflit se répète · jamais de gel silencieux"]],
  rpEd_x_auto: "Automatisations", rpEd_xd_auto: "Changer de règle quand un produit ne se vend plus, compté par pays et par réserve de stock partagée.",
  rpEd_xf_auto: [["Pas de vente depuis", "20 › 35 › 50 › 65 jours"], ["Alors passer à", "Règle suivante"]],
  rpEd_note: "Enregistrer ne modifie aucun prix chez Amazon.", rpEd_facon: "Comment fixer votre prix ?", rpEd_fc_concurrents: "SmartPrice", rpEd_fcd_concurrents: "Votre marque face à des produits concurrents, d'autres marques.",
  rpEd_vf_m001: (c) => `0,01 ${c} moins cher`, rpEd_vfRef_foep: "le prix conseillé par Amazon", rpEd_vfRef_bas: "le prix livré du moins cher", rpEd_exT: "Exemple fictif · aucun produit réel", rpEd_exVed: "Offre vedette", rpEd_exPl: "Plancher", rpEd_exGarde: "gardé au plancher", rpEd_vfRef: "l'offre vedette", rpEd_vfH: "parmi les vendeurs de la fiche que cette règle compte", rpEd_vfPl: "Vendeurs comptés", rpEd_vfExp_tous: "tous les vendeurs", rpEd_vfExpD_tous: "Chaque vendeur relevé sur la fiche compte, quel que soit qui expédie.", rpEd_vfExp_amazon: "expédiés par Amazon seulement", rpEd_vfExpD_amazon: "Seuls les vendeurs dont l'offre est expédiée par Amazon comptent. Un vendeur dont on ne sait pas qui expédie n'est pas compté.", rpEd_vfExpH: "Écarter un vendeur précis : bientôt disponible, depuis la liste des vendeurs de la fiche.", rpEd_vfPh_aucun: "Choisissez un écart : le prix suivra l'offre vedette, sans descendre sous le plancher ni dépasser le plafond.", rpEd_e_vf: "Écart : un nombre positif, deux décimales au plus.", rpEd_fcRfOk: "Choix enregistré. Calculé en Simulation : aucun prix n'est envoyé à Amazon.", rpEd_fcRfNonEnr: "Sera enregistré avec la règle. Calculé en Simulation : aucun prix n'est envoyé à Amazon.", rpEd_fc_vendeurs_fiche: "Repricer", rpEd_fcd_vendeurs_fiche: "Vous et d'autres vendeurs sur la même fiche Amazon.", rpEd_fcAClasser: "À classer : tant qu'aucune façon n'est choisie, la règle garde son calcul actuel.", rpEd_fcNonEnr: "Sera enregistré avec la règle. Ce calcul n'est pas encore actif : aucun conseil n'en dépend aujourd'hui.", rpEd_fcInactif: "Choix enregistré. Ce calcul n'est pas encore actif : aucun conseil n'en dépend aujourd'hui.",
  rpEd_fcLe: (d) => `Choisi le ${d}.`,
  rpEd_enr: "Enregistrer", rpEd_resAria: "Aperçu de la règle", rpEd_pl_lim: "Limites", rpEd_pl_ctb: "Contribution", rpEd_pl_pays: "Pays", rpEd_pl_mode: "Mode", rpEd_plv_profit: "contribution", rpEd_plv_marge: "marge", rpEd_plv_roi: "retour sur coût", rpEd_plv_mini: (x) => `${x} mini`, rpEd_plv_maxi: (x) => `${x} maxi`, rpEd_plv_aucune: "aucune limite", rpEd_plv_ctb: "prix HT − frais − achat, avant pub", rpEd_plv_mode_concurrents: "produits concurrents", rpEd_plv_mode_vendeurs_fiche: "vendeurs de la fiche",
  rpEd_clsRes: "Tant qu'elle n'a pas de mode, cette règle garde son calcul actuel.", rpEd_clsN: (n) => `${n} ${n > 1 ? "offres suivent" : "offre suit"} cette règle`, rpEd_fcSpOk: "Choix enregistré.", rpEd_fcSpNonEnr: "Sera enregistré avec la règle.", rpEd_fcSpSans: "Sans écart de prix, SmartPrice ne suit aucun concurrent ; il ramène seulement dans la règle un prix qui en sort (trop bas, trop haut ou non autorisé).", rpEd_ecExPlC: (x) => `contribution ${x}`, rpEd_ecCoChoisir: "Choisir un concurrent comparable", rpEd_ecCoHors: (a) => `${a} (n'est plus comparable)`,
  rpEd_fcq_concurrents: "face à des produits concurrents", rpEd_fcq_vendeurs_fiche: "face aux autres vendeurs de la fiche", rpEd_clsT: "Cette règle n'a pas encore de mode.", rpEd_clsD: (n) => `Elle date d'avant SmartPrice. ${n} ${n > 1 ? "offres la suivent" : "offre la suit"}. Choisissez une fois ; ses limites sont gardées.`, rpEd_passer_concurrents: "Passer en SmartPrice", rpEd_passer_vendeurs_fiche: "Passer en Repricer", rpEd_mq_facon: "Choisissez un mode pour enregistrer. Aucun prix n'est modifié chez Amazon.", rpEd_mq_ecart: "Choisissez un écart de prix pour enregistrer. Aucun prix n'est modifié chez Amazon.",
  rpEd_ec: "Écart de prix", rpEd_ec_m5: "5 % moins cher", rpEd_ec_0: "Au même prix", rpEd_ec_p5: "5 % plus cher", rpEd_ec_autre: "Autre", rpEd_ecQue: "que", rpEd_ecRef: "Prix de référence", rpEd_ecC_moins_cher: "le moins cher", rpEd_ecC_mediane: "la médiane", rpEd_ecC_choisi: "un concurrent choisi", rpEd_ecVal: "Écart", rpEd_ecU: "Unité", rpEd_ecS: "Sens", rpEd_ecS_moins: "moins cher", rpEd_ecS_plus: "plus cher", rpEd_ecAsin: "ASIN du concurrent", rpEd_ecH: "parmi vos concurrents déclarés comparables, produit par produit", rpEd_e_ecart: "Écart : un nombre positif, deux décimales au plus, sous 100 % (ou 10 000 en devise).", rpEd_e_asin: "ASIN du concurrent : 10 lettres ou chiffres.",
  rpEd_ecPh_aucun: "Choisissez un écart : le prix suivra vos concurrents comparables, sans descendre sous le plancher ni dépasser le plafond.", rpEd_ecPh_moins: (v, r) => `Prix placé ${v} sous ${r}, sans descendre sous le plancher ni dépasser le plafond.`, rpEd_ecPh_egal: (r) => `Prix aligné sur ${r}, sans descendre sous le plancher ni dépasser le plafond.`, rpEd_ecPh_plus: (v, r) => `Prix placé ${v} plus cher que ${r}, sans descendre sous le plancher ni dépasser le plafond.`, rpEd_ecR_moins_cher: "le moins cher des concurrents comparables", rpEd_ecR_mediane: "la médiane des concurrents comparables", rpEd_ecR_choisi: (a) => `le concurrent ${a}`,
  rpEd_ecEx: (n) => `Exemple · ${n}`, rpEd_ecExMoins: (n) => `le moins cher de ${n} comparable${n > 1 ? "s" : ""}`, rpEd_ecExMed: "Médiane", rpEd_ecExMedD: (n) => `de ${n} comparables`, rpEd_ecExChoisi: "concurrent choisi", rpEd_ecExCons: "Prix conseillé", rpEd_ecExCtb: "Contribution par vente", rpEd_ecExCtbD: "HT, avant pub, estimée", rpEd_ecExPl: "Plancher", rpEd_ecExPlD: "premier prix permis par les limites", rpEd_ecExNone: "Exemple chiffré indisponible : aucun produit chargé n'a assez de concurrents comparables au prix récent pour cette référence.",
  rpLb_fClasser: "À classer", rpEd_annuler: "Annuler", rpEd_saveV: (v) => `Enregistrer la version ${v}`, rpEd_saveNew: "Enregistrer la règle",
  rpEd_saveProp: "Enregistrer la règle propre", rpEd_busy: "Enregistrement…", rpEd_ko: (m) => `Rien n'a été écrit : ${m}`,
  rpEd_cflProp: "La règle propre a changé ailleurs : rien n'a été écrit. Fermer et rouvrir pour repartir de la version enregistrée.",
  rpEd_e_champ: "Une barrière n'est pas un nombre positif.", rpEd_e_grand: "Bénéfice mini : moins de 100 par vente ; bénéfice maxi : moins d'un million.", rpEd_e_vide: "Au moins un minimum : bénéfice, marge ou retour sur coût.",
  rpEd_e_maxi: "Un maximum est au plus égal au minimum du même critère.", rpEd_e_nom: "Nom de la règle : 1 à 80 caractères.", rpEd_e_pays: "Choisir au moins un pays.",
  rpEd_cflT: "Cette règle a changé pendant la modification : rien n'a été écrit.",
  rpEd_cflD: (lu, v, le) => `Version ${lu} lue ; version ${v} enregistrée ailleurs${le ? ` le ${le}` : ""}. Voici la fusion proposée ; elle ne s'enregistre qu'avec « Enregistrer la version ${v + 1} ».`,
  rpEd_cChamp: "Champ", rpEd_cLu: (v) => `Lu (v${v})`, rpEd_cSaisie: "Saisie ici", rpEd_cTrouve: (v) => `Version ${v}`, rpEd_cRes: (v) => `Résultat v${v}`, rpEd_cOrig: "Origine",
  rpEd_oSaisie: "saisie gardée", rpEd_oReprise: (v) => `version ${v} reprise`, rpEd_oIdem: "Aucun champ ne diffère : seule la version change.", rpEd_abandon: (v) => `Abandonner la saisie (garder la version ${v})`,
  rpPp_ouvrir: "Règles et prix par pays", rpPp_retour: "Tous les produits", rpPp_cout: "Coût d'achat", rpPp_coutMoy: "moyenne pondérée", rpPp_charge: "calcul…",
  rpPp_th_pays: "Pays", rpPp_th_etat: "Offre · vedette", rpPp_th_prix: "Prix actuel TTC", rpPp_th_cons: "Conseil · simulation", rpPp_th_ben: "Bénéfice", rpPp_th_marge: "Marge sur prix HT",
  rpPp_th_roi: "Retour / coût", rpPp_th_eq: "Prix d'équilibre", rpPp_th_mini: "Prix mini règle", rpPp_th_aff: "Règle affectée", rpPp_th_app: "Règle appliquée",
  rpPp_conseil: "Conseil", rpPp_roi2: "Retour sur coût", rpPp_mini2: "Prix mini de la règle", rpPp_plus: "Bénéfice, marge, prix d'équilibre, prix mini",
  rpPp_active: "Active", rpPp_inactive: "Inactive", rpPp_bbNous: "Vedette à nous", rpPp_bbInc: "vedette inconnue", rpPp_inactif: "offre inactive : rien à conseiller",
  rpPp_indispo: "Indisponible", rpPp_sansApp: "aucune règle applicable", rpPp_garder: "garder", rpPp_releve: (h) => `relevé il y a ${h} h`,
  rpPp_foepT: "Prix à viser d'Amazon pas encore relevé : un « garder » peut venir de ce manque", rpPp_dansBornes: "dans les bornes",
  rpPp_g_buy_box_detenue: "offre vedette à nous", rpPp_g_seule_offre: "seule offre", rpPp_g_buy_box_perdue_sans_prix_a_viser: "prix à viser non relevé", rpPp_g_deja_au_prix_vise: "déjà au prix visé",
  rpPp_horsGrille: "hors grille", rpPp_enConflit: "en conflit",
  rpPp_selAucune: "— aucune", rpPp_selNonCouv: "(pays non couvert)", rpPp_introuvable: "Règle introuvable", rpPp_choisir: (mp) => `Règle affectée · ${mp}`,
  rpPp_propreSeule: "règle propre seule", rpPp_rempl: (v) => `v${v} · remplacée par la règle propre`,
  rpPp_et_pays_non_couvert: "Affectée, mais non applicable", rpPp_et_archivee: "Archivée · non appliquée", rpPp_et_introuvable: "Introuvable · non appliquée",
  rpPp_aucuneApp: "aucune", rpPp_compteAbs: "règle du compte absente", rpPp_sansRegle: "aucune règle", rpPp_propre: "Règle propre",
  rpPp_src_produit: "propre", rpPp_src_nommee: "nommée", rpPp_src_defaut: "compte",
  rpPp_motif_pays_non_couvert: "à la place de la règle affectée : pays non couvert", rpPp_motif_archivee: "à la place de la règle affectée : archivée",
  rpPp_motif_introuvable: "à la place de la règle affectée : introuvable",
  rpPp_calcT: (p) => `Détail du calcul · ${p} au prix actuel`, rpPp_ttc: "TTC", rpPp_tva: "TVA", rpPp_ht: "HT", rpPp_frais: "frais Amazon à ce prix", rpPp_coutA: "coût d'achat",
  rpPp_benef: "bénéfice", rpPp_marge: "marge", rpPp_roi: "retour sur coût",
  rpPp_fxT_remplacee: "Règle nommée affectée, mais remplacée par la règle propre du produit.", rpPp_fxD_remplacee: (nom, v, p) => `« ${nom} » v${v} est enregistrée pour ${p} ; la règle propre s'applique.`,
  rpPp_creerPropre: "Créer une règle propre", rpPp_retirerPropre: "Retirer la règle propre", rpPp_modPropre: "Modifier la règle propre", rpPp_modRegle: "Modifier la règle",
  rpPp_fxT_pays: "Pays non couvert par la règle affectée.", rpPp_fxD_pays: (nom, p) => `« ${nom} » ne couvre pas ${p} : elle n'y est pas appliquée. La règle du compte s'applique à sa place, nommée dans « Règle appliquée ».`,
  rpPp_ajouterPays: (c) => `Ajouter ${c} à la règle`, rpPp_autreRegle: "Affecter une autre règle",
  rpPp_fxT_archivee: "Règle nommée archivée : non appliquée.", rpPp_fxD_archivee: (nom) => `« ${nom} » est archivée ; la règle du compte s'applique à sa place.`,
  rpPp_fxT_introuvable: "Règle nommée introuvable : non appliquée.", rpPp_fxD_introuvable: "L'affectation désigne une règle qui n'existe plus ; la règle du compte s'applique à sa place.",
  rpPp_fxT_aucune: "Aucune règle applicable : aucune recommandation.", rpPp_fxD_aucune: "La règle affectée ne s'applique pas ici et le compte n'a pas de règle : rien ne la remplace en silence.",
  rpPp_fxT_conflit: "Aucun prix permis", rpPp_fxD_conflit: ": les barrières de la règle appliquée ne laissent aucun prix de la grille.",
  rpPp_fxT_perime: (h) => `Relevé de prix trop ancien (${h} h)`, rpPp_fxD_perime: ": rien n'est recommandé tant qu'un relevé de moins de 36 h n'est pas arrivé.",
  rpPp_coutT: "Coût d'achat inconnu", rpPp_coutD: (n) => ` : bénéfice, marge et prix mini sont incalculables dans les ${n} pays ; aucune recommandation.`, rpPp_saisirCout: "Saisir le coût d'achat",
  rpPp_f1T: "Prix à viser d'Amazon pas encore relevé", rpPp_f1D: " : un « garder » peut venir de ce manque.",
  rpPp_f2T: "Offre vedette", rpPp_f2D: " : « à nous » ou « inconnue » ; le relevé ne sait pas encore dire « perdue ».",
  rpPp_f3T: "Chiffres", rpPp_f3D: " au prix actuel TTC, avant publicité ; marge sur prix HT · règle et version notées à chaque simulation · relevé de plus de 36 h = indisponible.",
  rpAf_sel: (n) => `${n} produit(s) sélectionné(s)`, rpAf_sur: (n) => `sur ${n}`, rpAf_desel: "Tout désélectionner", rpAf_tout: "Tout sélectionner", rpAf_cocher: "Choisir",
  rpAf_th_prod: "Produit", rpAf_th_pays: "Pays vendus", rpAf_th_regles: "Règles actuelles", rpAf_titre: (n) => `Affecter une règle · ${n} produit(s)`,
  rpAf_regle: "Règle", rpAf_choisir: "Choisir une règle", rpAf_pays: "Pays", rpAf_apercu: "Aperçu", rpAf_nonCouv: "non couvert",
  rpAf_vendus: (tot, sans) => `produits × pays vendus dans les pays choisis (sur ${tot} ; ${sans} sans offre, non touchés)`,
  rpAf_chg: "changent de règle : la règle choisie devient effective", rpAf_deja: "déjà sur cette règle : inchangés", rpAf_prop: "gardent leur règle propre : affectation enregistrée, non effective",
  rpAf_hint: "Rien d'automatique en plus : seule l'affectation change. Simulation uniquement, aucun prix Amazon modifié.", rpAf_aucunSel: "Cocher des produits dans la liste.",
  rpRe_envLc: (a) => `Relu ${a}`, rpRe_coutEstC: "Coût estimé", rpRe_coutDc: "Prix non calculable", rpRe_gc_tenue: (n) => `${n} tenue${n > 1 ? "s" : ""}`, rpRe_gc_perdue: (n) => `${n} perdue${n > 1 ? "s" : ""}`, rpRe_gc_aucune: (n) => `${n} sans offre vedette`, rpRe_gc_inconnue: (n) => `${n} inconnu${n > 1 ? "s" : ""}`,
  rpRe_iAria: "Situation de l'offre vedette", rpRe_i_offres: "Offres", rpRe_i_tenue: "Tenues", rpRe_i_perdue: "Perdues", rpRe_i_aucune: "Sans offre vedette", rpRe_i_inconnue: "Inconnues",
  rpRe_g_tenue: (n) => `${n} où vous tenez l'offre vedette`, rpRe_g_perdue: (n) => `${n} où l'offre vedette est perdue`, rpRe_g_aucune: (n) => `${n} fiche${n > 1 ? "s" : ""} sans offre vedette`, rpRe_g_inconnue: (n) => `${n} état${n > 1 ? "s" : ""} inconnu${n > 1 ? "s" : ""}`,
  rpRe_simuP: "Simulation :", rpRe_aLire: (n) => `${n} conseil${n > 1 ? "s" : ""} à lire`, rpRe_pos: (n) => `Situation de l'offre vedette, sur ${n} offre${n > 1 ? "s" : ""}`,
  rpRe_rien: "Rien à faire", rpRe_rienD: (h, n) => `Aucune offre ne demande de geste. Dernier calcul à ${h}, sur ${n > 1 ? `les ${n} offres` : `${n} offre`}.`, rpRe_rienDx: (n) => `Aucune offre ne demande de geste, sur ${n > 1 ? `les ${n} offres` : `${n} offre`}.`, rpRe_prochaines: "Les prochaines actions s'affichent ici.",
  rpRe_coutEst: "Coût d'achat estimé :", rpRe_coutInc: "Coût d'achat inconnu", rpRe_aConf: "À confirmer", rpRe_coutD: "Prix non calculable avant confirmation du coût dans COGS", rpRe_confCogs: "Confirmer dans COGS",
  rpRe_conflitD: (p, f) => `Plancher ${p} au-dessus du plafond ${f}`, rpRe_sousPl: "Offre vedette sous votre plancher", rpRe_sousPlD: "Prix gardé au plancher · choix rentable", rpRe_sousPlDx: "Prix gardé · choix rentable",
  rpRe_nivInc: "Niveau inconnu", rpRe_pays: "Pays :",
  rpRe_trier: "Trier", rpRe_trierP: "Trier :", rpRe_tri_pays: "Pays", rpRe_tri_produit: "Produit", rpRe_tri_variation: "Variation", rpRe_tri_contribution: "Contribution",
  rpRf_regle: (n) => `Règle : ${n}`, rpRf_st_tenue: "Offre vedette tenue", rpRf_st_perdue: "Offre vedette perdue", rpRf_st_aucune: "Sans offre vedette", rpRf_st_inconnue: "Offre vedette inconnue",
  rpRf_simt: "Simulation · Aucun envoi à Amazon", rpRf_conserve: "Prix conservé au plancher", rpRf_garde: "Prix gardé", rpRf_ved: "Offre vedette", rpRf_suiv: "Offre suivante",
  rpRf_actuel: "Prix actuel", rpRf_propose: "Prix proposé", rpRf_veut: "Ce que ça veut dire", rpRf_faire: "Ce que vous pouvez faire",
  rpRf_alignB: "Au même prix livré que l'offre vedette", rpRf_align: (q, p, port, x) => `, tenue par ${q} : votre prix d'article ${p} + port ${port}${x}, `, rpRf_align2: ". Aligné, pas moins cher : atteindre ce prix ne garantit pas l'offre vedette.",
  rpRf_viseB: (p) => `Prix visé : ${p}`, rpRf_vise: (pv, port) => `, pour une offre vedette à ${pv} livré (votre port : ${port}). Atteindre ce prix ne garantit pas l'offre vedette.`,
  rpRf_plafB: "Au plafond de votre règle", rpRf_plaf: (pv, pf) => ` : l'offre vedette est à ${pv} livré, au-dessus de votre plafond de ${pf}. Atteindre ce prix ne garantit pas l'offre vedette.`,
  rpRf_tenueB: "Vous tenez l'offre vedette.", rpRf_suivTxt: (p, l) => ` La prochaine offre comptée${l ? ` (${l})` : ""} est à ${p} livré.`, rpRf_hausse24: (m, h) => ` Hausse facultative : ${m} au plus sur 24 h, depuis votre prix d'hier (${h}).`,
  rpRf_hausse: " Hausse facultative.", rpRf_risque: " Une hausse peut vous faire perdre l'offre vedette.", rpRf_tenueGarde: " Prix gardé.",
  rpRf_sousPl: (q, pv, ec) => `${q} tient l'offre vedette à ${pv}, soit ${ec} sous votre plancher.`, rpRf_sousPlCtb: (x) => ` À ce prix, votre contribution tomberait à ≈ ${x} par vente`, rpRf_minDe: (m) => `, pour un minimum de ${m}`,
  rpRf_inconnue: "L'état de l'offre vedette est inconnu : aucun prix n'est calculé.", rpRf_cause: (x) => `Cause : ${x}.`, rpRf_aucune: "Aucune offre vedette sur cette fiche au dernier relevé : aucun prix n'est calculé.",
  rpRf_ctbK: "Contribution estimée, HT", rpRf_ctbK2: "Contribution estimée avant publicité", rpRf_vente: " / vente",
  rpRf_ctbAu: (b, ec, m) => `Contribution estimée avant publicité : ${b} par vente, soit ${ec} au-dessus de votre minimum de ${m}.`, rpRf_ctbSur: (b, ec, m) => `Contribution estimée avant publicité : ${b} par vente, soit ${ec} au-dessus de votre maximum de ${m}.`, rpRf_ctbSous: (b, ec, m) => `Contribution estimée avant publicité : ${b} par vente, soit ${ec} sous votre minimum de ${m}.`,
  rpRf_ctbPerte: "Si l'offre vedette est perdue, un nouveau calcul proposera une baisse, à valider.", rpRf_ctbAct: (p) => `À votre prix actuel de ${p}.`, rpRf_ctbActMin: (p) => `À votre prix actuel de ${p} : c'est votre minimum.`,
  rpRf_simnB: "Simulation.", rpRf_simn: " Aucun prix ne part chez Amazon. Ce conseil se lit, il ne s'envoie pas.",
  rpRf_f_garder: (p) => `Garder ${p}`, rpRf_f_garderPl: ", votre plancher : un choix rentable.", rpRf_f_remonte: "Si l'offre vedette remonte, un nouveau calcul proposera une hausse, à valider.", rpRf_f_min: (n) => `Ou baisser le minimum de la règle (${n} offre${n > 1 ? "s" : ""}).`,
  rpRf_vdr: "Vendeurs de la fiche", rpRf_mInc: "Éligibilité inconnue", rpRf_mBientot: "Bientôt disponible", rpRf_mSecu: "Simulation · envoi pas encore ouvert", rpRf_deux: (a, b) => `${a} : ${b}`, rpRf_vdL: (l) => `Vendeur ${l}`, rpRf_autreV: "un autre vendeur", rpRf_autreVM: "Un autre vendeur", rpRf_nOffres: (n) => `${n} offre${n > 1 ? "s" : ""}`, rpRf_expA: " (expédié par Amazon)", rpRf_expV: " (expédié par vous)", rpRf_vdrInc: "relevé inconnu", rpRf_hist: "Historique des prix",
  rpRe_videT: "Aucune offre ne suit Repricer", rpRe_videD: "Repricer place votre prix face aux autres vendeurs d'une même fiche Amazon, pour tenir l'offre vedette. Deux étapes pour obtenir vos premiers conseils.",
  rpRe_e_1: "Règle", rpRe_e_1d: "écart et limites", rpRe_e_1a: "Créer une règle", rpRe_e_2: "Offres", rpRe_e_2d: "appliquer la règle", rpRe_videB: "Les vendeurs de chaque fiche sont relevés chez Amazon : rien d'autre à choisir.",
  rpC_simulation: "Simulation", rpRzK_offre_vedette_perdue_prix_vise: "Au prix de l'offre vedette", rpRzK_offre_vedette_perdue_prix_vise_plafond: "Au plafond, sous l'offre vedette",
  rpRzK_hausse_vers_vendeur_suivant: "Hausse facultative", rpRzK_hausse_vers_vendeur_suivant_plafond: "Hausse facultative", rpRzK_hausse_vers_vendeur_suivant_limite_24h: "Hausse facultative",
  rpSpF_rien: "Rien à faire", rpSpF_aCompleter: "Configuration à compléter", rpSpF_sansTxt: (n, p) => `${n} offre${n > 1 ? "s" : ""}, prix gardé${p ? ` : ${p}` : ""}`, rpSpF_dVise: (n) => `${n} au prix visé`,
  rpSpFcD: "Prix non calculable", rpSpFcD_cout_inconnu: "Prix non calculable sans ce coût", rpSpFcD_bornes_en_conflit: "Prix non calculable avec ces limites",
  rpK5_aria: "Position des prix face au prix visé", rpK5_offres: "Offres", rpK5_vise: "Au prix visé", rpK5_ajuster: "À ajuster", rpK5_plancher: "Au plancher", rpK5_nonCalc: "Non calculables",
  rpK5_aFaire: "À faire :", rpK5_env: (n) => `${n} envoi${n > 1 ? "s" : ""} à vérifier`, rpK5_prix: (n) => `${n} prix à valider`, rpK5_conf: (n) => `${n} configuration${n > 1 ? "s" : ""} à compléter`,
  rpK5_pos: (n) => `Position de vos prix face au prix visé, sur ${n} offre${n > 1 ? "s" : ""}`, rpSl_thVar: "Variation", rpSl_thRaison: "Raison", rpSl_thCtb: "Contribution*",
  rpSl_ctbNote: "* Contribution estimée par vente, HT, avant publicité, au prix proposé.", rpSl_sku: (s) => `SKU : ${s}`, rpSl_skuInc: "SKU inconnu", rpSp_apres: (n) => `Après l'étape ${n}`,
  rpRzK_sous_le_plancher: "Remonter au plancher", rpRzK_au_dessus_du_plafond: "Redescendre au plafond", rpRzK_prix_actuel_non_admissible: "Ramener dans la règle", rpRzK_cible_concurrents: "Sur la cible", rpRzK_cible_concurrents_plancher: "Cible sous le plancher", rpRzK_cible_concurrents_plafond: "Cible au-dessus du plafond", rpRzK_cible_concurrents_hors_regle: "Cible hors de la règle", rpRzK_cible_concurrents_non_estimable: "Prix permis le plus proche", rpRzK_buy_box_perdue_prix_a_viser: "Aligné sur l'offre vedette",
  rpRzQ: (e, s, c) => { const a = { moins_cher: ["le moins cher", "du moins cher"], mediane: ["la médiane", "de la médiane"], choisi: ["le concurrent choisi", "du concurrent choisi"] }[c]; return !a ? null : s < 0 ? `${e} sous ${a[0]}` : s > 0 ? `${e} au-dessus ${a[1]}` : `Au prix ${a[1]}`; }, rpSpF_dSansPl: (n) => `${n} sans plancher connu`, rpSpF_dSansPrix: (n) => `${n} sans prix actuel relevé`,
  rpSl_envoi: "Envoi à vérifier", rpSl_envT: "Résultat Amazon non confirmé", rpSl_envD: (a) => `Demandé ${a}`, rpSl_envL: (a) => `Relu chez Amazon ${a}`,
  rpSl_verifier: "Vérifier", rpSl_ec: (s, v) => `${s}${v} %`, rpSl_barre: "Offres dont la règle suit SmartPrice",
  rpSl_voirRe: (n) => (n > 1 ? `Voir les ${n} offres Repricer` : "Voir l'offre Repricer"), rpSl_voirReC: (n) => `${n} offre${n > 1 ? "s" : ""} Repricer`, rpSpTh_regle: "Règle",
  rpSpTh_prix: "Prix actuel", rpSpTh_sit: "Situation actuelle", rpSpTh_conseil: "Prix proposé", rpSl_aff: (a, b) => `${a} sur ${b} affichée${b > 1 ? "s" : ""}`, rpSl_suiv: "Suivantes",
  rpSl_auj: (s) => `Aujourd'hui ${s.charAt(0).toLowerCase()}${s.slice(1)}`, rpSl_trier: "Trier", rpSl_sousPl: "Sous le plancher",
  rpSd_refAria: "Référence", rpSd_mediane: "la médiane", rpSd_pct: (v) => `${v}\u00a0%`, rpSd_sous: (e, n) => `${e} sous ${n}`, rpSd_dessus: (e, n) => `${e} au-dessus de ${n}`, rpSd_egal: (n) => `Au prix de ${n}`,
  rpSd_ilYa: (a) => `il y a ${a}`, rpSd_sousPl: (m) => `Prix actuel à ${m} sous le plancher.`, rpSd_remonte: (p, c, pl) => `${p} donnerait ${c} : le conseil remonte au plancher, ${pl}.`,
  rpSd_cz_moins_cher: (p, n) => (n ? `${p}, le moins cher des ${n} concurrents comparables au prix relevé.` : `${p}, le moins cher des concurrents comparables.`),
  rpSd_cz_mediane: (p, n) => (n ? `${p} des ${n} concurrents comparables au prix relevé.` : `${p} des concurrents comparables.`), rpSd_cz_choisi: (p) => `${p}, le concurrent choisi.`,
  rpSd_ctb: "Contribution par vente", rpSd_ctbD: "HT, avant pub", rpSd_seuilPlus: (n) => `Vous gagnez autant si les ventes augmentent de ${n}\u00a0%.`, rpSd_seuilMoins: (n) => `Vous gagnez autant même si les ventes baissent de ${n}\u00a0%.`,
  rpSd_recapT: "Envoyer ce prix à Amazon ?", rpSd_recapSous: "avant l'envoi à Amazon", rpSd_pays: "Pays", rpSd_prixDem: "Prix demandé", rpSd_regle: "Règle", rpSd_envoyer: (p) => `Envoyer ${p} à Amazon`, rpSd_retour: "Retour",
  rpSd_recapNote: "La barre de confirmation demande ensuite une dernière validation. Après l'envoi, GTINPilot relit le prix affiché par Amazon ; tant qu'il n'est pas confirmé, l'offre reste dans « Envoi à vérifier ».",
  rpSd_coutT: "Coût d'achat par unité", rpSd_coutP: "Il se saisit à un seul endroit : la page des coûts d'achat.", rpSd_coutLien: "Saisir le coût d'achat", rpSd_aussi: (p) => `aussi bloquée en ${p}`,
  rpSd_pub: "Publicité", rpSd_pubV: (m) => `${m} par vente`, rpSd_pubNon: "non mesurée", rpSd_nonCalc: "non calculé", rpSd_ramene: "prix livré, à votre format",
  rpF_aValider: "À valider", rpF_conseils: "Conseils", rpF_aDebloquer: "À débloquer", rpF_sans: "Sans changement", rpF_examiner: "Examiner", rpF_voir: "Voir",
  rpF_saisirCout: "Saisir le coût", rpF_modifRegle: "Modifier la règle", rpF_toutVoir: "Tout voir", rpF_nOffres: (n) => `${n} offre${n > 1 ? "s" : ""}`,
  rpF_sansTxt: (n, p) => `${n} offre${n > 1 ? "s" : ""}${p ? `, dont ${p}` : ""}`, rpF_dPl: (n) => `${n} au plancher`, rpF_dPromo: (n) => `${n} en promotion`,
  rpF_dStock: (n) => `${n} sans stock vendable`, rpF_rien: "Rien à décider", rpF_derniere: "Dernière modification", rpF_prochaines: "Les prochaines décisions s'affichent ici.",
  rpF_dIgn: (n) => `${n} ignorée${n > 1 ? "s" : ""}`, rpF_ignores: "Conseils ignorés", rpD_ignorer: "Ignorer ce conseil", rpD_ignLe: (d) => `Conseil ignoré le ${d}`,
  rpD_ignRevient: "Il revient dans la file si la situation change.", rpD_ignRet: "Ne plus ignorer", rpD_ignOk: (h) => `Conseil ignoré (calcul de ${h})`,
  rpD_ignNouveau: "La situation a changé : le conseil reste à examiner.", rpD_ignRelErr: "Enregistré ; relecture impossible : recharger la page.", rpD_ignRetEncore: "Le conseil est encore ignoré : recharger la page.", rpD_ignRetOk: "Le conseil n'est plus ignoré.",
  rpD_ignIll: "Liste des conseils ignorés illisible : « Ignorer » est indisponible.", rpD_ignErr: (m) => `Non enregistré : ${m}`, rpD_ignBusy: "Enregistrement…",
  rpFc_envoi_non_confirme: "Envoi non confirmé", rpFc_envoi_refuse: "Envoi refusé", rpFc_refuse_amazon: "Refusé par Amazon", rpFc_cout_inconnu: "Coût d'achat inconnu",
  rpFc_bornes_en_conflit: "Limites en conflit", rpFc_frais_inconnus: "Frais Amazon inconnus", rpFc_sans_prix: "Prix actuel inconnu ou relevé trop ancien", rpFc_aucun: "Calcul jamais passé",
  rpFc_bloque: "Bloqué", rpFc_situation_changee: "Situation changée depuis le calcul",
  rpD_regle: (n) => `règle ${n}`, rpD_conseille: "Conseillé", rpD_actuel: "Prix actuel", rpD_releve: (a) => `relevé il y a ${a}`, rpD_plancher: "Plancher", rpD_plafond: "Plafond",
  rpD_sousPl: "sous le plancher", rpD_dessusPf: "au-dessus du plafond", rpD_valider: (p) => `Valider ${p}`, rpD_recap: "Un récapitulatif s'ouvre avant l'envoi à Amazon.",
  rpD_simu: "Simulation : aucun prix ne part chez Amazon. Ce conseil se lit, il ne s'envoie pas.", rpD_benef: (p) => `Bénéfice par vente à ${p}`, rpD_calcPl: "Calcul du plancher",
  rpD_calcPlD: "Plus bas prix de la grille d'Amazon qui respecte la règle (bénéfice, marge, retour sur coût), avec les frais estimés à ce prix.",
  rpD_sitChg: (h) => `Situation changée depuis le calcul de ${h}`, rpD_sitRegle: "La règle a changé depuis ce calcul.", rpD_sitPrixAct: (p) => `Prix actuel relevé depuis : ${p}.`,
  rpD_sitPrix: (p) => `Prix relu chez Amazon : ${p}. Rien n'a été proposé.`, rpD_prochain: "Nouveau conseil au prochain calcul.", rpD_limChg: (h) => `Limites changées depuis le calcul de ${h}`,
  rpD_nonCalc: "Prix non calculable", rpD_coutPl: "Coût d'achat inconnu : le plancher ne peut pas être calculé.", rpD_coutEst: "Coût estimé",
  rpD_estDe: (j) => `d'après le lot confirmé précédent · réception du ${j}`, rpD_aConfirmer: "À confirmer dans l'onglet COGS", rpD_ouvrirCogs: "Ouvrir COGS", rpD_coutND: "Coût non déterminable",
  rpD_coutR_change_absent: "taux de change du jour de réception absent", rpD_coutR_sans_jour: "réception sans date", rpD_coutR_autre_zone_seulement: "lots confirmés dans une autre zone seulement",
  rpD_coutR_aucun_lot_avant: "aucun lot confirmé avant cette réception", rpD_coutR_egalite_ambigue: "plusieurs coûts différents le même jour",
  rpD_coutR_aucune_estimation: "aucune estimation pour ce produit dans cette zone", rpD_coutR_aucune_reception: "aucune réception de ce produit dans cette zone", rpD_coutR_zone_inconnue: "zone de stock du pays inconnue",
  rpD_envAttente: "En attente de validation", rpD_env_PENDING: "Proposition prête : la barre « Valider » en bas de l'écran l'envoie, après son récapitulatif.",
  rpD_env_EN_COURS: "Envoi en cours : aucun nouvel envoi tant que le résultat n'est pas connu.", rpD_attente: "Le conseil sera recalculé ; en attendant, aucun envoi depuis ce conseil.", rpP_envBloque: "Envoi non confirmé sur cette offre : aucun nouvel envoi d'ici tant que son résultat n'est pas connu (onglet Décisions).",
  rpD_env_UNKNOWN: "Résultat inconnu chez Amazon : aucun nouvel envoi depuis cet écran. Vérifier le prix dans Seller Central.", rpD_motif: "Motif", rpD_motifNC: "motif non communiqué",
  rpD_envRetour: "Un nouveau conseil s'affichera après le prochain calcul.",
  rpMo_VALUE_CHANGED: "prix ou limites changés chez Amazon depuis la proposition (Seller Central)", rpMo_RULE_CHANGED: "la règle de prix a changé depuis la proposition : proposez de nouveau. Rien n'a été envoyé.", rpMo_RULE_UNVERIFIABLE: "la règle de prix n'a pas pu être vérifiée : proposez de nouveau. Rien n'a été envoyé.", rpMo_UNSUPPORTED_DISCOUNT: "un prix remisé planifié existe chez Amazon",
  rpMo_UNSUPPORTED_OFFER: "offre non prise en charge", rpMo_PREVIEW_INVALID: "aperçu refusé par Amazon", rpMo_PREVIEW_FAILED: "aperçu impossible chez Amazon", rpMo_FROZEN: "envois gelés pour ce compte",
  rpMo_TOO_SLOW: "envoi trop lent, arrêté avant l'émission", rpMo_TOKEN_FAILED: "accès Amazon indisponible", rpMo_READ_FAILED: "prix illisible chez Amazon", rpMo_OFFER_BUSY: "un autre prix était en cours d'envoi",
  rpMo_CURRENCY: "devise de l'offre différente", rpMo_NO_PRODUCT_TYPE: "type de produit absent de la fiche", rpMo_INVALID: "demande jugée invalide par Amazon", rpMo_http: (c) => `Amazon a refusé la demande (HTTP ${c})`,
  rpRz_sous_le_plancher: "Prix actuel sous le plancher", rpRz_au_dessus_du_plafond: "Prix actuel au-dessus du plafond", rpRz_prix_actuel_non_admissible: "Prix actuel hors de la règle : ramené au prix permis le plus proche",
  rpRz_buy_box_perdue_prix_a_viser: "Offre vedette perdue : prix aligné sur l'offre vedette", rpRz_seule_offre: "Seule offre de la fiche : prix gardé", rpRz_buy_box_detenue: "Offre vedette détenue : prix gardé",
  rpRz_buy_box_perdue_sans_prix_a_viser: "Offre vedette perdue, aucun prix à viser relevé", rpRz_deja_au_prix_vise: "Déjà au prix visé", rpRz_promotion_en_cours: "Promotion en cours : conseil en pause",
  rpRz_non_achetable: "Stock vendable nul", rpRz_aucun_prix_admissible: "Aucun prix ne respecte toutes les limites de la règle",
  rpRzF: (f, e) => `${f} : ${e}`, rpRzF_releve_prix: "Relevé de notre prix", rpRzF_prix_actuel: "Prix actuel", rpRzF_stock: "Relevé du stock", rpRzF_promotions: "Relevé des promotions",
  rpRzF_cout_achat: "Coût d'achat", rpRzF_frais_prix_actuel: "Frais Amazon au prix actuel", rpRzE_absent: "absent", rpRzE_perime: "trop ancien", rpRzE_invalide: "illisible", rpRzE_inconnu: "inconnu",
  rpRz_concurrents_parametres_absents: "Face aux concurrents : cible non posée dans la règle", rpRz_concurrents_choisi_absent: "Face aux concurrents : concurrent choisi absent de la liste", rpRz_concurrents_choisi_exclu: "Face aux concurrents : concurrent choisi écarté du calcul", rpRz_concurrents_aucun_prix_admissible: "Face aux concurrents : aucun prix concurrent utilisable", rpRz_concurrents_couverture_insuffisante: "Face aux concurrents : trop peu de prix récents pour conclure", rpRz_concurrents_mediane_moins_de_2_prix: "Face aux concurrents : moins de 2 prix pour une médiane",
  rpRz_cible_concurrents: "Face aux concurrents : prix placé sur la cible", rpRz_cible_concurrents_plancher: "Face aux concurrents : cible sous le plancher, prix au plancher", rpRz_cible_concurrents_plafond: "Face aux concurrents : cible au-dessus du plafond, prix au plafond", rpRz_deja_a_la_cible_concurrents: "Face aux concurrents : déjà à la cible", rpRz_deja_a_la_cible_concurrents_plancher: "Face aux concurrents : déjà au plancher (cible plus basse)", rpRz_deja_a_la_cible_concurrents_plafond: "Face aux concurrents : déjà au plafond (cible plus haute)", rpRz_cible_concurrents_hors_regle: "Face aux concurrents : cible non autorisée par la règle, prix autorisé le plus proche du côté de la cible", rpRz_deja_au_prix_autorise_concurrents: "Face aux concurrents : cible non autorisée par la règle, déjà au prix autorisé le plus proche du côté de la cible", rpRz_cible_concurrents_non_estimable: "Face aux concurrents : prix au centime non calculable, prix autorisé le plus proche du côté de la cible", rpRz_deja_au_prix_grille_concurrents: "Face aux concurrents : prix au centime non calculable, déjà au prix autorisé le plus proche du côté de la cible", rpRz_ecart_sous_minimum_concurrents: "Face aux concurrents : cible trop proche du prix actuel, prix gardé",
  rpRzN: (e) => `Face aux concurrents : notre offre, ${e}`, rpRzC_offre_invalide: "relevé mal formé", rpRzC_etat_inconnu: "état de l'article inconnu", rpRzC_expedition_inconnue: "mode d'expédition inconnu", rpRzC_heure_inconnue: "heure du relevé inconnue", rpRzC_donnee_future: "heure du relevé dans le futur", rpRzC_donnee_perimee: "relevé trop ancien", rpRzC_port_inconnu: "frais de port inconnus", rpRzC_total_incoherent: "total livré incohérent", rpRzC_port_incoherent: "frais de port incohérents",
  rpCo_pli: "Concurrents", rpCo_nSurM: (n, m) => `${n} comparable${n > 1 ? "s" : ""} sur ${m}`, rpCo_indispo: "liste indisponible", rpCo_aucunCourt: "aucun", rpCo_indispoD: "Liste des concurrents indisponible : l'état de la Veille n'a pas pu être lu. Rien n'a été modifié.", rpCo_etat: (n, max) => `${n} suivi${n > 1 ? "s" : ""} · ${max} au plus`, rpCo_aucun: "Aucun concurrent suivi pour ce produit dans ce pays. Ajoutez-en un ci-dessous, ou choisissez-le dans la Veille.", rpCo_sansPrix: "prix non relevé", rpCo_parUnite: (p) => `${p}/unité`, rpCo_lotDe: (n, p) => `Lot de ${n} : ${p}`, rpCo_releveIlYa: (a) => `relevé il y a ${a}`, rpCo_sansOffre: (a) => `sans offre vedette au dernier relevé (il y a ${a}), hors calcul`, rpCo_dernierConnu: (p, a) => `dernier prix connu ${p}, il y a ${a}`, rpCo_perime: (h) => `périmé (plus de ${h} h), hors calcul`, rpCo_photo: (a) => `offres photographiées il y a ${a}`, rpCo_format: "Unités par lot", rpCo_fmtOk: "Enregistrer le format", rpCo_retirer: "Retirer pour ce produit", rpCo_aDeclarer: "À déclarer · hors calcul", rpCo_cmp: "Comparable", rpCo_cmpLot: (n) => `Comparable · lot de ${n}`, rpCo_hors: "Hors calcul", rpCo_srcManuel: "Ajout manuel", rpCo_srcVeille: "Veille", rpCo_actions: "Actions sur ce concurrent", rpCo_ajouter: "Ajouter un concurrent", rpCo_ph: "ASIN ou lien Amazon", rpCo_ajouterBtn: "Ajouter", rpCo_veille: "Choisir dans la Veille", rpCo_note: "Prix : dernier prix relevé de l'offre vedette, port compris, avec son âge ; au-delà de 2 h, il est périmé et n'entre plus dans le calcul. Sans offre vedette au dernier relevé, il n'y entre pas non plus. Un concurrent hors calcul reste surveillé. Rien ne change chez Amazon.", rpCo_okAjout: "Concurrent ajouté.", rpCo_okFmt: "Format enregistré.", rpCo_okRet: "Concurrent retiré pour ce produit.", rpCo_okCmp: "Compté dans le calcul.", rpCo_okHors: "Hors calcul, toujours surveillé.", rpCo_errMax: "Refusé : 10 concurrents suivis au plus par produit et par pays (ou 100 ajouts). Rien n'a été écrit.", rpCo_errNonSuivi: "Refusé : ce concurrent n'est plus suivi pour ce produit. Rien n'a été écrit.", rpCo_err: "Échec de l'enregistrement. Rien n'a été écrit.", rpCo_errAsin: "ASIN invalide : 10 lettres ou chiffres, ou un lien Amazon de fiche produit.", rpCo_errFmt: "Format invalide : un nombre entier de 1 à 100.",
});
Object.assign(I18N.en, { t1pPrice: "Repricer", rpTitle: "Repricer", t1pSmart: "SmartPrice", rpSp_videT: "No offer follows SmartPrice", rpSp_videD: "SmartPrice sets your brand's price against competing products you choose. Three steps, in order, to turn it on.", rpSp_aria: "Three steps to turn on SmartPrice", rpSp_e_1: "Rule", rpSp_e_1d: "gap and limits", rpSp_e_1a: "Create a rule", rpSp_e_2: "Offers", rpSp_e_2d: "apply the rule", rpSp_e_3: "Competitors", rpSp_e_3d: "per offer and per country",
  rpCrumb: "Products", rpLvl_ombre: "Simulation", rpLvl_propose: "Send after approval", rpLvl_auto: "Automatic",
  rpLvlAria: "Repricer level", rpLvlTip: "Account level: Simulation while the price lock is closed (no price sent to Amazon), Send after approval when it is open. Automatic does not exist yet.", rpLvlUnk: "Level unknown: price lock not read.", rpEtatN: (s, n) => `${s} ${n === 1 ? "offer" : "offers"}`, rpRe_c_expl: (s) => `${s} usable`, rpRe_c_bloq: (s) => `${s} blocked`, rpRe_c_inact: (s) => `${s} inactive`, rpRe_c_nonAch: (s) => `${s} not buyable`, rpRe_c_nonConf: (s) => `${s} unconfirmed`, rpRe_c_sansOffre: (s) => `${s} without an offer of yours`, rpRe_c_ecart: (s) => `${s} hidden or disabled`, rpRe_decTip: "Usable: price captured, calculation possible. Blocked: tracked, but a value is missing for the calculation (cost, fees, limits). Inactive: listing inactive at Amazon. Without an offer of yours: the product page exists in this country, with no listing or price of yours. Not buyable: listing active, but no buyable offer captured or no sellable stock. Unconfirmed: price captured, but listing missing from the listings report. Hidden or disabled: by you. All are listed in “All offers”.", rpRe_mode: "Mode:", rpEtatCalc: (h) => `calculated at ${h}`,
  rpFPays: "Country", rpFSit: "Situation", rpFAll: "All", rpFAllF: "All", rpTabConseils: "Actions", rpTabTous: "All offers", rpTabJournal: "Log", rpTabRegles: "Rules",
  rpTabsCount: (p, c) => `${p} product${p === 1 ? "" : "s"} · ${c} countr${c === 1 ? "y" : "ies"}`, rpSoon: "Next batch",
  rpTh_prod: "Product", rpTh_pays: "Country", rpTh_prix: "Price", rpTh_conseil: "Advice",
  rpC_garder: "Keep", rpC_pause_promo: "Paused · promo", rpC_cout_inconnu: "Cost unknown", rpC_bornes_en_conflit: "Limits in conflict", rpC_frais_inconnus: "Fees unknown",
  rpC_sans_prix: "Price not read", rpC_bloque: "Blocked", rpC_aucun: "Not advised yet", rpC_desactive: "Deactivated", rpC_aValider: "to validate",
  rpErr: "Unavailable.", rpNone: "No product sold in the last 7 days.", rpNoneFiltre: "No row for these filters.",
  rpP_perdue: (d, n) => `featured offer lost since ${d} · ${n} sellers`, rpP_perdueX: "featured offer lost", rpP_detenue: (n) => `featured offer held · ${n} sellers`,
  rpP_seul: "only seller · no other offer", rpP_inconnue: "featured offer: situation unknown", rpP_sans_offre: "no active offer", rpP_close: "Close",
  rpSim: "Simulation", rpSimTest: "Test another price", rpSimPrix: "tested price", rpSimPlancher: "floor", rpSimPlafond: "ceiling", rpSimAttendu: "expected", rpSimAttNon: "not read", rpSimAttSeul: "no competitor",
  rpL_ttc: "Price incl. tax", rpL_tva: (p) => `VAT ${p}`, rpL_tvaX: "VAT", rpL_frais: "Amazon fees at this price", rpL_cout: "Purchase cost (average of remaining stock)", rpL_coutProv: "provisional",
  rpL_pub: "Advertising per unit", rpL_pubNon: "not calculated", rpL_ben: "Profit per unit", rpL_benAv: "before ads", rpL_acos: "Break-even ACOS", rpL_ench: "Break-even bid",
  rpL_enchAu: "Bids above", rpL_inconnu: "unknown", rpL_nonReleve: "not read", rpL_pxInactive: "listing inactive", rpL_pxSansOffre: "no offer of yours", rpL_pxNonLu: "listings report not read yet", rpL_pxFiche: "listing-page price, SKU not identified", rpL_pxConf: (p, d) => `Configured price: ${p} (listings report, ${d})`, rpRe_c_nonLu: (s) => `${s} to check (listings not read)`, rpL_pxNonAch: "no buyable offer captured", rpL_avant: "Before", rpL_parU: "/ unit", rpL_vjPerte: "Sales / day before the loss",
  rpL_vj: "Sales / day", rpL_vjCumul: "Sales / day combined (all references of the product)", rpL_moy14: "14-day average", rpE_attente: "Awaiting approval", rpE_conseil: (p) => `Advice: ${p}`, rpProposer: "Propose this price",
  rpPropBusy: "Sending…", rpPropGele: "Price lock closed: no price can be sent to Amazon.", rpPropErr: (m) => `Not proposed: ${m}`, rpPropSousMarge: "Price below the minimum margin: it shows in red in the bar below, and is sent only after “Override the margin”.", rpPropRelu: (p) => `Price read on Amazon: ${p}`,
  rpDetErr: "Detail unavailable.", rpGrilleVide: "No price estimated by Amazon for this product.",
  rpJErr: "Log unavailable.", rpJ_vide: "No entry in the last 30 days.", rpJ_th_date: "Date", rpJ_th_evt: "Event", rpJ_cpt: (n) => `${n} unchanged reading(s) (at most one per day and product, all countries)`, rpJ_cout: "Purchase cost (frozen)", rpJ_estime: "(estimated)", rpJ_roi: "Return on cost", rpJ_marge: "Margin", rpJ_bb: "Featured offer", rpJ_bbOui: "held", rpJ_bbNon: "not held", rpJ_bornes: "Floor / ceiling", rpJ_bas: "Lowest price Prime / non-Prime", rpJ_raison: "Reason", rpJ_fige: "Frozen on", rpJ_nonFige: "Proposal made before snapshots: economics not frozen.", rpJ_regleNonFigee: "rule not frozen", rpJ_voir: "Show details", rpJ_auPa: (p) => `At current price (${p})`, rpJ_auPaC: "at current price", rpJ_contrib: "Contribution", rpJ_nonEnr: "not recorded", rpJ_indispo0: "unavailable", rpJ_causes: "Causes", rpJ_consq: "Consequence", rpJ_consqV: (v) => `${v}: unavailable`, rpJ_filS: (s, n) => `Offers tracked by the Repricer · ${s} ${n === 1 ? "entry" : "entries"} of other offers hidden`, rpJ_filT: "Full history", rpJ_voirTout: "Show full history", rpJ_voirSuiv: "Back to tracked offers", rpJA_prix_inconnu: "price not captured", rpJA_frais_absents: "Amazon fees missing", rpJA_cout_achat_absent: "purchase cost missing",
  rpJ_ombre: "Advice (simulation)", rpJ_prop: "Price proposal", rpJ_via_barre: "bar", rpJ_via_mcp: "MCP",
  rpJ_St_PENDING: "Pending", rpJ_St_CONFIRMED: "Confirmed", rpJ_St_SENDING: "Sending", rpJ_St_APPLIED: "Applied", rpJ_St_NOT_APPLIED: "Not applied",
  rpJ_St_REFUSED: "Refused", rpJ_St_CANCELLED: "Cancelled", rpJ_St_EXPIRED: "Expired", rpJ_St_UNKNOWN: "Result unknown",
  rpR_def: "Default (account)", rpR_defNone: "No default rule: no advice calculated.", rpR_src: "Rule", rpR_propre: "Own", rpR_defaut: "default",
  rpR_margeMin: "Min margin", rpR_roiMin: "Min return on cost", rpR_profitMin: "Min profit / unit", rpR_margeMax: "Max margin", rpR_mode: "Mode",
  rpR_mode_tous: "All minimums", rpR_mode_au_moins_un: "At least one", rpR_revenir: "Back to default", rpR_garder: "Keep own rule", rpR_auDefaut: "→ default",
  rpR_sansSku: "no seller SKU", rpR_n: (n) => `${n} rule(s) changed`, rpR_ou: "in GTINPilot, nothing sent to Amazon", rpR_cancel: "Cancel", rpR_save: "Save",
  rpR_busy: "Saving…", rpR_ok: "Saved · advice at the next calculation", rpR_ko: (m) => `Not saved: ${m}`,
  rpR_e_champ: (w) => `${w}: number > 0 expected`, rpR_e_vide: (w) => `${w}: at least one minimum (margin, return on cost or profit)`,
  rpR_e_maxi: (w) => `${w}: max margin ≤ min margin`, rpR_e_trop: () => "50 rules at most per save",
  rpTh_situation: "Situation", rpTh_situationTip: "Current position of the offer. The Advice column gives the price to aim for: the two labels differ on purpose.",
  rpTh_ventes: "Sales 30 d", rpTh_ventesTip: "Units sold over the last 30 days, excluding Vine (Vine shown apart): same calculation as the Sales page (account day, cancelled orders excluded).",
  rpSit_seul_vendeur: "Only seller", rpSit_detenue: "Featured offer held", rpSit_perdue: "Featured offer lost", rpSit_au_plancher: "At floor", rpSit_cout_inconnu: "Cost unknown",
  rpSit_sans_offre: "No active offer", rpSit_inconnue: "Unknown", rpV_aucune: "No order recorded in this country", rpV_sansArt: (n) => `${n} order(s) in this country without item detail: this figure is a minimum`, rpV_vine: (n) => `+${n} Vine`, rpV_jours: (n) => `over ${n} d`,
  rpV_tip: (u, j) => `Sales ${j} d: ${u}`,
  rpPli_inactifs: (n) => `No active offer (${n})`, rpPli_inactifsD: "No price read or listing inactive on Amazon: nothing to advise until the offer sells.",
  rpPli_masques: (n) => `Hidden products (${n})`, rpPli_masquesD: "Hidden in Stock › Listings: removed from lists only, still tracked.",
  rpPli_desactives: (n) => `Deactivated (${n})`, rpPli_desactivesD: "Deactivated across GTINPilot: the repricer no longer advises it. Reactivate it in Stock › Listings.",
  rpNoneActif: "No offer on sale for these filters.",rpC_non_achetable: "Not buyable · no stock",
  rpL_pubTip: (a, b) => `ad spend ÷ units sold, ${a} to ${b}`, rpPubR_rapport_pub_absent: "no ad report for this country", rpPubR_rapport_pub_incomplet: "ad report incomplete over 30 days",
  rpPubR_aucune_vente: "no unit sold over 30 days", rpPubR_devise_pub_differente: "ad spend in another currency", rpPubR_quantite_absente: "quantity missing on an order", rpPubR_tables_absentes: "data missing",
  rpL_enchN: (n, m) => `${n} bid(s) above ${m}`, rpL_ench0: (m) => `no bid above ${m}`,
  rpLb_dateInc: "date unknown", rpLb_voirJournal: "See the log", rpLb_voirN: (n) => `See the ${n}`, rpLb_horsListe: (n) => `${n} outside this page (countries or products without a recent reading)`, rpEd_e_choix: "Choose the value to keep for each field changed on both sides.", rpEd_cflAucunDeux: "No field changed on both sides; if one had, it would be chosen here before saving.", rpEd_cflDeux: "A field changed on both sides: choose the value to keep before saving.", rpEd_inchanges: "unchanged", rpEd_aChoisir: "to choose", rpEd_oIdentiques: "identical", rpPp_calcAvec: (r, a) => `computed with ${r} ${a} ago`, rpPp_stale: (r, a) => `Advice computed with ${r} ${a} ago — recomputed at the next run`, rpPp_ageMin: (n) => `${n}\u00a0min`, rpPp_ageHM: (h, m) => `${h}\u00a0h\u00a0${String(m).padStart(2, "0")}\u00a0min`, rpPp_ageH: (n) => `${n}\u00a0h`, rpPp_nonNotee: "rule not recorded", rpPp_fxD_conflitAvec: (r) => `: the guardrails of ${r} leave no price of the grid.`, rpPp_recalcul: "It is no longer the current rule: recomputed at the next run.", rpPp_reaffecter: "Reassign", rpPp_compteNonModif: "account rule: not editable here", rpLb_simT: "Simulation only.", rpLb_simD: "These rules compute recommendations. No Amazon price is changed by them.",
  rpLb_ordre: "Order:", rpLb_o1: "product's own rule", rpLb_o2: "assigned named rule", rpLb_o3: "account rule",
  rpLb_titre: "Rule library", rpLb_sous: "Reusable rules, assigned per product × country", rpLb_defs: "Definitions", rpLb_affecter: "Assign a rule", rpLb_nouvelle: "New rule",
  rpLb_thRegle: "Rule", rpLb_thBar: "Price guardrails", rpLb_thEcart: "Gap", rpLb_thAff: "Assigned to", rpLb_thPays: "Countries", rpLb_thActs: "Actions",
  rpLb_compte: "Account rule", rpLb_tagDef: "Default", rpLb_compteD: "applies to every product × country without another rule",
  rpLb_compteAbs: "No account rule: without a named or own rule, no recommendation.",
  rpLb_compteLock: "Not editable here · set in the account configuration, no screen today",
  rpLb_mini: "Min", rpLb_maxi: "Max", rpLb_sansPlafond: "no ceiling", rpLb_et: "AND", rpLb_ou: "OR",
  rpLb_c_profit: "Profit", rpLb_c_marge: "Margin", rpLb_c_roi: "Return on cost", rpLb_ecNon: "not set", rpLb_ecNonT: "No gap set: the engine applies no gap with this rule.", rpLb_ecClasserT: "Approach to be classified: the engine applies no gap.", rpLb_ecT: "Gap applied by the engine for this approach.",
  rpLb_pxp: "products × countries", rpLb_dontApp: (n) => `${n} applied`, rpLb_tousPays: "All countries", rpLb_nNommees: (n) => `${n} named`,
  rpLb_version: (v, le, par) => `version ${v}${le ? ` · ${le}` : ""}${par ? ` · ${par}` : ""}`,
  rpLb_appliquer: "Apply everywhere", rpLb_modifier: "Edit", rpLb_dupliquer: "Duplicate", rpLb_supprimer: "Delete", rpLb_supprT: "Delete (archived, recoverable)",
  rpLb_autres: (nom) => `More actions · ${nom}`, rpLb_copie: (nom) => `${nom} (copy)`,
  rpLb_arch: (n) => `Archived (${n})`, rpLb_archD: "recoverable", rpLb_restaurer: "Restore",
  rpLb_s_personnalise: "Custom", rpLb_s_prudent: "Cautious", rpLb_s_equilibre: "Balanced", rpLb_s_offensif: "Aggressive", rpLb_s_destockage: "Clearance",
  rpLb_n_prudent: "Protected margin", rpLb_n_equilibre: "Balanced Buy Box", rpLb_n_offensif: "Conquest (Q4)", rpLb_n_destockage: "Clearance",
  rpLb_videT: "No named rule", rpLb_videD: (n, p) => `The account rule applies to the ${n} products × countries (${p} countries).`,
  rpLb_videD2: "A named rule is created once and assigned to many products × countries; editing it creates a new version its products follow.",
  rpLb_partir: "Start from this template", rpLb_lecture: "Reading the account's rules…",
  rpLb_errT: "Rules unreadable", rpLb_errD: "This account's rules file could not be read. Until it is, no rule is applied: nothing silently falls back to the account rule.",
  rpLb_errD2: (d) => `The recommendations shown date from the last successful calculation (${d}) and are stale.`, rpLb_reessayer: "Retry",
  rpLb_lockT: "Writes disabled", rpLb_lockD: "while the file is unreadable: writing over an unreadable file could erase the rules it holds.",
  rpLb_detail: "Detail:", rpLb_offT: "Writes disabled: rules file unreadable",
  rpLb_apT: (nom, v) => `Apply “${nom}” v${v} everywhere`, rpLb_apBig: "products × countries change rule",
  rpLb_apNote: (n, p) => `Out of the ${n} products × countries in the ${p} countries the rule covers. Simulation only: no Amazon price changed.`,
  rpLb_apChg: "change rule: the named rule becomes effective", rpLb_apDeja: (nom) => `already on “${nom}”: unchanged`,
  rpLb_apProp: "keep their own rule: assignment saved, overridden by the own rule", rpLb_apHors: (p) => `untouched: ${p}, not covered by the rule`,
  rpLb_apSans: "no seller SKU: untouched", rpLb_rien: (nom) => `Nothing to change: every covered product × country is already on “${nom}”.`,
  rpLb_resOk: (n) => `${n} product(s) × country assigned · simulation only, nothing at Amazon.`,
  rpLb_resPart: (ok, tot, ko) => `${ok} assigned out of ${tot} · ${ko} not assigned`, rpLb_resPartD: "the other assignments are saved.",
  rpLb_r_CONFLIT: "assignment changed meanwhile; nothing changed for this product", rpLb_r_PAYS_NON_COUVERT: "country not covered by the rule; nothing changed for this product",
  rpLb_r_ARCHIVEE: "rule archived meanwhile; nothing changed for this product", rpLb_r_INTROUVABLE: "rule not found; nothing changed for this product",
  rpLb_reessayerN: (n) => `Retry the ${n}`,
  rpLb_suppRefus: (n, nom) => `Deletion refused: ${n} product(s) × country use “${nom}”. Reassign them first; deleting archives the rule, recoverable.`,
  rpLb_vbT: "Change to confirm — 1 pending", rpLb_annuler: "Cancel", rpLb_valider: "Confirm", rpLb_enCours: "Saving…",
  rpLb_vbSim: "simulation only · no Amazon price changed",
  rpLb_vb_affect: (nom, v, n, p) => `Assign “${nom}” v${v}: ${n} product(s) × country${p ? ` · ${p} keep their own rule` : ""}`,
  rpLb_vb_affectD: "Products will follow every new version of the rule.", rpLb_vb_affMulti: (n, p) => `${n} product(s) × ${p} countries chosen`,
  rpLb_vb_aucune: (qui) => `Remove the assignment of ${qui}: the account rule will apply`,
  rpLb_vb_archiver: (nom) => `Archive “${nom}”`, rpLb_vb_archiverD: "Archived, it stays recoverable; no product uses it.",
  rpLb_vb_restaurer: (nom) => `Restore “${nom}”`, rpLb_vb_retirer: (qui) => `Remove the own rule of ${qui}`,
  rpLb_vb_retirerD: "The assigned named rule, otherwise the account rule, will apply. Nothing else is erased.",
  rpLb_okMsg: "Rule saved · simulation only, nothing at Amazon.", rpLb_ko: (m) => `Nothing was saved: ${m}`,
  rpLb_archOk: (nom) => `“${nom}” archived (recoverable).`, rpLb_restOk: (nom) => `“${nom}” restored.`, rpLb_retOk: "Own rule removed.",
  rpEd_titreMod: "Edit rule", rpEd_titreNew: "New rule", rpEd_titreProp: (qui) => `Own rule · ${qui}`,
  rpEd_metaMod: (nom, v, le) => `${nom} · version ${v}${le ? ` · edited ${le}` : ""}`, rpEd_metaNew: "draft · nothing saved", rpEd_metaProp: (v) => `version ${v}`,
  rpEd_fermer: "Close", rpEd_ident: "Name", rpEd_nom: "Rule name", rpEd_affA: "Assigned to", rpEd_affN: (n) => `${n} product(s) × country`, rpEd_aucunProd: "no product",
  rpEd_vInfo: (a, b) => `version ${a} → ${b}`, rpEd_vNew: "new",
  rpEd_hintMod: (v, n) => `Saving creates version ${v}; the ${n} assigned product(s) × country follow it. Each simulation records the version used.`,
  rpEd_hintNew: "New rule: version 1 when saved, assigned to no product.",
  rpEd_style: "Rule style", rpEd_styleH: "A style pre-fills the guardrails below; Custom keeps the entered values.", rpEd_rec: "Recommended",
  rpEd_sd_personnalise: "changes nothing", rpEd_sd_prudent: "margin first", rpEd_sd_equilibre: "margin and featured offer", rpEd_sd_offensif: "low minimums", rpEd_sd_destockage: "never below cost",
  rpEd_bar: "Price guardrails", rpEd_defH: "Definitions — the same as the calculation",
  rpEd_dBen: "price excl. VAT − Amazon fees at that price − purchase cost (weighted average), per unit, before advertising", rpEd_dMarge: "profit ÷ price excl. VAT", rpEd_dRoi: "profit ÷ purchase cost",
  rpEd_mins: "Minimums", rpEd_maxs: "Maximums", rpEd_aucun: "None", rpEd_devPays: "country currency",
  rpEd_f_profitMin: "Min profit per sale", rpEd_f_margeMin: "Min margin", rpEd_f_roiMin: "Min return on cost",
  rpEd_f_profitMax: "Max profit per sale", rpEd_f_margeMax: "Max margin", rpEd_f_roiMax: "Max return on cost",
  rpEd_modeMin: "Minimums: AND / OR", rpEd_modeMax: "Maximums: AND / OR", rpEd_tousMin: "every minimum set", rpEd_tousMax: "every maximum set", rpEd_auMoins: "at least one",
  rpEd_maxH0: "No maximum set: no ceiling.", rpEd_maxH1: "A maximum only narrows the allowed prices.", rpEd_maxH2: "A maximum never lifts a minimum or a safeguard.",
  rpEd_exDes: "allowed prices from", rpEd_exSans: "· no ceiling", rpEd_exJusq: (m) => `· up to ${m}`, rpEd_ok: "compatible guardrails", rpEd_exCout: "cost",
  rpEd_exAucun: "no price of its grid meets these guardrails", rpEd_exNone: "Worked example: reading a product's price grid…",
  rpEd_vide: "No price allowed", rpEd_videD: (x) => `: ${x} cannot hold together. True for every product; fix one of the two to save.`,
  rpEd_contra: "Contradictory bounds", rpEd_contraD: (x) => `: ${x}. A maximum must exceed the minimum of the same criterion; fix to save.`,
  rpEd_saveImp: "Cannot save: no price allowed", rpEd_saveImpT: "No price allowed: fix the guardrails",
  rpEd_pays: "Countries where the rule applies", rpEd_tousPays: "All the account's countries", rpEd_tousPaysD: "including ones added later", rpEd_certains: "Some countries", rpEd_certainsD: "ticked below",
  rpEd_paysH: "Unticked country: the rule never applies there. A product still assigned there is flagged “assigned, but not applicable”, and the rule actually applied is named.",
  rpEd_soon: "Planned, not active yet", rpEd_soonN: (n) => `${n} settings`,
  rpEd_x_pause: "Recurring pause", rpEd_xd_pause: "Keep the price as is during a chosen time slot.", rpEd_xf_pause: [["Slots", "+ Add a slot"]],
  rpEd_x_conc: "Competition", rpEd_xd_conc: "How to position against Amazon and against merchant-fulfilled sellers.",
  rpEd_xf_conc: [["Against Amazon", "Match if profitable, otherwise leave"], ["Merchant-fulfilled sellers", "Take them into account"], ["Gap to the price to beat", "0 · match"], ["Max rise and drop per day", "—"]],
  rpEd_x_cas: "Special cases", rpEd_xd_cas: "What to do when the featured offer is removed, when competitors go below the floor, when the offer is alone or already holds the featured offer.",
  rpEd_xf_cas: [["Featured offer removed by Amazon", "Leave the price"], ["Competitors below the floor", "Leave the price"], ["Only offer on the listing", "Leave the price"], ["Featured offer already held", "Leave the price"]],
  rpEd_x_battre: "Price to beat", rpEd_xd_battre: "Which price to target, and which competitors to count.", rpEd_xf_battre: [["Targeted price", "Featured offer price"], ["Seller's min positive feedback", "—"]],
  rpEd_x_yoyo: "Anti-yo-yo safeguards", rpEd_xd_yoyo: "If the price keeps going up and down against another tool, a pause that grows with each repeat, cause written to the log.",
  rpEd_xf_yoyo: [["Pause", "6 h › 24 h › 72 h if the conflict repeats · never a silent freeze"]],
  rpEd_x_auto: "Automations", rpEd_xd_auto: "Switch rule when a product stops selling, counted per country and per shared stock pool.",
  rpEd_xf_auto: [["No sale for", "20 › 35 › 50 › 65 days"], ["Then switch to", "Next rule"]],
  rpEd_note: "Saving changes no price on Amazon.", rpEd_facon: "How do you set your price?", rpEd_fc_concurrents: "SmartPrice", rpEd_fcd_concurrents: "Your brand against competing products from other brands.",
  rpEd_vf_m001: (c) => `0.01 ${c} cheaper`, rpEd_vfRef_foep: "Amazon's suggested price", rpEd_vfRef_bas: "the lowest delivered price", rpEd_exT: "Fictitious example · no real product", rpEd_exVed: "Featured offer", rpEd_exPl: "Floor", rpEd_exGarde: "kept at the floor", rpEd_vfRef: "the Featured offer", rpEd_vfH: "among the sellers on the listing that this rule counts", rpEd_vfPl: "Sellers counted", rpEd_vfExp_tous: "all sellers", rpEd_vfExpD_tous: "Every seller found on the listing counts, whoever ships.", rpEd_vfExp_amazon: "shipped by Amazon only", rpEd_vfExpD_amazon: "Only sellers whose offer is shipped by Amazon count. A seller whose shipper is unknown is not counted.", rpEd_vfExpH: "Excluding a specific seller: coming soon, from the list of sellers on the listing.", rpEd_vfPh_aucun: "Choose a gap: the price will follow the Featured offer, never below the floor nor above the ceiling.", rpEd_e_vf: "Gap: a positive number, two decimals at most.", rpEd_fcRfOk: "Choice saved. Calculated in Simulation: no price is sent to Amazon.", rpEd_fcRfNonEnr: "Saved with the rule. Calculated in Simulation: no price is sent to Amazon.", rpEd_fc_vendeurs_fiche: "Repricer", rpEd_fcd_vendeurs_fiche: "You and other sellers on the same Amazon listing.", rpEd_fcAClasser: "To classify: until a method is chosen, the rule keeps its current calculation.", rpEd_fcNonEnr: "Saved with the rule. This calculation is not active yet: no advice depends on it today.", rpEd_fcInactif: "Choice saved. This calculation is not active yet: no advice depends on it today.",
  rpEd_fcLe: (d) => `Chosen on ${d}.`,
  rpEd_enr: "Save", rpEd_resAria: "Rule preview", rpEd_pl_lim: "Limits", rpEd_pl_ctb: "Contribution", rpEd_pl_pays: "Countries", rpEd_pl_mode: "Mode", rpEd_plv_profit: "contribution", rpEd_plv_marge: "margin", rpEd_plv_roi: "return on cost", rpEd_plv_mini: (x) => `${x} min`, rpEd_plv_maxi: (x) => `${x} max`, rpEd_plv_aucune: "no limit", rpEd_plv_ctb: "price excl. VAT − fees − cost, before ads", rpEd_plv_mode_concurrents: "competing products", rpEd_plv_mode_vendeurs_fiche: "sellers on the listing",
  rpEd_clsRes: "Until it has a mode, this rule keeps its current calculation.", rpEd_clsN: (n) => `${n} ${n === 1 ? "offer follows" : "offers follow"} this rule`, rpEd_fcSpOk: "Choice saved.", rpEd_fcSpNonEnr: "Will be saved with the rule.", rpEd_fcSpSans: "Without a price gap, SmartPrice follows no competitor; it only brings back into the rule a price that falls outside it (too low, too high or not allowed).", rpEd_ecExPlC: (x) => `contribution ${x}`, rpEd_ecCoChoisir: "Choose a comparable competitor", rpEd_ecCoHors: (a) => `${a} (no longer comparable)`,
  rpEd_fcq_concurrents: "against competing products", rpEd_fcq_vendeurs_fiche: "against the other sellers on the listing", rpEd_clsT: "This rule has no mode yet.", rpEd_clsD: (n) => `It predates SmartPrice. ${n} ${n === 1 ? "offer follows" : "offers follow"} it. Choose once; its limits are kept.`, rpEd_passer_concurrents: "Switch to SmartPrice", rpEd_passer_vendeurs_fiche: "Switch to Repricer", rpEd_mq_facon: "Choose a mode to save. No price is changed on Amazon.", rpEd_mq_ecart: "Choose a price gap to save. No price is changed on Amazon.",
  rpEd_ec: "Price gap", rpEd_ec_m5: "5% cheaper", rpEd_ec_0: "Same price", rpEd_ec_p5: "5% more expensive", rpEd_ec_autre: "Other", rpEd_ecQue: "than", rpEd_ecRef: "Reference price", rpEd_ecC_moins_cher: "the cheapest", rpEd_ecC_mediane: "the median", rpEd_ecC_choisi: "a chosen competitor", rpEd_ecVal: "Gap", rpEd_ecU: "Unit", rpEd_ecS: "Direction", rpEd_ecS_moins: "cheaper", rpEd_ecS_plus: "more expensive", rpEd_ecAsin: "Competitor ASIN", rpEd_ecH: "among the competitors you marked comparable, product by product", rpEd_e_ecart: "Gap: a positive number, two decimals at most, under 100% (or 10,000 in currency).", rpEd_e_asin: "Competitor ASIN: 10 letters or digits.",
  rpEd_ecPh_aucun: "Choose a gap: the price will follow your comparable competitors, never below the floor nor above the ceiling.", rpEd_ecPh_moins: (v, r) => `Price set ${v} below the reference (${r}), never below the floor nor above the ceiling.`, rpEd_ecPh_egal: (r) => `Price matched to the reference (${r}), never below the floor nor above the ceiling.`, rpEd_ecPh_plus: (v, r) => `Price set ${v} above the reference (${r}), never below the floor nor above the ceiling.`, rpEd_ecR_moins_cher: "the cheapest comparable competitor", rpEd_ecR_mediane: "the median of comparable competitors", rpEd_ecR_choisi: (a) => `competitor ${a}`,
  rpEd_ecEx: (n) => `Example · ${n}`, rpEd_ecExMoins: (n) => `cheapest of ${n} comparable`, rpEd_ecExMed: "Median", rpEd_ecExMedD: (n) => `of ${n} comparable`, rpEd_ecExChoisi: "chosen competitor", rpEd_ecExCons: "Suggested price", rpEd_ecExCtb: "Contribution per sale", rpEd_ecExCtbD: "excl. VAT, before ads, estimated", rpEd_ecExPl: "Floor", rpEd_ecExPlD: "first price allowed by the limits", rpEd_ecExNone: "No worked example: no loaded product has enough comparable competitors with a recent price for this reference.",
  rpLb_fClasser: "To classify", rpEd_annuler: "Cancel", rpEd_saveV: (v) => `Save version ${v}`, rpEd_saveNew: "Save rule",
  rpEd_saveProp: "Save own rule", rpEd_busy: "Saving…", rpEd_ko: (m) => `Nothing was written: ${m}`,
  rpEd_cflProp: "The own rule changed elsewhere: nothing was written. Close and reopen to start from the saved version.",
  rpEd_e_champ: "A guardrail is not a positive number.", rpEd_e_grand: "Min profit: under 100 per sale; max profit: under one million.", rpEd_e_vide: "At least one minimum: profit, margin or return on cost.",
  rpEd_e_maxi: "A maximum is at most the minimum of the same criterion.", rpEd_e_nom: "Rule name: 1 to 80 characters.", rpEd_e_pays: "Choose at least one country.",
  rpEd_cflT: "This rule changed while it was being edited: nothing was written.",
  rpEd_cflD: (lu, v, le) => `Version ${lu} read; version ${v} saved elsewhere${le ? ` on ${le}` : ""}. Here is the proposed merge; it is saved only with “Save version ${v + 1}”.`,
  rpEd_cChamp: "Field", rpEd_cLu: (v) => `Read (v${v})`, rpEd_cSaisie: "Entered here", rpEd_cTrouve: (v) => `Version ${v}`, rpEd_cRes: (v) => `Result v${v}`, rpEd_cOrig: "Origin",
  rpEd_oSaisie: "entry kept", rpEd_oReprise: (v) => `version ${v} taken`, rpEd_oIdem: "No field differs: only the version changes.", rpEd_abandon: (v) => `Discard the entry (keep version ${v})`,
  rpPp_ouvrir: "Rules and prices by country", rpPp_retour: "All products", rpPp_cout: "Purchase cost", rpPp_coutMoy: "weighted average", rpPp_charge: "computing…",
  rpPp_th_pays: "Country", rpPp_th_etat: "Offer · featured", rpPp_th_prix: "Current price incl. VAT", rpPp_th_cons: "Advice · simulation", rpPp_th_ben: "Profit", rpPp_th_marge: "Margin on price excl. VAT",
  rpPp_th_roi: "Return / cost", rpPp_th_eq: "Break-even price", rpPp_th_mini: "Rule min price", rpPp_th_aff: "Assigned rule", rpPp_th_app: "Applied rule",
  rpPp_conseil: "Advice", rpPp_roi2: "Return on cost", rpPp_mini2: "Rule min price", rpPp_plus: "Profit, margin, break-even price, min price",
  rpPp_active: "Active", rpPp_inactive: "Inactive", rpPp_bbNous: "Featured: ours", rpPp_bbInc: "featured unknown", rpPp_inactif: "inactive offer: nothing to advise",
  rpPp_indispo: "Unavailable", rpPp_sansApp: "no applicable rule", rpPp_garder: "keep", rpPp_releve: (h) => `read ${h} h ago`,
  rpPp_foepT: "Amazon's target price not read yet: a “keep” can come from this gap", rpPp_dansBornes: "within bounds",
  rpPp_g_buy_box_detenue: "featured offer ours", rpPp_g_seule_offre: "only offer", rpPp_g_buy_box_perdue_sans_prix_a_viser: "target price not read", rpPp_g_deja_au_prix_vise: "already at target",
  rpPp_horsGrille: "outside grid", rpPp_enConflit: "in conflict",
  rpPp_selAucune: "— none", rpPp_selNonCouv: "(country not covered)", rpPp_introuvable: "Rule not found", rpPp_choisir: (mp) => `Assigned rule · ${mp}`,
  rpPp_propreSeule: "own rule only", rpPp_rempl: (v) => `v${v} · overridden by the own rule`,
  rpPp_et_pays_non_couvert: "Assigned, but not applicable", rpPp_et_archivee: "Archived · not applied", rpPp_et_introuvable: "Not found · not applied",
  rpPp_aucuneApp: "none", rpPp_compteAbs: "no account rule", rpPp_sansRegle: "no rule", rpPp_propre: "Own rule",
  rpPp_src_produit: "own", rpPp_src_nommee: "named", rpPp_src_defaut: "account",
  rpPp_motif_pays_non_couvert: "instead of the assigned rule: country not covered", rpPp_motif_archivee: "instead of the assigned rule: archived",
  rpPp_motif_introuvable: "instead of the assigned rule: not found",
  rpPp_calcT: (p) => `Calculation detail · ${p} at current price`, rpPp_ttc: "incl. VAT", rpPp_tva: "VAT", rpPp_ht: "excl. VAT", rpPp_frais: "Amazon fees at this price", rpPp_coutA: "purchase cost",
  rpPp_benef: "profit", rpPp_marge: "margin", rpPp_roi: "return on cost",
  rpPp_fxT_remplacee: "Named rule assigned, but overridden by the product's own rule.", rpPp_fxD_remplacee: (nom, v, p) => `“${nom}” v${v} is saved for ${p}; the own rule applies.`,
  rpPp_creerPropre: "Create an own rule", rpPp_retirerPropre: "Remove own rule", rpPp_modPropre: "Edit own rule", rpPp_modRegle: "Edit rule",
  rpPp_fxT_pays: "Country not covered by the assigned rule.", rpPp_fxD_pays: (nom, p) => `“${nom}” does not cover ${p}: it is not applied there. The account rule applies instead, named under “Applied rule”.`,
  rpPp_ajouterPays: (c) => `Add ${c} to the rule`, rpPp_autreRegle: "Assign another rule",
  rpPp_fxT_archivee: "Named rule archived: not applied.", rpPp_fxD_archivee: (nom) => `“${nom}” is archived; the account rule applies instead.`,
  rpPp_fxT_introuvable: "Named rule not found: not applied.", rpPp_fxD_introuvable: "The assignment points to a rule that no longer exists; the account rule applies instead.",
  rpPp_fxT_aucune: "No applicable rule: no recommendation.", rpPp_fxD_aucune: "The assigned rule does not apply here and the account has no rule: nothing silently replaces it.",
  rpPp_fxT_conflit: "No price allowed", rpPp_fxD_conflit: ": the applied rule's guardrails leave no price of the grid.",
  rpPp_fxT_perime: (h) => `Price reading too old (${h} h)`, rpPp_fxD_perime: ": nothing is recommended until a reading under 36 h arrives.",
  rpPp_coutT: "Purchase cost unknown", rpPp_coutD: (n) => `: profit, margin and min price cannot be computed in the ${n} countries; no recommendation.`, rpPp_saisirCout: "Enter purchase cost",
  rpPp_f1T: "Amazon's target price not read yet", rpPp_f1D: ": a “keep” can come from this gap.",
  rpPp_f2T: "Featured offer", rpPp_f2D: ": “ours” or “unknown”; the reading cannot say “lost” yet.",
  rpPp_f3T: "Figures", rpPp_f3D: " at current price incl. VAT, before advertising; margin on price excl. VAT · rule and version recorded by every simulation · reading older than 36 h = unavailable.",
  rpAf_sel: (n) => `${n} product(s) selected`, rpAf_sur: (n) => `of ${n}`, rpAf_desel: "Deselect all", rpAf_tout: "Select all", rpAf_cocher: "Choose",
  rpAf_th_prod: "Product", rpAf_th_pays: "Countries sold", rpAf_th_regles: "Current rules", rpAf_titre: (n) => `Assign a rule · ${n} product(s)`,
  rpAf_regle: "Rule", rpAf_choisir: "Choose a rule", rpAf_pays: "Countries", rpAf_apercu: "Preview", rpAf_nonCouv: "not covered",
  rpAf_vendus: (tot, sans) => `products × countries sold in the chosen countries (of ${tot}; ${sans} without an offer, untouched)`,
  rpAf_chg: "change rule: the chosen rule becomes effective", rpAf_deja: "already on this rule: unchanged", rpAf_prop: "keep their own rule: assignment saved, not effective",
  rpAf_hint: "Nothing automatic on top: only the assignment changes. Simulation only, no Amazon price changed.", rpAf_aucunSel: "Tick products in the list.",
  rpRe_envLc: (a) => `Re-read ${a}`, rpRe_coutEstC: "Estimated cost", rpRe_coutDc: "Price not computable", rpRe_gc_tenue: (n) => `${n} held`, rpRe_gc_perdue: (n) => `${n} lost`, rpRe_gc_aucune: (n) => `${n} with no featured offer`, rpRe_gc_inconnue: (n) => `${n} unknown`,
  rpRe_iAria: "Featured offer situation", rpRe_i_offres: "Offers", rpRe_i_tenue: "Held", rpRe_i_perdue: "Lost", rpRe_i_aucune: "No featured offer", rpRe_i_inconnue: "Unknown",
  rpRe_g_tenue: (n) => `${n} where you hold the featured offer`, rpRe_g_perdue: (n) => `${n} where the featured offer is lost`, rpRe_g_aucune: (n) => `${n} listing${n > 1 ? "s" : ""} with no featured offer`, rpRe_g_inconnue: (n) => `${n} unknown state${n > 1 ? "s" : ""}`,
  rpRe_simuP: "Simulation:", rpRe_aLire: (n) => `${n} suggestion${n > 1 ? "s" : ""} to read`, rpRe_pos: (n) => `Featured offer situation, over ${n} offer${n > 1 ? "s" : ""}`,
  rpRe_rien: "Nothing to do", rpRe_rienD: (h, n) => `No offer needs action. Last run at ${h}, over ${n > 1 ? `the ${n} offers` : `${n} offer`}.`, rpRe_rienDx: (n) => `No offer needs action, over ${n > 1 ? `the ${n} offers` : `${n} offer`}.`, rpRe_prochaines: "The next actions will appear here.",
  rpRe_coutEst: "Estimated purchase cost:", rpRe_coutInc: "Purchase cost unknown", rpRe_aConf: "To confirm", rpRe_coutD: "Price cannot be computed until the cost is confirmed in COGS", rpRe_confCogs: "Confirm in COGS",
  rpRe_conflitD: (p, f) => `Floor ${p} above ceiling ${f}`, rpRe_sousPl: "Featured offer below your floor", rpRe_sousPlD: "Price kept at the floor · profitable choice", rpRe_sousPlDx: "Price kept · profitable choice",
  rpRe_nivInc: "Level unknown", rpRe_pays: "Country:",
  rpRe_trier: "Sort", rpRe_trierP: "Sort:", rpRe_tri_pays: "Country", rpRe_tri_produit: "Product", rpRe_tri_variation: "Change", rpRe_tri_contribution: "Contribution",
  rpRf_regle: (n) => `Rule: ${n}`, rpRf_st_tenue: "Featured offer held", rpRf_st_perdue: "Featured offer lost", rpRf_st_aucune: "No featured offer", rpRf_st_inconnue: "Featured offer unknown",
  rpRf_simt: "Simulation · Nothing sent to Amazon", rpRf_conserve: "Price kept at the floor", rpRf_garde: "Price kept", rpRf_ved: "Featured offer", rpRf_suiv: "Next offer",
  rpRf_actuel: "Current price", rpRf_propose: "Suggested price", rpRf_veut: "What it means", rpRf_faire: "What you can do",
  rpRf_alignB: "Same delivered price as the featured offer", rpRf_align: (q, p, port, x) => `, held by ${q}: your item price ${p} + shipping ${port}${x}, `, rpRf_align2: ". Matched, not cheaper: reaching this price does not guarantee the featured offer.",
  rpRf_viseB: (p) => `Target price: ${p}`, rpRf_vise: (pv, port) => `, for a featured offer at ${pv} delivered (your shipping: ${port}). Reaching this price does not guarantee the featured offer.`,
  rpRf_plafB: "At your rule's ceiling", rpRf_plaf: (pv, pf) => `: the featured offer is at ${pv} delivered, above your ceiling of ${pf}. Reaching this price does not guarantee the featured offer.`,
  rpRf_tenueB: "You hold the featured offer.", rpRf_suivTxt: (p, l) => ` The next counted offer${l ? ` (${l})` : ""} is at ${p} delivered.`, rpRf_hausse24: (m, h) => ` Optional increase: at most ${m} over 24 h, from your price yesterday (${h}).`,
  rpRf_hausse: " Optional increase.", rpRf_risque: " An increase may lose you the featured offer.", rpRf_tenueGarde: " Price kept.",
  rpRf_sousPl: (q, pv, ec) => `${q} holds the featured offer at ${pv}, ${ec} below your floor.`, rpRf_sousPlCtb: (x) => ` At that price, your contribution would drop to ≈ ${x} per sale`, rpRf_minDe: (m) => `, for a minimum of ${m}`,
  rpRf_inconnue: "The featured offer status is unknown: no price is calculated.", rpRf_cause: (x) => `Cause: ${x}.`, rpRf_aucune: "No featured offer on this listing at the last reading: no price is calculated.",
  rpRf_ctbK: "Estimated contribution, excl. VAT", rpRf_ctbK2: "Estimated contribution before advertising", rpRf_vente: " / sale",
  rpRf_ctbAu: (b, ec, m) => `Estimated contribution before advertising: ${b} per sale, ${ec} above your minimum of ${m}.`, rpRf_ctbSur: (b, ec, m) => `Estimated contribution before advertising: ${b} per sale, ${ec} above your maximum of ${m}.`, rpRf_ctbSous: (b, ec, m) => `Estimated contribution before advertising: ${b} per sale, ${ec} below your minimum of ${m}.`,
  rpRf_ctbPerte: "If the featured offer is lost, a new calculation will propose a decrease, to approve.", rpRf_ctbAct: (p) => `At your current price of ${p}.`, rpRf_ctbActMin: (p) => `At your current price of ${p}: that is your minimum.`,
  rpRf_simnB: "Simulation.", rpRf_simn: " No price goes to Amazon. This advice is to read, not to send.",
  rpRf_f_garder: (p) => `Keep ${p}`, rpRf_f_garderPl: ", your floor: a profitable choice.", rpRf_f_remonte: "If the featured offer goes back up, a new calculation will propose an increase, to approve.", rpRf_f_min: (n) => `Or lower the rule's minimum (${n} offer${n > 1 ? "s" : ""}).`,
  rpRf_vdr: "Sellers on the listing", rpRf_mInc: "Eligibility unknown", rpRf_mBientot: "Coming soon", rpRf_mSecu: "Simulation · sending not open yet", rpRf_deux: (a, b) => `${a}: ${b}`, rpRf_vdL: (l) => `Seller ${l}`, rpRf_autreV: "another seller", rpRf_autreVM: "Another seller", rpRf_nOffres: (n) => `${n} offer${n > 1 ? "s" : ""}`, rpRf_expA: " (shipped by Amazon)", rpRf_expV: " (shipped by you)", rpRf_vdrInc: "reading unknown", rpRf_hist: "Price history",
  rpRe_videT: "No offer follows Repricer", rpRe_videD: "Repricer sets your price against the other sellers of the same Amazon listing, to hold the featured offer. Two steps to get your first suggestions.",
  rpRe_e_1: "Rule", rpRe_e_1d: "gap and limits", rpRe_e_1a: "Create a rule", rpRe_e_2: "Offers", rpRe_e_2d: "apply the rule", rpRe_videB: "The sellers of each listing are read from Amazon: nothing else to choose.",
  rpC_simulation: "Simulation", rpRzK_offre_vedette_perdue_prix_vise: "At the featured offer price", rpRzK_offre_vedette_perdue_prix_vise_plafond: "At the ceiling, under the featured offer",
  rpRzK_hausse_vers_vendeur_suivant: "Optional increase", rpRzK_hausse_vers_vendeur_suivant_plafond: "Optional increase", rpRzK_hausse_vers_vendeur_suivant_limite_24h: "Optional increase",
  rpSpF_rien: "Nothing to do", rpSpF_aCompleter: "Setup to complete", rpSpF_sansTxt: (n, p) => `${n} offer${n > 1 ? "s" : ""}, price kept${p ? `: ${p}` : ""}`, rpSpF_dVise: (n) => `${n} at target price`,
  rpSpFcD: "Price cannot be calculated", rpSpFcD_cout_inconnu: "Price cannot be calculated without this cost", rpSpFcD_bornes_en_conflit: "Price cannot be calculated with these limits",
  rpK5_aria: "Prices against the target price", rpK5_offres: "Offers", rpK5_vise: "At target price", rpK5_ajuster: "To adjust", rpK5_plancher: "At floor", rpK5_nonCalc: "Not calculable",
  rpK5_aFaire: "To do:", rpK5_env: (n) => `${n} sending${n > 1 ? "s" : ""} to check`, rpK5_prix: (n) => `${n} price${n > 1 ? "s" : ""} to approve`, rpK5_conf: (n) => `${n} setup${n > 1 ? "s" : ""} to complete`,
  rpK5_pos: (n) => `Your prices against the target price, across ${n} offer${n > 1 ? "s" : ""}`, rpSl_thVar: "Change", rpSl_thRaison: "Reason", rpSl_thCtb: "Contribution*",
  rpSl_ctbNote: "* Estimated contribution per sale, excl. VAT, before advertising, at the proposed price.", rpSl_sku: (s) => `SKU: ${s}`, rpSl_skuInc: "Unknown SKU", rpSp_apres: (n) => `After step ${n}`,
  rpRzK_sous_le_plancher: "Raise to the floor", rpRzK_au_dessus_du_plafond: "Lower to the ceiling", rpRzK_prix_actuel_non_admissible: "Bring back within the rule", rpRzK_cible_concurrents: "On target", rpRzK_cible_concurrents_plancher: "Target below the floor", rpRzK_cible_concurrents_plafond: "Target above the ceiling", rpRzK_cible_concurrents_hors_regle: "Target outside the rule", rpRzK_cible_concurrents_non_estimable: "Nearest allowed price", rpRzK_buy_box_perdue_prix_a_viser: "Matched to the featured offer",
  rpRzQ: (e, s, c) => { const a = { moins_cher: "the cheapest", mediane: "the median", choisi: "the chosen competitor" }[c]; return !a ? null : s < 0 ? `${e} below ${a}` : s > 0 ? `${e} above ${a}` : `At the price of ${a}`; }, rpSpF_dSansPl: (n) => `${n} without a known floor`, rpSpF_dSansPrix: (n) => `${n} without a read current price`,
  rpSl_envoi: "Sending to check", rpSl_envT: "Amazon result not confirmed", rpSl_envD: (a) => `Requested ${a}`, rpSl_envL: (a) => `Re-read on Amazon ${a}`,
  rpSl_verifier: "Check", rpSl_ec: (s, v) => `${s}${v}%`, rpSl_barre: "Offers whose rule follows SmartPrice",
  rpSl_voirRe: (n) => (n === 1 ? "View the Repricer offer" : `View the ${n} Repricer offers`), rpSl_voirReC: (n) => `${n} Repricer offer${n === 1 ? "" : "s"}`, rpSpTh_regle: "Rule",
  rpSpTh_prix: "Current price", rpSpTh_sit: "Current situation", rpSpTh_conseil: "Suggested price", rpSl_aff: (a, b) => `${a} of ${b} shown`, rpSl_suiv: "Next",
  rpSl_auj: (s) => `Today: ${s}`, rpSl_trier: "Sort", rpSl_sousPl: "Below the floor",
  rpSd_refAria: "Reference", rpSd_mediane: "the median", rpSd_pct: (v) => `${v}%`, rpSd_sous: (e, n) => `${e} below ${n}`, rpSd_dessus: (e, n) => `${e} above ${n}`, rpSd_egal: (n) => `At the price of ${n}`,
  rpSd_ilYa: (a) => `${a} ago`, rpSd_sousPl: (m) => `Current price ${m} below the floor.`, rpSd_remonte: (p, c, pl) => `${p} would give ${c}: the suggestion goes up to the floor, ${pl}.`,
  rpSd_cz_moins_cher: (p, n) => (n ? `${p}, the cheapest of ${n} comparable competitors with a known price.` : `${p}, the cheapest of the comparable competitors.`),
  rpSd_cz_mediane: (p, n) => (n ? `${p} of ${n} comparable competitors with a known price.` : `${p} of the comparable competitors.`), rpSd_cz_choisi: (p) => `${p}, the chosen competitor.`,
  rpSd_ctb: "Contribution per sale", rpSd_ctbD: "excl. VAT, before ads", rpSd_seuilPlus: (n) => `You earn as much if sales rise by ${n}%.`, rpSd_seuilMoins: (n) => `You earn as much even if sales fall by ${n}%.`,
  rpSd_recapT: "Send this price to Amazon?", rpSd_recapSous: "before sending to Amazon", rpSd_pays: "Country", rpSd_prixDem: "Requested price", rpSd_regle: "Rule", rpSd_envoyer: (p) => `Send ${p} to Amazon`, rpSd_retour: "Back",
  rpSd_recapNote: "The confirmation bar then asks for a final approval. After sending, GTINPilot reads back the price shown by Amazon; until it is confirmed, the offer stays in “Send to check”.",
  rpSd_coutT: "Purchase cost per unit", rpSd_coutP: "It is entered in one place only: the purchase costs page.", rpSd_coutLien: "Enter the purchase cost", rpSd_aussi: (p) => `also blocked in ${p}`,
  rpSd_pub: "Advertising", rpSd_pubV: (m) => `${m} per sale`, rpSd_pubNon: "not measured", rpSd_nonCalc: "not calculated", rpSd_ramene: "delivered price, in your format",
  rpF_aValider: "To approve", rpF_conseils: "Advice", rpF_aDebloquer: "To unblock", rpF_sans: "No change", rpF_examiner: "Review", rpF_voir: "View",
  rpF_saisirCout: "Enter the cost", rpF_modifRegle: "Edit the rule", rpF_toutVoir: "See all", rpF_nOffres: (n) => `${n} offer${n > 1 ? "s" : ""}`,
  rpF_sansTxt: (n, p) => `${n} offer${n > 1 ? "s" : ""}${p ? `, including ${p}` : ""}`, rpF_dPl: (n) => `${n} at the floor`, rpF_dPromo: (n) => `${n} on promotion`,
  rpF_dStock: (n) => `${n} with no sellable stock`, rpF_rien: "Nothing to decide", rpF_derniere: "Last change", rpF_prochaines: "The next decisions will appear here.",
  rpF_dIgn: (n) => `${n} ignored`, rpF_ignores: "Ignored advice", rpD_ignorer: "Ignore this advice", rpD_ignLe: (d) => `Advice ignored on ${d}`,
  rpD_ignRevient: "It returns to the queue if the situation changes.", rpD_ignRet: "Stop ignoring", rpD_ignOk: (h) => `Advice ignored (${h} calculation)`,
  rpD_ignNouveau: "The situation has changed: the advice is still to review.", rpD_ignRelErr: "Saved; could not read it back: reload the page.", rpD_ignRetEncore: "The advice is still ignored: reload the page.", rpD_ignRetOk: "The advice is no longer ignored.",
  rpD_ignIll: "Ignored advice list unreadable: “Ignore” is unavailable.", rpD_ignErr: (m) => `Not saved: ${m}`, rpD_ignBusy: "Saving…",
  rpFc_envoi_non_confirme: "Sending not confirmed", rpFc_envoi_refuse: "Sending refused", rpFc_refuse_amazon: "Refused by Amazon", rpFc_cout_inconnu: "Purchase cost unknown",
  rpFc_bornes_en_conflit: "Limits in conflict", rpFc_frais_inconnus: "Amazon fees unknown", rpFc_sans_prix: "Current price unknown or reading too old", rpFc_aucun: "Never computed",
  rpFc_bloque: "Blocked", rpFc_situation_changee: "Situation changed since the calculation",
  rpD_regle: (n) => `rule ${n}`, rpD_conseille: "Advised", rpD_actuel: "Current price", rpD_releve: (a) => `read ${a} ago`, rpD_plancher: "Floor", rpD_plafond: "Ceiling",
  rpD_sousPl: "below the floor", rpD_dessusPf: "above the ceiling", rpD_valider: (p) => `Approve ${p}`, rpD_recap: "A summary opens before anything is sent to Amazon.",
  rpD_simu: "Simulation: no price is sent to Amazon. This advice can be read, not sent.", rpD_benef: (p) => `Profit per sale at ${p}`, rpD_calcPl: "How the floor is computed",
  rpD_calcPlD: "Lowest price of Amazon's grid that meets the rule (profit, margin, return on cost), with the fees estimated at that price.",
  rpD_sitChg: (h) => `Situation changed since the ${h} calculation`, rpD_sitRegle: "The rule changed since this calculation.", rpD_sitPrixAct: (p) => `Current price read since then: ${p}.`,
  rpD_sitPrix: (p) => `Price read on Amazon: ${p}. Nothing was proposed.`, rpD_prochain: "New advice at the next calculation.", rpD_limChg: (h) => `Limits changed since the ${h} calculation`,
  rpD_nonCalc: "Price cannot be computed", rpD_coutPl: "Purchase cost unknown: the floor cannot be computed.", rpD_coutEst: "Estimated cost",
  rpD_estDe: (j) => `from the previous confirmed batch · received on ${j}`, rpD_aConfirmer: "To confirm in the COGS tab", rpD_ouvrirCogs: "Open COGS", rpD_coutND: "Cost cannot be determined",
  rpD_coutR_change_absent: "exchange rate of the receiving day missing", rpD_coutR_sans_jour: "receipt without a date", rpD_coutR_autre_zone_seulement: "confirmed batches only in another zone",
  rpD_coutR_aucun_lot_avant: "no confirmed batch before this receipt", rpD_coutR_egalite_ambigue: "several different costs on the same day",
  rpD_coutR_aucune_estimation: "no estimate for this product in this zone", rpD_coutR_aucune_reception: "no receipt of this product in this zone", rpD_coutR_zone_inconnue: "stock zone of the country unknown",
  rpD_envAttente: "Awaiting approval", rpD_env_PENDING: "Proposal ready: the “Approve” bar at the bottom of the screen sends it, after its summary.",
  rpD_env_EN_COURS: "Sending in progress: no new sending until the result is known.", rpD_attente: "The advice will be recomputed; until then, nothing is sent from this advice.", rpP_envBloque: "Sending not confirmed on this offer: no new sending from here until its result is known (Decisions tab).",
  rpD_env_UNKNOWN: "Result unknown at Amazon: no new sending from this screen. Check the price in Seller Central.", rpD_motif: "Reason", rpD_motifNC: "reason not given",
  rpD_envRetour: "New advice will appear after the next calculation.",
  rpMo_VALUE_CHANGED: "price or limits changed at Amazon since the proposal (Seller Central)", rpMo_RULE_CHANGED: "the price rule changed since the proposal: propose again. Nothing was sent.", rpMo_RULE_UNVERIFIABLE: "the price rule could not be checked: propose again. Nothing was sent.", rpMo_UNSUPPORTED_DISCOUNT: "a scheduled sale price exists at Amazon",
  rpMo_UNSUPPORTED_OFFER: "offer not supported", rpMo_PREVIEW_INVALID: "preview refused by Amazon", rpMo_PREVIEW_FAILED: "preview impossible at Amazon", rpMo_FROZEN: "sending frozen for this account",
  rpMo_TOO_SLOW: "sending too slow, stopped before it left", rpMo_TOKEN_FAILED: "Amazon access unavailable", rpMo_READ_FAILED: "price unreadable at Amazon", rpMo_OFFER_BUSY: "another price was being sent",
  rpMo_CURRENCY: "offer currency differs", rpMo_NO_PRODUCT_TYPE: "product type missing from the listing", rpMo_INVALID: "request judged invalid by Amazon", rpMo_http: (c) => `Amazon refused the request (HTTP ${c})`,
  rpRz_sous_le_plancher: "Current price below the floor", rpRz_au_dessus_du_plafond: "Current price above the ceiling", rpRz_prix_actuel_non_admissible: "Current price outside the rule: moved to the nearest allowed price",
  rpRz_buy_box_perdue_prix_a_viser: "Featured offer lost: price matched to the featured offer", rpRz_seule_offre: "Only offer on the listing: price kept", rpRz_buy_box_detenue: "Featured offer held: price kept",
  rpRz_buy_box_perdue_sans_prix_a_viser: "Featured offer lost, no target price read", rpRz_deja_au_prix_vise: "Already at the target price", rpRz_promotion_en_cours: "Promotion running: advice paused",
  rpRz_non_achetable: "No sellable stock", rpRz_aucun_prix_admissible: "No price meets every limit of the rule",
  rpRzF: (f, e) => `${f}: ${e}`, rpRzF_releve_prix: "Reading of our price", rpRzF_prix_actuel: "Current price", rpRzF_stock: "Stock reading", rpRzF_promotions: "Promotions reading",
  rpRzF_cout_achat: "Purchase cost", rpRzF_frais_prix_actuel: "Amazon fees at the current price", rpRzE_absent: "missing", rpRzE_perime: "too old", rpRzE_invalide: "unreadable", rpRzE_inconnu: "unknown",
  rpRz_concurrents_parametres_absents: "Against competitors: no target set in the rule", rpRz_concurrents_choisi_absent: "Against competitors: chosen competitor not in the list", rpRz_concurrents_choisi_exclu: "Against competitors: chosen competitor left out of the calculation", rpRz_concurrents_aucun_prix_admissible: "Against competitors: no usable competitor price", rpRz_concurrents_couverture_insuffisante: "Against competitors: too few recent prices to conclude", rpRz_concurrents_mediane_moins_de_2_prix: "Against competitors: fewer than 2 prices for a median",
  rpRz_cible_concurrents: "Against competitors: price set on the target", rpRz_cible_concurrents_plancher: "Against competitors: target below the floor, price at the floor", rpRz_cible_concurrents_plafond: "Against competitors: target above the ceiling, price at the ceiling", rpRz_deja_a_la_cible_concurrents: "Against competitors: already at the target", rpRz_deja_a_la_cible_concurrents_plancher: "Against competitors: already at the floor (lower target)", rpRz_deja_a_la_cible_concurrents_plafond: "Against competitors: already at the ceiling (higher target)", rpRz_cible_concurrents_hors_regle: "Against competitors: target not allowed by the rule, nearest allowed price on the target's side", rpRz_deja_au_prix_autorise_concurrents: "Against competitors: target not allowed by the rule, already at the nearest allowed price on the target's side", rpRz_cible_concurrents_non_estimable: "Against competitors: price to the cent not computable, nearest allowed price on the target's side", rpRz_deja_au_prix_grille_concurrents: "Against competitors: price to the cent not computable, already at the nearest allowed price on the target's side", rpRz_ecart_sous_minimum_concurrents: "Against competitors: target too close to the current price, price kept",
  rpRzN: (e) => `Against competitors: our offer, ${e}`, rpRzC_offre_invalide: "malformed reading", rpRzC_etat_inconnu: "item condition unknown", rpRzC_expedition_inconnue: "fulfilment method unknown", rpRzC_heure_inconnue: "reading time unknown", rpRzC_donnee_future: "reading time in the future", rpRzC_donnee_perimee: "reading too old", rpRzC_port_inconnu: "shipping cost unknown", rpRzC_total_incoherent: "inconsistent delivered total", rpRzC_port_incoherent: "inconsistent shipping cost",
  rpCo_pli: "Competitors", rpCo_nSurM: (n, m) => `${n} comparable of ${m}`, rpCo_indispo: "list unavailable", rpCo_aucunCourt: "none", rpCo_indispoD: "Competitor list unavailable: the Watch state could not be read. Nothing was changed.", rpCo_etat: (n, max) => `${n} tracked · ${max} at most`, rpCo_aucun: "No competitor tracked for this product in this country. Add one below, or pick it in Watch.", rpCo_sansPrix: "price not read", rpCo_parUnite: (p) => `${p}/unit`, rpCo_lotDe: (n, p) => `Pack of ${n}: ${p}`, rpCo_releveIlYa: (a) => `read ${a} ago`, rpCo_sansOffre: (a) => `no Featured Offer at the last read (${a} ago), not used in the calculation`, rpCo_dernierConnu: (p, a) => `last known price ${p}, ${a} ago`, rpCo_perime: (h) => `stale (over ${h} h), not used in the calculation`, rpCo_photo: (a) => `offers captured ${a} ago`, rpCo_format: "Units per pack", rpCo_fmtOk: "Save the format", rpCo_retirer: "Remove for this product", rpCo_aDeclarer: "To declare · not counted", rpCo_cmp: "Comparable", rpCo_cmpLot: (n) => `Comparable · pack of ${n}`, rpCo_hors: "Not counted", rpCo_srcManuel: "Added by hand", rpCo_srcVeille: "Watch", rpCo_actions: "Actions on this competitor", rpCo_ajouter: "Add a competitor", rpCo_ph: "ASIN or Amazon link", rpCo_ajouterBtn: "Add", rpCo_veille: "Pick in Watch", rpCo_note: "Price: last Featured Offer price read, shipping included, with its age; after 2 h it is stale and no longer used in the calculation. With no Featured Offer at the last read, it is not used either. A competitor not counted stays watched. Nothing changes on Amazon.", rpCo_okAjout: "Competitor added.", rpCo_okFmt: "Format saved.", rpCo_okRet: "Competitor removed for this product.", rpCo_okCmp: "Counted in the calculation.", rpCo_okHors: "Not counted, still watched.", rpCo_errMax: "Refused: at most 10 tracked competitors per product and country (or 100 additions). Nothing was written.", rpCo_errNonSuivi: "Refused: this competitor is no longer tracked for this product. Nothing was written.", rpCo_err: "Saving failed. Nothing was written.", rpCo_errAsin: "Invalid ASIN: 10 letters or digits, or an Amazon product page link.", rpCo_errFmt: "Invalid format: a whole number from 1 to 100.",
});
Object.assign(I18N.es, { t1pPrice: "Repricer", rpTitle: "Repricer", t1pSmart: "SmartPrice", rpSp_videT: "Ninguna oferta sigue SmartPrice", rpSp_videD: "SmartPrice sitúa el precio de su marca frente a productos competidores que usted elige. Tres pasos, en orden, para activarlo.", rpSp_aria: "Tres pasos para activar SmartPrice", rpSp_e_1: "Regla", rpSp_e_1d: "diferencia y límites", rpSp_e_1a: "Crear una regla", rpSp_e_2: "Ofertas", rpSp_e_2d: "aplicar la regla", rpSp_e_3: "Competidores", rpSp_e_3d: "por oferta y por país",
  rpCrumb: "Productos", rpLvl_ombre: "Simulación", rpLvl_propose: "Envío tras validación", rpLvl_auto: "Automático",
  rpLvlAria: "Nivel del repricer", rpLvlTip: "Nivel de la cuenta: Simulación mientras el bloqueo de precios está cerrado (ningún precio enviado a Amazon), Envío tras validación cuando está abierto. Automático aún no existe.", rpLvlUnk: "Nivel desconocido: bloqueo de precios no leído.", rpEtatN: (s, n) => `${s} ${n === 1 ? "oferta" : "ofertas"}`, rpRe_c_expl: (s, n) => `${s} utilizable${n === 1 ? "" : "s"}`, rpRe_c_bloq: (s, n) => `${s} bloqueada${n === 1 ? "" : "s"}`, rpRe_c_inact: (s, n) => `${s} inactiva${n === 1 ? "" : "s"}`, rpRe_c_nonAch: (s, n) => `${s} no comprable${n === 1 ? "" : "s"}`, rpRe_c_nonConf: (s, n) => `${s} no confirmada${n === 1 ? "" : "s"}`, rpRe_c_sansOffre: (s) => `${s} sin oferta suya`, rpRe_c_ecart: (s, n) => `${s} oculta${n === 1 ? "" : "s"} o desactivada${n === 1 ? "" : "s"}`, rpRe_decTip: "Utilizables: precio registrado, cálculo posible. Bloqueadas: seguidas, pero falta un dato para el cálculo (coste, tarifas, límites). Inactivas: anuncio inactivo en Amazon. Sin oferta suya: la ficha existe en este país, sin anuncio ni precio suyo. No comprables: anuncio activo, pero sin oferta comprable registrada o sin stock vendible. No confirmadas: precio registrado, pero anuncio ausente del informe de anuncios. Ocultas o desactivadas: por usted. Todas aparecen en «Todas las ofertas».", rpRe_mode: "Modo:", rpEtatCalc: (h) => `calculado a las ${h}`,
  rpFPays: "País", rpFSit: "Situación", rpFAll: "Todos", rpFAllF: "Todas", rpTabConseils: "Acciones", rpTabTous: "Todas las ofertas", rpTabJournal: "Registro", rpTabRegles: "Reglas",
  rpTabsCount: (p, c) => `${p} producto${p === 1 ? "" : "s"} · ${c} país${c === 1 ? "" : "es"}`, rpSoon: "Próximo lote",
  rpTh_prod: "Producto", rpTh_pays: "País", rpTh_prix: "Precio", rpTh_conseil: "Consejo",
  rpC_garder: "Mantener", rpC_pause_promo: "En pausa · promo", rpC_cout_inconnu: "Coste desconocido", rpC_bornes_en_conflit: "Límites en conflicto", rpC_frais_inconnus: "Tarifas desconocidas",
  rpC_sans_prix: "Precio no leído", rpC_bloque: "Bloqueado", rpC_aucun: "Aún sin consejo", rpC_desactive: "Desactivado", rpC_aValider: "por validar",
  rpErr: "No disponible.", rpNone: "Ningún producto vendido en los últimos 7 días.", rpNoneFiltre: "Ninguna fila con estos filtros.",
  rpP_perdue: (d, n) => `oferta destacada perdida desde el ${d} · ${n} vendedores`, rpP_perdueX: "oferta destacada perdida", rpP_detenue: (n) => `oferta destacada propia · ${n} vendedores`,
  rpP_seul: "único vendedor · ninguna otra oferta", rpP_inconnue: "oferta destacada: situación desconocida", rpP_sans_offre: "ninguna oferta activa", rpP_close: "Cerrar",
  rpSim: "Simulación", rpSimTest: "Probar otro precio", rpSimPrix: "precio probado", rpSimPlancher: "mínimo", rpSimPlafond: "máximo", rpSimAttendu: "esperado", rpSimAttNon: "no leído", rpSimAttSeul: "ningún competidor",
  rpL_ttc: "Precio con IVA", rpL_tva: (p) => `IVA ${p}`, rpL_tvaX: "IVA", rpL_frais: "Tarifas de Amazon a este precio", rpL_cout: "Coste de compra (media del stock restante)", rpL_coutProv: "provisional",
  rpL_pub: "Publicidad por unidad", rpL_pubNon: "no calculada", rpL_ben: "Beneficio por unidad", rpL_benAv: "antes de publicidad", rpL_acos: "ACOS de equilibrio", rpL_ench: "Puja de equilibrio",
  rpL_enchAu: "Pujas por encima", rpL_inconnu: "desconocido", rpL_nonReleve: "no leído", rpL_pxInactive: "anuncio inactivo", rpL_pxSansOffre: "sin oferta suya", rpL_pxNonLu: "informe de anuncios aún no leído", rpL_pxFiche: "precio de la ficha, referencia no identificada", rpL_pxConf: (p, d) => `Precio configurado: ${p} (informe de anuncios, ${d})`, rpRe_c_nonLu: (s) => `${s} por verificar (anuncios no leídos)`, rpL_pxNonAch: "ninguna oferta comprable registrada", rpL_avant: "Antes", rpL_parU: "/ unidad", rpL_vjPerte: "Ventas / día antes de la pérdida",
  rpL_vj: "Ventas / día", rpL_vjCumul: "Ventas / día acumuladas (todas las referencias del producto)", rpL_moy14: "media de 14 días", rpE_attente: "Pendiente de validación", rpE_conseil: (p) => `Consejo: ${p}`, rpProposer: "Proponer este precio",
  rpPropBusy: "Enviando…", rpPropGele: "Bloqueo de precios cerrado: ningún precio puede enviarse a Amazon.", rpPropErr: (m) => `No propuesto: ${m}`, rpPropSousMarge: "Precio por debajo del margen mínimo: aparece en rojo en la barra inferior y solo se envía tras «Ignorar el margen».", rpPropRelu: (p) => `Precio leído en Amazon: ${p}`,
  rpDetErr: "Detalle no disponible.", rpGrilleVide: "Ningún precio estimado por Amazon para este producto.",
  rpJErr: "Registro no disponible.", rpJ_vide: "Ninguna entrada en los últimos 30 días.", rpJ_th_date: "Fecha", rpJ_th_evt: "Evento", rpJ_cpt: (n) => `${n} lectura(s) sin cambio (como máximo una por día y producto, todos los países)`, rpJ_cout: "Coste de compra (congelado)", rpJ_estime: "(estimado)", rpJ_roi: "Retorno sobre coste", rpJ_marge: "Margen", rpJ_bb: "Oferta destacada", rpJ_bbOui: "obtenida", rpJ_bbNon: "no obtenida", rpJ_bornes: "Mínimo / máximo", rpJ_bas: "Precio más bajo Prime / no Prime", rpJ_raison: "Motivo", rpJ_fige: "Congelado el", rpJ_nonFige: "Propuesta anterior a las instantáneas: economía no congelada.", rpJ_regleNonFigee: "regla no congelada", rpJ_voir: "Ver el detalle", rpJ_auPa: (p) => `Al precio actual (${p})`, rpJ_auPaC: "al precio actual", rpJ_contrib: "Contribución", rpJ_nonEnr: "no registrado", rpJ_indispo0: "no disponible", rpJ_causes: "Causas", rpJ_consq: "Consecuencia", rpJ_consqV: (v) => `${v}: no disponibles`, rpJ_filS: (s, n) => `Ofertas seguidas por el Repricer · ${s} entrada${n === 1 ? "" : "s"} de otras ofertas oculta${n === 1 ? "" : "s"}`, rpJ_filT: "Todo el historial", rpJ_voirTout: "Mostrar todo el historial", rpJ_voirSuiv: "Volver a las ofertas seguidas", rpJA_prix_inconnu: "precio no registrado", rpJA_frais_absents: "faltan las tarifas de Amazon", rpJA_cout_achat_absent: "falta el coste de compra",
  rpJ_ombre: "Consejo (simulación)", rpJ_prop: "Propuesta de precio", rpJ_via_barre: "barra", rpJ_via_mcp: "MCP",
  rpJ_St_PENDING: "Pendiente", rpJ_St_CONFIRMED: "Confirmado", rpJ_St_SENDING: "Enviando", rpJ_St_APPLIED: "Aplicado", rpJ_St_NOT_APPLIED: "No aplicado",
  rpJ_St_REFUSED: "Rechazado", rpJ_St_CANCELLED: "Cancelado", rpJ_St_EXPIRED: "Caducado", rpJ_St_UNKNOWN: "Resultado desconocido",
  rpR_def: "Por defecto (cuenta)", rpR_defNone: "Ninguna regla por defecto: ningún consejo calculado.", rpR_src: "Regla", rpR_propre: "Propia", rpR_defaut: "por defecto",
  rpR_margeMin: "Margen mínimo", rpR_roiMin: "Retorno sobre coste mínimo", rpR_profitMin: "Beneficio mínimo / unidad", rpR_margeMax: "Margen máximo", rpR_mode: "Modo",
  rpR_mode_tous: "Todos los mínimos", rpR_mode_au_moins_un: "Al menos uno", rpR_revenir: "Volver al defecto", rpR_garder: "Mantener la propia", rpR_auDefaut: "→ por defecto",
  rpR_sansSku: "sin referencia de vendedor", rpR_n: (n) => `${n} regla(s) modificada(s)`, rpR_ou: "en GTINPilot, nada enviado a Amazon", rpR_cancel: "Cancelar", rpR_save: "Guardar",
  rpR_busy: "Guardando…", rpR_ok: "Guardado · consejos en el próximo cálculo", rpR_ko: (m) => `No guardado: ${m}`,
  rpR_e_champ: (w) => `${w}: se espera un número > 0`, rpR_e_vide: (w) => `${w}: al menos un mínimo (margen, retorno sobre coste o beneficio)`,
  rpR_e_maxi: (w) => `${w}: margen máximo ≤ margen mínimo`, rpR_e_trop: () => "50 reglas como máximo por guardado",
  rpTh_situation: "Situación", rpTh_situationTip: "Posición actual de la oferta. La columna Consejo indica el precio a alcanzar: las dos etiquetas difieren a propósito.",
  rpTh_ventes: "Ventas 30 d", rpTh_ventesTip: "Unidades vendidas en los últimos 30 días, sin Vine (Vine aparte): mismo cálculo que la página Ventas (día de la cuenta, pedidos cancelados excluidos).",
  rpSit_seul_vendeur: "Único vendedor", rpSit_detenue: "Oferta destacada propia", rpSit_perdue: "Oferta destacada perdida", rpSit_au_plancher: "En el mínimo", rpSit_cout_inconnu: "Coste desconocido",
  rpSit_sans_offre: "Sin oferta activa", rpSit_inconnue: "Desconocida", rpV_aucune: "Ningún pedido registrado en este país", rpV_sansArt: (n) => `${n} pedido(s) del país sin detalle de artículo: esta cifra es un mínimo`, rpV_vine: (n) => `+${n} Vine`, rpV_jours: (n) => `en ${n} d`,
  rpV_tip: (u, j) => `Ventas ${j} d: ${u}`,
  rpPli_inactifs: (n) => `Sin oferta activa (${n})`, rpPli_inactifsD: "Ningún precio leído o anuncio inactivo en Amazon: nada que aconsejar mientras la oferta no venda.",
  rpPli_masques: (n) => `Productos ocultos (${n})`, rpPli_masquesD: "Oculto en Stock › Listings: retirado solo de las listas, sigue seguido.",
  rpPli_desactives: (n) => `Desactivados (${n})`, rpPli_desactivesD: "Desactivado en todo GTINPilot: el repricer deja de aconsejarlo. Se reactiva en Stock › Listings.",
  rpNoneActif: "Ninguna oferta en venta para estos filtros.",rpC_non_achetable: "No comprable · sin stock",
  rpL_pubTip: (a, b) => `gasto publicitario ÷ unidades vendidas, del ${a} al ${b}`, rpPubR_rapport_pub_absent: "sin informe de publicidad para este país", rpPubR_rapport_pub_incomplet: "informe de publicidad incompleto en 30 días",
  rpPubR_aucune_vente: "ninguna unidad vendida en 30 días", rpPubR_devise_pub_differente: "gasto publicitario en otra moneda", rpPubR_quantite_absente: "cantidad ausente en un pedido", rpPubR_tables_absentes: "datos ausentes",
  rpL_enchN: (n, m) => `${n} puja(s) por encima de ${m}`, rpL_ench0: (m) => `ninguna puja por encima de ${m}`,
  rpLb_dateInc: "fecha desconocida", rpLb_voirJournal: "Ver el registro", rpLb_voirN: (n) => `Ver los ${n}`, rpLb_horsListe: (n) => `${n} fuera de esta página (países o productos sin lectura reciente)`, rpEd_e_choix: "Elegir el valor que se conserva para cada campo cambiado en ambos lados.", rpEd_cflAucunDeux: "Ningún campo cambió en ambos lados; si lo hubiera, se elegiría aquí antes de guardar.", rpEd_cflDeux: "Un campo cambió en ambos lados: elegir el valor que se conserva antes de guardar.", rpEd_inchanges: "sin cambios", rpEd_aChoisir: "por elegir", rpEd_oIdentiques: "idénticos", rpPp_calcAvec: (r, a) => `calculado con ${r} hace ${a}`, rpPp_stale: (r, a) => `Consejo calculado con ${r} hace ${a} — se recalcula en el próximo paso`, rpPp_ageMin: (n) => `${n}\u00a0min`, rpPp_ageHM: (h, m) => `${h}\u00a0h\u00a0${String(m).padStart(2, "0")}\u00a0min`, rpPp_ageH: (n) => `${n}\u00a0h`, rpPp_nonNotee: "regla no anotada", rpPp_fxD_conflitAvec: (r) => `: las barreras de ${r} no dejan ningún precio de la tabla.`, rpPp_recalcul: "Ya no es la regla actual: se recalcula en el próximo paso.", rpPp_reaffecter: "Reasignar", rpPp_compteNonModif: "regla de la cuenta: no editable aquí", rpLb_simT: "Solo simulación.", rpLb_simD: "Estas reglas calculan recomendaciones. No modifican ningún precio de Amazon.",
  rpLb_ordre: "Orden:", rpLb_o1: "regla propia del producto", rpLb_o2: "regla con nombre asignada", rpLb_o3: "regla de la cuenta",
  rpLb_titre: "Biblioteca de reglas", rpLb_sous: "Reglas reutilizables, asignadas por producto × país", rpLb_defs: "Definiciones", rpLb_affecter: "Asignar una regla", rpLb_nouvelle: "Nueva regla",
  rpLb_thRegle: "Regla", rpLb_thBar: "Barreras de precio", rpLb_thEcart: "Diferencia", rpLb_thAff: "Asignada a", rpLb_thPays: "Países", rpLb_thActs: "Acciones",
  rpLb_compte: "Regla de la cuenta", rpLb_tagDef: "Por defecto", rpLb_compteD: "se aplica a todo producto × país sin otra regla",
  rpLb_compteAbs: "Sin regla de la cuenta: sin regla con nombre ni propia, ninguna recomendación.",
  rpLb_compteLock: "No editable aquí · fijada en la configuración de la cuenta, sin pantalla hoy",
  rpLb_mini: "Mín", rpLb_maxi: "Máx", rpLb_sansPlafond: "sin techo", rpLb_et: "Y", rpLb_ou: "O",
  rpLb_c_profit: "Beneficio", rpLb_c_marge: "Margen", rpLb_c_roi: "Retorno sobre coste", rpLb_ecNon: "no ajustado", rpLb_ecNonT: "Ninguna diferencia ajustada: el motor no aplica ninguna diferencia con esta regla.", rpLb_ecClasserT: "Forma por clasificar: el motor no aplica ninguna diferencia.", rpLb_ecT: "Diferencia aplicada por el motor para esta forma de apuntar.",
  rpLb_pxp: "productos × países", rpLb_dontApp: (n) => `${n} aplicado(s)`, rpLb_tousPays: "Todos los países", rpLb_nNommees: (n) => `${n} con nombre`,
  rpLb_version: (v, le, par) => `versión ${v}${le ? ` · ${le}` : ""}${par ? ` · ${par}` : ""}`,
  rpLb_appliquer: "Aplicar en todas partes", rpLb_modifier: "Modificar", rpLb_dupliquer: "Duplicar", rpLb_supprimer: "Eliminar", rpLb_supprT: "Eliminar (se archiva, recuperable)",
  rpLb_autres: (nom) => `Más acciones · ${nom}`, rpLb_copie: (nom) => `${nom} (copia)`,
  rpLb_arch: (n) => `Archivadas (${n})`, rpLb_archD: "recuperable", rpLb_restaurer: "Restaurar",
  rpLb_s_personnalise: "Personalizado", rpLb_s_prudent: "Prudente", rpLb_s_equilibre: "Equilibrado", rpLb_s_offensif: "Ofensivo", rpLb_s_destockage: "Liquidación",
  rpLb_n_prudent: "Margen protegido", rpLb_n_equilibre: "Buy Box equilibrada", rpLb_n_offensif: "Conquista (Q4)", rpLb_n_destockage: "Liquidación",
  rpLb_videT: "Ninguna regla con nombre", rpLb_videD: (n, p) => `La regla de la cuenta se aplica a los ${n} productos × países (${p} países).`,
  rpLb_videD2: "Una regla con nombre se crea una vez y se asigna a varios productos × países; modificarla crea una nueva versión que siguen sus productos.",
  rpLb_partir: "Partir de este modelo", rpLb_lecture: "Leyendo las reglas de la cuenta…",
  rpLb_errT: "Reglas ilegibles", rpLb_errD: "No se pudo leer el archivo de reglas de esta cuenta. Mientras no se lea, no se aplica ninguna regla: nada vuelve en silencio a la regla de la cuenta.",
  rpLb_errD2: (d) => `Las recomendaciones mostradas datan del último cálculo correcto (${d}) y están caducadas.`, rpLb_reessayer: "Reintentar",
  rpLb_lockT: "Escrituras desactivadas", rpLb_lockD: "mientras el archivo sea ilegible: escribir sobre un archivo ilegible podría borrar las reglas que contiene.",
  rpLb_detail: "Detalle:", rpLb_offT: "Escrituras desactivadas: archivo de reglas ilegible",
  rpLb_apT: (nom, v) => `Aplicar «${nom}» v${v} en todas partes`, rpLb_apBig: "productos × países cambian de regla",
  rpLb_apNote: (n, p) => `De los ${n} productos × países de los ${p} países cubiertos por la regla. Solo simulación: ningún precio de Amazon modificado.`,
  rpLb_apChg: "cambian de regla: la regla con nombre pasa a ser efectiva", rpLb_apDeja: (nom) => `ya en «${nom}»: sin cambios`,
  rpLb_apProp: "conservan su regla propia: asignación guardada, sustituida por la regla propia", rpLb_apHors: (p) => `sin tocar: ${p}, no cubierto(s) por la regla`,
  rpLb_apSans: "sin SKU de vendedor: sin tocar", rpLb_rien: (nom) => `Nada que cambiar: todos los productos × países cubiertos ya están en «${nom}».`,
  rpLb_resOk: (n) => `${n} producto(s) × país asignado(s) · solo simulación, nada en Amazon.`,
  rpLb_resPart: (ok, tot, ko) => `${ok} asignados de ${tot} · ${ko} sin asignar`, rpLb_resPartD: "las demás asignaciones están guardadas.",
  rpLb_r_CONFLIT: "asignación modificada entretanto; nada cambió para este producto", rpLb_r_PAYS_NON_COUVERT: "país no cubierto por la regla; nada cambió para este producto",
  rpLb_r_ARCHIVEE: "regla archivada entretanto; nada cambió para este producto", rpLb_r_INTROUVABLE: "regla no encontrada; nada cambió para este producto",
  rpLb_reessayerN: (n) => `Reintentar los ${n}`,
  rpLb_suppRefus: (n, nom) => `Eliminación rechazada: ${n} producto(s) × país usan «${nom}». Reasignarlos primero; eliminar archiva la regla, recuperable.`,
  rpLb_vbT: "Cambio por validar — 1 pendiente", rpLb_annuler: "Cancelar", rpLb_valider: "Validar", rpLb_enCours: "Guardando…",
  rpLb_vbSim: "solo simulación · ningún precio de Amazon modificado",
  rpLb_vb_affect: (nom, v, n, p) => `Asignar «${nom}» v${v}: ${n} producto(s) × país${p ? ` · ${p} conservan su regla propia` : ""}`,
  rpLb_vb_affectD: "Los productos seguirán cada nueva versión de la regla.", rpLb_vb_affMulti: (n, p) => `${n} producto(s) × ${p} países elegidos`,
  rpLb_vb_aucune: (qui) => `Quitar la asignación de ${qui}: se aplicará la regla de la cuenta`,
  rpLb_vb_archiver: (nom) => `Archivar «${nom}»`, rpLb_vb_archiverD: "Archivada, sigue siendo recuperable; ningún producto la usa.",
  rpLb_vb_restaurer: (nom) => `Restaurar «${nom}»`, rpLb_vb_retirer: (qui) => `Quitar la regla propia de ${qui}`,
  rpLb_vb_retirerD: "Se aplicará la regla con nombre asignada o, si no, la de la cuenta. No se borra nada más.",
  rpLb_okMsg: "Regla guardada · solo simulación, nada en Amazon.", rpLb_ko: (m) => `No se guardó nada: ${m}`,
  rpLb_archOk: (nom) => `«${nom}» archivada (recuperable).`, rpLb_restOk: (nom) => `«${nom}» restaurada.`, rpLb_retOk: "Regla propia quitada.",
  rpEd_titreMod: "Modificar la regla", rpEd_titreNew: "Nueva regla", rpEd_titreProp: (qui) => `Regla propia · ${qui}`,
  rpEd_metaMod: (nom, v, le) => `${nom} · versión ${v}${le ? ` · modificada el ${le}` : ""}`, rpEd_metaNew: "borrador · nada guardado", rpEd_metaProp: (v) => `versión ${v}`,
  rpEd_fermer: "Cerrar", rpEd_ident: "Nombre", rpEd_nom: "Nombre de la regla", rpEd_affA: "Asignada a", rpEd_affN: (n) => `${n} producto(s) × país`, rpEd_aucunProd: "ningún producto",
  rpEd_vInfo: (a, b) => `versión ${a} → ${b}`, rpEd_vNew: "nueva",
  rpEd_hintMod: (v, n) => `Guardar crea la versión ${v}; los ${n} producto(s) × país asignados la siguen. Cada simulación anota la versión usada.`,
  rpEd_hintNew: "Nueva regla: versión 1 al guardar, sin productos asignados.",
  rpEd_style: "Estilo de la regla", rpEd_styleH: "Un estilo rellena las barreras de abajo; Personalizado conserva los valores introducidos.", rpEd_rec: "Recomendado",
  rpEd_sd_personnalise: "no cambia nada", rpEd_sd_prudent: "margen primero", rpEd_sd_equilibre: "margen y oferta destacada", rpEd_sd_offensif: "mínimos bajos", rpEd_sd_destockage: "nunca bajo coste",
  rpEd_bar: "Barreras de precio", rpEd_defH: "Definiciones — las mismas que el cálculo",
  rpEd_dBen: "precio sin IVA − comisiones de Amazon a ese precio − coste de compra (media ponderada), por unidad, antes de publicidad", rpEd_dMarge: "beneficio ÷ precio sin IVA", rpEd_dRoi: "beneficio ÷ coste de compra",
  rpEd_mins: "Mínimos", rpEd_maxs: "Máximos", rpEd_aucun: "Ninguno", rpEd_devPays: "moneda del país",
  rpEd_f_profitMin: "Beneficio mín. por venta", rpEd_f_margeMin: "Margen mín.", rpEd_f_roiMin: "Retorno sobre coste mín.",
  rpEd_f_profitMax: "Beneficio máx. por venta", rpEd_f_margeMax: "Margen máx.", rpEd_f_roiMax: "Retorno sobre coste máx.",
  rpEd_modeMin: "Mínimos: Y / O", rpEd_modeMax: "Máximos: Y / O", rpEd_tousMin: "todos los mínimos fijados", rpEd_tousMax: "todos los máximos fijados", rpEd_auMoins: "al menos uno",
  rpEd_maxH0: "Ningún máximo fijado: sin techo.", rpEd_maxH1: "Un máximo solo restringe los precios permitidos.", rpEd_maxH2: "Un máximo nunca anula un mínimo ni una protección.",
  rpEd_exDes: "precios permitidos desde", rpEd_exSans: "· sin techo", rpEd_exJusq: (m) => `· hasta ${m}`, rpEd_ok: "barreras compatibles", rpEd_exCout: "coste",
  rpEd_exAucun: "ningún precio de su tabla respeta estas barreras", rpEd_exNone: "Ejemplo con cifras: leyendo la tabla de precios de un producto…",
  rpEd_vide: "Ningún precio permitido", rpEd_videD: (x) => `: ${x} no pueden cumplirse juntos. Vale para todos los productos; corregir uno de los dos para guardar.`,
  rpEd_contra: "Límites contradictorios", rpEd_contraD: (x) => `: ${x}. Un máximo debe superar el mínimo del mismo criterio; corregir para guardar.`,
  rpEd_saveImp: "No se puede guardar: ningún precio permitido", rpEd_saveImpT: "Ningún precio permitido: corregir las barreras",
  rpEd_pays: "Países donde se aplica la regla", rpEd_tousPays: "Todos los países de la cuenta", rpEd_tousPaysD: "incluidos los que se añadan más tarde", rpEd_certains: "Algunos países", rpEd_certainsD: "marcados abajo",
  rpEd_paysH: "País sin marcar: la regla nunca se aplica allí. Un producto que siga asignado se señala «asignada, pero no aplicable», y se nombra la regla realmente aplicada.",
  rpEd_soon: "Previsto, aún no activo", rpEd_soonN: (n) => `${n} ajustes`,
  rpEd_x_pause: "Pausa recurrente", rpEd_xd_pause: "Mantener el precio en una franja horaria elegida.", rpEd_xf_pause: [["Franjas", "+ Añadir una franja"]],
  rpEd_x_conc: "Competencia", rpEd_xd_conc: "Cómo situarse frente a Amazon y a los vendedores que envían ellos mismos.",
  rpEd_xf_conc: [["Frente a Amazon", "Igualar si es rentable, si no dejar"], ["Vendedores que envían ellos mismos", "Tenerlos en cuenta"], ["Diferencia con el precio a batir", "0 · igualar"], ["Subida y bajada máx. por día", "—"]],
  rpEd_x_cas: "Casos particulares", rpEd_xd_cas: "Qué hacer si se retira la oferta destacada, si la competencia baja del suelo, si la oferta está sola o ya tiene la oferta destacada.",
  rpEd_xf_cas: [["Oferta destacada retirada por Amazon", "No tocar el precio"], ["Competencia bajo el suelo", "No tocar el precio"], ["Única oferta del anuncio", "No tocar el precio"], ["Oferta destacada ya obtenida", "No tocar el precio"]],
  rpEd_x_battre: "Precio a batir", rpEd_xd_battre: "Qué precio apuntar y qué competidores contar.", rpEd_xf_battre: [["Precio objetivo", "Precio de la oferta destacada"], ["Valoraciones positivas mín. del vendedor", "—"]],
  rpEd_x_yoyo: "Protecciones anti-yoyó", rpEd_xd_yoyo: "Si el precio sube y baja en bucle frente a otro programa, pausa que se alarga con cada repetición, causa escrita en el registro.",
  rpEd_xf_yoyo: [["Pausa", "6 h › 24 h › 72 h si el conflicto se repite · nunca un bloqueo silencioso"]],
  rpEd_x_auto: "Automatizaciones", rpEd_xd_auto: "Cambiar de regla cuando un producto deja de venderse, contado por país y por reserva de stock compartida.",
  rpEd_xf_auto: [["Sin ventas desde", "20 › 35 › 50 › 65 días"], ["Entonces pasar a", "Regla siguiente"]],
  rpEd_note: "Guardar no modifica ningún precio en Amazon.", rpEd_facon: "¿Cómo fija su precio?", rpEd_fc_concurrents: "SmartPrice", rpEd_fcd_concurrents: "Su marca frente a productos competidores de otras marcas.",
  rpEd_vf_m001: (c) => `0,01 ${c} más barato`, rpEd_vfRef_foep: "el precio sugerido por Amazon", rpEd_vfRef_bas: "el precio entregado más bajo", rpEd_exT: "Ejemplo ficticio · ningún producto real", rpEd_exVed: "Oferta destacada", rpEd_exPl: "Precio mínimo", rpEd_exGarde: "mantenido en el mínimo", rpEd_vfRef: "la oferta destacada", rpEd_vfH: "entre los vendedores de la ficha que cuenta esta regla", rpEd_vfPl: "Vendedores contados", rpEd_vfExp_tous: "todos los vendedores", rpEd_vfExpD_tous: "Cuenta cada vendedor encontrado en la ficha, sea quien sea quien envíe.", rpEd_vfExp_amazon: "solo enviados por Amazon", rpEd_vfExpD_amazon: "Solo cuentan los vendedores cuya oferta envía Amazon. Un vendedor del que no se sabe quién envía no se cuenta.", rpEd_vfExpH: "Descartar un vendedor concreto: disponible pronto, desde la lista de vendedores de la ficha.", rpEd_vfPh_aucun: "Elija una diferencia: el precio seguirá a la oferta destacada, sin bajar del suelo ni superar el techo.", rpEd_e_vf: "Diferencia: un número positivo, dos decimales como máximo.", rpEd_fcRfOk: "Elección guardada. Calculado en Simulación: no se envía ningún precio a Amazon.", rpEd_fcRfNonEnr: "Se guardará con la regla. Calculado en Simulación: no se envía ningún precio a Amazon.", rpEd_fc_vendeurs_fiche: "Repricer", rpEd_fcd_vendeurs_fiche: "Usted y otros vendedores en la misma ficha de Amazon.", rpEd_fcAClasser: "Por clasificar: mientras no se elija un modo, la regla conserva su cálculo actual.", rpEd_fcNonEnr: "Se guardará con la regla. Este cálculo aún no está activo: hoy no depende de él ningún consejo.", rpEd_fcInactif: "Elección guardada. Este cálculo aún no está activo: hoy no depende de él ningún consejo.",
  rpEd_fcLe: (d) => `Elegido el ${d}.`,
  rpEd_enr: "Guardar", rpEd_resAria: "Vista previa de la regla", rpEd_pl_lim: "Límites", rpEd_pl_ctb: "Contribución", rpEd_pl_pays: "Países", rpEd_pl_mode: "Modo", rpEd_plv_profit: "contribución", rpEd_plv_marge: "margen", rpEd_plv_roi: "retorno sobre coste", rpEd_plv_mini: (x) => `${x} mín.`, rpEd_plv_maxi: (x) => `${x} máx.`, rpEd_plv_aucune: "ningún límite", rpEd_plv_ctb: "precio sin IVA − comisiones − compra, antes de publicidad", rpEd_plv_mode_concurrents: "productos competidores", rpEd_plv_mode_vendeurs_fiche: "vendedores de la ficha",
  rpEd_clsRes: "Mientras no tenga modo, esta regla conserva su cálculo actual.", rpEd_clsN: (n) => `${n} ${n === 1 ? "oferta sigue" : "ofertas siguen"} esta regla`, rpEd_fcSpOk: "Elección guardada.", rpEd_fcSpNonEnr: "Se guardará con la regla.", rpEd_fcSpSans: "Sin diferencia de precio, SmartPrice no sigue a ningún competidor; solo devuelve a la regla un precio que se sale de ella (demasiado bajo, demasiado alto o no permitido).", rpEd_ecExPlC: (x) => `contribución ${x}`, rpEd_ecCoChoisir: "Elegir un competidor comparable", rpEd_ecCoHors: (a) => `${a} (ya no es comparable)`,
  rpEd_fcq_concurrents: "frente a productos competidores", rpEd_fcq_vendeurs_fiche: "frente a los demás vendedores de la ficha", rpEd_clsT: "Esta regla aún no tiene modo.", rpEd_clsD: (n) => `Es anterior a SmartPrice. ${n} ${n === 1 ? "oferta la sigue" : "ofertas la siguen"}. Elija una vez; sus límites se conservan.`, rpEd_passer_concurrents: "Pasar a SmartPrice", rpEd_passer_vendeurs_fiche: "Pasar a Repricer", rpEd_mq_facon: "Elija un modo para guardar. No se modifica ningún precio en Amazon.", rpEd_mq_ecart: "Elija una diferencia de precio para guardar. No se modifica ningún precio en Amazon.",
  rpEd_ec: "Diferencia de precio", rpEd_ec_m5: "5 % más barato", rpEd_ec_0: "Al mismo precio", rpEd_ec_p5: "5 % más caro", rpEd_ec_autre: "Otra", rpEd_ecQue: "que", rpEd_ecRef: "Precio de referencia", rpEd_ecC_moins_cher: "el más barato", rpEd_ecC_mediane: "la mediana", rpEd_ecC_choisi: "un competidor elegido", rpEd_ecVal: "Diferencia", rpEd_ecU: "Unidad", rpEd_ecS: "Sentido", rpEd_ecS_moins: "más barato", rpEd_ecS_plus: "más caro", rpEd_ecAsin: "ASIN del competidor", rpEd_ecH: "entre los competidores que declaró comparables, producto por producto", rpEd_e_ecart: "Diferencia: un número positivo, dos decimales como máximo, por debajo de 100 % (o 10 000 en divisa).", rpEd_e_asin: "ASIN del competidor: 10 letras o cifras.",
  rpEd_ecPh_aucun: "Elija una diferencia: el precio seguirá a sus competidores comparables, sin bajar del suelo ni superar el techo.", rpEd_ecPh_moins: (v, r) => `Precio ${v} por debajo de la referencia (${r}), sin bajar del suelo ni superar el techo.`, rpEd_ecPh_egal: (r) => `Precio igual a la referencia (${r}), sin bajar del suelo ni superar el techo.`, rpEd_ecPh_plus: (v, r) => `Precio ${v} por encima de la referencia (${r}), sin bajar del suelo ni superar el techo.`, rpEd_ecR_moins_cher: "el más barato de los competidores comparables", rpEd_ecR_mediane: "la mediana de los competidores comparables", rpEd_ecR_choisi: (a) => `el competidor ${a}`,
  rpEd_ecEx: (n) => `Ejemplo · ${n}`, rpEd_ecExMoins: (n) => `el más barato de ${n} comparable${n === 1 ? "" : "s"}`, rpEd_ecExMed: "Mediana", rpEd_ecExMedD: (n) => `de ${n} comparables`, rpEd_ecExChoisi: "competidor elegido", rpEd_ecExCons: "Precio aconsejado", rpEd_ecExCtb: "Contribución por venta", rpEd_ecExCtbD: "sin IVA, antes de publicidad, estimada", rpEd_ecExPl: "Suelo", rpEd_ecExPlD: "primer precio permitido por los límites", rpEd_ecExNone: "Ejemplo no disponible: ningún producto cargado tiene suficientes competidores comparables con un precio reciente para esta referencia.",
  rpLb_fClasser: "Por clasificar", rpEd_annuler: "Cancelar", rpEd_saveV: (v) => `Guardar la versión ${v}`, rpEd_saveNew: "Guardar la regla",
  rpEd_saveProp: "Guardar la regla propia", rpEd_busy: "Guardando…", rpEd_ko: (m) => `No se escribió nada: ${m}`,
  rpEd_cflProp: "La regla propia cambió en otro lugar: no se escribió nada. Cerrar y volver a abrir para partir de la versión guardada.",
  rpEd_e_champ: "Una barrera no es un número positivo.", rpEd_e_grand: "Beneficio mín.: menos de 100 por venta; beneficio máx.: menos de un millón.", rpEd_e_vide: "Al menos un mínimo: beneficio, margen o retorno sobre coste.",
  rpEd_e_maxi: "Un máximo es igual o menor que el mínimo del mismo criterio.", rpEd_e_nom: "Nombre de la regla: de 1 a 80 caracteres.", rpEd_e_pays: "Elegir al menos un país.",
  rpEd_cflT: "Esta regla cambió durante la modificación: no se escribió nada.",
  rpEd_cflD: (lu, v, le) => `Versión ${lu} leída; versión ${v} guardada en otro lugar${le ? ` el ${le}` : ""}. Esta es la fusión propuesta; solo se guarda con «Guardar la versión ${v + 1}».`,
  rpEd_cChamp: "Campo", rpEd_cLu: (v) => `Leído (v${v})`, rpEd_cSaisie: "Introducido aquí", rpEd_cTrouve: (v) => `Versión ${v}`, rpEd_cRes: (v) => `Resultado v${v}`, rpEd_cOrig: "Origen",
  rpEd_oSaisie: "entrada conservada", rpEd_oReprise: (v) => `versión ${v} retomada`, rpEd_oIdem: "Ningún campo difiere: solo cambia la versión.", rpEd_abandon: (v) => `Descartar la entrada (conservar la versión ${v})`,
  rpPp_ouvrir: "Reglas y precios por país", rpPp_retour: "Todos los productos", rpPp_cout: "Coste de compra", rpPp_coutMoy: "media ponderada", rpPp_charge: "calculando…",
  rpPp_th_pays: "País", rpPp_th_etat: "Oferta · destacada", rpPp_th_prix: "Precio actual con IVA", rpPp_th_cons: "Consejo · simulación", rpPp_th_ben: "Beneficio", rpPp_th_marge: "Margen sobre precio sin IVA",
  rpPp_th_roi: "Retorno / coste", rpPp_th_eq: "Precio de equilibrio", rpPp_th_mini: "Precio mín. regla", rpPp_th_aff: "Regla asignada", rpPp_th_app: "Regla aplicada",
  rpPp_conseil: "Consejo", rpPp_roi2: "Retorno sobre coste", rpPp_mini2: "Precio mín. de la regla", rpPp_plus: "Beneficio, margen, precio de equilibrio, precio mín.",
  rpPp_active: "Activa", rpPp_inactive: "Inactiva", rpPp_bbNous: "Destacada: nuestra", rpPp_bbInc: "destacada desconocida", rpPp_inactif: "oferta inactiva: nada que aconsejar",
  rpPp_indispo: "No disponible", rpPp_sansApp: "ninguna regla aplicable", rpPp_garder: "mantener", rpPp_releve: (h) => `leído hace ${h} h`,
  rpPp_foepT: "Precio objetivo de Amazon aún no leído: un «mantener» puede venir de esa falta", rpPp_dansBornes: "dentro de los límites",
  rpPp_g_buy_box_detenue: "oferta destacada nuestra", rpPp_g_seule_offre: "única oferta", rpPp_g_buy_box_perdue_sans_prix_a_viser: "precio objetivo no leído", rpPp_g_deja_au_prix_vise: "ya en el precio objetivo",
  rpPp_horsGrille: "fuera de la tabla", rpPp_enConflit: "en conflicto",
  rpPp_selAucune: "— ninguna", rpPp_selNonCouv: "(país no cubierto)", rpPp_introuvable: "Regla no encontrada", rpPp_choisir: (mp) => `Regla asignada · ${mp}`,
  rpPp_propreSeule: "solo regla propia", rpPp_rempl: (v) => `v${v} · sustituida por la regla propia`,
  rpPp_et_pays_non_couvert: "Asignada, pero no aplicable", rpPp_et_archivee: "Archivada · no aplicada", rpPp_et_introuvable: "No encontrada · no aplicada",
  rpPp_aucuneApp: "ninguna", rpPp_compteAbs: "sin regla de la cuenta", rpPp_sansRegle: "ninguna regla", rpPp_propre: "Regla propia",
  rpPp_src_produit: "propia", rpPp_src_nommee: "con nombre", rpPp_src_defaut: "cuenta",
  rpPp_motif_pays_non_couvert: "en lugar de la regla asignada: país no cubierto", rpPp_motif_archivee: "en lugar de la regla asignada: archivada",
  rpPp_motif_introuvable: "en lugar de la regla asignada: no encontrada",
  rpPp_calcT: (p) => `Detalle del cálculo · ${p} al precio actual`, rpPp_ttc: "con IVA", rpPp_tva: "IVA", rpPp_ht: "sin IVA", rpPp_frais: "comisiones de Amazon a este precio", rpPp_coutA: "coste de compra",
  rpPp_benef: "beneficio", rpPp_marge: "margen", rpPp_roi: "retorno sobre coste",
  rpPp_fxT_remplacee: "Regla con nombre asignada, pero sustituida por la regla propia del producto.", rpPp_fxD_remplacee: (nom, v, p) => `«${nom}» v${v} está guardada para ${p}; se aplica la regla propia.`,
  rpPp_creerPropre: "Crear una regla propia", rpPp_retirerPropre: "Quitar la regla propia", rpPp_modPropre: "Modificar la regla propia", rpPp_modRegle: "Modificar la regla",
  rpPp_fxT_pays: "País no cubierto por la regla asignada.", rpPp_fxD_pays: (nom, p) => `«${nom}» no cubre ${p}: no se aplica allí. Se aplica la regla de la cuenta en su lugar, nombrada en «Regla aplicada».`,
  rpPp_ajouterPays: (c) => `Añadir ${c} a la regla`, rpPp_autreRegle: "Asignar otra regla",
  rpPp_fxT_archivee: "Regla con nombre archivada: no aplicada.", rpPp_fxD_archivee: (nom) => `«${nom}» está archivada; se aplica la regla de la cuenta en su lugar.`,
  rpPp_fxT_introuvable: "Regla con nombre no encontrada: no aplicada.", rpPp_fxD_introuvable: "La asignación designa una regla que ya no existe; se aplica la regla de la cuenta en su lugar.",
  rpPp_fxT_aucune: "Ninguna regla aplicable: ninguna recomendación.", rpPp_fxD_aucune: "La regla asignada no se aplica aquí y la cuenta no tiene regla: nada la sustituye en silencio.",
  rpPp_fxT_conflit: "Ningún precio permitido", rpPp_fxD_conflit: ": las barreras de la regla aplicada no dejan ningún precio de la tabla.",
  rpPp_fxT_perime: (h) => `Lectura de precio demasiado antigua (${h} h)`, rpPp_fxD_perime: ": no se recomienda nada hasta que llegue una lectura de menos de 36 h.",
  rpPp_coutT: "Coste de compra desconocido", rpPp_coutD: (n) => `: beneficio, margen y precio mín. no se pueden calcular en los ${n} países; ninguna recomendación.`, rpPp_saisirCout: "Introducir el coste de compra",
  rpPp_f1T: "Precio objetivo de Amazon aún no leído", rpPp_f1D: ": un «mantener» puede venir de esa falta.",
  rpPp_f2T: "Oferta destacada", rpPp_f2D: ": «nuestra» o «desconocida»; la lectura aún no sabe decir «perdida».",
  rpPp_f3T: "Cifras", rpPp_f3D: " al precio actual con IVA, antes de publicidad; margen sobre precio sin IVA · regla y versión anotadas en cada simulación · lectura de más de 36 h = no disponible.",
  rpAf_sel: (n) => `${n} producto(s) seleccionado(s)`, rpAf_sur: (n) => `de ${n}`, rpAf_desel: "Deseleccionar todo", rpAf_tout: "Seleccionar todo", rpAf_cocher: "Elegir",
  rpAf_th_prod: "Producto", rpAf_th_pays: "Países vendidos", rpAf_th_regles: "Reglas actuales", rpAf_titre: (n) => `Asignar una regla · ${n} producto(s)`,
  rpAf_regle: "Regla", rpAf_choisir: "Elegir una regla", rpAf_pays: "Países", rpAf_apercu: "Vista previa", rpAf_nonCouv: "no cubierto",
  rpAf_vendus: (tot, sans) => `productos × países vendidos en los países elegidos (de ${tot}; ${sans} sin oferta, sin tocar)`,
  rpAf_chg: "cambian de regla: la regla elegida pasa a ser efectiva", rpAf_deja: "ya en esta regla: sin cambios", rpAf_prop: "conservan su regla propia: asignación guardada, no efectiva",
  rpAf_hint: "Nada automático de más: solo cambia la asignación. Solo simulación, ningún precio de Amazon modificado.", rpAf_aucunSel: "Marcar productos en la lista.",
  rpRe_envLc: (a) => `Releído ${a}`, rpRe_coutEstC: "Coste estimado", rpRe_coutDc: "Precio no calculable", rpRe_gc_tenue: (n) => `${n} ganada${n > 1 ? "s" : ""}`, rpRe_gc_perdue: (n) => `${n} perdida${n > 1 ? "s" : ""}`, rpRe_gc_aucune: (n) => `${n} sin oferta destacada`, rpRe_gc_inconnue: (n) => `${n} desconocido${n > 1 ? "s" : ""}`,
  rpRe_iAria: "Situación de la oferta destacada", rpRe_i_offres: "Ofertas", rpRe_i_tenue: "Ganadas", rpRe_i_perdue: "Perdidas", rpRe_i_aucune: "Sin oferta destacada", rpRe_i_inconnue: "Desconocidas",
  rpRe_g_tenue: (n) => `${n} donde tiene la oferta destacada`, rpRe_g_perdue: (n) => `${n} donde la oferta destacada está perdida`, rpRe_g_aucune: (n) => `${n} ficha${n > 1 ? "s" : ""} sin oferta destacada`, rpRe_g_inconnue: (n) => `${n} estado${n > 1 ? "s" : ""} desconocido${n > 1 ? "s" : ""}`,
  rpRe_simuP: "Simulación:", rpRe_aLire: (n) => `${n} consejo${n > 1 ? "s" : ""} para leer`, rpRe_pos: (n) => `Situación de la oferta destacada, en ${n} oferta${n > 1 ? "s" : ""}`,
  rpRe_rien: "Nada que hacer", rpRe_rienD: (h, n) => `Ninguna oferta requiere acción. Último cálculo a las ${h}, en ${n > 1 ? `las ${n} ofertas` : `${n} oferta`}.`, rpRe_rienDx: (n) => `Ninguna oferta requiere acción, en ${n > 1 ? `las ${n} ofertas` : `${n} oferta`}.`, rpRe_prochaines: "Las próximas acciones aparecerán aquí.",
  rpRe_coutEst: "Coste de compra estimado:", rpRe_coutInc: "Coste de compra desconocido", rpRe_aConf: "Por confirmar", rpRe_coutD: "Precio no calculable hasta confirmar el coste en COGS", rpRe_confCogs: "Confirmar en COGS",
  rpRe_conflitD: (p, f) => `Mínimo ${p} por encima del máximo ${f}`, rpRe_sousPl: "Oferta destacada por debajo de su mínimo", rpRe_sousPlD: "Precio mantenido en el mínimo · opción rentable", rpRe_sousPlDx: "Precio mantenido · opción rentable",
  rpRe_nivInc: "Nivel desconocido", rpRe_pays: "País:",
  rpRe_trier: "Ordenar", rpRe_trierP: "Ordenar:", rpRe_tri_pays: "País", rpRe_tri_produit: "Producto", rpRe_tri_variation: "Variación", rpRe_tri_contribution: "Contribución",
  rpRf_regle: (n) => `Regla: ${n}`, rpRf_st_tenue: "Oferta destacada obtenida", rpRf_st_perdue: "Oferta destacada perdida", rpRf_st_aucune: "Sin oferta destacada", rpRf_st_inconnue: "Oferta destacada desconocida",
  rpRf_simt: "Simulación · Nada se envía a Amazon", rpRf_conserve: "Precio mantenido en el mínimo", rpRf_garde: "Precio mantenido", rpRf_ved: "Oferta destacada", rpRf_suiv: "Oferta siguiente",
  rpRf_actuel: "Precio actual", rpRf_propose: "Precio propuesto", rpRf_veut: "Qué significa", rpRf_faire: "Qué puede hacer",
  rpRf_alignB: "Al mismo precio con envío que la oferta destacada", rpRf_align: (q, p, port, x) => `, en manos de ${q}: su precio de artículo ${p} + envío ${port}${x}, `, rpRf_align2: ". Alineado, no más barato: alcanzar este precio no garantiza la oferta destacada.",
  rpRf_viseB: (p) => `Precio objetivo: ${p}`, rpRf_vise: (pv, port) => `, para una oferta destacada a ${pv} con envío (su envío: ${port}). Alcanzar este precio no garantiza la oferta destacada.`,
  rpRf_plafB: "En el máximo de su regla", rpRf_plaf: (pv, pf) => `: la oferta destacada está a ${pv} con envío, por encima de su máximo de ${pf}. Alcanzar este precio no garantiza la oferta destacada.`,
  rpRf_tenueB: "Usted tiene la oferta destacada.", rpRf_suivTxt: (p, l) => ` La siguiente oferta contada${l ? ` (${l})` : ""} está a ${p} con envío.`, rpRf_hausse24: (m, h) => ` Subida opcional: como máximo ${m} en 24 h, desde su precio de ayer (${h}).`,
  rpRf_hausse: " Subida opcional.", rpRf_risque: " Una subida puede hacerle perder la oferta destacada.", rpRf_tenueGarde: " Precio mantenido.",
  rpRf_sousPl: (q, pv, ec) => `${q} tiene la oferta destacada a ${pv}, ${ec} por debajo de su mínimo.`, rpRf_sousPlCtb: (x) => ` A ese precio, su contribución bajaría a ≈ ${x} por venta`, rpRf_minDe: (m) => `, para un mínimo de ${m}`,
  rpRf_inconnue: "El estado de la oferta destacada es desconocido: no se calcula ningún precio.", rpRf_cause: (x) => `Causa: ${x}.`, rpRf_aucune: "Ninguna oferta destacada en esta ficha en la última lectura: no se calcula ningún precio.",
  rpRf_ctbK: "Contribución estimada, sin IVA", rpRf_ctbK2: "Contribución estimada antes de publicidad", rpRf_vente: " / venta",
  rpRf_ctbAu: (b, ec, m) => `Contribución estimada antes de publicidad: ${b} por venta, ${ec} por encima de su mínimo de ${m}.`, rpRf_ctbSur: (b, ec, m) => `Contribución estimada antes de publicidad: ${b} por venta, ${ec} por encima de su máximo de ${m}.`, rpRf_ctbSous: (b, ec, m) => `Contribución estimada antes de publicidad: ${b} por venta, ${ec} por debajo de su mínimo de ${m}.`,
  rpRf_ctbPerte: "Si se pierde la oferta destacada, un nuevo cálculo propondrá una bajada, a validar.", rpRf_ctbAct: (p) => `A su precio actual de ${p}.`, rpRf_ctbActMin: (p) => `A su precio actual de ${p}: es su mínimo.`,
  rpRf_simnB: "Simulación.", rpRf_simn: " Ningún precio sale hacia Amazon. Este consejo se lee, no se envía.",
  rpRf_f_garder: (p) => `Mantener ${p}`, rpRf_f_garderPl: ", su mínimo: una opción rentable.", rpRf_f_remonte: "Si la oferta destacada sube, un nuevo cálculo propondrá una subida, a validar.", rpRf_f_min: (n) => `O bajar el mínimo de la regla (${n} oferta${n > 1 ? "s" : ""}).`,
  rpRf_vdr: "Vendedores de la ficha", rpRf_mInc: "Elegibilidad desconocida", rpRf_mBientot: "Próximamente", rpRf_mSecu: "Simulación · envío aún no abierto", rpRf_deux: (a, b) => `${a}: ${b}`, rpRf_vdL: (l) => `Vendedor ${l}`, rpRf_autreV: "otro vendedor", rpRf_autreVM: "Otro vendedor", rpRf_nOffres: (n) => `${n} oferta${n > 1 ? "s" : ""}`, rpRf_expA: " (enviado por Amazon)", rpRf_expV: " (enviado por usted)", rpRf_vdrInc: "lectura desconocida", rpRf_hist: "Historial de precios",
  rpRe_videT: "Ninguna oferta sigue Repricer", rpRe_videD: "Repricer sitúa su precio frente a los demás vendedores de una misma ficha de Amazon, para mantener la oferta destacada. Dos pasos para obtener sus primeros consejos.",
  rpRe_e_1: "Regla", rpRe_e_1d: "diferencia y límites", rpRe_e_1a: "Crear una regla", rpRe_e_2: "Ofertas", rpRe_e_2d: "aplicar la regla", rpRe_videB: "Los vendedores de cada ficha se leen en Amazon: nada más que elegir.",
  rpC_simulation: "Simulación", rpRzK_offre_vedette_perdue_prix_vise: "Al precio de la oferta destacada", rpRzK_offre_vedette_perdue_prix_vise_plafond: "En el máximo, bajo la oferta destacada",
  rpRzK_hausse_vers_vendeur_suivant: "Subida opcional", rpRzK_hausse_vers_vendeur_suivant_plafond: "Subida opcional", rpRzK_hausse_vers_vendeur_suivant_limite_24h: "Subida opcional",
  rpSpF_rien: "Nada que hacer", rpSpF_aCompleter: "Configuración por completar", rpSpF_sansTxt: (n, p) => `${n} oferta${n > 1 ? "s" : ""}, precio mantenido${p ? `: ${p}` : ""}`, rpSpF_dVise: (n) => `${n} al precio objetivo`,
  rpSpFcD: "Precio no calculable", rpSpFcD_cout_inconnu: "Precio no calculable sin este coste", rpSpFcD_bornes_en_conflit: "Precio no calculable con estos límites",
  rpK5_aria: "Precios frente al precio objetivo", rpK5_offres: "Ofertas", rpK5_vise: "Al precio objetivo", rpK5_ajuster: "Por ajustar", rpK5_plancher: "En el mínimo", rpK5_nonCalc: "No calculables",
  rpK5_aFaire: "Por hacer:", rpK5_env: (n) => `${n} envío${n > 1 ? "s" : ""} por verificar`, rpK5_prix: (n) => `${n} precio${n > 1 ? "s" : ""} por validar`, rpK5_conf: (n) => `${n} configuraci${n > 1 ? "ones" : "ón"} por completar`,
  rpK5_pos: (n) => `Sus precios frente al precio objetivo, en ${n} oferta${n > 1 ? "s" : ""}`, rpSl_thVar: "Variación", rpSl_thRaison: "Motivo", rpSl_thCtb: "Contribución*",
  rpSl_ctbNote: "* Contribución estimada por venta, sin IVA, antes de publicidad, al precio propuesto.", rpSl_sku: (s) => `SKU: ${s}`, rpSl_skuInc: "SKU desconocido", rpSp_apres: (n) => `Después del paso ${n}`,
  rpRzK_sous_le_plancher: "Subir al mínimo", rpRzK_au_dessus_du_plafond: "Bajar al máximo", rpRzK_prix_actuel_non_admissible: "Volver a la regla", rpRzK_cible_concurrents: "En el objetivo", rpRzK_cible_concurrents_plancher: "Objetivo bajo el mínimo", rpRzK_cible_concurrents_plafond: "Objetivo sobre el máximo", rpRzK_cible_concurrents_hors_regle: "Objetivo fuera de la regla", rpRzK_cible_concurrents_non_estimable: "Precio permitido más cercano", rpRzK_buy_box_perdue_prix_a_viser: "Alineado con la oferta destacada",
  rpRzQ: (e, s, c) => { const a = { moins_cher: ["el más barato", "del más barato"], mediane: ["la mediana", "de la mediana"], choisi: ["el competidor elegido", "del competidor elegido"] }[c]; return !a ? null : s < 0 ? `${e} por debajo ${a[1]}` : s > 0 ? `${e} por encima ${a[1]}` : `Al precio ${a[1]}`; }, rpSpF_dSansPl: (n) => `${n} sin mínimo conocido`, rpSpF_dSansPrix: (n) => `${n} sin precio actual leído`,
  rpSl_envoi: "Envío por verificar", rpSl_envT: "Resultado de Amazon no confirmado", rpSl_envD: (a) => `Solicitado ${a}`, rpSl_envL: (a) => `Releído en Amazon ${a}`,
  rpSl_verifier: "Verificar", rpSl_ec: (s, v) => `${s}${v} %`, rpSl_barre: "Ofertas cuya regla sigue SmartPrice",
  rpSl_voirRe: (n) => (n === 1 ? "Ver la oferta Repricer" : `Ver las ${n} ofertas Repricer`), rpSl_voirReC: (n) => `${n} oferta${n === 1 ? "" : "s"} Repricer`, rpSpTh_regle: "Regla",
  rpSpTh_prix: "Precio actual", rpSpTh_sit: "Situación actual", rpSpTh_conseil: "Precio propuesto", rpSl_aff: (a, b) => `${a} de ${b} mostrada${b === 1 ? "" : "s"}`, rpSl_suiv: "Siguientes",
  rpSl_auj: (s) => `Hoy: ${s}`, rpSl_trier: "Ordenar", rpSl_sousPl: "Por debajo del mínimo",
  rpSd_refAria: "Referencia", rpSd_mediane: "la mediana", rpSd_pct: (v) => `${v}\u00a0%`, rpSd_sous: (e, n) => `${e} por debajo de ${n}`, rpSd_dessus: (e, n) => `${e} por encima de ${n}`, rpSd_egal: (n) => `Al precio de ${n}`,
  rpSd_ilYa: (a) => `hace ${a}`, rpSd_sousPl: (m) => `Precio actual ${m} por debajo del mínimo.`, rpSd_remonte: (p, c, pl) => `${p} daría ${c}: la sugerencia sube al mínimo, ${pl}.`,
  rpSd_cz_moins_cher: (p, n) => (n ? `${p}, el más barato de ${n} competidores comparables con precio conocido.` : `${p}, el más barato de los competidores comparables.`),
  rpSd_cz_mediane: (p, n) => (n ? `${p} de ${n} competidores comparables con precio conocido.` : `${p} de los competidores comparables.`), rpSd_cz_choisi: (p) => `${p}, el competidor elegido.`,
  rpSd_ctb: "Contribución por venta", rpSd_ctbD: "sin IVA, antes de publicidad", rpSd_seuilPlus: (n) => `Gana lo mismo si las ventas suben un ${n}\u00a0%.`, rpSd_seuilMoins: (n) => `Gana lo mismo aunque las ventas bajen un ${n}\u00a0%.`,
  rpSd_recapT: "¿Enviar este precio a Amazon?", rpSd_recapSous: "antes del envío a Amazon", rpSd_pays: "País", rpSd_prixDem: "Precio solicitado", rpSd_regle: "Regla", rpSd_envoyer: (p) => `Enviar ${p} a Amazon`, rpSd_retour: "Volver",
  rpSd_recapNote: "La barra de confirmación pide después una última validación. Tras el envío, GTINPilot vuelve a leer el precio mostrado por Amazon; mientras no se confirme, la oferta sigue en «Envío por verificar».",
  rpSd_coutT: "Coste de compra por unidad", rpSd_coutP: "Se introduce en un solo lugar: la página de costes de compra.", rpSd_coutLien: "Introducir el coste de compra", rpSd_aussi: (p) => `también bloqueada en ${p}`,
  rpSd_pub: "Publicidad", rpSd_pubV: (m) => `${m} por venta`, rpSd_pubNon: "no medida", rpSd_nonCalc: "no calculada", rpSd_ramene: "precio entregado, en su formato",
  rpF_aValider: "Por validar", rpF_conseils: "Consejos", rpF_aDebloquer: "Por desbloquear", rpF_sans: "Sin cambios", rpF_examiner: "Revisar", rpF_voir: "Ver",
  rpF_saisirCout: "Introducir el coste", rpF_modifRegle: "Modificar la regla", rpF_toutVoir: "Ver todo", rpF_nOffres: (n) => `${n} oferta${n > 1 ? "s" : ""}`,
  rpF_sansTxt: (n, p) => `${n} oferta${n > 1 ? "s" : ""}${p ? `, de ellas ${p}` : ""}`, rpF_dPl: (n) => `${n} en el mínimo`, rpF_dPromo: (n) => `${n} en promoción`,
  rpF_dStock: (n) => `${n} sin stock vendible`, rpF_rien: "Nada que decidir", rpF_derniere: "Último cambio", rpF_prochaines: "Las próximas decisiones aparecerán aquí.",
  rpF_dIgn: (n) => `${n} ignorada${n > 1 ? "s" : ""}`, rpF_ignores: "Consejos ignorados", rpD_ignorer: "Ignorar este consejo", rpD_ignLe: (d) => `Consejo ignorado el ${d}`,
  rpD_ignRevient: "Vuelve a la lista si la situación cambia.", rpD_ignRet: "Dejar de ignorar", rpD_ignOk: (h) => `Consejo ignorado (cálculo de las ${h})`,
  rpD_ignNouveau: "La situación ha cambiado: el consejo sigue por revisar.", rpD_ignRelErr: "Guardado; no se pudo volver a leer: recargar la página.", rpD_ignRetEncore: "El consejo sigue ignorado: recargar la página.", rpD_ignRetOk: "El consejo ya no se ignora.",
  rpD_ignIll: "Lista de consejos ignorados ilegible: «Ignorar» no está disponible.", rpD_ignErr: (m) => `No guardado: ${m}`, rpD_ignBusy: "Guardando…",
  rpFc_envoi_non_confirme: "Envío no confirmado", rpFc_envoi_refuse: "Envío rechazado", rpFc_refuse_amazon: "Rechazado por Amazon", rpFc_cout_inconnu: "Coste de compra desconocido",
  rpFc_bornes_en_conflit: "Límites en conflicto", rpFc_frais_inconnus: "Tarifas de Amazon desconocidas", rpFc_sans_prix: "Precio actual desconocido o lectura demasiado antigua", rpFc_aucun: "Nunca calculado",
  rpFc_bloque: "Bloqueado", rpFc_situation_changee: "Situación cambiada desde el cálculo",
  rpD_regle: (n) => `regla ${n}`, rpD_conseille: "Aconsejado", rpD_actuel: "Precio actual", rpD_releve: (a) => `leído hace ${a}`, rpD_plancher: "Mínimo", rpD_plafond: "Máximo",
  rpD_sousPl: "por debajo del mínimo", rpD_dessusPf: "por encima del máximo", rpD_valider: (p) => `Validar ${p}`, rpD_recap: "Se abre un resumen antes del envío a Amazon.",
  rpD_simu: "Simulación: ningún precio se envía a Amazon. Este consejo se lee, no se envía.", rpD_benef: (p) => `Beneficio por venta a ${p}`, rpD_calcPl: "Cálculo del mínimo",
  rpD_calcPlD: "Precio más bajo de la cuadrícula de Amazon que respeta la regla (beneficio, margen, retorno sobre coste), con las tarifas estimadas a ese precio.",
  rpD_sitChg: (h) => `Situación cambiada desde el cálculo de las ${h}`, rpD_sitRegle: "La regla ha cambiado desde este cálculo.", rpD_sitPrixAct: (p) => `Precio actual leído desde entonces: ${p}.`,
  rpD_sitPrix: (p) => `Precio leído en Amazon: ${p}. No se ha propuesto nada.`, rpD_prochain: "Nuevo consejo en el próximo cálculo.", rpD_limChg: (h) => `Límites cambiados desde el cálculo de las ${h}`,
  rpD_nonCalc: "Precio no calculable", rpD_coutPl: "Coste de compra desconocido: el mínimo no puede calcularse.", rpD_coutEst: "Coste estimado",
  rpD_estDe: (j) => `según el lote confirmado anterior · recepción del ${j}`, rpD_aConfirmer: "Por confirmar en la pestaña COGS", rpD_ouvrirCogs: "Abrir COGS", rpD_coutND: "Coste no determinable",
  rpD_coutR_change_absent: "falta el tipo de cambio del día de recepción", rpD_coutR_sans_jour: "recepción sin fecha", rpD_coutR_autre_zone_seulement: "lotes confirmados solo en otra zona",
  rpD_coutR_aucun_lot_avant: "ningún lote confirmado antes de esta recepción", rpD_coutR_egalite_ambigue: "varios costes distintos el mismo día",
  rpD_coutR_aucune_estimation: "ninguna estimación para este producto en esta zona", rpD_coutR_aucune_reception: "ninguna recepción de este producto en esta zona", rpD_coutR_zone_inconnue: "zona de stock del país desconocida",
  rpD_envAttente: "Pendiente de validación", rpD_env_PENDING: "Propuesta lista: la barra «Validar» de la parte inferior la envía, tras su resumen.",
  rpD_env_EN_COURS: "Envío en curso: ningún envío nuevo hasta conocer el resultado.", rpD_attente: "El consejo se recalculará; mientras tanto, no se envía nada desde este consejo.", rpP_envBloque: "Envío no confirmado en esta oferta: ningún envío nuevo desde aquí hasta conocer su resultado (pestaña Decisiones).",
  rpD_env_UNKNOWN: "Resultado desconocido en Amazon: ningún envío nuevo desde esta pantalla. Comprobar el precio en Seller Central.", rpD_motif: "Motivo", rpD_motifNC: "motivo no comunicado",
  rpD_envRetour: "Un nuevo consejo aparecerá tras el próximo cálculo.",
  rpMo_VALUE_CHANGED: "precio o límites cambiados en Amazon desde la propuesta (Seller Central)", rpMo_RULE_CHANGED: "la regla de precio cambió desde la propuesta: proponga de nuevo. No se envió nada.", rpMo_RULE_UNVERIFIABLE: "no se pudo verificar la regla de precio: proponga de nuevo. No se envió nada.", rpMo_UNSUPPORTED_DISCOUNT: "existe un precio rebajado programado en Amazon",
  rpMo_UNSUPPORTED_OFFER: "oferta no admitida", rpMo_PREVIEW_INVALID: "vista previa rechazada por Amazon", rpMo_PREVIEW_FAILED: "vista previa imposible en Amazon", rpMo_FROZEN: "envíos congelados para esta cuenta",
  rpMo_TOO_SLOW: "envío demasiado lento, detenido antes de salir", rpMo_TOKEN_FAILED: "acceso a Amazon no disponible", rpMo_READ_FAILED: "precio ilegible en Amazon", rpMo_OFFER_BUSY: "otro precio se estaba enviando",
  rpMo_CURRENCY: "moneda de la oferta distinta", rpMo_NO_PRODUCT_TYPE: "tipo de producto ausente de la ficha", rpMo_INVALID: "solicitud considerada no válida por Amazon", rpMo_http: (c) => `Amazon rechazó la solicitud (HTTP ${c})`,
  rpRz_sous_le_plancher: "Precio actual por debajo del mínimo", rpRz_au_dessus_du_plafond: "Precio actual por encima del máximo", rpRz_prix_actuel_non_admissible: "Precio actual fuera de la regla: llevado al precio permitido más cercano",
  rpRz_buy_box_perdue_prix_a_viser: "Oferta destacada perdida: precio alineado con la oferta destacada", rpRz_seule_offre: "Única oferta de la ficha: precio mantenido", rpRz_buy_box_detenue: "Oferta destacada propia: precio mantenido",
  rpRz_buy_box_perdue_sans_prix_a_viser: "Oferta destacada perdida, ningún precio objetivo leído", rpRz_deja_au_prix_vise: "Ya en el precio objetivo", rpRz_promotion_en_cours: "Promoción en curso: consejo en pausa",
  rpRz_non_achetable: "Sin stock vendible", rpRz_aucun_prix_admissible: "Ningún precio respeta todos los límites de la regla",
  rpRzF: (f, e) => `${f}: ${e}`, rpRzF_releve_prix: "Lectura de nuestro precio", rpRzF_prix_actuel: "Precio actual", rpRzF_stock: "Lectura del stock", rpRzF_promotions: "Lectura de las promociones",
  rpRzF_cout_achat: "Coste de compra", rpRzF_frais_prix_actuel: "Tarifas de Amazon al precio actual", rpRzE_absent: "ausente", rpRzE_perime: "demasiado antigua", rpRzE_invalide: "ilegible", rpRzE_inconnu: "desconocido",
  rpRz_concurrents_parametres_absents: "Frente a los competidores: objetivo no definido en la regla", rpRz_concurrents_choisi_absent: "Frente a los competidores: competidor elegido ausente de la lista", rpRz_concurrents_choisi_exclu: "Frente a los competidores: competidor elegido excluido del cálculo", rpRz_concurrents_aucun_prix_admissible: "Frente a los competidores: ningún precio de competidor utilizable", rpRz_concurrents_couverture_insuffisante: "Frente a los competidores: muy pocos precios recientes para concluir", rpRz_concurrents_mediane_moins_de_2_prix: "Frente a los competidores: menos de 2 precios para una mediana",
  rpRz_cible_concurrents: "Frente a los competidores: precio situado en el objetivo", rpRz_cible_concurrents_plancher: "Frente a los competidores: objetivo por debajo del mínimo, precio en el mínimo", rpRz_cible_concurrents_plafond: "Frente a los competidores: objetivo por encima del máximo, precio en el máximo", rpRz_deja_a_la_cible_concurrents: "Frente a los competidores: ya en el objetivo", rpRz_deja_a_la_cible_concurrents_plancher: "Frente a los competidores: ya en el mínimo (objetivo más bajo)", rpRz_deja_a_la_cible_concurrents_plafond: "Frente a los competidores: ya en el máximo (objetivo más alto)", rpRz_cible_concurrents_hors_regle: "Frente a los competidores: objetivo no permitido por la regla, precio permitido más cercano del lado del objetivo", rpRz_deja_au_prix_autorise_concurrents: "Frente a los competidores: objetivo no permitido por la regla, ya en el precio permitido más cercano del lado del objetivo", rpRz_cible_concurrents_non_estimable: "Frente a los competidores: precio al céntimo no calculable, precio permitido más cercano del lado del objetivo", rpRz_deja_au_prix_grille_concurrents: "Frente a los competidores: precio al céntimo no calculable, ya en el precio permitido más cercano del lado del objetivo", rpRz_ecart_sous_minimum_concurrents: "Frente a los competidores: objetivo demasiado cerca del precio actual, precio conservado",
  rpRzN: (e) => `Frente a los competidores: nuestra oferta, ${e}`, rpRzC_offre_invalide: "lectura mal formada", rpRzC_etat_inconnu: "estado del artículo desconocido", rpRzC_expedition_inconnue: "modo de envío desconocido", rpRzC_heure_inconnue: "hora de la lectura desconocida", rpRzC_donnee_future: "hora de la lectura en el futuro", rpRzC_donnee_perimee: "lectura demasiado antigua", rpRzC_port_inconnu: "gastos de envío desconocidos", rpRzC_total_incoherent: "total entregado incoherente", rpRzC_port_incoherent: "gastos de envío incoherentes",
  rpCo_pli: "Competidores", rpCo_nSurM: (n, m) => `${n} comparable${n > 1 ? "s" : ""} de ${m}`, rpCo_indispo: "lista no disponible", rpCo_aucunCourt: "ninguno", rpCo_indispoD: "Lista de competidores no disponible: no se pudo leer el estado de Vigilancia. No se modificó nada.", rpCo_etat: (n, max) => `${n} seguido${n > 1 ? "s" : ""} · ${max} como máximo`, rpCo_aucun: "Ningún competidor seguido para este producto en este país. Añada uno abajo o elíjalo en Vigilancia.", rpCo_sansPrix: "precio no registrado", rpCo_parUnite: (p) => `${p}/unidad`, rpCo_lotDe: (n, p) => `Lote de ${n}: ${p}`, rpCo_releveIlYa: (a) => `registrado hace ${a}`, rpCo_sansOffre: (a) => `sin oferta destacada en el último registro (hace ${a}), fuera del cálculo`, rpCo_dernierConnu: (p, a) => `último precio conocido ${p}, hace ${a}`, rpCo_perime: (h) => `caducado (más de ${h} h), fuera del cálculo`, rpCo_photo: (a) => `ofertas capturadas hace ${a}`, rpCo_format: "Unidades por lote", rpCo_fmtOk: "Guardar el formato", rpCo_retirer: "Quitar para este producto", rpCo_aDeclarer: "Por declarar · fuera del cálculo", rpCo_cmp: "Comparable", rpCo_cmpLot: (n) => `Comparable · lote de ${n}`, rpCo_hors: "Fuera del cálculo", rpCo_srcManuel: "Añadido a mano", rpCo_srcVeille: "Vigilancia", rpCo_actions: "Acciones sobre este competidor", rpCo_ajouter: "Añadir un competidor", rpCo_ph: "ASIN o enlace de Amazon", rpCo_ajouterBtn: "Añadir", rpCo_veille: "Elegir en Vigilancia", rpCo_note: "Precio: último precio registrado de la oferta destacada, envío incluido, con su antigüedad; pasadas 2 h está caducado y deja de entrar en el cálculo. Sin oferta destacada en el último registro, tampoco entra. Un competidor fuera del cálculo sigue vigilado. Nada cambia en Amazon.", rpCo_okAjout: "Competidor añadido.", rpCo_okFmt: "Formato guardado.", rpCo_okRet: "Competidor quitado para este producto.", rpCo_okCmp: "Contado en el cálculo.", rpCo_okHors: "Fuera del cálculo, sigue vigilado.", rpCo_errMax: "Rechazado: 10 competidores seguidos como máximo por producto y país (o 100 añadidos). No se escribió nada.", rpCo_errNonSuivi: "Rechazado: este competidor ya no se sigue para este producto. No se escribió nada.", rpCo_err: "Error al guardar. No se escribió nada.", rpCo_errAsin: "ASIN no válido: 10 letras o cifras, o un enlace de ficha de Amazon.", rpCo_errFmt: "Formato no válido: un número entero de 1 a 100.",
});
Object.assign(I18N.de, { t1pPrice: "Repricer", rpTitle: "Repricer", t1pSmart: "SmartPrice", rpSp_videT: "Kein Angebot folgt SmartPrice", rpSp_videD: "SmartPrice setzt den Preis Ihrer Marke gegenüber Konkurrenzprodukten, die Sie auswählen. Drei Schritte, der Reihe nach, zur Aktivierung.", rpSp_aria: "Drei Schritte zur Aktivierung von SmartPrice", rpSp_e_1: "Regel", rpSp_e_1d: "Abstand und Grenzen", rpSp_e_1a: "Regel erstellen", rpSp_e_2: "Angebote", rpSp_e_2d: "Regel anwenden", rpSp_e_3: "Konkurrenten", rpSp_e_3d: "je Angebot und Land",
  rpCrumb: "Produkte", rpLvl_ombre: "Simulation", rpLvl_propose: "Nach Bestätigung", rpLvl_auto: "Automatisch",
  rpLvlAria: "Stufe des Repricers", rpLvlTip: "Stufe des Kontos: Simulation, solange die Preissperre geschlossen ist (kein Preis an Amazon gesendet), Nach Bestätigung, wenn sie offen ist (der Preis wird erst nach Ihrer Bestätigung an Amazon gesendet). Automatisch gibt es noch nicht.", rpLvlUnk: "Stufe unbekannt: Preissperre nicht gelesen.", rpEtatN: (s, n) => `${s} ${n === 1 ? "Angebot" : "Angebote"}`, rpRe_c_expl: (s) => `${s} nutzbar`, rpRe_c_bloq: (s) => `${s} blockiert`, rpRe_c_inact: (s) => `${s} inaktiv`, rpRe_c_nonAch: (s) => `${s} nicht kaufbar`, rpRe_c_nonConf: (s) => `${s} unbestätigt`, rpRe_c_sansOffre: (s) => `${s} ohne eigenes Angebot`, rpRe_c_ecart: (s) => `${s} ausgeblendet oder deaktiviert`, rpRe_decTip: "Nutzbar: Preis erfasst, Berechnung möglich. Blockiert: verfolgt, aber ein Wert fehlt für die Berechnung (Kosten, Gebühren, Grenzen). Inaktiv: Angebot bei Amazon inaktiv. Ohne eigenes Angebot: die Produktseite existiert in diesem Land, ohne Angebot oder Preis von Ihnen. Nicht kaufbar: Angebot aktiv, aber kein kaufbares Angebot erfasst oder kein verkaufsfähiger Bestand. Unbestätigt: Preis erfasst, aber Angebot fehlt im Angebotsbericht. Ausgeblendet oder deaktiviert: von Ihnen. Alle stehen unter „Alle Angebote“.", rpRe_mode: "Modus:", rpEtatCalc: (h) => `berechnet um ${h}`,
  rpFPays: "Land", rpFSit: "Lage", rpFAll: "Alle", rpFAllF: "Alle", rpTabConseils: "Aktionen", rpTabTous: "Alle Angebote", rpTabJournal: "Protokoll", rpTabRegles: "Regeln",
  rpTabsCount: (p, c) => `${p} Produkt${p === 1 ? "" : "e"} · ${c} ${c === 1 ? "Land" : "Länder"}`, rpSoon: "Nächstes Paket",
  rpTh_prod: "Produkt", rpTh_pays: "Land", rpTh_prix: "Preis", rpTh_conseil: "Empfehlung",
  rpC_garder: "Behalten", rpC_pause_promo: "Pausiert · Aktion", rpC_cout_inconnu: "Kosten unbekannt", rpC_bornes_en_conflit: "Grenzen im Konflikt", rpC_frais_inconnus: "Gebühren unbekannt",
  rpC_sans_prix: "Preis nicht erfasst", rpC_bloque: "Blockiert", rpC_aucun: "Noch keine Empfehlung", rpC_desactive: "Deaktiviert", rpC_aValider: "zu bestätigen",
  rpErr: "Nicht verfügbar.", rpNone: "In den letzten 7 Tagen kein Produkt verkauft.", rpNoneFiltre: "Keine Zeile für diese Filter.",
  rpP_perdue: (d, n) => `empfohlenes Angebot verloren seit ${d} · ${n} Verkäufer`, rpP_perdueX: "empfohlenes Angebot verloren", rpP_detenue: (n) => `empfohlenes Angebot gehalten · ${n} Verkäufer`,
  rpP_seul: "einziger Verkäufer · kein anderes Angebot", rpP_inconnue: "empfohlenes Angebot: Lage unbekannt", rpP_sans_offre: "kein aktives Angebot", rpP_close: "Schließen",
  rpSim: "Simulation", rpSimTest: "Anderen Preis testen", rpSimPrix: "getesteter Preis", rpSimPlancher: "Untergrenze", rpSimPlafond: "Obergrenze", rpSimAttendu: "erwartet", rpSimAttNon: "nicht erfasst", rpSimAttSeul: "kein Wettbewerber",
  rpL_ttc: "Preis inkl. MwSt.", rpL_tva: (p) => `MwSt. ${p}`, rpL_tvaX: "MwSt.", rpL_frais: "Amazon-Gebühren zu diesem Preis", rpL_cout: "Einkaufskosten (Durchschnitt des Restbestands)", rpL_coutProv: "vorläufig",
  rpL_pub: "Werbung pro Einheit", rpL_pubNon: "nicht berechnet", rpL_ben: "Gewinn pro Einheit", rpL_benAv: "vor Werbung", rpL_acos: "Break-even-ACOS", rpL_ench: "Break-even-Gebot",
  rpL_enchAu: "Gebote darüber", rpL_inconnu: "unbekannt", rpL_nonReleve: "nicht erfasst", rpL_pxInactive: "Angebot inaktiv", rpL_pxSansOffre: "kein eigenes Angebot", rpL_pxNonLu: "Angebotsbericht noch nicht gelesen", rpL_pxFiche: "Preis der Produktseite, SKU nicht zugeordnet", rpL_pxConf: (p, d) => `Eingestellter Preis: ${p} (Angebotsbericht, ${d})`, rpRe_c_nonLu: (s) => `${s} zu prüfen (Angebote nicht gelesen)`, rpL_pxNonAch: "kein kaufbares Angebot erfasst", rpL_avant: "Vorher", rpL_parU: "/ Einheit", rpL_vjPerte: "Verkäufe / Tag vor dem Verlust",
  rpL_vj: "Verkäufe / Tag", rpL_vjCumul: "Verkäufe / Tag kumuliert (alle Referenzen des Produkts)", rpL_moy14: "14-Tage-Durchschnitt", rpE_attente: "Wartet auf Bestätigung", rpE_conseil: (p) => `Empfehlung: ${p}`, rpProposer: "Diesen Preis vorschlagen",
  rpPropBusy: "Wird gesendet…", rpPropGele: "Preissperre geschlossen: Kein Preis kann an Amazon gesendet werden.", rpPropErr: (m) => `Nicht vorgeschlagen: ${m}`, rpPropSousMarge: "Preis unter der Mindestmarge: Er erscheint rot in der Leiste unten und wird erst nach „Marge übergehen“ gesendet.", rpPropRelu: (p) => `Bei Amazon gelesener Preis: ${p}`,
  rpDetErr: "Detail nicht verfügbar.", rpGrilleVide: "Kein von Amazon geschätzter Preis für dieses Produkt.",
  rpJErr: "Protokoll nicht verfügbar.", rpJ_vide: "Kein Eintrag in den letzten 30 Tagen.", rpJ_th_date: "Datum", rpJ_th_evt: "Ereignis", rpJ_cpt: (n) => `${n} Erfassung(en) ohne Änderung (höchstens eine pro Tag und Produkt, alle Länder)`, rpJ_cout: "Einkaufskosten (eingefroren)", rpJ_estime: "(geschätzt)", rpJ_roi: "Rendite auf Kosten", rpJ_marge: "Marge", rpJ_bb: "Empfohlenes Angebot", rpJ_bbOui: "gehalten", rpJ_bbNon: "nicht gehalten", rpJ_bornes: "Untergrenze / Obergrenze", rpJ_bas: "Niedrigster Preis Prime / ohne Prime", rpJ_raison: "Grund", rpJ_fige: "Eingefroren am", rpJ_nonFige: "Vorschlag vor den Momentaufnahmen: Wirtschaftlichkeit nicht eingefroren.", rpJ_regleNonFigee: "Regel nicht eingefroren", rpJ_voir: "Details anzeigen", rpJ_auPa: (p) => `Zum aktuellen Preis (${p})`, rpJ_auPaC: "zum aktuellen Preis", rpJ_contrib: "Deckungsbeitrag", rpJ_nonEnr: "nicht erfasst", rpJ_indispo0: "nicht verfügbar", rpJ_causes: "Ursachen", rpJ_consq: "Folge", rpJ_consqV: (v) => `${v}: nicht verfügbar`, rpJ_filS: (s, n) => `Vom Repricer verfolgte Angebote · ${s} ${n === 1 ? "Eintrag" : "Einträge"} anderer Angebote ausgeblendet`, rpJ_filT: "Gesamter Verlauf", rpJ_voirTout: "Gesamten Verlauf anzeigen", rpJ_voirSuiv: "Zurück zu den verfolgten Angeboten", rpJA_prix_inconnu: "Preis nicht erfasst", rpJA_frais_absents: "Amazon-Gebühren fehlen", rpJA_cout_achat_absent: "Einkaufskosten fehlen",
  rpJ_ombre: "Empfehlung (Simulation)", rpJ_prop: "Preisvorschlag", rpJ_via_barre: "Leiste", rpJ_via_mcp: "MCP",
  rpJ_St_PENDING: "Ausstehend", rpJ_St_CONFIRMED: "Bestätigt", rpJ_St_SENDING: "Wird gesendet", rpJ_St_APPLIED: "Übernommen", rpJ_St_NOT_APPLIED: "Nicht übernommen",
  rpJ_St_REFUSED: "Abgelehnt", rpJ_St_CANCELLED: "Abgebrochen", rpJ_St_EXPIRED: "Abgelaufen", rpJ_St_UNKNOWN: "Ergebnis unbekannt",
  rpR_def: "Standard (Konto)", rpR_defNone: "Keine Standardregel: keine Empfehlung berechnet.", rpR_src: "Regel", rpR_propre: "Eigene", rpR_defaut: "Standard",
  rpR_margeMin: "Mindestmarge", rpR_roiMin: "Mindestrendite auf Kosten", rpR_profitMin: "Mindestgewinn / Einheit", rpR_margeMax: "Höchstmarge", rpR_mode: "Modus",
  rpR_mode_tous: "Alle Mindestwerte", rpR_mode_au_moins_un: "Mindestens einer", rpR_revenir: "Zurück zum Standard", rpR_garder: "Eigene behalten", rpR_auDefaut: "→ Standard",
  rpR_sansSku: "ohne Verkäufer-SKU", rpR_n: (n) => `${n} Regel(n) geändert`, rpR_ou: "in GTINPilot, nichts an Amazon gesendet", rpR_cancel: "Abbrechen", rpR_save: "Speichern",
  rpR_busy: "Wird gespeichert…", rpR_ok: "Gespeichert · Empfehlungen bei der nächsten Berechnung", rpR_ko: (m) => `Nicht gespeichert: ${m}`,
  rpR_e_champ: (w) => `${w}: Zahl > 0 erwartet`, rpR_e_vide: (w) => `${w}: mindestens ein Mindestwert (Marge, Rendite auf Kosten oder Gewinn)`,
  rpR_e_maxi: (w) => `${w}: Höchstmarge ≤ Mindestmarge`, rpR_e_trop: () => "Höchstens 50 Regeln pro Speichern",
  rpTh_situation: "Situation", rpTh_situationTip: "Aktuelle Position des Angebots. Die Spalte Empfehlung nennt den Zielpreis: Die beiden Bezeichnungen unterscheiden sich absichtlich.",
  rpTh_ventes: "Verkäufe 30 T", rpTh_ventesTip: "In den letzten 30 Tagen verkaufte Einheiten, ohne Vine (Vine separat): gleiche Berechnung wie die Seite Verkäufe (Kontotag, stornierte Bestellungen ausgeschlossen).",
  rpSit_seul_vendeur: "Einziger Verkäufer", rpSit_detenue: "Empfohlenes Angebot gehalten", rpSit_perdue: "Empfohlenes Angebot verloren", rpSit_au_plancher: "An der Untergrenze", rpSit_cout_inconnu: "Kosten unbekannt",
  rpSit_sans_offre: "Kein aktives Angebot", rpSit_inconnue: "Unbekannt", rpV_aucune: "Keine Bestellung in diesem Land erfasst", rpV_sansArt: (n) => `${n} Bestellung(en) im Land ohne Artikeldetails: diese Zahl ist ein Minimum`, rpV_vine: (n) => `+${n} Vine`, rpV_jours: (n) => `über ${n} T`,
  rpV_tip: (u, j) => `Verkäufe ${j} T: ${u}`,
  rpPli_inactifs: (n) => `Kein aktives Angebot (${n})`, rpPli_inactifsD: "Kein Preis erfasst oder Angebot bei Amazon inaktiv: nichts zu empfehlen, solange das Angebot nicht verkauft.",
  rpPli_masques: (n) => `Ausgeblendete Produkte (${n})`, rpPli_masquesD: "In Bestand › Listings ausgeblendet: nur aus den Listen entfernt, weiterhin verfolgt.",
  rpPli_desactives: (n) => `Deaktiviert (${n})`, rpPli_desactivesD: "In ganz GTINPilot deaktiviert: der Repricer empfiehlt es nicht mehr. Reaktivierung in Bestand › Listings.",
  rpNoneActif: "Kein Angebot im Verkauf für diese Filter.",rpC_non_achetable: "Nicht kaufbar · kein Bestand",
  rpL_pubTip: (a, b) => `Werbeausgaben ÷ verkaufte Einheiten, ${a} bis ${b}`, rpPubR_rapport_pub_absent: "kein Werbebericht für dieses Land", rpPubR_rapport_pub_incomplet: "Werbebericht über 30 Tage unvollständig",
  rpPubR_aucune_vente: "keine Einheit in 30 Tagen verkauft", rpPubR_devise_pub_differente: "Werbeausgaben in anderer Währung", rpPubR_quantite_absente: "Menge in einer Bestellung fehlt", rpPubR_tables_absentes: "Daten fehlen",
  rpL_enchN: (n, m) => `${n} Gebot(e) über ${m}`, rpL_ench0: (m) => `kein Gebot über ${m}`,
  rpLb_dateInc: "Datum unbekannt", rpLb_voirJournal: "Journal ansehen", rpLb_voirN: (n) => `Die ${n} ansehen`, rpLb_horsListe: (n) => `${n} außerhalb dieser Seite (Länder oder Produkte ohne aktuelle Ablesung)`, rpEd_e_choix: "Für jedes auf beiden Seiten geänderte Feld den zu behaltenden Wert wählen.", rpEd_cflAucunDeux: "Kein Feld wurde auf beiden Seiten geändert; sonst wäre es hier vor dem Speichern zu wählen.", rpEd_cflDeux: "Ein Feld wurde auf beiden Seiten geändert: vor dem Speichern den zu behaltenden Wert wählen.", rpEd_inchanges: "unverändert", rpEd_aChoisir: "zu wählen", rpEd_oIdentiques: "identisch", rpPp_calcAvec: (r, a) => `berechnet mit ${r} vor ${a}`, rpPp_stale: (r, a) => `Empfehlung berechnet mit ${r} vor ${a} — Neuberechnung beim nächsten Lauf`, rpPp_ageMin: (n) => `${n}\u00a0Min.`, rpPp_ageHM: (h, m) => `${h}\u00a0h\u00a0${String(m).padStart(2, "0")}\u00a0Min.`, rpPp_ageH: (n) => `${n}\u00a0h`, rpPp_nonNotee: "Regel nicht vermerkt", rpPp_fxD_conflitAvec: (r) => `: die Grenzen von ${r} lassen keinen Preis des Rasters zu.`, rpPp_recalcul: "Das ist nicht mehr die aktuelle Regel: Neuberechnung beim nächsten Lauf.", rpPp_reaffecter: "Neu zuweisen", rpPp_compteNonModif: "Kontoregel: hier nicht änderbar", rpLb_simT: "Nur Simulation.", rpLb_simD: "Diese Regeln berechnen Empfehlungen. Sie ändern keinen Amazon-Preis.",
  rpLb_ordre: "Reihenfolge:", rpLb_o1: "eigene Regel des Produkts", rpLb_o2: "zugewiesene benannte Regel", rpLb_o3: "Kontoregel",
  rpLb_titre: "Regelbibliothek", rpLb_sous: "Wiederverwendbare Regeln, je Produkt × Land zugewiesen", rpLb_defs: "Definitionen", rpLb_affecter: "Regel zuweisen", rpLb_nouvelle: "Neue Regel",
  rpLb_thRegle: "Regel", rpLb_thBar: "Preisgrenzen", rpLb_thEcart: "Abstand", rpLb_thAff: "Zugewiesen an", rpLb_thPays: "Länder", rpLb_thActs: "Aktionen",
  rpLb_compte: "Kontoregel", rpLb_tagDef: "Standard", rpLb_compteD: "gilt für jedes Produkt × Land ohne andere Regel",
  rpLb_compteAbs: "Keine Kontoregel: ohne benannte oder eigene Regel keine Empfehlung.",
  rpLb_compteLock: "Hier nicht änderbar · in der Kontokonfiguration festgelegt, heute ohne Bildschirm",
  rpLb_mini: "Min", rpLb_maxi: "Max", rpLb_sansPlafond: "keine Obergrenze", rpLb_et: "UND", rpLb_ou: "ODER",
  rpLb_c_profit: "Gewinn", rpLb_c_marge: "Marge", rpLb_c_roi: "Rendite auf Kosten", rpLb_ecNon: "nicht eingestellt", rpLb_ecNonT: "Kein Abstand eingestellt: die Engine wendet mit dieser Regel keinen Abstand an.", rpLb_ecClasserT: "Vorgehen noch einzuordnen: die Engine wendet keinen Abstand an.", rpLb_ecT: "Von der Engine für dieses Vorgehen angewandter Abstand.",
  rpLb_pxp: "Produkte × Länder", rpLb_dontApp: (n) => `davon ${n} angewandt`, rpLb_tousPays: "Alle Länder", rpLb_nNommees: (n) => `${n} benannt`,
  rpLb_version: (v, le, par) => `Version ${v}${le ? ` · ${le}` : ""}${par ? ` · ${par}` : ""}`,
  rpLb_appliquer: "Überall anwenden", rpLb_modifier: "Bearbeiten", rpLb_dupliquer: "Duplizieren", rpLb_supprimer: "Löschen", rpLb_supprT: "Löschen (archiviert, wiederherstellbar)",
  rpLb_autres: (nom) => `Weitere Aktionen · ${nom}`, rpLb_copie: (nom) => `${nom} (Kopie)`,
  rpLb_arch: (n) => `Archiviert (${n})`, rpLb_archD: "wiederherstellbar", rpLb_restaurer: "Wiederherstellen",
  rpLb_s_personnalise: "Individuell", rpLb_s_prudent: "Vorsichtig", rpLb_s_equilibre: "Ausgewogen", rpLb_s_offensif: "Offensiv", rpLb_s_destockage: "Abverkauf",
  rpLb_n_prudent: "Geschützte Marge", rpLb_n_equilibre: "Ausgewogene Buy Box", rpLb_n_offensif: "Eroberung (Q4)", rpLb_n_destockage: "Abverkauf",
  rpLb_videT: "Keine benannte Regel", rpLb_videD: (n, p) => `Die Kontoregel gilt für die ${n} Produkte × Länder (${p} Länder).`,
  rpLb_videD2: "Eine benannte Regel wird einmal erstellt und mehreren Produkten × Ländern zugewiesen; eine Änderung erzeugt eine neue Version, der ihre Produkte folgen.",
  rpLb_partir: "Von dieser Vorlage ausgehen", rpLb_lecture: "Regeln des Kontos werden gelesen…",
  rpLb_errT: "Regeln nicht lesbar", rpLb_errD: "Die Regeldatei dieses Kontos konnte nicht gelesen werden. Solange das so bleibt, gilt keine Regel: nichts fällt still auf die Kontoregel zurück.",
  rpLb_errD2: (d) => `Die angezeigten Empfehlungen stammen aus der letzten erfolgreichen Berechnung (${d}) und sind veraltet.`, rpLb_reessayer: "Erneut versuchen",
  rpLb_lockT: "Schreiben deaktiviert", rpLb_lockD: "solange die Datei nicht lesbar ist: Schreiben über eine unlesbare Datei könnte ihre Regeln löschen.",
  rpLb_detail: "Detail:", rpLb_offT: "Schreiben deaktiviert: Regeldatei nicht lesbar",
  rpLb_apT: (nom, v) => `„${nom}“ v${v} überall anwenden`, rpLb_apBig: "Produkte × Länder wechseln die Regel",
  rpLb_apNote: (n, p) => `Von den ${n} Produkten × Ländern der ${p} von der Regel abgedeckten Länder. Nur Simulation: kein Amazon-Preis geändert.`,
  rpLb_apChg: "wechseln die Regel: die benannte Regel wird wirksam", rpLb_apDeja: (nom) => `bereits auf „${nom}“: unverändert`,
  rpLb_apProp: "behalten ihre eigene Regel: Zuweisung gespeichert, durch die eigene Regel ersetzt", rpLb_apHors: (p) => `unberührt: ${p}, von der Regel nicht abgedeckt`,
  rpLb_apSans: "ohne Verkäufer-SKU: unberührt", rpLb_rien: (nom) => `Nichts zu ändern: alle abgedeckten Produkte × Länder sind bereits auf „${nom}“.`,
  rpLb_resOk: (n) => `${n} Produkt(e) × Land zugewiesen · nur Simulation, nichts bei Amazon.`,
  rpLb_resPart: (ok, tot, ko) => `${ok} von ${tot} zugewiesen · ${ko} nicht zugewiesen`, rpLb_resPartD: "die übrigen Zuweisungen sind gespeichert.",
  rpLb_r_CONFLIT: "Zuweisung inzwischen geändert; für dieses Produkt hat sich nichts geändert", rpLb_r_PAYS_NON_COUVERT: "Land von der Regel nicht abgedeckt; für dieses Produkt hat sich nichts geändert",
  rpLb_r_ARCHIVEE: "Regel inzwischen archiviert; für dieses Produkt hat sich nichts geändert", rpLb_r_INTROUVABLE: "Regel nicht gefunden; für dieses Produkt hat sich nichts geändert",
  rpLb_reessayerN: (n) => `Die ${n} erneut versuchen`,
  rpLb_suppRefus: (n, nom) => `Löschen abgelehnt: ${n} Produkt(e) × Land nutzen „${nom}“. Zuerst neu zuweisen; Löschen archiviert die Regel, wiederherstellbar.`,
  rpLb_vbT: "Änderung zu bestätigen — 1 ausstehend", rpLb_annuler: "Abbrechen", rpLb_valider: "Bestätigen", rpLb_enCours: "Wird gespeichert…",
  rpLb_vbSim: "nur Simulation · kein Amazon-Preis geändert",
  rpLb_vb_affect: (nom, v, n, p) => `„${nom}“ v${v} zuweisen: ${n} Produkt(e) × Land${p ? ` · ${p} behalten ihre eigene Regel` : ""}`,
  rpLb_vb_affectD: "Die Produkte folgen jeder neuen Version der Regel.", rpLb_vb_affMulti: (n, p) => `${n} Produkt(e) × ${p} gewählte Länder`,
  rpLb_vb_aucune: (qui) => `Zuweisung von ${qui} entfernen: die Kontoregel gilt`,
  rpLb_vb_archiver: (nom) => `„${nom}“ archivieren`, rpLb_vb_archiverD: "Archiviert bleibt sie wiederherstellbar; kein Produkt nutzt sie.",
  rpLb_vb_restaurer: (nom) => `„${nom}“ wiederherstellen`, rpLb_vb_retirer: (qui) => `Eigene Regel von ${qui} entfernen`,
  rpLb_vb_retirerD: "Es gilt die zugewiesene benannte Regel, sonst die Kontoregel. Sonst wird nichts gelöscht.",
  rpLb_okMsg: "Regel gespeichert · nur Simulation, nichts bei Amazon.", rpLb_ko: (m) => `Nichts gespeichert: ${m}`,
  rpLb_archOk: (nom) => `„${nom}“ archiviert (wiederherstellbar).`, rpLb_restOk: (nom) => `„${nom}“ wiederhergestellt.`, rpLb_retOk: "Eigene Regel entfernt.",
  rpEd_titreMod: "Regel bearbeiten", rpEd_titreNew: "Neue Regel", rpEd_titreProp: (qui) => `Eigene Regel · ${qui}`,
  rpEd_metaMod: (nom, v, le) => `${nom} · Version ${v}${le ? ` · geändert am ${le}` : ""}`, rpEd_metaNew: "Entwurf · nichts gespeichert", rpEd_metaProp: (v) => `Version ${v}`,
  rpEd_fermer: "Schließen", rpEd_ident: "Name", rpEd_nom: "Name der Regel", rpEd_affA: "Zugewiesen an", rpEd_affN: (n) => `${n} Produkt(e) × Land`, rpEd_aucunProd: "kein Produkt",
  rpEd_vInfo: (a, b) => `Version ${a} → ${b}`, rpEd_vNew: "neu",
  rpEd_hintMod: (v, n) => `Speichern erzeugt Version ${v}; die ${n} zugewiesenen Produkt(e) × Land folgen ihr. Jede Simulation notiert die verwendete Version.`,
  rpEd_hintNew: "Neue Regel: Version 1 beim Speichern, keinem Produkt zugewiesen.",
  rpEd_style: "Stil der Regel", rpEd_styleH: "Ein Stil füllt die Grenzen unten vor; Individuell behält die eingegebenen Werte.", rpEd_rec: "Empfohlen",
  rpEd_sd_personnalise: "ändert nichts", rpEd_sd_prudent: "Marge zuerst", rpEd_sd_equilibre: "Marge und hervorgehobenes Angebot", rpEd_sd_offensif: "niedrige Mindestwerte", rpEd_sd_destockage: "nie unter Kosten",
  rpEd_bar: "Preisgrenzen", rpEd_defH: "Definitionen — dieselben wie in der Berechnung",
  rpEd_dBen: "Nettopreis − Amazon-Gebühren zu diesem Preis − Einkaufskosten (gewichteter Durchschnitt), je Einheit, vor Werbung", rpEd_dMarge: "Gewinn ÷ Nettopreis", rpEd_dRoi: "Gewinn ÷ Einkaufskosten",
  rpEd_mins: "Mindestwerte", rpEd_maxs: "Höchstwerte", rpEd_aucun: "Keiner", rpEd_devPays: "Landeswährung",
  rpEd_f_profitMin: "Mindestgewinn je Verkauf", rpEd_f_margeMin: "Mindestmarge", rpEd_f_roiMin: "Mindestrendite auf Kosten",
  rpEd_f_profitMax: "Höchstgewinn je Verkauf", rpEd_f_margeMax: "Höchstmarge", rpEd_f_roiMax: "Höchstrendite auf Kosten",
  rpEd_modeMin: "Mindestwerte: UND / ODER", rpEd_modeMax: "Höchstwerte: UND / ODER", rpEd_tousMin: "alle gesetzten Mindestwerte", rpEd_tousMax: "alle gesetzten Höchstwerte", rpEd_auMoins: "mindestens einer",
  rpEd_maxH0: "Kein Höchstwert gesetzt: keine Obergrenze.", rpEd_maxH1: "Ein Höchstwert schränkt die erlaubten Preise nur ein.", rpEd_maxH2: "Ein Höchstwert hebt nie einen Mindestwert oder einen Schutz auf.",
  rpEd_exDes: "erlaubte Preise ab", rpEd_exSans: "· ohne Obergrenze", rpEd_exJusq: (m) => `· bis ${m}`, rpEd_ok: "verträgliche Grenzen", rpEd_exCout: "Kosten",
  rpEd_exAucun: "kein Preis seines Rasters erfüllt diese Grenzen", rpEd_exNone: "Rechenbeispiel: Preisraster eines Produkts wird gelesen…",
  rpEd_vide: "Kein Preis erlaubt", rpEd_videD: (x) => `: ${x} können nicht zusammen gelten. Gilt für alle Produkte; einen der beiden korrigieren, um zu speichern.`,
  rpEd_contra: "Widersprüchliche Grenzen", rpEd_contraD: (x) => `: ${x}. Ein Höchstwert muss über dem Mindestwert desselben Kriteriums liegen; korrigieren, um zu speichern.`,
  rpEd_saveImp: "Speichern unmöglich: kein Preis erlaubt", rpEd_saveImpT: "Kein Preis erlaubt: Grenzen korrigieren",
  rpEd_pays: "Länder, in denen die Regel gilt", rpEd_tousPays: "Alle Länder des Kontos", rpEd_tousPaysD: "auch später hinzugefügte", rpEd_certains: "Bestimmte Länder", rpEd_certainsD: "unten angekreuzt",
  rpEd_paysH: "Nicht angekreuztes Land: dort gilt die Regel nie. Ein dort weiter zugewiesenes Produkt wird als „zugewiesen, aber nicht anwendbar“ gemeldet, und die tatsächlich angewandte Regel wird genannt.",
  rpEd_soon: "Geplant, noch nicht aktiv", rpEd_soonN: (n) => `${n} Einstellungen`,
  rpEd_x_pause: "Wiederkehrende Pause", rpEd_xd_pause: "Den Preis in einem gewählten Zeitfenster unverändert lassen.", rpEd_xf_pause: [["Zeitfenster", "+ Zeitfenster hinzufügen"]],
  rpEd_x_conc: "Wettbewerb", rpEd_xd_conc: "Wie man sich gegenüber Amazon und selbst versendenden Verkäufern positioniert.",
  rpEd_xf_conc: [["Gegenüber Amazon", "Angleichen, wenn rentabel, sonst lassen"], ["Selbst versendende Verkäufer", "Berücksichtigen"], ["Abstand zum zu schlagenden Preis", "0 · angleichen"], ["Max. Anstieg und Senkung pro Tag", "—"]],
  rpEd_x_cas: "Sonderfälle", rpEd_xd_cas: "Was tun, wenn das hervorgehobene Angebot entfernt wird, die Konkurrenz unter die Untergrenze fällt, das Angebot allein ist oder es bereits hält.",
  rpEd_xf_cas: [["Hervorgehobenes Angebot von Amazon entfernt", "Preis nicht ändern"], ["Konkurrenz unter der Untergrenze", "Preis nicht ändern"], ["Einziges Angebot im Eintrag", "Preis nicht ändern"], ["Hervorgehobenes Angebot bereits gehalten", "Preis nicht ändern"]],
  rpEd_x_battre: "Zu schlagender Preis", rpEd_xd_battre: "Welcher Preis angepeilt wird und welche Konkurrenten zählen.", rpEd_xf_battre: [["Zielpreis", "Preis des hervorgehobenen Angebots"], ["Min. positive Bewertungen des Verkäufers", "—"]],
  rpEd_x_yoyo: "Jo-Jo-Schutz", rpEd_xd_yoyo: "Wenn der Preis gegen ein anderes Programm hin und her springt, eine Pause, die mit jeder Wiederholung länger wird, Ursache im Journal.",
  rpEd_xf_yoyo: [["Pause", "6 h › 24 h › 72 h bei Wiederholung · nie ein stilles Einfrieren"]],
  rpEd_x_auto: "Automatisierungen", rpEd_xd_auto: "Die Regel wechseln, wenn ein Produkt sich nicht mehr verkauft, gezählt je Land und je gemeinsamem Bestand.",
  rpEd_xf_auto: [["Kein Verkauf seit", "20 › 35 › 50 › 65 Tagen"], ["Dann wechseln zu", "Nächste Regel"]],
  rpEd_note: "Speichern ändert keinen Preis bei Amazon.", rpEd_facon: "Wie legen Sie Ihren Preis fest?", rpEd_fc_concurrents: "SmartPrice", rpEd_fcd_concurrents: "Ihre Marke gegenüber Konkurrenzprodukten anderer Marken.",
  rpEd_vf_m001: (c) => `0,01 ${c} günstiger`, rpEd_vfRef_foep: "der von Amazon empfohlene Preis", rpEd_vfRef_bas: "der günstigste Lieferpreis", rpEd_exT: "Fiktives Beispiel · kein echtes Produkt", rpEd_exVed: "Empfohlenes Angebot", rpEd_exPl: "Mindestpreis", rpEd_exGarde: "beim Mindestpreis gehalten", rpEd_vfRef: "das Empfohlene Angebot", rpEd_vfH: "unter den Verkäufern des Angebots, die diese Regel zählt", rpEd_vfPl: "Gezählte Verkäufer", rpEd_vfExp_tous: "alle Verkäufer", rpEd_vfExpD_tous: "Jeder auf dem Angebot erfasste Verkäufer zählt, egal wer versendet.", rpEd_vfExp_amazon: "nur Versand durch Amazon", rpEd_vfExpD_amazon: "Nur Verkäufer, deren Angebot Amazon versendet, zählen. Ein Verkäufer, bei dem unbekannt ist, wer versendet, zählt nicht.", rpEd_vfExpH: "Einen bestimmten Verkäufer ausschließen: bald verfügbar, über die Liste der Verkäufer des Angebots.", rpEd_vfPh_aucun: "Wählen Sie einen Abstand: Der Preis folgt dem Empfohlenen Angebot, nie unter dem Mindestpreis und nie über dem Höchstpreis.", rpEd_e_vf: "Abstand: eine positive Zahl, höchstens zwei Dezimalstellen.", rpEd_fcRfOk: "Auswahl gespeichert. In der Simulation berechnet: Kein Preis wird an Amazon gesendet.", rpEd_fcRfNonEnr: "Wird mit der Regel gespeichert. In der Simulation berechnet: Kein Preis wird an Amazon gesendet.", rpEd_fc_vendeurs_fiche: "Repricer", rpEd_fcd_vendeurs_fiche: "Sie und andere Verkäufer auf demselben Amazon-Angebot.", rpEd_fcAClasser: "Einzuordnen: Solange keine Art gewählt ist, behält die Regel ihre bisherige Berechnung.", rpEd_fcNonEnr: "Wird mit der Regel gespeichert. Diese Berechnung ist noch nicht aktiv: Heute hängt keine Empfehlung davon ab.", rpEd_fcInactif: "Auswahl gespeichert. Diese Berechnung ist noch nicht aktiv: Heute hängt keine Empfehlung davon ab.",
  rpEd_fcLe: (d) => `Gewählt am ${d}.`,
  rpEd_enr: "Speichern", rpEd_resAria: "Vorschau der Regel", rpEd_pl_lim: "Grenzen", rpEd_pl_ctb: "Deckungsbeitrag", rpEd_pl_pays: "Länder", rpEd_pl_mode: "Modus", rpEd_plv_profit: "Deckungsbeitrag", rpEd_plv_marge: "Marge", rpEd_plv_roi: "Rendite auf Kosten", rpEd_plv_mini: (x) => `${x} min.`, rpEd_plv_maxi: (x) => `${x} max.`, rpEd_plv_aucune: "keine Grenze", rpEd_plv_ctb: "Nettopreis − Gebühren − Einkauf, vor Werbung", rpEd_plv_mode_concurrents: "Konkurrenzprodukte", rpEd_plv_mode_vendeurs_fiche: "Verkäufer des Angebots",
  rpEd_clsRes: "Solange sie keinen Modus hat, behält diese Regel ihre bisherige Berechnung.", rpEd_clsN: (n) => `${n} ${n === 1 ? "Angebot folgt" : "Angebote folgen"} dieser Regel`, rpEd_fcSpOk: "Auswahl gespeichert.", rpEd_fcSpNonEnr: "Wird mit der Regel gespeichert.", rpEd_fcSpSans: "Ohne Preisabstand folgt SmartPrice keinem Wettbewerber; es bringt nur einen Preis, der aus der Regel fällt, in die Regel zurück (zu niedrig, zu hoch oder nicht erlaubt).", rpEd_ecExPlC: (x) => `Deckungsbeitrag ${x}`, rpEd_ecCoChoisir: "Vergleichbaren Konkurrenten wählen", rpEd_ecCoHors: (a) => `${a} (nicht mehr vergleichbar)`,
  rpEd_fcq_concurrents: "gegenüber Konkurrenzprodukten", rpEd_fcq_vendeurs_fiche: "gegenüber den anderen Verkäufern des Angebots", rpEd_clsT: "Diese Regel hat noch keinen Modus.", rpEd_clsD: (n) => `Sie stammt aus der Zeit vor SmartPrice. ${n} ${n === 1 ? "Angebot folgt" : "Angebote folgen"} ihr. Einmal wählen; ihre Grenzen bleiben erhalten.`, rpEd_passer_concurrents: "Zu SmartPrice wechseln", rpEd_passer_vendeurs_fiche: "Zu Repricer wechseln", rpEd_mq_facon: "Wählen Sie einen Modus, um zu speichern. Bei Amazon wird kein Preis geändert.", rpEd_mq_ecart: "Wählen Sie einen Preisabstand, um zu speichern. Bei Amazon wird kein Preis geändert.",
  rpEd_ec: "Preisabstand", rpEd_ec_m5: "5 % günstiger", rpEd_ec_0: "Gleicher Preis", rpEd_ec_p5: "5 % teurer", rpEd_ec_autre: "Andere", rpEd_ecQue: "als", rpEd_ecRef: "Referenzpreis", rpEd_ecC_moins_cher: "der günstigste", rpEd_ecC_mediane: "der Median", rpEd_ecC_choisi: "ein gewählter Konkurrent", rpEd_ecVal: "Abstand", rpEd_ecU: "Einheit", rpEd_ecS: "Richtung", rpEd_ecS_moins: "günstiger", rpEd_ecS_plus: "teurer", rpEd_ecAsin: "ASIN des Konkurrenten", rpEd_ecH: "unter den als vergleichbar markierten Konkurrenten, Produkt für Produkt", rpEd_e_ecart: "Abstand: eine positive Zahl, höchstens zwei Dezimalstellen, unter 100 % (oder 10.000 in Währung).", rpEd_e_asin: "ASIN des Konkurrenten: 10 Buchstaben oder Ziffern.",
  rpEd_ecPh_aucun: "Wählen Sie einen Abstand: Der Preis folgt Ihren vergleichbaren Konkurrenten, nie unter dem Mindestpreis und nie über dem Höchstpreis.", rpEd_ecPh_moins: (v, r) => `Preis ${v} unter der Referenz (${r}), nie unter dem Mindestpreis und nie über dem Höchstpreis.`, rpEd_ecPh_egal: (r) => `Preis gleich der Referenz (${r}), nie unter dem Mindestpreis und nie über dem Höchstpreis.`, rpEd_ecPh_plus: (v, r) => `Preis ${v} über der Referenz (${r}), nie unter dem Mindestpreis und nie über dem Höchstpreis.`, rpEd_ecR_moins_cher: "der günstigste vergleichbare Konkurrent", rpEd_ecR_mediane: "der Median der vergleichbaren Konkurrenten", rpEd_ecR_choisi: (a) => `Konkurrent ${a}`,
  rpEd_ecEx: (n) => `Beispiel · ${n}`, rpEd_ecExMoins: (n) => `günstigster von ${n} vergleichbaren`, rpEd_ecExMed: "Median", rpEd_ecExMedD: (n) => `von ${n} vergleichbaren`, rpEd_ecExChoisi: "gewählter Konkurrent", rpEd_ecExCons: "Empfohlener Preis", rpEd_ecExCtb: "Deckungsbeitrag je Verkauf", rpEd_ecExCtbD: "netto, vor Werbung, geschätzt", rpEd_ecExPl: "Mindestpreis", rpEd_ecExPlD: "erster von den Grenzen erlaubter Preis", rpEd_ecExNone: "Kein Rechenbeispiel: Kein geladenes Produkt hat genug vergleichbare Konkurrenten mit aktuellem Preis für diese Referenz.",
  rpLb_fClasser: "Einzuordnen", rpEd_annuler: "Abbrechen", rpEd_saveV: (v) => `Version ${v} speichern`, rpEd_saveNew: "Regel speichern",
  rpEd_saveProp: "Eigene Regel speichern", rpEd_busy: "Wird gespeichert…", rpEd_ko: (m) => `Nichts geschrieben: ${m}`,
  rpEd_cflProp: "Die eigene Regel wurde anderswo geändert: nichts geschrieben. Schließen und erneut öffnen, um von der gespeicherten Version auszugehen.",
  rpEd_e_champ: "Eine Grenze ist keine positive Zahl.", rpEd_e_grand: "Mindestgewinn: unter 100 je Verkauf; Höchstgewinn: unter einer Million.", rpEd_e_vide: "Mindestens ein Mindestwert: Gewinn, Marge oder Rendite auf Kosten.",
  rpEd_e_maxi: "Ein Höchstwert ist höchstens gleich dem Mindestwert desselben Kriteriums.", rpEd_e_nom: "Name der Regel: 1 bis 80 Zeichen.", rpEd_e_pays: "Mindestens ein Land wählen.",
  rpEd_cflT: "Diese Regel wurde während der Bearbeitung geändert: nichts geschrieben.",
  rpEd_cflD: (lu, v, le) => `Version ${lu} gelesen; Version ${v} anderswo gespeichert${le ? ` am ${le}` : ""}. Hier die vorgeschlagene Zusammenführung; sie wird nur mit „Version ${v + 1} speichern“ gespeichert.`,
  rpEd_cChamp: "Feld", rpEd_cLu: (v) => `Gelesen (v${v})`, rpEd_cSaisie: "Hier eingegeben", rpEd_cTrouve: (v) => `Version ${v}`, rpEd_cRes: (v) => `Ergebnis v${v}`, rpEd_cOrig: "Herkunft",
  rpEd_oSaisie: "Eingabe behalten", rpEd_oReprise: (v) => `Version ${v} übernommen`, rpEd_oIdem: "Kein Feld weicht ab: nur die Version ändert sich.", rpEd_abandon: (v) => `Eingabe verwerfen (Version ${v} behalten)`,
  rpPp_ouvrir: "Regeln und Preise je Land", rpPp_retour: "Alle Produkte", rpPp_cout: "Einkaufskosten", rpPp_coutMoy: "gewichteter Durchschnitt", rpPp_charge: "Berechnung…",
  rpPp_th_pays: "Land", rpPp_th_etat: "Angebot · hervorgehoben", rpPp_th_prix: "Aktueller Bruttopreis", rpPp_th_cons: "Empfehlung · Simulation", rpPp_th_ben: "Gewinn", rpPp_th_marge: "Marge auf Nettopreis",
  rpPp_th_roi: "Rendite / Kosten", rpPp_th_eq: "Break-even-Preis", rpPp_th_mini: "Mindestpreis Regel", rpPp_th_aff: "Zugewiesene Regel", rpPp_th_app: "Angewandte Regel",
  rpPp_conseil: "Empfehlung", rpPp_roi2: "Rendite auf Kosten", rpPp_mini2: "Mindestpreis der Regel", rpPp_plus: "Gewinn, Marge, Break-even-Preis, Mindestpreis",
  rpPp_active: "Aktiv", rpPp_inactive: "Inaktiv", rpPp_bbNous: "Hervorgehoben: unseres", rpPp_bbInc: "hervorgehoben unbekannt", rpPp_inactif: "inaktives Angebot: nichts zu empfehlen",
  rpPp_indispo: "Nicht verfügbar", rpPp_sansApp: "keine anwendbare Regel", rpPp_garder: "behalten", rpPp_releve: (h) => `vor ${h} h gelesen`,
  rpPp_foepT: "Amazons Zielpreis noch nicht gelesen: ein „behalten“ kann von dieser Lücke kommen", rpPp_dansBornes: "innerhalb der Grenzen",
  rpPp_g_buy_box_detenue: "hervorgehobenes Angebot unseres", rpPp_g_seule_offre: "einziges Angebot", rpPp_g_buy_box_perdue_sans_prix_a_viser: "Zielpreis nicht gelesen", rpPp_g_deja_au_prix_vise: "bereits beim Zielpreis",
  rpPp_horsGrille: "außerhalb des Rasters", rpPp_enConflit: "im Konflikt",
  rpPp_selAucune: "— keine", rpPp_selNonCouv: "(Land nicht abgedeckt)", rpPp_introuvable: "Regel nicht gefunden", rpPp_choisir: (mp) => `Zugewiesene Regel · ${mp}`,
  rpPp_propreSeule: "nur eigene Regel", rpPp_rempl: (v) => `v${v} · durch die eigene Regel ersetzt`,
  rpPp_et_pays_non_couvert: "Zugewiesen, aber nicht anwendbar", rpPp_et_archivee: "Archiviert · nicht angewandt", rpPp_et_introuvable: "Nicht gefunden · nicht angewandt",
  rpPp_aucuneApp: "keine", rpPp_compteAbs: "keine Kontoregel", rpPp_sansRegle: "keine Regel", rpPp_propre: "Eigene Regel",
  rpPp_src_produit: "eigen", rpPp_src_nommee: "benannt", rpPp_src_defaut: "Konto",
  rpPp_motif_pays_non_couvert: "anstelle der zugewiesenen Regel: Land nicht abgedeckt", rpPp_motif_archivee: "anstelle der zugewiesenen Regel: archiviert",
  rpPp_motif_introuvable: "anstelle der zugewiesenen Regel: nicht gefunden",
  rpPp_calcT: (p) => `Berechnungsdetail · ${p} zum aktuellen Preis`, rpPp_ttc: "brutto", rpPp_tva: "MwSt.", rpPp_ht: "netto", rpPp_frais: "Amazon-Gebühren zu diesem Preis", rpPp_coutA: "Einkaufskosten",
  rpPp_benef: "Gewinn", rpPp_marge: "Marge", rpPp_roi: "Rendite auf Kosten",
  rpPp_fxT_remplacee: "Benannte Regel zugewiesen, aber durch die eigene Regel des Produkts ersetzt.", rpPp_fxD_remplacee: (nom, v, p) => `„${nom}“ v${v} ist für ${p} gespeichert; die eigene Regel gilt.`,
  rpPp_creerPropre: "Eigene Regel anlegen", rpPp_retirerPropre: "Eigene Regel entfernen", rpPp_modPropre: "Eigene Regel bearbeiten", rpPp_modRegle: "Regel bearbeiten",
  rpPp_fxT_pays: "Land von der zugewiesenen Regel nicht abgedeckt.", rpPp_fxD_pays: (nom, p) => `„${nom}“ deckt ${p} nicht ab: sie wird dort nicht angewandt. Stattdessen gilt die Kontoregel, genannt unter „Angewandte Regel“.`,
  rpPp_ajouterPays: (c) => `${c} zur Regel hinzufügen`, rpPp_autreRegle: "Andere Regel zuweisen",
  rpPp_fxT_archivee: "Benannte Regel archiviert: nicht angewandt.", rpPp_fxD_archivee: (nom) => `„${nom}“ ist archiviert; stattdessen gilt die Kontoregel.`,
  rpPp_fxT_introuvable: "Benannte Regel nicht gefunden: nicht angewandt.", rpPp_fxD_introuvable: "Die Zuweisung verweist auf eine Regel, die es nicht mehr gibt; stattdessen gilt die Kontoregel.",
  rpPp_fxT_aucune: "Keine anwendbare Regel: keine Empfehlung.", rpPp_fxD_aucune: "Die zugewiesene Regel gilt hier nicht und das Konto hat keine Regel: nichts ersetzt sie still.",
  rpPp_fxT_conflit: "Kein Preis erlaubt", rpPp_fxD_conflit: ": die Grenzen der angewandten Regel lassen keinen Preis des Rasters zu.",
  rpPp_fxT_perime: (h) => `Preisablesung zu alt (${h} h)`, rpPp_fxD_perime: ": nichts wird empfohlen, bis eine Ablesung unter 36 h eintrifft.",
  rpPp_coutT: "Einkaufskosten unbekannt", rpPp_coutD: (n) => `: Gewinn, Marge und Mindestpreis sind in den ${n} Ländern nicht berechenbar; keine Empfehlung.`, rpPp_saisirCout: "Einkaufskosten eingeben",
  rpPp_f1T: "Amazons Zielpreis noch nicht gelesen", rpPp_f1D: ": ein „behalten“ kann von dieser Lücke kommen.",
  rpPp_f2T: "Hervorgehobenes Angebot", rpPp_f2D: ": „unseres“ oder „unbekannt“; die Ablesung kann „verloren“ noch nicht sagen.",
  rpPp_f3T: "Zahlen", rpPp_f3D: " zum aktuellen Bruttopreis, vor Werbung; Marge auf Nettopreis · Regel und Version bei jeder Simulation notiert · Ablesung älter als 36 h = nicht verfügbar.",
  rpAf_sel: (n) => `${n} Produkt(e) ausgewählt`, rpAf_sur: (n) => `von ${n}`, rpAf_desel: "Alle abwählen", rpAf_tout: "Alle auswählen", rpAf_cocher: "Wählen",
  rpAf_th_prod: "Produkt", rpAf_th_pays: "Verkaufte Länder", rpAf_th_regles: "Aktuelle Regeln", rpAf_titre: (n) => `Regel zuweisen · ${n} Produkt(e)`,
  rpAf_regle: "Regel", rpAf_choisir: "Regel wählen", rpAf_pays: "Länder", rpAf_apercu: "Vorschau", rpAf_nonCouv: "nicht abgedeckt",
  rpAf_vendus: (tot, sans) => `Produkte × Länder verkauft in den gewählten Ländern (von ${tot}; ${sans} ohne Angebot, unberührt)`,
  rpAf_chg: "wechseln die Regel: die gewählte Regel wird wirksam", rpAf_deja: "bereits auf dieser Regel: unverändert", rpAf_prop: "behalten ihre eigene Regel: Zuweisung gespeichert, nicht wirksam",
  rpAf_hint: "Nichts Automatisches zusätzlich: nur die Zuweisung ändert sich. Nur Simulation, kein Amazon-Preis geändert.", rpAf_aucunSel: "Produkte in der Liste ankreuzen.",
  rpRe_envLc: (a) => `Erneut gelesen ${a}`, rpRe_coutEstC: "Geschätzte Kosten", rpRe_coutDc: "Preis nicht berechenbar", rpRe_gc_tenue: (n) => `${n} gehalten`, rpRe_gc_perdue: (n) => `${n} verloren`, rpRe_gc_aucune: (n) => `${n} ohne empfohlenes Angebot`, rpRe_gc_inconnue: (n) => `${n} unbekannt`,
  rpRe_iAria: "Lage des empfohlenen Angebots", rpRe_i_offres: "Angebote", rpRe_i_tenue: "Gehalten", rpRe_i_perdue: "Verloren", rpRe_i_aucune: "Ohne empfohlenes Angebot", rpRe_i_inconnue: "Unbekannt",
  rpRe_g_tenue: (n) => `${n} mit Ihrem empfohlenen Angebot`, rpRe_g_perdue: (n) => `${n} mit verlorenem empfohlenen Angebot`, rpRe_g_aucune: (n) => `${n} Angebotsseite${n > 1 ? "n" : ""} ohne empfohlenes Angebot`, rpRe_g_inconnue: (n) => `${n} unbekannte${n > 1 ? "" : "r"} Zustand${n > 1 ? "e" : ""}`,
  rpRe_simuP: "Simulation:", rpRe_aLire: (n) => `${n} Empfehlung${n > 1 ? "en" : ""} zum Lesen`, rpRe_pos: (n) => `Lage des empfohlenen Angebots, bei ${n} Angebot${n > 1 ? "en" : ""}`,
  rpRe_rien: "Nichts zu tun", rpRe_rienD: (h, n) => `Kein Angebot erfordert eine Aktion. Letzte Berechnung um ${h}, bei ${n > 1 ? `allen ${n} Angeboten` : `${n} Angebot`}.`, rpRe_rienDx: (n) => `Kein Angebot erfordert eine Aktion, bei ${n > 1 ? `allen ${n} Angeboten` : `${n} Angebot`}.`, rpRe_prochaines: "Die nächsten Aktionen erscheinen hier.",
  rpRe_coutEst: "Geschätzte Einkaufskosten:", rpRe_coutInc: "Einkaufskosten unbekannt", rpRe_aConf: "Zu bestätigen", rpRe_coutD: "Preis erst berechenbar, wenn die Kosten in COGS bestätigt sind", rpRe_confCogs: "In COGS bestätigen",
  rpRe_conflitD: (p, f) => `Mindestpreis ${p} über dem Höchstpreis ${f}`, rpRe_sousPl: "Empfohlenes Angebot unter Ihrem Mindestpreis", rpRe_sousPlD: "Preis am Mindestpreis gehalten · rentable Wahl", rpRe_sousPlDx: "Preis gehalten · rentable Wahl",
  rpRe_nivInc: "Stufe unbekannt", rpRe_pays: "Land:",
  rpRe_trier: "Sortieren", rpRe_trierP: "Sortieren:", rpRe_tri_pays: "Land", rpRe_tri_produit: "Produkt", rpRe_tri_variation: "Änderung", rpRe_tri_contribution: "Beitrag",
  rpRf_regle: (n) => `Regel: ${n}`, rpRf_st_tenue: "Empfohlenes Angebot gehalten", rpRf_st_perdue: "Empfohlenes Angebot verloren", rpRf_st_aucune: "Kein empfohlenes Angebot", rpRf_st_inconnue: "Empfohlenes Angebot unbekannt",
  rpRf_simt: "Simulation · Nichts geht an Amazon", rpRf_conserve: "Preis am Mindestpreis gehalten", rpRf_garde: "Preis gehalten", rpRf_ved: "Empfohlenes Angebot", rpRf_suiv: "Nächstes Angebot",
  rpRf_actuel: "Aktueller Preis", rpRf_propose: "Vorgeschlagener Preis", rpRf_veut: "Was das bedeutet", rpRf_faire: "Was Sie tun können",
  rpRf_alignB: "Zum gleichen Lieferpreis wie das empfohlene Angebot", rpRf_align: (q, p, port, x) => `, gehalten von ${q}: Ihr Artikelpreis ${p} + Versand ${port}${x}, `, rpRf_align2: ". Angeglichen, nicht billiger: Dieser Preis garantiert das empfohlene Angebot nicht.",
  rpRf_viseB: (p) => `Zielpreis: ${p}`, rpRf_vise: (pv, port) => `, für ein empfohlenes Angebot zu ${pv} geliefert (Ihr Versand: ${port}). Dieser Preis garantiert das empfohlene Angebot nicht.`,
  rpRf_plafB: "Am Höchstpreis Ihrer Regel", rpRf_plaf: (pv, pf) => `: Das empfohlene Angebot liegt bei ${pv} geliefert, über Ihrem Höchstpreis von ${pf}. Dieser Preis garantiert das empfohlene Angebot nicht.`,
  rpRf_tenueB: "Sie halten das empfohlene Angebot.", rpRf_suivTxt: (p, l) => ` Das nächste gezählte Angebot${l ? ` (${l})` : ""} liegt bei ${p} geliefert.`, rpRf_hausse24: (m, h) => ` Optionale Erhöhung: höchstens ${m} in 24 h, ab Ihrem Preis von gestern (${h}).`,
  rpRf_hausse: " Optionale Erhöhung.", rpRf_risque: " Eine Erhöhung kann Sie das empfohlene Angebot kosten.", rpRf_tenueGarde: " Preis gehalten.",
  rpRf_sousPl: (q, pv, ec) => `${q} hält das empfohlene Angebot zu ${pv}, ${ec} unter Ihrem Mindestpreis.`, rpRf_sousPlCtb: (x) => ` Zu diesem Preis fiele Ihr Beitrag auf ≈ ${x} pro Verkauf`, rpRf_minDe: (m) => `, bei einem Minimum von ${m}`,
  rpRf_inconnue: "Der Status des empfohlenen Angebots ist unbekannt: Es wird kein Preis berechnet.", rpRf_cause: (x) => `Ursache: ${x}.`, rpRf_aucune: "Kein empfohlenes Angebot auf dieser Seite bei der letzten Erhebung: Es wird kein Preis berechnet.",
  rpRf_ctbK: "Geschätzter Beitrag, netto", rpRf_ctbK2: "Geschätzter Beitrag vor Werbung", rpRf_vente: " / Verkauf",
  rpRf_ctbAu: (b, ec, m) => `Geschätzter Beitrag vor Werbung: ${b} pro Verkauf, ${ec} über Ihrem Minimum von ${m}.`, rpRf_ctbSur: (b, ec, m) => `Geschätzter Beitrag vor Werbung: ${b} pro Verkauf, ${ec} über Ihrem Maximum von ${m}.`, rpRf_ctbSous: (b, ec, m) => `Geschätzter Beitrag vor Werbung: ${b} pro Verkauf, ${ec} unter Ihrem Minimum von ${m}.`,
  rpRf_ctbPerte: "Geht das empfohlene Angebot verloren, schlägt eine neue Berechnung eine Senkung vor, zur Freigabe.", rpRf_ctbAct: (p) => `Zu Ihrem aktuellen Preis von ${p}.`, rpRf_ctbActMin: (p) => `Zu Ihrem aktuellen Preis von ${p}: das ist Ihr Minimum.`,
  rpRf_simnB: "Simulation.", rpRf_simn: " Kein Preis geht an Amazon. Dieser Rat wird gelesen, nicht gesendet.",
  rpRf_f_garder: (p) => `${p} behalten`, rpRf_f_garderPl: ", Ihr Mindestpreis: eine rentable Wahl.", rpRf_f_remonte: "Steigt das empfohlene Angebot wieder, schlägt eine neue Berechnung eine Erhöhung vor, zur Freigabe.", rpRf_f_min: (n) => `Oder das Minimum der Regel senken (${n} Angebot${n > 1 ? "e" : ""}).`,
  rpRf_vdr: "Verkäufer der Seite", rpRf_mInc: "Berechtigung unbekannt", rpRf_mBientot: "Bald verfügbar", rpRf_mSecu: "Simulation · Senden noch nicht freigegeben", rpRf_deux: (a, b) => `${a}: ${b}`, rpRf_vdL: (l) => `Verkäufer ${l}`, rpRf_autreV: "einem anderen Verkäufer", rpRf_autreVM: "Ein anderer Verkäufer", rpRf_nOffres: (n) => `${n} Angebot${n > 1 ? "e" : ""}`, rpRf_expA: " (Versand durch Amazon)", rpRf_expV: " (Versand durch Sie)", rpRf_vdrInc: "Erhebung unbekannt", rpRf_hist: "Preisverlauf",
  rpRe_videT: "Kein Angebot folgt dem Repricer", rpRe_videD: "Der Repricer setzt Ihren Preis gegenüber den anderen Verkäufern derselben Amazon-Angebotsseite, um das empfohlene Angebot zu halten. Zwei Schritte bis zu Ihren ersten Empfehlungen.",
  rpRe_e_1: "Regel", rpRe_e_1d: "Abstand und Grenzen", rpRe_e_1a: "Regel erstellen", rpRe_e_2: "Angebote", rpRe_e_2d: "Regel anwenden", rpRe_videB: "Die Verkäufer jeder Angebotsseite werden bei Amazon ausgelesen: sonst nichts zu wählen.",
  rpC_simulation: "Simulation", rpRzK_offre_vedette_perdue_prix_vise: "Zum Preis des empfohlenen Angebots", rpRzK_offre_vedette_perdue_prix_vise_plafond: "Am Höchstpreis, unter dem empfohlenen Angebot",
  rpRzK_hausse_vers_vendeur_suivant: "Optionale Erhöhung", rpRzK_hausse_vers_vendeur_suivant_plafond: "Optionale Erhöhung", rpRzK_hausse_vers_vendeur_suivant_limite_24h: "Optionale Erhöhung",
  rpSpF_rien: "Nichts zu tun", rpSpF_aCompleter: "Einrichtung abschließen", rpSpF_sansTxt: (n, p) => `${n} Angebot${n > 1 ? "e" : ""}, Preis beibehalten${p ? `: ${p}` : ""}`, rpSpF_dVise: (n) => `${n} beim Zielpreis`,
  rpSpFcD: "Preis nicht berechenbar", rpSpFcD_cout_inconnu: "Preis ohne diese Kosten nicht berechenbar", rpSpFcD_bornes_en_conflit: "Preis mit diesen Grenzen nicht berechenbar",
  rpK5_aria: "Preise im Vergleich zum Zielpreis", rpK5_offres: "Angebote", rpK5_vise: "Beim Zielpreis", rpK5_ajuster: "Anzupassen", rpK5_plancher: "Am Mindestpreis", rpK5_nonCalc: "Nicht berechenbar",
  rpK5_aFaire: "Zu tun:", rpK5_env: (n) => `${n} Übermittlung${n > 1 ? "en" : ""} zu prüfen`, rpK5_prix: (n) => `${n} Preis${n > 1 ? "e" : ""} zu bestätigen`, rpK5_conf: (n) => `${n} Einrichtung${n > 1 ? "en" : ""} abzuschließen`,
  rpK5_pos: (n) => `Ihre Preise im Vergleich zum Zielpreis, bei ${n} Angebot${n > 1 ? "en" : ""}`, rpSl_thVar: "Änderung", rpSl_thRaison: "Grund", rpSl_thCtb: "Beitrag*",
  rpSl_ctbNote: "* Geschätzter Beitrag pro Verkauf, netto, vor Werbung, zum vorgeschlagenen Preis.", rpSl_sku: (s) => `SKU: ${s}`, rpSl_skuInc: "SKU unbekannt", rpSp_apres: (n) => `Nach Schritt ${n}`,
  rpRzK_sous_le_plancher: "Auf den Mindestpreis anheben", rpRzK_au_dessus_du_plafond: "Auf den Höchstpreis senken", rpRzK_prix_actuel_non_admissible: "In die Regel zurückführen", rpRzK_cible_concurrents: "Auf dem Ziel", rpRzK_cible_concurrents_plancher: "Ziel unter dem Mindestpreis", rpRzK_cible_concurrents_plafond: "Ziel über dem Höchstpreis", rpRzK_cible_concurrents_hors_regle: "Ziel außerhalb der Regel", rpRzK_cible_concurrents_non_estimable: "Nächster erlaubter Preis", rpRzK_buy_box_perdue_prix_a_viser: "An das hervorgehobene Angebot angepasst",
  rpRzQ: (e, s, c) => { const a = { moins_cher: "dem günstigsten", mediane: "dem Median", choisi: "dem gewählten Wettbewerber" }[c]; return !a ? null : s < 0 ? `${e} unter ${a}` : s > 0 ? `${e} über ${a}` : `Zum Preis von ${a}`; }, rpSpF_dSansPl: (n) => `${n} ohne bekannten Mindestpreis`, rpSpF_dSansPrix: (n) => `${n} ohne gelesenen aktuellen Preis`,
  rpSl_envoi: "Senden zu prüfen", rpSl_envT: "Ergebnis von Amazon nicht bestätigt", rpSl_envD: (a) => `Angefragt ${a}`, rpSl_envL: (a) => `Bei Amazon erneut gelesen ${a}`,
  rpSl_verifier: "Prüfen", rpSl_ec: (s, v) => `${s}${v} %`, rpSl_barre: "Angebote, deren Regel SmartPrice folgt",
  rpSl_voirRe: (n) => `${n === 1 ? "Das Repricer-Angebot" : `Die ${n} Repricer-Angebote`} ansehen`, rpSl_voirReC: (n) => `${n} Repricer-${n === 1 ? "Angebot" : "Angebote"}`, rpSpTh_regle: "Regel",
  rpSpTh_prix: "Aktueller Preis", rpSpTh_sit: "Aktuelle Lage", rpSpTh_conseil: "Vorgeschlagener Preis", rpSl_aff: (a, b) => `${a} von ${b} angezeigt`, rpSl_suiv: "Weitere",
  rpSl_auj: (s) => `Heute: ${s}`, rpSl_trier: "Sortieren", rpSl_sousPl: "Unter der Untergrenze",
  rpSd_refAria: "Referenz", rpSd_mediane: "dem Median", rpSd_pct: (v) => `${v}\u00a0%`, rpSd_sous: (e, n) => `${e} unter ${n}`, rpSd_dessus: (e, n) => `${e} über ${n}`, rpSd_egal: (n) => `Zum Preis von ${n}`,
  rpSd_ilYa: (a) => `vor ${a}`, rpSd_sousPl: (m) => `Aktueller Preis ${m} unter der Untergrenze.`, rpSd_remonte: (p, c, pl) => `${p} ergäbe ${c}: der Vorschlag steigt auf die Untergrenze, ${pl}.`,
  rpSd_cz_moins_cher: (p, n) => (n ? `${p}, dem günstigsten von ${n} vergleichbaren Wettbewerbern mit bekanntem Preis.` : `${p}, dem günstigsten der vergleichbaren Wettbewerber.`),
  rpSd_cz_mediane: (p, n) => (n ? `${p} von ${n} vergleichbaren Wettbewerbern mit bekanntem Preis.` : `${p} der vergleichbaren Wettbewerber.`), rpSd_cz_choisi: (p) => `${p}, dem gewählten Wettbewerber.`,
  rpSd_ctb: "Deckungsbeitrag pro Verkauf", rpSd_ctbD: "netto, vor Werbung", rpSd_seuilPlus: (n) => `Sie verdienen gleich viel, wenn der Absatz um ${n}\u00a0% steigt.`, rpSd_seuilMoins: (n) => `Sie verdienen gleich viel, auch wenn der Absatz um ${n}\u00a0% sinkt.`,
  rpSd_recapT: "Diesen Preis an Amazon senden?", rpSd_recapSous: "vor dem Senden an Amazon", rpSd_pays: "Land", rpSd_prixDem: "Angefragter Preis", rpSd_regle: "Regel", rpSd_envoyer: (p) => `${p} an Amazon senden`, rpSd_retour: "Zurück",
  rpSd_recapNote: "Die Bestätigungsleiste fragt danach eine letzte Freigabe ab. Nach dem Senden liest GTINPilot den von Amazon angezeigten Preis erneut; solange er nicht bestätigt ist, bleibt das Angebot unter „Sendung prüfen“.",
  rpSd_coutT: "Einkaufskosten pro Einheit", rpSd_coutP: "Sie werden nur an einer Stelle erfasst: auf der Seite der Einkaufskosten.", rpSd_coutLien: "Einkaufskosten erfassen", rpSd_aussi: (p) => `auch blockiert in ${p}`,
  rpSd_pub: "Werbung", rpSd_pubV: (m) => `${m} pro Verkauf`, rpSd_pubNon: "nicht gemessen", rpSd_nonCalc: "nicht berechnet", rpSd_ramene: "Lieferpreis, in Ihrem Format",
  rpF_aValider: "Zu bestätigen", rpF_conseils: "Empfehlungen", rpF_aDebloquer: "Zu lösen", rpF_sans: "Ohne Änderung", rpF_examiner: "Prüfen", rpF_voir: "Ansehen",
  rpF_saisirCout: "Kosten erfassen", rpF_modifRegle: "Regel ändern", rpF_toutVoir: "Alle ansehen", rpF_nOffres: (n) => `${n} Angebot${n > 1 ? "e" : ""}`,
  rpF_sansTxt: (n, p) => `${n} Angebot${n > 1 ? "e" : ""}${p ? `, davon ${p}` : ""}`, rpF_dPl: (n) => `${n} an der Untergrenze`, rpF_dPromo: (n) => `${n} in Aktion`,
  rpF_dStock: (n) => `${n} ohne verkaufbaren Bestand`, rpF_rien: "Nichts zu entscheiden", rpF_derniere: "Letzte Änderung", rpF_prochaines: "Die nächsten Entscheidungen erscheinen hier.",
  rpF_dIgn: (n) => `${n} ignoriert`, rpF_ignores: "Ignorierte Empfehlungen", rpD_ignorer: "Diese Empfehlung ignorieren", rpD_ignLe: (d) => `Empfehlung am ${d} ignoriert`,
  rpD_ignRevient: "Sie kehrt in die Liste zurück, wenn sich die Lage ändert.", rpD_ignRet: "Nicht mehr ignorieren", rpD_ignOk: (h) => `Empfehlung ignoriert (Berechnung von ${h})`,
  rpD_ignNouveau: "Die Lage hat sich geändert: Die Empfehlung ist weiter zu prüfen.", rpD_ignRelErr: "Gespeichert; erneutes Lesen nicht möglich: Seite neu laden.", rpD_ignRetEncore: "Die Empfehlung wird weiterhin ignoriert: Seite neu laden.", rpD_ignRetOk: "Die Empfehlung wird nicht mehr ignoriert.",
  rpD_ignIll: "Liste der ignorierten Empfehlungen unlesbar: „Ignorieren“ ist nicht verfügbar.", rpD_ignErr: (m) => `Nicht gespeichert: ${m}`, rpD_ignBusy: "Wird gespeichert…",
  rpFc_envoi_non_confirme: "Senden nicht bestätigt", rpFc_envoi_refuse: "Senden abgelehnt", rpFc_refuse_amazon: "Von Amazon abgelehnt", rpFc_cout_inconnu: "Einkaufskosten unbekannt",
  rpFc_bornes_en_conflit: "Grenzen im Konflikt", rpFc_frais_inconnus: "Amazon-Gebühren unbekannt", rpFc_sans_prix: "Aktueller Preis unbekannt oder Erfassung zu alt", rpFc_aucun: "Nie berechnet",
  rpFc_bloque: "Blockiert", rpFc_situation_changee: "Lage seit der Berechnung geändert",
  rpD_regle: (n) => `Regel ${n}`, rpD_conseille: "Empfohlen", rpD_actuel: "Aktueller Preis", rpD_releve: (a) => `erfasst vor ${a}`, rpD_plancher: "Untergrenze", rpD_plafond: "Obergrenze",
  rpD_sousPl: "unter der Untergrenze", rpD_dessusPf: "über der Obergrenze", rpD_valider: (p) => `${p} bestätigen`, rpD_recap: "Vor dem Senden an Amazon öffnet sich eine Übersicht.",
  rpD_simu: "Simulation: Kein Preis geht an Amazon. Diese Empfehlung ist lesbar, nicht sendbar.", rpD_benef: (p) => `Gewinn pro Verkauf bei ${p}`, rpD_calcPl: "Berechnung der Untergrenze",
  rpD_calcPlD: "Niedrigster Preis des Amazon-Rasters, der die Regel erfüllt (Gewinn, Marge, Kapitalrendite), mit den bei diesem Preis geschätzten Gebühren.",
  rpD_sitChg: (h) => `Lage seit der Berechnung von ${h} geändert`, rpD_sitRegle: "Die Regel hat sich seit dieser Berechnung geändert.", rpD_sitPrixAct: (p) => `Seitdem erfasster aktueller Preis: ${p}.`,
  rpD_sitPrix: (p) => `Bei Amazon gelesener Preis: ${p}. Nichts wurde vorgeschlagen.`, rpD_prochain: "Neue Empfehlung bei der nächsten Berechnung.", rpD_limChg: (h) => `Grenzen seit der Berechnung von ${h} geändert`,
  rpD_nonCalc: "Preis nicht berechenbar", rpD_coutPl: "Einkaufskosten unbekannt: Die Untergrenze kann nicht berechnet werden.", rpD_coutEst: "Geschätzte Kosten",
  rpD_estDe: (j) => `nach der vorigen bestätigten Charge · Eingang am ${j}`, rpD_aConfirmer: "Im Tab COGS zu bestätigen", rpD_ouvrirCogs: "COGS öffnen", rpD_coutND: "Kosten nicht bestimmbar",
  rpD_coutR_change_absent: "Wechselkurs des Eingangstags fehlt", rpD_coutR_sans_jour: "Eingang ohne Datum", rpD_coutR_autre_zone_seulement: "bestätigte Chargen nur in einer anderen Zone",
  rpD_coutR_aucun_lot_avant: "keine bestätigte Charge vor diesem Eingang", rpD_coutR_egalite_ambigue: "mehrere verschiedene Kosten am selben Tag",
  rpD_coutR_aucune_estimation: "keine Schätzung für dieses Produkt in dieser Zone", rpD_coutR_aucune_reception: "kein Eingang dieses Produkts in dieser Zone", rpD_coutR_zone_inconnue: "Lagerzone des Landes unbekannt",
  rpD_envAttente: "Wartet auf Bestätigung", rpD_env_PENDING: "Vorschlag bereit: Die Leiste „Bestätigen“ unten sendet ihn nach ihrer Übersicht.",
  rpD_env_EN_COURS: "Senden läuft: kein neues Senden, bis das Ergebnis bekannt ist.", rpD_attente: "Die Empfehlung wird neu berechnet; bis dahin wird aus dieser Empfehlung nichts gesendet.", rpP_envBloque: "Senden für dieses Angebot nicht bestätigt: kein neues Senden von hier, bis das Ergebnis bekannt ist (Tab Entscheidungen).",
  rpD_env_UNKNOWN: "Ergebnis bei Amazon unbekannt: kein neues Senden aus dieser Ansicht. Preis in Seller Central prüfen.", rpD_motif: "Grund", rpD_motifNC: "Grund nicht mitgeteilt",
  rpD_envRetour: "Nach der nächsten Berechnung erscheint eine neue Empfehlung.",
  rpMo_VALUE_CHANGED: "Preis oder Grenzen bei Amazon seit dem Vorschlag geändert (Seller Central)", rpMo_RULE_CHANGED: "die Preisregel hat sich seit dem Vorschlag geändert: bitte erneut vorschlagen. Es wurde nichts gesendet.", rpMo_RULE_UNVERIFIABLE: "die Preisregel konnte nicht geprüft werden: bitte erneut vorschlagen. Es wurde nichts gesendet.", rpMo_UNSUPPORTED_DISCOUNT: "bei Amazon ist ein geplanter Angebotspreis vorhanden",
  rpMo_UNSUPPORTED_OFFER: "Angebot nicht unterstützt", rpMo_PREVIEW_INVALID: "Vorschau von Amazon abgelehnt", rpMo_PREVIEW_FAILED: "Vorschau bei Amazon nicht möglich", rpMo_FROZEN: "Senden für dieses Konto gesperrt",
  rpMo_TOO_SLOW: "Senden zu langsam, vor dem Absenden gestoppt", rpMo_TOKEN_FAILED: "Amazon-Zugang nicht verfügbar", rpMo_READ_FAILED: "Preis bei Amazon nicht lesbar", rpMo_OFFER_BUSY: "ein anderer Preis wurde gerade gesendet",
  rpMo_CURRENCY: "Währung des Angebots abweichend", rpMo_NO_PRODUCT_TYPE: "Produkttyp fehlt im Listing", rpMo_INVALID: "Anfrage von Amazon als ungültig bewertet", rpMo_http: (c) => `Amazon hat die Anfrage abgelehnt (HTTP ${c})`,
  rpRz_sous_le_plancher: "Aktueller Preis unter der Untergrenze", rpRz_au_dessus_du_plafond: "Aktueller Preis über der Obergrenze", rpRz_prix_actuel_non_admissible: "Aktueller Preis außerhalb der Regel: auf den nächsten erlaubten Preis gesetzt",
  rpRz_buy_box_perdue_prix_a_viser: "Empfohlenes Angebot verloren: Preis an das empfohlene Angebot angeglichen", rpRz_seule_offre: "Einziges Angebot im Listing: Preis beibehalten", rpRz_buy_box_detenue: "Empfohlenes Angebot gehalten: Preis beibehalten",
  rpRz_buy_box_perdue_sans_prix_a_viser: "Empfohlenes Angebot verloren, kein Zielpreis erfasst", rpRz_deja_au_prix_vise: "Bereits beim Zielpreis", rpRz_promotion_en_cours: "Aktion läuft: Empfehlung pausiert",
  rpRz_non_achetable: "Kein verkaufbarer Bestand", rpRz_aucun_prix_admissible: "Kein Preis erfüllt alle Grenzen der Regel",
  rpRzF: (f, e) => `${f}: ${e}`, rpRzF_releve_prix: "Erfassung unseres Preises", rpRzF_prix_actuel: "Aktueller Preis", rpRzF_stock: "Bestandserfassung", rpRzF_promotions: "Erfassung der Aktionen",
  rpRzF_cout_achat: "Einkaufskosten", rpRzF_frais_prix_actuel: "Amazon-Gebühren zum aktuellen Preis", rpRzE_absent: "fehlt", rpRzE_perime: "zu alt", rpRzE_invalide: "nicht lesbar", rpRzE_inconnu: "unbekannt",
  rpRz_concurrents_parametres_absents: "Gegenüber Wettbewerbern: kein Ziel in der Regel gesetzt", rpRz_concurrents_choisi_absent: "Gegenüber Wettbewerbern: gewählter Wettbewerber nicht in der Liste", rpRz_concurrents_choisi_exclu: "Gegenüber Wettbewerbern: gewählter Wettbewerber von der Berechnung ausgeschlossen", rpRz_concurrents_aucun_prix_admissible: "Gegenüber Wettbewerbern: kein verwendbarer Wettbewerberpreis", rpRz_concurrents_couverture_insuffisante: "Gegenüber Wettbewerbern: zu wenige aktuelle Preise für ein Ergebnis", rpRz_concurrents_mediane_moins_de_2_prix: "Gegenüber Wettbewerbern: weniger als 2 Preise für einen Median",
  rpRz_cible_concurrents: "Gegenüber Wettbewerbern: Preis auf das Ziel gesetzt", rpRz_cible_concurrents_plancher: "Gegenüber Wettbewerbern: Ziel unter der Untergrenze, Preis an der Untergrenze", rpRz_cible_concurrents_plafond: "Gegenüber Wettbewerbern: Ziel über der Obergrenze, Preis an der Obergrenze", rpRz_deja_a_la_cible_concurrents: "Gegenüber Wettbewerbern: bereits beim Ziel", rpRz_deja_a_la_cible_concurrents_plancher: "Gegenüber Wettbewerbern: bereits an der Untergrenze (niedrigeres Ziel)", rpRz_deja_a_la_cible_concurrents_plafond: "Gegenüber Wettbewerbern: bereits an der Obergrenze (höheres Ziel)", rpRz_cible_concurrents_hors_regle: "Gegenüber Wettbewerbern: Ziel von der Regel nicht erlaubt, nächster erlaubter Preis auf der Seite des Ziels", rpRz_deja_au_prix_autorise_concurrents: "Gegenüber Wettbewerbern: Ziel von der Regel nicht erlaubt, bereits beim nächsten erlaubten Preis auf der Seite des Ziels", rpRz_cible_concurrents_non_estimable: "Gegenüber Wettbewerbern: centgenauer Preis nicht berechenbar, nächster erlaubter Preis auf der Seite des Ziels", rpRz_deja_au_prix_grille_concurrents: "Gegenüber Wettbewerbern: centgenauer Preis nicht berechenbar, bereits beim nächsten erlaubten Preis auf der Seite des Ziels", rpRz_ecart_sous_minimum_concurrents: "Gegenüber Wettbewerbern: Ziel zu nah am aktuellen Preis, Preis beibehalten",
  rpRzN: (e) => `Gegenüber Wettbewerbern: unser Angebot, ${e}`, rpRzC_offre_invalide: "fehlerhafte Erfassung", rpRzC_etat_inconnu: "Artikelzustand unbekannt", rpRzC_expedition_inconnue: "Versandart unbekannt", rpRzC_heure_inconnue: "Zeitpunkt der Erfassung unbekannt", rpRzC_donnee_future: "Zeitpunkt der Erfassung in der Zukunft", rpRzC_donnee_perimee: "Erfassung zu alt", rpRzC_port_inconnu: "Versandkosten unbekannt", rpRzC_total_incoherent: "Lieferpreis widersprüchlich", rpRzC_port_incoherent: "Versandkosten widersprüchlich",
  rpCo_pli: "Wettbewerber", rpCo_nSurM: (n, m) => `${n} vergleichbar von ${m}`, rpCo_indispo: "Liste nicht verfügbar", rpCo_aucunCourt: "keine", rpCo_indispoD: "Wettbewerberliste nicht verfügbar: Der Stand der Beobachtung konnte nicht gelesen werden. Nichts wurde geändert.", rpCo_etat: (n, max) => `${n} verfolgt · höchstens ${max}`, rpCo_aucun: "Kein Wettbewerber für dieses Produkt in diesem Land verfolgt. Unten einen hinzufügen oder in der Beobachtung wählen.", rpCo_sansPrix: "Preis nicht erfasst", rpCo_parUnite: (p) => `${p}/Stück`, rpCo_lotDe: (n, p) => `${n}er-Pack: ${p}`, rpCo_releveIlYa: (a) => `erfasst vor ${a}`, rpCo_sansOffre: (a) => `kein Empfohlenes Angebot bei der letzten Erfassung (vor ${a}), nicht in der Berechnung`, rpCo_dernierConnu: (p, a) => `letzter bekannter Preis ${p}, vor ${a}`, rpCo_perime: (h) => `veraltet (über ${h} Std.), nicht in der Berechnung`, rpCo_photo: (a) => `Angebote vor ${a} erfasst`, rpCo_format: "Stück pro Pack", rpCo_fmtOk: "Format speichern", rpCo_retirer: "Für dieses Produkt entfernen", rpCo_aDeclarer: "Anzugeben · nicht gerechnet", rpCo_cmp: "Vergleichbar", rpCo_cmpLot: (n) => `Vergleichbar · ${n}er-Pack`, rpCo_hors: "Nicht gerechnet", rpCo_srcManuel: "Von Hand hinzugefügt", rpCo_srcVeille: "Beobachtung", rpCo_actions: "Aktionen für diesen Wettbewerber", rpCo_ajouter: "Wettbewerber hinzufügen", rpCo_ph: "ASIN oder Amazon-Link", rpCo_ajouterBtn: "Hinzufügen", rpCo_veille: "In der Beobachtung wählen", rpCo_note: "Preis: zuletzt erfasster Preis des Empfohlenen Angebots, inkl. Versand, mit seinem Alter; nach 2 Std. ist er veraltet und zählt nicht mehr zur Berechnung. Ohne Empfohlenes Angebot bei der letzten Erfassung zählt er ebenfalls nicht. Ein nicht gerechneter Wettbewerber bleibt beobachtet. Bei Amazon ändert sich nichts.", rpCo_okAjout: "Wettbewerber hinzugefügt.", rpCo_okFmt: "Format gespeichert.", rpCo_okRet: "Wettbewerber für dieses Produkt entfernt.", rpCo_okCmp: "In der Berechnung gezählt.", rpCo_okHors: "Nicht gerechnet, weiter beobachtet.", rpCo_errMax: "Abgelehnt: höchstens 10 verfolgte Wettbewerber pro Produkt und Land (oder 100 Hinzufügungen). Nichts wurde geschrieben.", rpCo_errNonSuivi: "Abgelehnt: Dieser Wettbewerber wird für dieses Produkt nicht mehr verfolgt. Nichts wurde geschrieben.", rpCo_err: "Speichern fehlgeschlagen. Nichts wurde geschrieben.", rpCo_errAsin: "Ungültige ASIN: 10 Buchstaben oder Ziffern oder ein Amazon-Produktlink.", rpCo_errFmt: "Ungültiges Format: eine ganze Zahl von 1 bis 100.",
});
Object.assign(I18N.it, { t1pPrice: "Repricer", rpTitle: "Repricer", t1pSmart: "SmartPrice", rpSp_videT: "Nessuna offerta segue SmartPrice", rpSp_videD: "SmartPrice colloca il prezzo del suo marchio rispetto a prodotti concorrenti che sceglie lei. Tre passi, in ordine, per attivarlo.", rpSp_aria: "Tre passi per attivare SmartPrice", rpSp_e_1: "Regola", rpSp_e_1d: "scarto e limiti", rpSp_e_1a: "Crea una regola", rpSp_e_2: "Offerte", rpSp_e_2d: "applicare la regola", rpSp_e_3: "Concorrenti", rpSp_e_3d: "per offerta e per paese",
  rpCrumb: "Prodotti", rpLvl_ombre: "Simulazione", rpLvl_propose: "Invio dopo convalida", rpLvl_auto: "Automatico",
  rpLvlAria: "Livello del repricer", rpLvlTip: "Livello dell'account: Simulazione finché il blocco prezzi è chiuso (nessun prezzo inviato ad Amazon), Invio dopo convalida quando è aperto. Automatico non esiste ancora.", rpLvlUnk: "Livello sconosciuto: blocco prezzi non letto.", rpEtatN: (s, n) => `${s} ${n === 1 ? "offerta" : "offerte"}`, rpRe_c_expl: (s, n) => `${s} utilizzabil${n === 1 ? "e" : "i"}`, rpRe_c_bloq: (s, n) => `${s} bloccat${n === 1 ? "a" : "e"}`, rpRe_c_inact: (s, n) => `${s} inattiv${n === 1 ? "a" : "e"}`, rpRe_c_nonAch: (s, n) => `${s} non acquistabil${n === 1 ? "e" : "i"}`, rpRe_c_nonConf: (s, n) => `${s} non confermat${n === 1 ? "a" : "e"}`, rpRe_c_sansOffre: (s) => `${s} senza una sua offerta`, rpRe_c_ecart: (s, n) => `${s} nascost${n === 1 ? "a" : "e"} o disattivat${n === 1 ? "a" : "e"}`, rpRe_decTip: "Utilizzabili: prezzo rilevato, calcolo possibile. Bloccate: seguite, ma manca un dato per il calcolo (costo, commissioni, limiti). Inattive: inserzione inattiva su Amazon. Senza una sua offerta: la scheda esiste in questo paese, senza inserzione né prezzo suoi. Non acquistabili: inserzione attiva, ma nessuna offerta acquistabile rilevata o nessuno stock vendibile. Non confermate: prezzo rilevato, ma inserzione assente dal report delle inserzioni. Nascoste o disattivate: da lei. Tutte sono elencate in «Tutte le offerte».", rpRe_mode: "Modalità:", rpEtatCalc: (h) => `calcolato alle ${h}`,
  rpFPays: "Paese", rpFSit: "Situazione", rpFAll: "Tutti", rpFAllF: "Tutte", rpTabConseils: "Azioni", rpTabTous: "Tutte le offerte", rpTabJournal: "Registro", rpTabRegles: "Regole",
  rpTabsCount: (p, c) => `${p} prodott${p === 1 ? "o" : "i"} · ${c} paes${c === 1 ? "e" : "i"}`, rpSoon: "Prossimo lotto",
  rpTh_prod: "Prodotto", rpTh_pays: "Paese", rpTh_prix: "Prezzo", rpTh_conseil: "Consiglio",
  rpC_garder: "Mantenere", rpC_pause_promo: "In pausa · promo", rpC_cout_inconnu: "Costo sconosciuto", rpC_bornes_en_conflit: "Limiti in conflitto", rpC_frais_inconnus: "Commissioni sconosciute",
  rpC_sans_prix: "Prezzo non rilevato", rpC_bloque: "Bloccato", rpC_aucun: "Ancora nessun consiglio", rpC_desactive: "Disattivato", rpC_aValider: "da convalidare",
  rpErr: "Non disponibile.", rpNone: "Nessun prodotto venduto negli ultimi 7 giorni.", rpNoneFiltre: "Nessuna riga per questi filtri.",
  rpP_perdue: (d, n) => `offerta in evidenza persa dal ${d} · ${n} venditori`, rpP_perdueX: "offerta in evidenza persa", rpP_detenue: (n) => `offerta in evidenza detenuta · ${n} venditori`,
  rpP_seul: "unico venditore · nessun'altra offerta", rpP_inconnue: "offerta in evidenza: situazione sconosciuta", rpP_sans_offre: "nessuna offerta attiva", rpP_close: "Chiudi",
  rpSim: "Simulazione", rpSimTest: "Prova un altro prezzo", rpSimPrix: "prezzo testato", rpSimPlancher: "minimo", rpSimPlafond: "massimo", rpSimAttendu: "atteso", rpSimAttNon: "non rilevato", rpSimAttSeul: "nessun concorrente",
  rpL_ttc: "Prezzo IVA inclusa", rpL_tva: (p) => `IVA ${p}`, rpL_tvaX: "IVA", rpL_frais: "Commissioni Amazon a questo prezzo", rpL_cout: "Costo d'acquisto (media dello stock residuo)", rpL_coutProv: "provvisorio",
  rpL_pub: "Pubblicità per unità", rpL_pubNon: "non calcolata", rpL_ben: "Utile per unità", rpL_benAv: "prima della pubblicità", rpL_acos: "ACOS di pareggio", rpL_ench: "Offerta di pareggio",
  rpL_enchAu: "Offerte superiori", rpL_inconnu: "sconosciuto", rpL_nonReleve: "non rilevato", rpL_pxInactive: "inserzione inattiva", rpL_pxSansOffre: "nessuna sua offerta", rpL_pxNonLu: "report delle inserzioni non ancora letto", rpL_pxFiche: "prezzo della scheda, SKU non identificato", rpL_pxConf: (p, d) => `Prezzo impostato: ${p} (report inserzioni, ${d})`, rpRe_c_nonLu: (s) => `${s} da verificare (inserzioni non lette)`, rpL_pxNonAch: "nessuna offerta acquistabile rilevata", rpL_avant: "Prima", rpL_parU: "/ unità", rpL_vjPerte: "Vendite / giorno prima della perdita",
  rpL_vj: "Vendite / giorno", rpL_vjCumul: "Vendite / giorno cumulate (tutti i riferimenti del prodotto)", rpL_moy14: "media 14 giorni", rpE_attente: "In attesa di convalida", rpE_conseil: (p) => `Consiglio: ${p}`, rpProposer: "Proponi questo prezzo",
  rpPropBusy: "Invio…", rpPropGele: "Blocco prezzi chiuso: nessun prezzo può essere inviato ad Amazon.", rpPropErr: (m) => `Non proposto: ${m}`, rpPropSousMarge: "Prezzo sotto il margine minimo: appare in rosso nella barra in basso e parte solo dopo «Ignora il margine».", rpPropRelu: (p) => `Prezzo letto su Amazon: ${p}`,
  rpDetErr: "Dettaglio non disponibile.", rpGrilleVide: "Nessun prezzo stimato da Amazon per questo prodotto.",
  rpJErr: "Registro non disponibile.", rpJ_vide: "Nessuna voce negli ultimi 30 giorni.", rpJ_th_date: "Data", rpJ_th_evt: "Evento", rpJ_cpt: (n) => `${n} rilevazione/i senza modifiche (al massimo una al giorno per prodotto, tutti i paesi)`, rpJ_cout: "Costo d'acquisto (congelato)", rpJ_estime: "(stimato)", rpJ_roi: "Ritorno sul costo", rpJ_marge: "Margine", rpJ_bb: "Offerta in evidenza", rpJ_bbOui: "detenuta", rpJ_bbNon: "non detenuta", rpJ_bornes: "Minimo / massimo", rpJ_bas: "Prezzo più basso Prime / non Prime", rpJ_raison: "Motivo", rpJ_fige: "Congelato il", rpJ_nonFige: "Proposta precedente alle istantanee: economia non congelata.", rpJ_regleNonFigee: "regola non congelata", rpJ_voir: "Mostra dettagli", rpJ_auPa: (p) => `Al prezzo attuale (${p})`, rpJ_auPaC: "al prezzo attuale", rpJ_contrib: "Contribuzione", rpJ_nonEnr: "non registrato", rpJ_indispo0: "non disponibile", rpJ_causes: "Cause", rpJ_consq: "Conseguenza", rpJ_consqV: (v) => `${v}: non disponibili`, rpJ_filS: (s, n) => `Offerte seguite dal Repricer · ${s} ${n === 1 ? "voce" : "voci"} di altre offerte nascost${n === 1 ? "a" : "e"}`, rpJ_filT: "Tutta la cronologia", rpJ_voirTout: "Mostra tutta la cronologia", rpJ_voirSuiv: "Torna alle offerte seguite", rpJA_prix_inconnu: "prezzo non rilevato", rpJA_frais_absents: "commissioni Amazon mancanti", rpJA_cout_achat_absent: "costo d'acquisto mancante",
  rpJ_ombre: "Consiglio (simulazione)", rpJ_prop: "Proposta di prezzo", rpJ_via_barre: "barra", rpJ_via_mcp: "MCP",
  rpJ_St_PENDING: "In attesa", rpJ_St_CONFIRMED: "Confermato", rpJ_St_SENDING: "Invio in corso", rpJ_St_APPLIED: "Applicato", rpJ_St_NOT_APPLIED: "Non applicato",
  rpJ_St_REFUSED: "Rifiutato", rpJ_St_CANCELLED: "Annullato", rpJ_St_EXPIRED: "Scaduto", rpJ_St_UNKNOWN: "Esito sconosciuto",
  rpR_def: "Predefinita (account)", rpR_defNone: "Nessuna regola predefinita: nessun consiglio calcolato.", rpR_src: "Regola", rpR_propre: "Propria", rpR_defaut: "predefinita",
  rpR_margeMin: "Margine minimo", rpR_roiMin: "Ritorno sul costo minimo", rpR_profitMin: "Profitto minimo / unità", rpR_margeMax: "Margine massimo", rpR_mode: "Modalità",
  rpR_mode_tous: "Tutti i minimi", rpR_mode_au_moins_un: "Almeno uno", rpR_revenir: "Torna alla predefinita", rpR_garder: "Mantieni la propria", rpR_auDefaut: "→ predefinita",
  rpR_sansSku: "senza SKU venditore", rpR_n: (n) => `${n} regola/e modificata/e`, rpR_ou: "in GTINPilot, nulla inviato ad Amazon", rpR_cancel: "Annulla", rpR_save: "Salva",
  rpR_busy: "Salvataggio…", rpR_ok: "Salvato · consigli al prossimo calcolo", rpR_ko: (m) => `Non salvato: ${m}`,
  rpR_e_champ: (w) => `${w}: numero > 0 atteso`, rpR_e_vide: (w) => `${w}: almeno un minimo (margine, ritorno sul costo o profitto)`,
  rpR_e_maxi: (w) => `${w}: margine massimo ≤ margine minimo`, rpR_e_trop: () => "Al massimo 50 regole per salvataggio",
  rpTh_situation: "Situazione", rpTh_situationTip: "Posizione attuale dell'offerta. La colonna Consiglio indica il prezzo da raggiungere: le due etichette differiscono di proposito.",
  rpTh_ventes: "Vendite 30 g", rpTh_ventesTip: "Unità vendute negli ultimi 30 giorni, escluso Vine (Vine a parte): stesso calcolo della pagina Vendite (giorno dell'account, ordini annullati esclusi).",
  rpSit_seul_vendeur: "Unico venditore", rpSit_detenue: "Offerta in evidenza detenuta", rpSit_perdue: "Offerta in evidenza persa", rpSit_au_plancher: "Al minimo", rpSit_cout_inconnu: "Costo sconosciuto",
  rpSit_sans_offre: "Nessuna offerta attiva", rpSit_inconnue: "Sconosciuta", rpV_aucune: "Nessun ordine registrato in questo paese", rpV_sansArt: (n) => `${n} ordine/i del paese senza dettaglio articolo: questa cifra è un minimo`, rpV_vine: (n) => `+${n} Vine`, rpV_jours: (n) => `su ${n} g`,
  rpV_tip: (u, j) => `Vendite ${j} g: ${u}`,
  rpPli_inactifs: (n) => `Senza offerta attiva (${n})`, rpPli_inactifsD: "Nessun prezzo rilevato o offerta inattiva su Amazon: niente da consigliare finché l'offerta non vende.",
  rpPli_masques: (n) => `Prodotti nascosti (${n})`, rpPli_masquesD: "Nascosto in Stock › Listings: tolto solo dagli elenchi, sempre seguito.",
  rpPli_desactives: (n) => `Disattivati (${n})`, rpPli_desactivesD: "Disattivato in tutto GTINPilot: il repricer non lo consiglia più. Si riattiva in Stock › Listings.",
  rpNoneActif: "Nessuna offerta in vendita per questi filtri.",rpC_non_achetable: "Non acquistabile · senza stock",
  rpL_pubTip: (a, b) => `spesa pubblicitaria ÷ unità vendute, dal ${a} al ${b}`, rpPubR_rapport_pub_absent: "nessun report pubblicitario per questo paese", rpPubR_rapport_pub_incomplet: "report pubblicitario incompleto su 30 giorni",
  rpPubR_aucune_vente: "nessuna unità venduta in 30 giorni", rpPubR_devise_pub_differente: "spesa pubblicitaria in un'altra valuta", rpPubR_quantite_absente: "quantità assente in un ordine", rpPubR_tables_absentes: "dati assenti",
  rpL_enchN: (n, m) => `${n} offerta/e sopra ${m}`, rpL_ench0: (m) => `nessuna offerta sopra ${m}`,
  rpLb_dateInc: "data sconosciuta", rpLb_voirJournal: "Vedi il registro", rpLb_voirN: (n) => `Vedi i ${n}`, rpLb_horsListe: (n) => `${n} fuori da questa pagina (paesi o prodotti senza rilevazione recente)`, rpEd_e_choix: "Scegliere il valore da mantenere per ogni campo cambiato da entrambe le parti.", rpEd_cflAucunDeux: "Nessun campo è cambiato da entrambe le parti; se ce ne fosse uno, si sceglierebbe qui prima di salvare.", rpEd_cflDeux: "Un campo è cambiato da entrambe le parti: scegliere il valore da mantenere prima di salvare.", rpEd_inchanges: "invariati", rpEd_aChoisir: "da scegliere", rpEd_oIdentiques: "identici", rpPp_calcAvec: (r, a) => `calcolato con ${r} ${a} fa`, rpPp_stale: (r, a) => `Consiglio calcolato con ${r} ${a} fa — ricalcolo al prossimo passaggio`, rpPp_ageMin: (n) => `${n}\u00a0min`, rpPp_ageHM: (h, m) => `${h}\u00a0h\u00a0${String(m).padStart(2, "0")}\u00a0min`, rpPp_ageH: (n) => `${n}\u00a0h`, rpPp_nonNotee: "regola non annotata", rpPp_fxD_conflitAvec: (r) => `: le barriere di ${r} non lasciano alcun prezzo della griglia.`, rpPp_recalcul: "Non è più la regola attuale: ricalcolo al prossimo passaggio.", rpPp_reaffecter: "Riassegna", rpPp_compteNonModif: "regola dell'account: non modificabile qui", rpLb_simT: "Solo simulazione.", rpLb_simD: "Queste regole calcolano raccomandazioni. Non modificano alcun prezzo Amazon.",
  rpLb_ordre: "Ordine:", rpLb_o1: "regola propria del prodotto", rpLb_o2: "regola con nome assegnata", rpLb_o3: "regola dell'account",
  rpLb_titre: "Libreria di regole", rpLb_sous: "Regole riutilizzabili, assegnate per prodotto × paese", rpLb_defs: "Definizioni", rpLb_affecter: "Assegna una regola", rpLb_nouvelle: "Nuova regola",
  rpLb_thRegle: "Regola", rpLb_thBar: "Barriere di prezzo", rpLb_thEcart: "Scarto", rpLb_thAff: "Assegnata a", rpLb_thPays: "Paesi", rpLb_thActs: "Azioni",
  rpLb_compte: "Regola dell'account", rpLb_tagDef: "Predefinita", rpLb_compteD: "si applica a ogni prodotto × paese senza altra regola",
  rpLb_compteAbs: "Nessuna regola dell'account: senza regola con nome o propria, nessuna raccomandazione.",
  rpLb_compteLock: "Non modificabile qui · fissata nella configurazione dell'account, oggi senza schermata",
  rpLb_mini: "Min", rpLb_maxi: "Max", rpLb_sansPlafond: "nessun tetto", rpLb_et: "E", rpLb_ou: "O",
  rpLb_c_profit: "Profitto", rpLb_c_marge: "Margine", rpLb_c_roi: "Ritorno sul costo", rpLb_ecNon: "non impostato", rpLb_ecNonT: "Nessuno scarto impostato: il motore non applica alcuno scarto con questa regola.", rpLb_ecClasserT: "Modo da classificare: il motore non applica alcuno scarto.", rpLb_ecT: "Scarto applicato dal motore per questo modo di puntare.",
  rpLb_pxp: "prodotti × paesi", rpLb_dontApp: (n) => `di cui ${n} applicati`, rpLb_tousPays: "Tutti i paesi", rpLb_nNommees: (n) => `${n} con nome`,
  rpLb_version: (v, le, par) => `versione ${v}${le ? ` · ${le}` : ""}${par ? ` · ${par}` : ""}`,
  rpLb_appliquer: "Applica ovunque", rpLb_modifier: "Modifica", rpLb_dupliquer: "Duplica", rpLb_supprimer: "Elimina", rpLb_supprT: "Elimina (archiviata, recuperabile)",
  rpLb_autres: (nom) => `Altre azioni · ${nom}`, rpLb_copie: (nom) => `${nom} (copia)`,
  rpLb_arch: (n) => `Archiviate (${n})`, rpLb_archD: "recuperabile", rpLb_restaurer: "Ripristina",
  rpLb_s_personnalise: "Personalizzato", rpLb_s_prudent: "Prudente", rpLb_s_equilibre: "Equilibrato", rpLb_s_offensif: "Offensivo", rpLb_s_destockage: "Svendita",
  rpLb_n_prudent: "Margine protetto", rpLb_n_equilibre: "Buy Box equilibrata", rpLb_n_offensif: "Conquista (Q4)", rpLb_n_destockage: "Svendita",
  rpLb_videT: "Nessuna regola con nome", rpLb_videD: (n, p) => `La regola dell'account si applica ai ${n} prodotti × paesi (${p} paesi).`,
  rpLb_videD2: "Una regola con nome si crea una volta e si assegna a più prodotti × paesi; modificarla crea una nuova versione che i suoi prodotti seguono.",
  rpLb_partir: "Parti da questo modello", rpLb_lecture: "Lettura delle regole dell'account…",
  rpLb_errT: "Regole illeggibili", rpLb_errD: "Il file delle regole di questo account non è stato letto. Finché non lo è, nessuna regola è applicata: niente torna in silenzio alla regola dell'account.",
  rpLb_errD2: (d) => `Le raccomandazioni mostrate risalgono all'ultimo calcolo riuscito (${d}) e sono scadute.`, rpLb_reessayer: "Riprova",
  rpLb_lockT: "Scritture disattivate", rpLb_lockD: "finché il file è illeggibile: scrivere su un file illeggibile potrebbe cancellare le regole che contiene.",
  rpLb_detail: "Dettaglio:", rpLb_offT: "Scritture disattivate: file delle regole illeggibile",
  rpLb_apT: (nom, v) => `Applica «${nom}» v${v} ovunque`, rpLb_apBig: "prodotti × paesi cambiano regola",
  rpLb_apNote: (n, p) => `Sui ${n} prodotti × paesi dei ${p} paesi coperti dalla regola. Solo simulazione: nessun prezzo Amazon modificato.`,
  rpLb_apChg: "cambiano regola: la regola con nome diventa effettiva", rpLb_apDeja: (nom) => `già su «${nom}»: invariati`,
  rpLb_apProp: "mantengono la loro regola propria: assegnazione registrata, sostituita dalla regola propria", rpLb_apHors: (p) => `non toccati: ${p}, non coperti dalla regola`,
  rpLb_apSans: "senza SKU venditore: non toccati", rpLb_rien: (nom) => `Niente da cambiare: tutti i prodotti × paesi coperti sono già su «${nom}».`,
  rpLb_resOk: (n) => `${n} prodotto/i × paese assegnato/i · solo simulazione, niente su Amazon.`,
  rpLb_resPart: (ok, tot, ko) => `${ok} assegnati su ${tot} · ${ko} non assegnati`, rpLb_resPartD: "le altre assegnazioni sono registrate.",
  rpLb_r_CONFLIT: "assegnazione modificata nel frattempo; nulla è cambiato per questo prodotto", rpLb_r_PAYS_NON_COUVERT: "paese non coperto dalla regola; nulla è cambiato per questo prodotto",
  rpLb_r_ARCHIVEE: "regola archiviata nel frattempo; nulla è cambiato per questo prodotto", rpLb_r_INTROUVABLE: "regola non trovata; nulla è cambiato per questo prodotto",
  rpLb_reessayerN: (n) => `Riprova i ${n}`,
  rpLb_suppRefus: (n, nom) => `Eliminazione rifiutata: ${n} prodotto/i × paese usano «${nom}». Riassegnarli prima; eliminare archivia la regola, recuperabile.`,
  rpLb_vbT: "Modifica da convalidare — 1 in attesa", rpLb_annuler: "Annulla", rpLb_valider: "Convalida", rpLb_enCours: "Salvataggio…",
  rpLb_vbSim: "solo simulazione · nessun prezzo Amazon modificato",
  rpLb_vb_affect: (nom, v, n, p) => `Assegna «${nom}» v${v}: ${n} prodotto/i × paese${p ? ` · ${p} mantengono la loro regola propria` : ""}`,
  rpLb_vb_affectD: "I prodotti seguiranno ogni nuova versione della regola.", rpLb_vb_affMulti: (n, p) => `${n} prodotto/i × ${p} paesi scelti`,
  rpLb_vb_aucune: (qui) => `Rimuovi l'assegnazione di ${qui}: si applicherà la regola dell'account`,
  rpLb_vb_archiver: (nom) => `Archivia «${nom}»`, rpLb_vb_archiverD: "Archiviata, resta recuperabile; nessun prodotto la usa.",
  rpLb_vb_restaurer: (nom) => `Ripristina «${nom}»`, rpLb_vb_retirer: (qui) => `Rimuovi la regola propria di ${qui}`,
  rpLb_vb_retirerD: "Si applicherà la regola con nome assegnata, altrimenti quella dell'account. Nient'altro viene cancellato.",
  rpLb_okMsg: "Regola salvata · solo simulazione, niente su Amazon.", rpLb_ko: (m) => `Nulla è stato salvato: ${m}`,
  rpLb_archOk: (nom) => `«${nom}» archiviata (recuperabile).`, rpLb_restOk: (nom) => `«${nom}» ripristinata.`, rpLb_retOk: "Regola propria rimossa.",
  rpEd_titreMod: "Modifica la regola", rpEd_titreNew: "Nuova regola", rpEd_titreProp: (qui) => `Regola propria · ${qui}`,
  rpEd_metaMod: (nom, v, le) => `${nom} · versione ${v}${le ? ` · modificata il ${le}` : ""}`, rpEd_metaNew: "bozza · nulla è salvato", rpEd_metaProp: (v) => `versione ${v}`,
  rpEd_fermer: "Chiudi", rpEd_ident: "Nome", rpEd_nom: "Nome della regola", rpEd_affA: "Assegnata a", rpEd_affN: (n) => `${n} prodotto/i × paese`, rpEd_aucunProd: "nessun prodotto",
  rpEd_vInfo: (a, b) => `versione ${a} → ${b}`, rpEd_vNew: "nuova",
  rpEd_hintMod: (v, n) => `Salvare crea la versione ${v}; i ${n} prodotto/i × paese assegnati la seguono. Ogni simulazione annota la versione usata.`,
  rpEd_hintNew: "Nuova regola: versione 1 al salvataggio, assegnata a nessun prodotto.",
  rpEd_style: "Stile della regola", rpEd_styleH: "Uno stile precompila le barriere qui sotto; Personalizzato mantiene i valori inseriti.", rpEd_rec: "Consigliato",
  rpEd_sd_personnalise: "non cambia nulla", rpEd_sd_prudent: "prima il margine", rpEd_sd_equilibre: "margine e offerta in evidenza", rpEd_sd_offensif: "minimi bassi", rpEd_sd_destockage: "mai sotto il costo",
  rpEd_bar: "Barriere di prezzo", rpEd_defH: "Definizioni — le stesse del calcolo",
  rpEd_dBen: "prezzo IVA esclusa − commissioni Amazon a quel prezzo − costo d'acquisto (media ponderata), per unità, prima della pubblicità", rpEd_dMarge: "profitto ÷ prezzo IVA esclusa", rpEd_dRoi: "profitto ÷ costo d'acquisto",
  rpEd_mins: "Minimi", rpEd_maxs: "Massimi", rpEd_aucun: "Nessuno", rpEd_devPays: "valuta del paese",
  rpEd_f_profitMin: "Profitto minimo per vendita", rpEd_f_margeMin: "Margine minimo", rpEd_f_roiMin: "Ritorno sul costo minimo",
  rpEd_f_profitMax: "Profitto massimo per vendita", rpEd_f_margeMax: "Margine massimo", rpEd_f_roiMax: "Ritorno sul costo massimo",
  rpEd_modeMin: "Minimi: E / O", rpEd_modeMax: "Massimi: E / O", rpEd_tousMin: "tutti i minimi posti", rpEd_tousMax: "tutti i massimi posti", rpEd_auMoins: "almeno uno",
  rpEd_maxH0: "Nessun massimo posto: nessun tetto.", rpEd_maxH1: "Un massimo restringe soltanto i prezzi permessi.", rpEd_maxH2: "Un massimo non annulla mai un minimo né una protezione.",
  rpEd_exDes: "prezzi permessi da", rpEd_exSans: "· senza tetto", rpEd_exJusq: (m) => `· fino a ${m}`, rpEd_ok: "barriere compatibili", rpEd_exCout: "costo",
  rpEd_exAucun: "nessun prezzo della sua griglia rispetta queste barriere", rpEd_exNone: "Esempio numerico: lettura della griglia di prezzi di un prodotto…",
  rpEd_vide: "Nessun prezzo permesso", rpEd_videD: (x) => `: ${x} non possono valere insieme. Vale per tutti i prodotti; correggere uno dei due per salvare.`,
  rpEd_contra: "Limiti contraddittori", rpEd_contraD: (x) => `: ${x}. Un massimo deve superare il minimo dello stesso criterio; correggere per salvare.`,
  rpEd_saveImp: "Salvataggio impossibile: nessun prezzo permesso", rpEd_saveImpT: "Nessun prezzo permesso: correggere le barriere",
  rpEd_pays: "Paesi in cui si applica la regola", rpEd_tousPays: "Tutti i paesi dell'account", rpEd_tousPaysD: "compresi quelli aggiunti in seguito", rpEd_certains: "Alcuni paesi", rpEd_certainsD: "spuntati qui sotto",
  rpEd_paysH: "Paese non spuntato: la regola non vi si applica mai. Un prodotto che vi resta assegnato è segnalato «assegnata, ma non applicabile», e la regola effettivamente applicata è nominata.",
  rpEd_soon: "Previsto, non ancora attivo", rpEd_soonN: (n) => `${n} impostazioni`,
  rpEd_x_pause: "Pausa ricorrente", rpEd_xd_pause: "Mantenere il prezzo invariato in una fascia oraria scelta.", rpEd_xf_pause: [["Fasce", "+ Aggiungi una fascia"]],
  rpEd_x_conc: "Concorrenza", rpEd_xd_conc: "Come posizionarsi rispetto ad Amazon e ai venditori che spediscono in proprio.",
  rpEd_xf_conc: [["Rispetto ad Amazon", "Allinearsi se redditizio, altrimenti lasciare"], ["Venditori che spediscono in proprio", "Tenerne conto"], ["Scarto dal prezzo da battere", "0 · allinearsi"], ["Aumento e calo massimi al giorno", "—"]],
  rpEd_x_cas: "Casi particolari", rpEd_xd_cas: "Cosa fare quando l'offerta in evidenza è rimossa, quando la concorrenza scende sotto il minimo, quando l'offerta è sola o ha già l'offerta in evidenza.",
  rpEd_xf_cas: [["Offerta in evidenza rimossa da Amazon", "Non toccare il prezzo"], ["Concorrenza sotto il minimo", "Non toccare il prezzo"], ["Unica offerta dell'inserzione", "Non toccare il prezzo"], ["Offerta in evidenza già detenuta", "Non toccare il prezzo"]],
  rpEd_x_battre: "Prezzo da battere", rpEd_xd_battre: "Quale prezzo puntare e quali concorrenti contare.", rpEd_xf_battre: [["Prezzo puntato", "Prezzo dell'offerta in evidenza"], ["Feedback positivi minimi del venditore", "—"]],
  rpEd_x_yoyo: "Protezioni anti-yo-yo", rpEd_xd_yoyo: "Se il prezzo sale e scende in loop contro un altro software, una pausa che si allunga a ogni ripetizione, causa scritta nel registro.",
  rpEd_xf_yoyo: [["Pausa", "6 h › 24 h › 72 h se il conflitto si ripete · mai un blocco silenzioso"]],
  rpEd_x_auto: "Automazioni", rpEd_xd_auto: "Cambiare regola quando un prodotto non vende più, contato per paese e per riserva di stock condivisa.",
  rpEd_xf_auto: [["Nessuna vendita da", "20 › 35 › 50 › 65 giorni"], ["Poi passare a", "Regola successiva"]],
  rpEd_note: "Salvare non modifica alcun prezzo su Amazon.", rpEd_facon: "Come fissa il suo prezzo?", rpEd_fc_concurrents: "SmartPrice", rpEd_fcd_concurrents: "Il suo marchio rispetto a prodotti concorrenti di altri marchi.",
  rpEd_vf_m001: (c) => `0,01 ${c} in meno`, rpEd_vfRef_foep: "il prezzo consigliato da Amazon", rpEd_vfRef_bas: "il prezzo consegnato più basso", rpEd_exT: "Esempio fittizio · nessun prodotto reale", rpEd_exVed: "Offerta in evidenza", rpEd_exPl: "Prezzo minimo", rpEd_exGarde: "mantenuto al minimo", rpEd_vfRef: "l'offerta in evidenza", rpEd_vfH: "tra i venditori della scheda che questa regola conta", rpEd_vfPl: "Venditori contati", rpEd_vfExp_tous: "tutti i venditori", rpEd_vfExpD_tous: "Conta ogni venditore rilevato sulla scheda, chiunque spedisca.", rpEd_vfExp_amazon: "solo spediti da Amazon", rpEd_vfExpD_amazon: "Contano solo i venditori la cui offerta è spedita da Amazon. Un venditore di cui non si sa chi spedisce non è contato.", rpEd_vfExpH: "Escludere un venditore preciso: presto disponibile, dall'elenco dei venditori della scheda.", rpEd_vfPh_aucun: "Scelga uno scarto: il prezzo seguirà l'offerta in evidenza, senza scendere sotto il minimo né superare il massimo.", rpEd_e_vf: "Scarto: un numero positivo, al massimo due decimali.", rpEd_fcRfOk: "Scelta salvata. Calcolato in Simulazione: nessun prezzo viene inviato ad Amazon.", rpEd_fcRfNonEnr: "Verrà salvata con la regola. Calcolato in Simulazione: nessun prezzo viene inviato ad Amazon.", rpEd_fc_vendeurs_fiche: "Repricer", rpEd_fcd_vendeurs_fiche: "Lei e altri venditori sulla stessa scheda Amazon.", rpEd_fcAClasser: "Da classificare: finché non si sceglie un modo, la regola mantiene il calcolo attuale.", rpEd_fcNonEnr: "Verrà salvata con la regola. Questo calcolo non è ancora attivo: oggi nessun consiglio ne dipende.", rpEd_fcInactif: "Scelta salvata. Questo calcolo non è ancora attivo: oggi nessun consiglio ne dipende.",
  rpEd_fcLe: (d) => `Scelto il ${d}.`,
  rpEd_enr: "Salva", rpEd_resAria: "Anteprima della regola", rpEd_pl_lim: "Limiti", rpEd_pl_ctb: "Contribuzione", rpEd_pl_pays: "Paesi", rpEd_pl_mode: "Modalità", rpEd_plv_profit: "contribuzione", rpEd_plv_marge: "margine", rpEd_plv_roi: "ritorno sul costo", rpEd_plv_mini: (x) => `${x} min.`, rpEd_plv_maxi: (x) => `${x} max.`, rpEd_plv_aucune: "nessun limite", rpEd_plv_ctb: "prezzo IVA esclusa − commissioni − acquisto, prima della pubblicità", rpEd_plv_mode_concurrents: "prodotti concorrenti", rpEd_plv_mode_vendeurs_fiche: "venditori della scheda",
  rpEd_clsRes: "Finché non ha una modalità, questa regola mantiene il calcolo attuale.", rpEd_clsN: (n) => `${n} ${n === 1 ? "offerta segue" : "offerte seguono"} questa regola`, rpEd_fcSpOk: "Scelta salvata.", rpEd_fcSpNonEnr: "Verrà salvata con la regola.", rpEd_fcSpSans: "Senza scarto di prezzo, SmartPrice non segue alcun concorrente; riporta solo nella regola un prezzo che ne esce (troppo basso, troppo alto o non consentito).", rpEd_ecExPlC: (x) => `contribuzione ${x}`, rpEd_ecCoChoisir: "Scegli un concorrente comparabile", rpEd_ecCoHors: (a) => `${a} (non più comparabile)`,
  rpEd_fcq_concurrents: "rispetto a prodotti concorrenti", rpEd_fcq_vendeurs_fiche: "rispetto agli altri venditori della scheda", rpEd_clsT: "Questa regola non ha ancora una modalità.", rpEd_clsD: (n) => `È precedente a SmartPrice. ${n} ${n === 1 ? "offerta la segue" : "offerte la seguono"}. Scelga una volta; i suoi limiti restano.`, rpEd_passer_concurrents: "Passa a SmartPrice", rpEd_passer_vendeurs_fiche: "Passa a Repricer", rpEd_mq_facon: "Scelga una modalità per salvare. Nessun prezzo viene modificato su Amazon.", rpEd_mq_ecart: "Scelga uno scarto di prezzo per salvare. Nessun prezzo viene modificato su Amazon.",
  rpEd_ec: "Scarto di prezzo", rpEd_ec_m5: "5 % più economico", rpEd_ec_0: "Stesso prezzo", rpEd_ec_p5: "5 % più caro", rpEd_ec_autre: "Altro", rpEd_ecQue: "di", rpEd_ecRef: "Prezzo di riferimento", rpEd_ecC_moins_cher: "il più economico", rpEd_ecC_mediane: "la mediana", rpEd_ecC_choisi: "un concorrente scelto", rpEd_ecVal: "Scarto", rpEd_ecU: "Unità", rpEd_ecS: "Direzione", rpEd_ecS_moins: "più economico", rpEd_ecS_plus: "più caro", rpEd_ecAsin: "ASIN del concorrente", rpEd_ecH: "tra i concorrenti dichiarati comparabili, prodotto per prodotto", rpEd_e_ecart: "Scarto: un numero positivo, al massimo due decimali, sotto il 100 % (o 10.000 in valuta).", rpEd_e_asin: "ASIN del concorrente: 10 lettere o cifre.",
  rpEd_ecPh_aucun: "Scelga uno scarto: il prezzo seguirà i suoi concorrenti comparabili, senza scendere sotto il minimo né superare il massimo.", rpEd_ecPh_moins: (v, r) => `Prezzo ${v} sotto il riferimento (${r}), senza scendere sotto il minimo né superare il massimo.`, rpEd_ecPh_egal: (r) => `Prezzo uguale al riferimento (${r}), senza scendere sotto il minimo né superare il massimo.`, rpEd_ecPh_plus: (v, r) => `Prezzo ${v} sopra il riferimento (${r}), senza scendere sotto il minimo né superare il massimo.`, rpEd_ecR_moins_cher: "il concorrente comparabile più economico", rpEd_ecR_mediane: "la mediana dei concorrenti comparabili", rpEd_ecR_choisi: (a) => `il concorrente ${a}`,
  rpEd_ecEx: (n) => `Esempio · ${n}`, rpEd_ecExMoins: (n) => `il più economico di ${n} comparabil${n === 1 ? "e" : "i"}`, rpEd_ecExMed: "Mediana", rpEd_ecExMedD: (n) => `di ${n} comparabili`, rpEd_ecExChoisi: "concorrente scelto", rpEd_ecExCons: "Prezzo consigliato", rpEd_ecExCtb: "Contribuzione per vendita", rpEd_ecExCtbD: "IVA esclusa, prima della pubblicità, stimata", rpEd_ecExPl: "Minimo", rpEd_ecExPlD: "primo prezzo consentito dai limiti", rpEd_ecExNone: "Esempio non disponibile: nessun prodotto caricato ha abbastanza concorrenti comparabili con un prezzo recente per questo riferimento.",
  rpLb_fClasser: "Da classificare", rpEd_annuler: "Annulla", rpEd_saveV: (v) => `Salva la versione ${v}`, rpEd_saveNew: "Salva la regola",
  rpEd_saveProp: "Salva la regola propria", rpEd_busy: "Salvataggio…", rpEd_ko: (m) => `Nulla è stato scritto: ${m}`,
  rpEd_cflProp: "La regola propria è cambiata altrove: nulla è stato scritto. Chiudere e riaprire per ripartire dalla versione salvata.",
  rpEd_e_champ: "Una barriera non è un numero positivo.", rpEd_e_grand: "Profitto minimo: meno di 100 per vendita; profitto massimo: meno di un milione.", rpEd_e_vide: "Almeno un minimo: profitto, margine o ritorno sul costo.",
  rpEd_e_maxi: "Un massimo è al più uguale al minimo dello stesso criterio.", rpEd_e_nom: "Nome della regola: da 1 a 80 caratteri.", rpEd_e_pays: "Scegliere almeno un paese.",
  rpEd_cflT: "Questa regola è cambiata durante la modifica: nulla è stato scritto.",
  rpEd_cflD: (lu, v, le) => `Versione ${lu} letta; versione ${v} salvata altrove${le ? ` il ${le}` : ""}. Ecco l'unione proposta; si salva solo con «Salva la versione ${v + 1}».`,
  rpEd_cChamp: "Campo", rpEd_cLu: (v) => `Letto (v${v})`, rpEd_cSaisie: "Inserito qui", rpEd_cTrouve: (v) => `Versione ${v}`, rpEd_cRes: (v) => `Risultato v${v}`, rpEd_cOrig: "Origine",
  rpEd_oSaisie: "inserimento mantenuto", rpEd_oReprise: (v) => `versione ${v} ripresa`, rpEd_oIdem: "Nessun campo differisce: cambia solo la versione.", rpEd_abandon: (v) => `Abbandona l'inserimento (mantieni la versione ${v})`,
  rpPp_ouvrir: "Regole e prezzi per paese", rpPp_retour: "Tutti i prodotti", rpPp_cout: "Costo d'acquisto", rpPp_coutMoy: "media ponderata", rpPp_charge: "calcolo…",
  rpPp_th_pays: "Paese", rpPp_th_etat: "Offerta · in evidenza", rpPp_th_prix: "Prezzo attuale IVA incl.", rpPp_th_cons: "Consiglio · simulazione", rpPp_th_ben: "Profitto", rpPp_th_marge: "Margine su prezzo IVA escl.",
  rpPp_th_roi: "Ritorno / costo", rpPp_th_eq: "Prezzo di pareggio", rpPp_th_mini: "Prezzo min. regola", rpPp_th_aff: "Regola assegnata", rpPp_th_app: "Regola applicata",
  rpPp_conseil: "Consiglio", rpPp_roi2: "Ritorno sul costo", rpPp_mini2: "Prezzo minimo della regola", rpPp_plus: "Profitto, margine, prezzo di pareggio, prezzo minimo",
  rpPp_active: "Attiva", rpPp_inactive: "Inattiva", rpPp_bbNous: "In evidenza: nostra", rpPp_bbInc: "in evidenza sconosciuta", rpPp_inactif: "offerta inattiva: niente da consigliare",
  rpPp_indispo: "Non disponibile", rpPp_sansApp: "nessuna regola applicabile", rpPp_garder: "mantenere", rpPp_releve: (h) => `letto ${h} h fa`,
  rpPp_foepT: "Prezzo obiettivo di Amazon non ancora letto: un «mantenere» può venire da questa mancanza", rpPp_dansBornes: "entro i limiti",
  rpPp_g_buy_box_detenue: "offerta in evidenza nostra", rpPp_g_seule_offre: "unica offerta", rpPp_g_buy_box_perdue_sans_prix_a_viser: "prezzo obiettivo non letto", rpPp_g_deja_au_prix_vise: "già al prezzo obiettivo",
  rpPp_horsGrille: "fuori griglia", rpPp_enConflit: "in conflitto",
  rpPp_selAucune: "— nessuna", rpPp_selNonCouv: "(paese non coperto)", rpPp_introuvable: "Regola non trovata", rpPp_choisir: (mp) => `Regola assegnata · ${mp}`,
  rpPp_propreSeule: "solo regola propria", rpPp_rempl: (v) => `v${v} · sostituita dalla regola propria`,
  rpPp_et_pays_non_couvert: "Assegnata, ma non applicabile", rpPp_et_archivee: "Archiviata · non applicata", rpPp_et_introuvable: "Non trovata · non applicata",
  rpPp_aucuneApp: "nessuna", rpPp_compteAbs: "nessuna regola dell'account", rpPp_sansRegle: "nessuna regola", rpPp_propre: "Regola propria",
  rpPp_src_produit: "propria", rpPp_src_nommee: "con nome", rpPp_src_defaut: "account",
  rpPp_motif_pays_non_couvert: "al posto della regola assegnata: paese non coperto", rpPp_motif_archivee: "al posto della regola assegnata: archiviata",
  rpPp_motif_introuvable: "al posto della regola assegnata: non trovata",
  rpPp_calcT: (p) => `Dettaglio del calcolo · ${p} al prezzo attuale`, rpPp_ttc: "IVA incl.", rpPp_tva: "IVA", rpPp_ht: "IVA escl.", rpPp_frais: "commissioni Amazon a questo prezzo", rpPp_coutA: "costo d'acquisto",
  rpPp_benef: "profitto", rpPp_marge: "margine", rpPp_roi: "ritorno sul costo",
  rpPp_fxT_remplacee: "Regola con nome assegnata, ma sostituita dalla regola propria del prodotto.", rpPp_fxD_remplacee: (nom, v, p) => `«${nom}» v${v} è registrata per ${p}; si applica la regola propria.`,
  rpPp_creerPropre: "Crea una regola propria", rpPp_retirerPropre: "Rimuovi la regola propria", rpPp_modPropre: "Modifica la regola propria", rpPp_modRegle: "Modifica la regola",
  rpPp_fxT_pays: "Paese non coperto dalla regola assegnata.", rpPp_fxD_pays: (nom, p) => `«${nom}» non copre ${p}: non vi è applicata. Si applica invece la regola dell'account, nominata in «Regola applicata».`,
  rpPp_ajouterPays: (c) => `Aggiungi ${c} alla regola`, rpPp_autreRegle: "Assegna un'altra regola",
  rpPp_fxT_archivee: "Regola con nome archiviata: non applicata.", rpPp_fxD_archivee: (nom) => `«${nom}» è archiviata; si applica invece la regola dell'account.`,
  rpPp_fxT_introuvable: "Regola con nome non trovata: non applicata.", rpPp_fxD_introuvable: "L'assegnazione indica una regola che non esiste più; si applica invece la regola dell'account.",
  rpPp_fxT_aucune: "Nessuna regola applicabile: nessuna raccomandazione.", rpPp_fxD_aucune: "La regola assegnata qui non si applica e l'account non ha una regola: nulla la sostituisce in silenzio.",
  rpPp_fxT_conflit: "Nessun prezzo permesso", rpPp_fxD_conflit: ": le barriere della regola applicata non lasciano alcun prezzo della griglia.",
  rpPp_fxT_perime: (h) => `Rilevazione del prezzo troppo vecchia (${h} h)`, rpPp_fxD_perime: ": nulla è raccomandato finché non arriva una rilevazione di meno di 36 h.",
  rpPp_coutT: "Costo d'acquisto sconosciuto", rpPp_coutD: (n) => `: profitto, margine e prezzo minimo non sono calcolabili nei ${n} paesi; nessuna raccomandazione.`, rpPp_saisirCout: "Inserisci il costo d'acquisto",
  rpPp_f1T: "Prezzo obiettivo di Amazon non ancora letto", rpPp_f1D: ": un «mantenere» può venire da questa mancanza.",
  rpPp_f2T: "Offerta in evidenza", rpPp_f2D: ": «nostra» o «sconosciuta»; la rilevazione non sa ancora dire «persa».",
  rpPp_f3T: "Cifre", rpPp_f3D: " al prezzo attuale IVA incl., prima della pubblicità; margine su prezzo IVA escl. · regola e versione annotate a ogni simulazione · rilevazione di oltre 36 h = non disponibile.",
  rpAf_sel: (n) => `${n} prodotto/i selezionato/i`, rpAf_sur: (n) => `su ${n}`, rpAf_desel: "Deseleziona tutto", rpAf_tout: "Seleziona tutto", rpAf_cocher: "Scegli",
  rpAf_th_prod: "Prodotto", rpAf_th_pays: "Paesi venduti", rpAf_th_regles: "Regole attuali", rpAf_titre: (n) => `Assegna una regola · ${n} prodotto/i`,
  rpAf_regle: "Regola", rpAf_choisir: "Scegli una regola", rpAf_pays: "Paesi", rpAf_apercu: "Anteprima", rpAf_nonCouv: "non coperto",
  rpAf_vendus: (tot, sans) => `prodotti × paesi venduti nei paesi scelti (su ${tot}; ${sans} senza offerta, non toccati)`,
  rpAf_chg: "cambiano regola: la regola scelta diventa effettiva", rpAf_deja: "già su questa regola: invariati", rpAf_prop: "mantengono la loro regola propria: assegnazione registrata, non effettiva",
  rpAf_hint: "Niente di automatico in più: cambia solo l'assegnazione. Solo simulazione, nessun prezzo Amazon modificato.", rpAf_aucunSel: "Spuntare dei prodotti nell'elenco.",
  rpRe_envLc: (a) => `Riletto ${a}`, rpRe_coutEstC: "Costo stimato", rpRe_coutDc: "Prezzo non calcolabile", rpRe_gc_tenue: (n) => `${n} tenut${n > 1 ? "e" : "a"}`, rpRe_gc_perdue: (n) => `${n} pers${n > 1 ? "e" : "a"}`, rpRe_gc_aucune: (n) => `${n} senza offerta in evidenza`, rpRe_gc_inconnue: (n) => `${n} sconosciut${n > 1 ? "i" : "o"}`,
  rpRe_iAria: "Situazione dell'offerta in evidenza", rpRe_i_offres: "Offerte", rpRe_i_tenue: "Tenute", rpRe_i_perdue: "Perse", rpRe_i_aucune: "Senza offerta in evidenza", rpRe_i_inconnue: "Sconosciute",
  rpRe_g_tenue: (n) => `${n} in cui tiene l'offerta in evidenza`, rpRe_g_perdue: (n) => `${n} in cui l'offerta in evidenza è persa`, rpRe_g_aucune: (n) => `${n} sched${n > 1 ? "e" : "a"} senza offerta in evidenza`, rpRe_g_inconnue: (n) => `${n} stat${n > 1 ? "i" : "o"} sconosciut${n > 1 ? "i" : "o"}`,
  rpRe_simuP: "Simulazione:", rpRe_aLire: (n) => `${n} consigl${n > 1 ? "i" : "io"} da leggere`, rpRe_pos: (n) => `Situazione dell'offerta in evidenza, su ${n} offert${n > 1 ? "e" : "a"}`,
  rpRe_rien: "Niente da fare", rpRe_rienD: (h, n) => `Nessuna offerta richiede un'azione. Ultimo calcolo alle ${h}, su ${n > 1 ? `tutte le ${n} offerte` : `${n} offerta`}.`, rpRe_rienDx: (n) => `Nessuna offerta richiede un'azione, su ${n > 1 ? `tutte le ${n} offerte` : `${n} offerta`}.`, rpRe_prochaines: "Le prossime azioni appariranno qui.",
  rpRe_coutEst: "Costo d'acquisto stimato:", rpRe_coutInc: "Costo d'acquisto sconosciuto", rpRe_aConf: "Da confermare", rpRe_coutD: "Prezzo non calcolabile prima della conferma del costo in COGS", rpRe_confCogs: "Conferma in COGS",
  rpRe_conflitD: (p, f) => `Minimo ${p} sopra il massimo ${f}`, rpRe_sousPl: "Offerta in evidenza sotto il suo minimo", rpRe_sousPlD: "Prezzo mantenuto al minimo · scelta redditizia", rpRe_sousPlDx: "Prezzo mantenuto · scelta redditizia",
  rpRe_nivInc: "Livello sconosciuto", rpRe_pays: "Paese:",
  rpRe_trier: "Ordina", rpRe_trierP: "Ordina:", rpRe_tri_pays: "Paese", rpRe_tri_produit: "Prodotto", rpRe_tri_variation: "Variazione", rpRe_tri_contribution: "Contributo",
  rpRf_regle: (n) => `Regola: ${n}`, rpRf_st_tenue: "Offerta in evidenza detenuta", rpRf_st_perdue: "Offerta in evidenza persa", rpRf_st_aucune: "Nessuna offerta in evidenza", rpRf_st_inconnue: "Offerta in evidenza sconosciuta",
  rpRf_simt: "Simulazione · Nessun invio ad Amazon", rpRf_conserve: "Prezzo mantenuto al minimo", rpRf_garde: "Prezzo mantenuto", rpRf_ved: "Offerta in evidenza", rpRf_suiv: "Offerta successiva",
  rpRf_actuel: "Prezzo attuale", rpRf_propose: "Prezzo proposto", rpRf_veut: "Cosa significa", rpRf_faire: "Cosa può fare",
  rpRf_alignB: "Allo stesso prezzo con spedizione dell'offerta in evidenza", rpRf_align: (q, p, port, x) => `, detenuta da ${q}: il suo prezzo articolo ${p} + spedizione ${port}${x}, `, rpRf_align2: ". Allineato, non più economico: raggiungere questo prezzo non garantisce l'offerta in evidenza.",
  rpRf_viseB: (p) => `Prezzo obiettivo: ${p}`, rpRf_vise: (pv, port) => `, per un'offerta in evidenza a ${pv} con spedizione (la sua spedizione: ${port}). Raggiungere questo prezzo non garantisce l'offerta in evidenza.`,
  rpRf_plafB: "Al massimo della sua regola", rpRf_plaf: (pv, pf) => `: l'offerta in evidenza è a ${pv} con spedizione, sopra il suo massimo di ${pf}. Raggiungere questo prezzo non garantisce l'offerta in evidenza.`,
  rpRf_tenueB: "Lei detiene l'offerta in evidenza.", rpRf_suivTxt: (p, l) => ` La prossima offerta contata${l ? ` (${l})` : ""} è a ${p} con spedizione.`, rpRf_hausse24: (m, h) => ` Aumento facoltativo: al massimo ${m} in 24 h, dal suo prezzo di ieri (${h}).`,
  rpRf_hausse: " Aumento facoltativo.", rpRf_risque: " Un aumento può farle perdere l'offerta in evidenza.", rpRf_tenueGarde: " Prezzo mantenuto.",
  rpRf_sousPl: (q, pv, ec) => `${q} detiene l'offerta in evidenza a ${pv}, ${ec} sotto il suo minimo.`, rpRf_sousPlCtb: (x) => ` A quel prezzo, il suo contributo scenderebbe a ≈ ${x} per vendita`, rpRf_minDe: (m) => `, per un minimo di ${m}`,
  rpRf_inconnue: "Lo stato dell'offerta in evidenza è sconosciuto: nessun prezzo è calcolato.", rpRf_cause: (x) => `Causa: ${x}.`, rpRf_aucune: "Nessuna offerta in evidenza su questa scheda all'ultima rilevazione: nessun prezzo è calcolato.",
  rpRf_ctbK: "Contributo stimato, IVA esclusa", rpRf_ctbK2: "Contributo stimato prima della pubblicità", rpRf_vente: " / vendita",
  rpRf_ctbAu: (b, ec, m) => `Contributo stimato prima della pubblicità: ${b} per vendita, ${ec} sopra il suo minimo di ${m}.`, rpRf_ctbSur: (b, ec, m) => `Contributo stimato prima della pubblicità: ${b} per vendita, ${ec} sopra il suo massimo di ${m}.`, rpRf_ctbSous: (b, ec, m) => `Contributo stimato prima della pubblicità: ${b} per vendita, ${ec} sotto il suo minimo di ${m}.`,
  rpRf_ctbPerte: "Se l'offerta in evidenza viene persa, un nuovo calcolo proporrà un ribasso, da convalidare.", rpRf_ctbAct: (p) => `Al suo prezzo attuale di ${p}.`, rpRf_ctbActMin: (p) => `Al suo prezzo attuale di ${p}: è il suo minimo.`,
  rpRf_simnB: "Simulazione.", rpRf_simn: " Nessun prezzo parte verso Amazon. Questo consiglio si legge, non si invia.",
  rpRf_f_garder: (p) => `Mantenere ${p}`, rpRf_f_garderPl: ", il suo minimo: una scelta redditizia.", rpRf_f_remonte: "Se l'offerta in evidenza risale, un nuovo calcolo proporrà un aumento, da convalidare.", rpRf_f_min: (n) => `Oppure abbassare il minimo della regola (${n} offert${n > 1 ? "e" : "a"}).`,
  rpRf_vdr: "Venditori della scheda", rpRf_mInc: "Idoneità sconosciuta", rpRf_mBientot: "Presto disponibile", rpRf_mSecu: "Simulazione · invio non ancora aperto", rpRf_deux: (a, b) => `${a}: ${b}`, rpRf_vdL: (l) => `Venditore ${l}`, rpRf_autreV: "un altro venditore", rpRf_autreVM: "Un altro venditore", rpRf_nOffres: (n) => `${n} offert${n > 1 ? "e" : "a"}`, rpRf_expA: " (spedito da Amazon)", rpRf_expV: " (spedito da lei)", rpRf_vdrInc: "rilevazione sconosciuta", rpRf_hist: "Storico dei prezzi",
  rpRe_videT: "Nessuna offerta segue Repricer", rpRe_videD: "Repricer posiziona il suo prezzo rispetto agli altri venditori della stessa scheda Amazon, per tenere l'offerta in evidenza. Due passaggi per ottenere i primi consigli.",
  rpRe_e_1: "Regola", rpRe_e_1d: "scarto e limiti", rpRe_e_1a: "Crea una regola", rpRe_e_2: "Offerte", rpRe_e_2d: "applica la regola", rpRe_videB: "I venditori di ogni scheda sono rilevati su Amazon: nient'altro da scegliere.",
  rpC_simulation: "Simulazione", rpRzK_offre_vedette_perdue_prix_vise: "Al prezzo dell'offerta in evidenza", rpRzK_offre_vedette_perdue_prix_vise_plafond: "Al massimo, sotto l'offerta in evidenza",
  rpRzK_hausse_vers_vendeur_suivant: "Aumento facoltativo", rpRzK_hausse_vers_vendeur_suivant_plafond: "Aumento facoltativo", rpRzK_hausse_vers_vendeur_suivant_limite_24h: "Aumento facoltativo",
  rpSpF_rien: "Niente da fare", rpSpF_aCompleter: "Configurazione da completare", rpSpF_sansTxt: (n, p) => `${n} offert${n > 1 ? "e" : "a"}, prezzo mantenuto${p ? `: ${p}` : ""}`, rpSpF_dVise: (n) => `${n} al prezzo obiettivo`,
  rpSpFcD: "Prezzo non calcolabile", rpSpFcD_cout_inconnu: "Prezzo non calcolabile senza questo costo", rpSpFcD_bornes_en_conflit: "Prezzo non calcolabile con questi limiti",
  rpK5_aria: "Prezzi rispetto al prezzo obiettivo", rpK5_offres: "Offerte", rpK5_vise: "Al prezzo obiettivo", rpK5_ajuster: "Da regolare", rpK5_plancher: "Al minimo", rpK5_nonCalc: "Non calcolabili",
  rpK5_aFaire: "Da fare:", rpK5_env: (n) => `${n} invi${n > 1 ? "i" : "o"} da verificare`, rpK5_prix: (n) => `${n} prezz${n > 1 ? "i" : "o"} da convalidare`, rpK5_conf: (n) => `${n} configurazion${n > 1 ? "i" : "e"} da completare`,
  rpK5_pos: (n) => `I vostri prezzi rispetto al prezzo obiettivo, su ${n} offert${n > 1 ? "e" : "a"}`, rpSl_thVar: "Variazione", rpSl_thRaison: "Motivo", rpSl_thCtb: "Contributo*",
  rpSl_ctbNote: "* Contributo stimato per vendita, IVA esclusa, prima della pubblicità, al prezzo proposto.", rpSl_sku: (s) => `SKU: ${s}`, rpSl_skuInc: "SKU sconosciuto", rpSp_apres: (n) => `Dopo il passaggio ${n}`,
  rpRzK_sous_le_plancher: "Risalire al minimo", rpRzK_au_dessus_du_plafond: "Scendere al massimo", rpRzK_prix_actuel_non_admissible: "Riportare nella regola", rpRzK_cible_concurrents: "Sull'obiettivo", rpRzK_cible_concurrents_plancher: "Obiettivo sotto il minimo", rpRzK_cible_concurrents_plafond: "Obiettivo sopra il massimo", rpRzK_cible_concurrents_hors_regle: "Obiettivo fuori regola", rpRzK_cible_concurrents_non_estimable: "Prezzo consentito più vicino", rpRzK_buy_box_perdue_prix_a_viser: "Allineato all'offerta in evidenza",
  rpRzQ: (e, s, c) => { const a = { moins_cher: ["il più economico", "del più economico"], mediane: ["la mediana", "della mediana"], choisi: ["il concorrente scelto", "del concorrente scelto"] }[c]; return !a ? null : s < 0 ? `${e} sotto ${a[0]}` : s > 0 ? `${e} sopra ${a[0]}` : `Al prezzo ${a[1]}`; }, rpSpF_dSansPl: (n) => `${n} senza minimo noto`, rpSpF_dSansPrix: (n) => `${n} senza prezzo attuale rilevato`,
  rpSl_envoi: "Invio da verificare", rpSl_envT: "Risultato Amazon non confermato", rpSl_envD: (a) => `Richiesto ${a}`, rpSl_envL: (a) => `Riletto su Amazon ${a}`,
  rpSl_verifier: "Verifica", rpSl_ec: (s, v) => `${s}${v}%`, rpSl_barre: "Offerte la cui regola segue SmartPrice",
  rpSl_voirRe: (n) => (n === 1 ? "Vedi l'offerta Repricer" : `Vedi le ${n} offerte Repricer`), rpSl_voirReC: (n) => `${n} offert${n === 1 ? "a" : "e"} Repricer`, rpSpTh_regle: "Regola",
  rpSpTh_prix: "Prezzo attuale", rpSpTh_sit: "Situazione attuale", rpSpTh_conseil: "Prezzo proposto", rpSl_aff: (a, b) => `${a} di ${b} mostrat${b === 1 ? "a" : "e"}`, rpSl_suiv: "Successive",
  rpSl_auj: (s) => `Oggi: ${s}`, rpSl_trier: "Ordina", rpSl_sousPl: "Sotto il minimo",
  rpSd_refAria: "Riferimento", rpSd_mediane: "la mediana", rpSd_pct: (v) => `${v}\u00a0%`, rpSd_sous: (e, n) => `${e} sotto ${n}`, rpSd_dessus: (e, n) => `${e} sopra ${n}`, rpSd_egal: (n) => `Al prezzo di ${n}`,
  rpSd_ilYa: (a) => `${a} fa`, rpSd_sousPl: (m) => `Prezzo attuale ${m} sotto il minimo.`, rpSd_remonte: (p, c, pl) => `${p} darebbe ${c}: il consiglio risale al minimo, ${pl}.`,
  rpSd_cz_moins_cher: (p, n) => (n ? `${p}, il più economico di ${n} concorrenti comparabili con prezzo noto.` : `${p}, il più economico dei concorrenti comparabili.`),
  rpSd_cz_mediane: (p, n) => (n ? `${p} di ${n} concorrenti comparabili con prezzo noto.` : `${p} dei concorrenti comparabili.`), rpSd_cz_choisi: (p) => `${p}, il concorrente scelto.`,
  rpSd_ctb: "Contributo per vendita", rpSd_ctbD: "IVA esclusa, prima della pubblicità", rpSd_seuilPlus: (n) => `Guadagna lo stesso se le vendite aumentano del ${n}\u00a0%.`, rpSd_seuilMoins: (n) => `Guadagna lo stesso anche se le vendite calano del ${n}\u00a0%.`,
  rpSd_recapT: "Inviare questo prezzo ad Amazon?", rpSd_recapSous: "prima dell'invio ad Amazon", rpSd_pays: "Paese", rpSd_prixDem: "Prezzo richiesto", rpSd_regle: "Regola", rpSd_envoyer: (p) => `Invia ${p} ad Amazon`, rpSd_retour: "Indietro",
  rpSd_recapNote: "La barra di conferma chiede poi un'ultima convalida. Dopo l'invio, GTINPilot rilegge il prezzo mostrato da Amazon; finché non è confermato, l'offerta resta in «Invio da verificare».",
  rpSd_coutT: "Costo d'acquisto per unità", rpSd_coutP: "Si inserisce in un solo punto: la pagina dei costi d'acquisto.", rpSd_coutLien: "Inserisci il costo d'acquisto", rpSd_aussi: (p) => `bloccata anche in ${p}`,
  rpSd_pub: "Pubblicità", rpSd_pubV: (m) => `${m} per vendita`, rpSd_pubNon: "non misurata", rpSd_nonCalc: "non calcolato", rpSd_ramene: "prezzo consegnato, nel suo formato",
  rpF_aValider: "Da convalidare", rpF_conseils: "Consigli", rpF_aDebloquer: "Da sbloccare", rpF_sans: "Senza modifiche", rpF_examiner: "Esamina", rpF_voir: "Vedi",
  rpF_saisirCout: "Inserisci il costo", rpF_modifRegle: "Modifica la regola", rpF_toutVoir: "Vedi tutto", rpF_nOffres: (n) => `${n} offert${n > 1 ? "e" : "a"}`,
  rpF_sansTxt: (n, p) => `${n} offert${n > 1 ? "e" : "a"}${p ? `, di cui ${p}` : ""}`, rpF_dPl: (n) => `${n} al minimo`, rpF_dPromo: (n) => `${n} in promozione`,
  rpF_dStock: (n) => `${n} senza stock vendibile`, rpF_rien: "Niente da decidere", rpF_derniere: "Ultima modifica", rpF_prochaines: "Le prossime decisioni appariranno qui.",
  rpF_dIgn: (n) => `${n} ignorat${n > 1 ? "e" : "a"}`, rpF_ignores: "Consigli ignorati", rpD_ignorer: "Ignora questo consiglio", rpD_ignLe: (d) => `Consiglio ignorato il ${d}`,
  rpD_ignRevient: "Torna nell'elenco se la situazione cambia.", rpD_ignRet: "Non ignorare più", rpD_ignOk: (h) => `Consiglio ignorato (calcolo delle ${h})`,
  rpD_ignNouveau: "La situazione è cambiata: il consiglio resta da esaminare.", rpD_ignRelErr: "Salvato; rilettura impossibile: ricaricare la pagina.", rpD_ignRetEncore: "Il consiglio è ancora ignorato: ricaricare la pagina.", rpD_ignRetOk: "Il consiglio non è più ignorato.",
  rpD_ignIll: "Elenco dei consigli ignorati illeggibile: «Ignora» non è disponibile.", rpD_ignErr: (m) => `Non salvato: ${m}`, rpD_ignBusy: "Salvataggio…",
  rpFc_envoi_non_confirme: "Invio non confermato", rpFc_envoi_refuse: "Invio rifiutato", rpFc_refuse_amazon: "Rifiutato da Amazon", rpFc_cout_inconnu: "Costo d'acquisto sconosciuto",
  rpFc_bornes_en_conflit: "Limiti in conflitto", rpFc_frais_inconnus: "Commissioni Amazon sconosciute", rpFc_sans_prix: "Prezzo attuale sconosciuto o rilevazione troppo vecchia", rpFc_aucun: "Mai calcolato",
  rpFc_bloque: "Bloccato", rpFc_situation_changee: "Situazione cambiata dal calcolo",
  rpD_regle: (n) => `regola ${n}`, rpD_conseille: "Consigliato", rpD_actuel: "Prezzo attuale", rpD_releve: (a) => `rilevato ${a} fa`, rpD_plancher: "Minimo", rpD_plafond: "Massimo",
  rpD_sousPl: "sotto il minimo", rpD_dessusPf: "sopra il massimo", rpD_valider: (p) => `Convalida ${p}`, rpD_recap: "Si apre un riepilogo prima dell'invio ad Amazon.",
  rpD_simu: "Simulazione: nessun prezzo parte verso Amazon. Questo consiglio si legge, non si invia.", rpD_benef: (p) => `Utile per vendita a ${p}`, rpD_calcPl: "Calcolo del minimo",
  rpD_calcPlD: "Prezzo più basso della griglia di Amazon che rispetta la regola (utile, margine, ritorno sul costo), con le commissioni stimate a quel prezzo.",
  rpD_sitChg: (h) => `Situazione cambiata dal calcolo delle ${h}`, rpD_sitRegle: "La regola è cambiata da questo calcolo.", rpD_sitPrixAct: (p) => `Prezzo attuale rilevato da allora: ${p}.`,
  rpD_sitPrix: (p) => `Prezzo letto su Amazon: ${p}. Nulla è stato proposto.`, rpD_prochain: "Nuovo consiglio al prossimo calcolo.", rpD_limChg: (h) => `Limiti cambiati dal calcolo delle ${h}`,
  rpD_nonCalc: "Prezzo non calcolabile", rpD_coutPl: "Costo d'acquisto sconosciuto: il minimo non può essere calcolato.", rpD_coutEst: "Costo stimato",
  rpD_estDe: (j) => `dal lotto confermato precedente · ricevuto il ${j}`, rpD_aConfirmer: "Da confermare nella scheda COGS", rpD_ouvrirCogs: "Apri COGS", rpD_coutND: "Costo non determinabile",
  rpD_coutR_change_absent: "manca il tasso di cambio del giorno di ricezione", rpD_coutR_sans_jour: "ricezione senza data", rpD_coutR_autre_zone_seulement: "lotti confermati solo in un'altra zona",
  rpD_coutR_aucun_lot_avant: "nessun lotto confermato prima di questa ricezione", rpD_coutR_egalite_ambigue: "più costi diversi lo stesso giorno",
  rpD_coutR_aucune_estimation: "nessuna stima per questo prodotto in questa zona", rpD_coutR_aucune_reception: "nessuna ricezione di questo prodotto in questa zona", rpD_coutR_zone_inconnue: "zona di stock del paese sconosciuta",
  rpD_envAttente: "In attesa di convalida", rpD_env_PENDING: "Proposta pronta: la barra «Convalida» in basso la invia, dopo il suo riepilogo.",
  rpD_env_EN_COURS: "Invio in corso: nessun nuovo invio finché l'esito non è noto.", rpD_attente: "Il consiglio sarà ricalcolato; nel frattempo, nessun invio da questo consiglio.", rpP_envBloque: "Invio non confermato su questa offerta: nessun nuovo invio da qui finché l'esito non è noto (scheda Decisioni).",
  rpD_env_UNKNOWN: "Esito sconosciuto presso Amazon: nessun nuovo invio da questa schermata. Verificare il prezzo in Seller Central.", rpD_motif: "Motivo", rpD_motifNC: "motivo non comunicato",
  rpD_envRetour: "Un nuovo consiglio apparirà dopo il prossimo calcolo.",
  rpMo_VALUE_CHANGED: "prezzo o limiti cambiati su Amazon dalla proposta (Seller Central)", rpMo_RULE_CHANGED: "la regola di prezzo è cambiata dalla proposta: proponga di nuovo. Non è stato inviato nulla.", rpMo_RULE_UNVERIFIABLE: "non è stato possibile verificare la regola di prezzo: proponga di nuovo. Non è stato inviato nulla.", rpMo_UNSUPPORTED_DISCOUNT: "esiste un prezzo scontato programmato su Amazon",
  rpMo_UNSUPPORTED_OFFER: "offerta non supportata", rpMo_PREVIEW_INVALID: "anteprima rifiutata da Amazon", rpMo_PREVIEW_FAILED: "anteprima impossibile su Amazon", rpMo_FROZEN: "invii bloccati per questo account",
  rpMo_TOO_SLOW: "invio troppo lento, fermato prima della partenza", rpMo_TOKEN_FAILED: "accesso ad Amazon non disponibile", rpMo_READ_FAILED: "prezzo illeggibile su Amazon", rpMo_OFFER_BUSY: "un altro prezzo era in corso di invio",
  rpMo_CURRENCY: "valuta dell'offerta diversa", rpMo_NO_PRODUCT_TYPE: "tipo di prodotto assente dalla scheda", rpMo_INVALID: "richiesta giudicata non valida da Amazon", rpMo_http: (c) => `Amazon ha rifiutato la richiesta (HTTP ${c})`,
  rpRz_sous_le_plancher: "Prezzo attuale sotto il minimo", rpRz_au_dessus_du_plafond: "Prezzo attuale sopra il massimo", rpRz_prix_actuel_non_admissible: "Prezzo attuale fuori regola: portato al prezzo consentito più vicino",
  rpRz_buy_box_perdue_prix_a_viser: "Offerta in evidenza persa: prezzo allineato all'offerta in evidenza", rpRz_seule_offre: "Unica offerta della scheda: prezzo mantenuto", rpRz_buy_box_detenue: "Offerta in evidenza detenuta: prezzo mantenuto",
  rpRz_buy_box_perdue_sans_prix_a_viser: "Offerta in evidenza persa, nessun prezzo obiettivo rilevato", rpRz_deja_au_prix_vise: "Già al prezzo obiettivo", rpRz_promotion_en_cours: "Promozione in corso: consiglio in pausa",
  rpRz_non_achetable: "Nessuno stock vendibile", rpRz_aucun_prix_admissible: "Nessun prezzo rispetta tutti i limiti della regola",
  rpRzF: (f, e) => `${f}: ${e}`, rpRzF_releve_prix: "Rilevazione del nostro prezzo", rpRzF_prix_actuel: "Prezzo attuale", rpRzF_stock: "Rilevazione dello stock", rpRzF_promotions: "Rilevazione delle promozioni",
  rpRzF_cout_achat: "Costo d'acquisto", rpRzF_frais_prix_actuel: "Commissioni Amazon al prezzo attuale", rpRzE_absent: "assente", rpRzE_perime: "troppo vecchia", rpRzE_invalide: "illeggibile", rpRzE_inconnu: "sconosciuto",
  rpRz_concurrents_parametres_absents: "Rispetto ai concorrenti: obiettivo non impostato nella regola", rpRz_concurrents_choisi_absent: "Rispetto ai concorrenti: concorrente scelto assente dall'elenco", rpRz_concurrents_choisi_exclu: "Rispetto ai concorrenti: concorrente scelto escluso dal calcolo", rpRz_concurrents_aucun_prix_admissible: "Rispetto ai concorrenti: nessun prezzo concorrente utilizzabile", rpRz_concurrents_couverture_insuffisante: "Rispetto ai concorrenti: troppo pochi prezzi recenti per concludere", rpRz_concurrents_mediane_moins_de_2_prix: "Rispetto ai concorrenti: meno di 2 prezzi per una mediana",
  rpRz_cible_concurrents: "Rispetto ai concorrenti: prezzo posto sull'obiettivo", rpRz_cible_concurrents_plancher: "Rispetto ai concorrenti: obiettivo sotto il minimo, prezzo al minimo", rpRz_cible_concurrents_plafond: "Rispetto ai concorrenti: obiettivo sopra il massimo, prezzo al massimo", rpRz_deja_a_la_cible_concurrents: "Rispetto ai concorrenti: già all'obiettivo", rpRz_deja_a_la_cible_concurrents_plancher: "Rispetto ai concorrenti: già al minimo (obiettivo più basso)", rpRz_deja_a_la_cible_concurrents_plafond: "Rispetto ai concorrenti: già al massimo (obiettivo più alto)", rpRz_cible_concurrents_hors_regle: "Rispetto ai concorrenti: obiettivo non consentito dalla regola, prezzo consentito più vicino dal lato dell'obiettivo", rpRz_deja_au_prix_autorise_concurrents: "Rispetto ai concorrenti: obiettivo non consentito dalla regola, già al prezzo consentito più vicino dal lato dell'obiettivo", rpRz_cible_concurrents_non_estimable: "Rispetto ai concorrenti: prezzo al centesimo non calcolabile, prezzo consentito più vicino dal lato dell'obiettivo", rpRz_deja_au_prix_grille_concurrents: "Rispetto ai concorrenti: prezzo al centesimo non calcolabile, già al prezzo consentito più vicino dal lato dell'obiettivo", rpRz_ecart_sous_minimum_concurrents: "Rispetto ai concorrenti: obiettivo troppo vicino al prezzo attuale, prezzo mantenuto",
  rpRzN: (e) => `Rispetto ai concorrenti: la nostra offerta, ${e}`, rpRzC_offre_invalide: "rilevazione non valida", rpRzC_etat_inconnu: "condizione dell'articolo sconosciuta", rpRzC_expedition_inconnue: "modalità di spedizione sconosciuta", rpRzC_heure_inconnue: "ora della rilevazione sconosciuta", rpRzC_donnee_future: "ora della rilevazione nel futuro", rpRzC_donnee_perimee: "rilevazione troppo vecchia", rpRzC_port_inconnu: "spese di spedizione sconosciute", rpRzC_total_incoherent: "totale consegnato incoerente", rpRzC_port_incoherent: "spese di spedizione incoerenti",
  rpCo_pli: "Concorrenti", rpCo_nSurM: (n, m) => `${n} comparabil${n > 1 ? "i" : "e"} su ${m}`, rpCo_indispo: "elenco non disponibile", rpCo_aucunCourt: "nessuno", rpCo_indispoD: "Elenco dei concorrenti non disponibile: lo stato del Monitoraggio non è leggibile. Nulla è stato modificato.", rpCo_etat: (n, max) => `${n} seguit${n > 1 ? "i" : "o"} · ${max} al massimo`, rpCo_aucun: "Nessun concorrente seguito per questo prodotto in questo paese. Aggiungetene uno qui sotto o sceglietelo nel Monitoraggio.", rpCo_sansPrix: "prezzo non rilevato", rpCo_parUnite: (p) => `${p}/unità`, rpCo_lotDe: (n, p) => `Confezione da ${n}: ${p}`, rpCo_releveIlYa: (a) => `rilevato ${a} fa`, rpCo_sansOffre: (a) => `nessuna offerta in evidenza all'ultimo rilevamento (${a} fa), fuori calcolo`, rpCo_dernierConnu: (p, a) => `ultimo prezzo noto ${p}, ${a} fa`, rpCo_perime: (h) => `scaduto (oltre ${h} h), fuori calcolo`, rpCo_photo: (a) => `offerte fotografate ${a} fa`, rpCo_format: "Unità per confezione", rpCo_fmtOk: "Salva il formato", rpCo_retirer: "Togli per questo prodotto", rpCo_aDeclarer: "Da dichiarare · fuori calcolo", rpCo_cmp: "Comparabile", rpCo_cmpLot: (n) => `Comparabile · confezione da ${n}`, rpCo_hors: "Fuori calcolo", rpCo_srcManuel: "Aggiunto a mano", rpCo_srcVeille: "Monitoraggio", rpCo_actions: "Azioni su questo concorrente", rpCo_ajouter: "Aggiungi un concorrente", rpCo_ph: "ASIN o link Amazon", rpCo_ajouterBtn: "Aggiungi", rpCo_veille: "Scegli nel Monitoraggio", rpCo_note: "Prezzo: ultimo prezzo rilevato dell'offerta in evidenza, spedizione inclusa, con la sua età; oltre 2 h è scaduto e non entra più nel calcolo. Senza offerta in evidenza all'ultimo rilevamento, non entra nemmeno. Un concorrente fuori calcolo resta monitorato. Nulla cambia su Amazon.", rpCo_okAjout: "Concorrente aggiunto.", rpCo_okFmt: "Formato salvato.", rpCo_okRet: "Concorrente tolto per questo prodotto.", rpCo_okCmp: "Contato nel calcolo.", rpCo_okHors: "Fuori calcolo, sempre monitorato.", rpCo_errMax: "Rifiutato: al massimo 10 concorrenti seguiti per prodotto e paese (o 100 aggiunte). Nulla è stato scritto.", rpCo_errNonSuivi: "Rifiutato: questo concorrente non è più seguito per questo prodotto. Nulla è stato scritto.", rpCo_err: "Salvataggio non riuscito. Nulla è stato scritto.", rpCo_errAsin: "ASIN non valido: 10 lettere o cifre, o un link a una scheda Amazon.", rpCo_errFmt: "Formato non valido: un numero intero da 1 a 100.",
});
Object.assign(I18N.zh, { t1pPrice: "Repricer", rpTitle: "Repricer", t1pSmart: "SmartPrice", rpSp_videT: "没有报价使用 SmartPrice", rpSp_videD: "SmartPrice 将您品牌的价格对标您选择的竞争产品。按顺序三步即可启用。", rpSp_aria: "启用 SmartPrice 的三个步骤", rpSp_e_1: "规则", rpSp_e_1d: "价差与限制", rpSp_e_1a: "创建规则", rpSp_e_2: "报价", rpSp_e_2d: "应用规则", rpSp_e_3: "竞争对手", rpSp_e_3d: "按报价和国家",
  rpCrumb: "产品", rpLvl_ombre: "模拟", rpLvl_propose: "确认后发送", rpLvl_auto: "自动",
  rpLvlAria: "调价级别", rpLvlTip: "账户级别：价格锁关闭时为“模拟”（不向亚马逊发送任何价格），打开时为“确认后发送”。“自动”尚不存在。", rpLvlUnk: "级别未知：未读取价格锁。", rpEtatN: (s) => `${s} 个报价`, rpRe_c_expl: (s) => `${s} 个可用`, rpRe_c_bloq: (s) => `${s} 个受阻`, rpRe_c_inact: (s) => `${s} 个停用`, rpRe_c_nonAch: (s) => `${s} 个不可购买`, rpRe_c_nonConf: (s) => `${s} 个未确认`, rpRe_c_sansOffre: (s) => `${s} 个无您的报价`, rpRe_c_ecart: (s) => `${s} 个已隐藏或已禁用`, rpRe_decTip: "可用：已读取价格，可以计算。受阻：已跟踪，但计算缺少数据（成本、费用、限制）。停用：亚马逊上的商品停用。无您的报价：该国家存在商品页面，但没有您的商品或价格。不可购买：商品有效，但未读取到可购买的报价或无可售库存。未确认：已读取价格，但商品不在商品报告中。已隐藏或已禁用：由您设置。全部列在“所有报价”中。", rpRe_mode: "模式：", rpEtatCalc: (h) => `计算于 ${h}`,
  rpFPays: "国家", rpFSit: "状况", rpFAll: "全部", rpFAllF: "全部", rpTabConseils: "操作", rpTabTous: "全部报价", rpTabJournal: "日志", rpTabRegles: "规则",
  rpTabsCount: (p, c) => `${p} 个产品 · ${c} 个国家`, rpSoon: "下一批",
  rpTh_prod: "产品", rpTh_pays: "国家", rpTh_prix: "价格", rpTh_conseil: "建议",
  rpC_garder: "保持", rpC_pause_promo: "暂停 · 促销", rpC_cout_inconnu: "成本未知", rpC_bornes_en_conflit: "上下限冲突", rpC_frais_inconnus: "费用未知",
  rpC_sans_prix: "未读取价格", rpC_bloque: "受阻", rpC_aucun: "尚无建议", rpC_desactive: "已停用", rpC_aValider: "待确认",
  rpErr: "不可用。", rpNone: "过去 7 天没有售出的产品。", rpNoneFiltre: "这些筛选条件下没有数据。",
  rpP_perdue: (d, n) => `自 ${d} 起失去推荐报价 · ${n} 个卖家`, rpP_perdueX: "已失去推荐报价", rpP_detenue: (n) => `持有推荐报价 · ${n} 个卖家`,
  rpP_seul: "唯一卖家 · 无其他报价", rpP_inconnue: "推荐报价：状况未知", rpP_sans_offre: "无有效报价", rpP_close: "关闭",
  rpSim: "模拟", rpSimTest: "测试其他价格", rpSimPrix: "测试价格", rpSimPlancher: "下限", rpSimPlafond: "上限", rpSimAttendu: "预期", rpSimAttNon: "未读取", rpSimAttSeul: "无竞争者",
  rpL_ttc: "含税价格", rpL_tva: (p) => `增值税 ${p}`, rpL_tvaX: "增值税", rpL_frais: "此价格下的亚马逊费用", rpL_cout: "采购成本（剩余库存平均）", rpL_coutProv: "暂定",
  rpL_pub: "每件广告费", rpL_pubNon: "未计算", rpL_ben: "每件利润", rpL_benAv: "广告前", rpL_acos: "盈亏平衡 ACOS", rpL_ench: "盈亏平衡出价",
  rpL_enchAu: "高于此的出价", rpL_inconnu: "未知", rpL_nonReleve: "未读取", rpL_pxInactive: "商品停用", rpL_pxSansOffre: "没有您的报价", rpL_pxNonLu: "尚未读取商品报告", rpL_pxFiche: "商品页价格，未识别 SKU", rpL_pxConf: (p, d) => `设置价格：${p}（商品报告，${d}）`, rpRe_c_nonLu: (s) => `${s} 个待核实（未读取商品报告）`, rpL_pxNonAch: "未读取到可购买的报价", rpL_avant: "之前", rpL_parU: "/ 件", rpL_vjPerte: "失去前每日销量",
  rpL_vj: "每日销量", rpL_vjCumul: "每日累计销量（该商品所有参考）", rpL_moy14: "14 天平均", rpE_attente: "等待确认", rpE_conseil: (p) => `建议：${p}`, rpProposer: "提议此价格",
  rpPropBusy: "发送中…", rpPropGele: "价格锁已关闭：任何价格都无法发送到亚马逊。", rpPropErr: (m) => `未提议：${m}`, rpPropSousMarge: "价格低于最低利润率：它在下方确认栏中以红色显示，仅在点击“忽略利润率限制”后发送。", rpPropRelu: (p) => `在亚马逊读取的价格：${p}`,
  rpDetErr: "详情不可用。", rpGrilleVide: "亚马逊未对此产品估算任何价格。",
  rpJErr: "日志不可用。", rpJ_vide: "最近 30 天无记录。", rpJ_th_date: "日期", rpJ_th_evt: "事件", rpJ_cpt: (n) => `${n} 次无变化记录（每个产品每天最多一次，所有国家）`, rpJ_cout: "采购成本（已固定）", rpJ_estime: "（估算）", rpJ_roi: "成本回报率", rpJ_marge: "利润率", rpJ_bb: "推荐报价", rpJ_bbOui: "持有", rpJ_bbNon: "未持有", rpJ_bornes: "下限 / 上限", rpJ_bas: "最低价 Prime / 非 Prime", rpJ_raison: "原因", rpJ_fige: "固定于", rpJ_nonFige: "提案早于快照：经济数据未固定。", rpJ_regleNonFigee: "规则未固定", rpJ_voir: "查看详情", rpJ_auPa: (p) => `按当前价格（${p}）`, rpJ_auPaC: "按当前价格", rpJ_contrib: "贡献", rpJ_nonEnr: "未记录", rpJ_indispo0: "不可用", rpJ_causes: "原因", rpJ_consq: "后果", rpJ_consqV: (v) => `${v}：不可用`, rpJ_filS: (s) => `调价器跟踪的报价 · 已隐藏其他报价的 ${s} 条记录`, rpJ_filT: "全部历史", rpJ_voirTout: "显示全部历史", rpJ_voirSuiv: "返回跟踪的报价", rpJA_prix_inconnu: "未记录价格", rpJA_frais_absents: "缺少亚马逊费用", rpJA_cout_achat_absent: "缺少采购成本",
  rpJ_ombre: "建议（模拟）", rpJ_prop: "价格提议", rpJ_via_barre: "操作栏", rpJ_via_mcp: "MCP",
  rpJ_St_PENDING: "待处理", rpJ_St_CONFIRMED: "已确认", rpJ_St_SENDING: "发送中", rpJ_St_APPLIED: "已生效", rpJ_St_NOT_APPLIED: "未生效",
  rpJ_St_REFUSED: "已拒绝", rpJ_St_CANCELLED: "已取消", rpJ_St_EXPIRED: "已过期", rpJ_St_UNKNOWN: "结果未知",
  rpR_def: "默认（账户）", rpR_defNone: "无默认规则：未计算任何建议。", rpR_src: "规则", rpR_propre: "专属", rpR_defaut: "默认",
  rpR_margeMin: "最低利润率", rpR_roiMin: "最低成本回报率", rpR_profitMin: "每件最低利润", rpR_margeMax: "最高利润率", rpR_mode: "模式",
  rpR_mode_tous: "满足全部最低值", rpR_mode_au_moins_un: "至少满足一项", rpR_revenir: "恢复默认", rpR_garder: "保留专属规则", rpR_auDefaut: "→ 默认",
  rpR_sansSku: "无卖家 SKU", rpR_n: (n) => `已修改 ${n} 条规则`, rpR_ou: "仅在 GTINPilot 中，不发送至亚马逊", rpR_cancel: "取消", rpR_save: "保存",
  rpR_busy: "保存中…", rpR_ok: "已保存 · 建议将在下次计算时更新", rpR_ko: (m) => `未保存：${m}`,
  rpR_e_champ: (w) => `${w}：应为大于 0 的数字`, rpR_e_vide: (w) => `${w}：至少设置一项最低值（利润率、成本回报率或利润）`,
  rpR_e_maxi: (w) => `${w}：最高利润率 ≤ 最低利润率`, rpR_e_trop: () => "每次最多保存 50 条规则",
  rpTh_situation: "状况", rpTh_situationTip: "报价的当前位置。“建议”一栏给出目标价格：两个标签故意不同。",
  rpTh_ventes: "30 天销量", rpTh_ventesTip: "过去 30 天售出的件数，不含 Vine（Vine 单列）：与“销售”页面的计算相同（账户日，已取消的订单除外）。",
  rpSit_seul_vendeur: "唯一卖家", rpSit_detenue: "持有推荐报价", rpSit_perdue: "失去推荐报价", rpSit_au_plancher: "处于下限", rpSit_cout_inconnu: "成本未知",
  rpSit_sans_offre: "无有效报价", rpSit_inconnue: "未知", rpV_aucune: "该国家无订单记录", rpV_sansArt: (n) => `${n} 个订单尚无商品明细：此数字为下限`, rpV_vine: (n) => `+${n} Vine`, rpV_jours: (n) => `${n} 天`,
  rpV_tip: (u, j) => `${j} 天销量：${u}`,
  rpPli_inactifs: (n) => `无在售报价（${n}）`, rpPli_inactifsD: "未读取到价格或亚马逊上商品未激活：报价未售出前无建议。",
  rpPli_masques: (n) => `已隐藏的产品（${n}）`, rpPli_masquesD: "在 库存 › 商品 中隐藏：仅从列表移除，仍在跟踪。",
  rpPli_desactives: (n) => `已停用（${n}）`, rpPli_desactivesD: "已在整个 GTINPilot 中停用：调价器不再给出建议。可在 库存 › 商品 中重新启用。",
  rpNoneActif: "这些筛选条件下没有在售报价。",rpC_non_achetable: "不可购买 · 无库存",
  rpL_pubTip: (a, b) => `广告花费 ÷ 售出件数，${a} 至 ${b}`, rpPubR_rapport_pub_absent: "该国家无广告报告", rpPubR_rapport_pub_incomplet: "30 天广告报告不完整",
  rpPubR_aucune_vente: "30 天内无售出", rpPubR_devise_pub_differente: "广告花费为其他货币", rpPubR_quantite_absente: "某订单缺少数量", rpPubR_tables_absentes: "数据缺失",
  rpL_enchN: (n, m) => `${n} 个出价高于 ${m}`, rpL_ench0: (m) => `没有高于 ${m} 的出价`,
  rpLb_dateInc: "日期未知", rpLb_voirJournal: "查看日志", rpLb_voirN: (n) => `查看这 ${n} 个`, rpLb_horsListe: (n) => `${n} 个不在本页（国家或产品无近期读取）`, rpEd_e_choix: "请为两边都更改的每个字段选择要保留的值。", rpEd_cflAucunDeux: "没有两边都更改的字段；若有，需在保存前于此选择。", rpEd_cflDeux: "有字段两边都已更改：保存前请选择要保留的值。", rpEd_inchanges: "未更改", rpEd_aChoisir: "待选择", rpEd_oIdentiques: "相同", rpPp_calcAvec: (r, a) => `${a}前按 ${r} 计算`, rpPp_stale: (r, a) => `建议是 ${a}前按 ${r} 计算的 — 下次运行时重新计算`, rpPp_ageMin: (n) => `${n}\u00a0分钟`, rpPp_ageHM: (h, m) => `${h}\u00a0小时\u00a0${m}\u00a0分钟`, rpPp_ageH: (n) => `${n}\u00a0小时`, rpPp_nonNotee: "未记录规则", rpPp_fxD_conflitAvec: (r) => `：${r} 的界限使价格表中没有任何价格可用。`, rpPp_recalcul: "这已不是当前规则：下次运行时重新计算。", rpPp_reaffecter: "重新分配", rpPp_compteNonModif: "账户规则：此处不可修改", rpLb_simT: "仅模拟。", rpLb_simD: "这些规则只计算建议，不会修改任何亚马逊价格。",
  rpLb_ordre: "顺序：", rpLb_o1: "产品专属规则", rpLb_o2: "已分配的命名规则", rpLb_o3: "账户规则",
  rpLb_titre: "规则库", rpLb_sous: "可复用的规则，按产品 × 国家分配", rpLb_defs: "定义", rpLb_affecter: "分配规则", rpLb_nouvelle: "新建规则",
  rpLb_thRegle: "规则", rpLb_thBar: "价格界限", rpLb_thEcart: "差距", rpLb_thAff: "已分配", rpLb_thPays: "国家", rpLb_thActs: "操作",
  rpLb_compte: "账户规则", rpLb_tagDef: "默认", rpLb_compteD: "适用于没有其他规则的所有产品 × 国家",
  rpLb_compteAbs: "无账户规则：没有命名规则或专属规则时不给建议。",
  rpLb_compteLock: "此处不可修改 · 在账户配置中设定，目前没有对应页面",
  rpLb_mini: "最低", rpLb_maxi: "最高", rpLb_sansPlafond: "无上限", rpLb_et: "且", rpLb_ou: "或",
  rpLb_c_profit: "利润", rpLb_c_marge: "利润率", rpLb_c_roi: "成本回报率", rpLb_ecNon: "未设置", rpLb_ecNonT: "未设置差价：此规则下引擎不应用任何差价。", rpLb_ecClasserT: "方式待分类：引擎不应用任何差价。", rpLb_ecT: "引擎对此定价方式应用的差价。",
  rpLb_pxp: "产品 × 国家", rpLb_dontApp: (n) => `其中 ${n} 个已生效`, rpLb_tousPays: "所有国家", rpLb_nNommees: (n) => `${n} 条命名规则`,
  rpLb_version: (v, le, par) => `版本 ${v}${le ? ` · ${le}` : ""}${par ? ` · ${par}` : ""}`,
  rpLb_appliquer: "全部应用", rpLb_modifier: "修改", rpLb_dupliquer: "复制", rpLb_supprimer: "删除", rpLb_supprT: "删除（归档，可恢复）",
  rpLb_autres: (nom) => `更多操作 · ${nom}`, rpLb_copie: (nom) => `${nom}（副本）`,
  rpLb_arch: (n) => `已归档（${n}）`, rpLb_archD: "可恢复", rpLb_restaurer: "恢复",
  rpLb_s_personnalise: "自定义", rpLb_s_prudent: "稳健", rpLb_s_equilibre: "平衡", rpLb_s_offensif: "进攻", rpLb_s_destockage: "清仓",
  rpLb_n_prudent: "保护利润率", rpLb_n_equilibre: "平衡 Buy Box", rpLb_n_offensif: "抢占（Q4）", rpLb_n_destockage: "清仓",
  rpLb_videT: "没有命名规则", rpLb_videD: (n, p) => `账户规则适用于 ${n} 个产品 × 国家（${p} 个国家）。`,
  rpLb_videD2: "命名规则只需创建一次，可分配给多个产品 × 国家；修改会生成新版本，其产品随之更新。",
  rpLb_partir: "从此模板开始", rpLb_lecture: "正在读取账户规则…",
  rpLb_errT: "规则无法读取", rpLb_errD: "无法读取该账户的规则文件。在读取成功前不应用任何规则：不会悄悄退回账户规则。",
  rpLb_errD2: (d) => `显示的建议来自最近一次成功计算（${d}），已过期。`, rpLb_reessayer: "重试",
  rpLb_lockT: "写入已停用", rpLb_lockD: "文件无法读取期间：覆盖无法读取的文件可能抹掉其中的规则。",
  rpLb_detail: "详情：", rpLb_offT: "写入已停用：规则文件无法读取",
  rpLb_apT: (nom, v) => `将「${nom}」v${v} 应用到全部`, rpLb_apBig: "个产品 × 国家更换规则",
  rpLb_apNote: (n, p) => `在该规则覆盖的 ${p} 个国家的 ${n} 个产品 × 国家中。仅模拟：不修改任何亚马逊价格。`,
  rpLb_apChg: "更换规则：命名规则生效", rpLb_apDeja: (nom) => `已在「${nom}」上：不变`,
  rpLb_apProp: "保留专属规则：分配已保存，但被专属规则取代", rpLb_apHors: (p) => `未改动：${p}，规则未覆盖`,
  rpLb_apSans: "无卖家 SKU：未改动", rpLb_rien: (nom) => `无需更改：所有覆盖的产品 × 国家已在「${nom}」上。`,
  rpLb_resOk: (n) => `已分配 ${n} 个产品 × 国家 · 仅模拟，亚马逊无任何变化。`,
  rpLb_resPart: (ok, tot, ko) => `${tot} 个中已分配 ${ok} 个 · ${ko} 个未分配`, rpLb_resPartD: "其余分配已保存。",
  rpLb_r_CONFLIT: "分配期间已被修改；该产品未作任何更改", rpLb_r_PAYS_NON_COUVERT: "规则未覆盖该国家；该产品未作任何更改",
  rpLb_r_ARCHIVEE: "规则期间已归档；该产品未作任何更改", rpLb_r_INTROUVABLE: "找不到规则；该产品未作任何更改",
  rpLb_reessayerN: (n) => `重试这 ${n} 个`,
  rpLb_suppRefus: (n, nom) => `删除被拒：${n} 个产品 × 国家正在使用「${nom}」。请先重新分配；删除即归档，可恢复。`,
  rpLb_vbT: "待确认的修改 — 1 项", rpLb_annuler: "取消", rpLb_valider: "确认", rpLb_enCours: "正在保存…",
  rpLb_vbSim: "仅模拟 · 不修改任何亚马逊价格",
  rpLb_vb_affect: (nom, v, n, p) => `分配「${nom}」v${v}：${n} 个产品 × 国家${p ? ` · ${p} 个保留专属规则` : ""}`,
  rpLb_vb_affectD: "产品会跟随规则的每个新版本。", rpLb_vb_affMulti: (n, p) => `已选 ${n} 个产品 × ${p} 个国家`,
  rpLb_vb_aucune: (qui) => `移除 ${qui} 的分配：将应用账户规则`,
  rpLb_vb_archiver: (nom) => `归档「${nom}」`, rpLb_vb_archiverD: "归档后仍可恢复；没有产品在使用。",
  rpLb_vb_restaurer: (nom) => `恢复「${nom}」`, rpLb_vb_retirer: (qui) => `移除 ${qui} 的专属规则`,
  rpLb_vb_retirerD: "将应用已分配的命名规则，否则应用账户规则。不会删除其他内容。",
  rpLb_okMsg: "规则已保存 · 仅模拟，亚马逊无任何变化。", rpLb_ko: (m) => `未保存任何内容：${m}`,
  rpLb_archOk: (nom) => `「${nom}」已归档（可恢复）。`, rpLb_restOk: (nom) => `「${nom}」已恢复。`, rpLb_retOk: "专属规则已移除。",
  rpEd_titreMod: "修改规则", rpEd_titreNew: "新建规则", rpEd_titreProp: (qui) => `专属规则 · ${qui}`,
  rpEd_metaMod: (nom, v, le) => `${nom} · 版本 ${v}${le ? ` · 修改于 ${le}` : ""}`, rpEd_metaNew: "草稿 · 尚未保存", rpEd_metaProp: (v) => `版本 ${v}`,
  rpEd_fermer: "关闭", rpEd_ident: "名称", rpEd_nom: "规则名称", rpEd_affA: "已分配", rpEd_affN: (n) => `${n} 个产品 × 国家`, rpEd_aucunProd: "无产品",
  rpEd_vInfo: (a, b) => `版本 ${a} → ${b}`, rpEd_vNew: "新建",
  rpEd_hintMod: (v, n) => `保存将生成版本 ${v}；已分配的 ${n} 个产品 × 国家随之更新。每次模拟都会记录所用版本。`,
  rpEd_hintNew: "新规则：保存时为版本 1，未分配给任何产品。",
  rpEd_style: "规则风格", rpEd_styleH: "风格会预填下方界限；自定义保留已输入的值。", rpEd_rec: "推荐",
  rpEd_sd_personnalise: "不作更改", rpEd_sd_prudent: "利润率优先", rpEd_sd_equilibre: "利润率与推荐报价", rpEd_sd_offensif: "较低最低值", rpEd_sd_destockage: "绝不低于成本",
  rpEd_bar: "价格界限", rpEd_defH: "定义 — 与计算一致",
  rpEd_dBen: "不含税价 − 该价格下的亚马逊费用 − 采购成本（加权平均），每件，广告前", rpEd_dMarge: "利润 ÷ 不含税价", rpEd_dRoi: "利润 ÷ 采购成本",
  rpEd_mins: "最低值", rpEd_maxs: "最高值", rpEd_aucun: "无", rpEd_devPays: "该国货币",
  rpEd_f_profitMin: "每单最低利润", rpEd_f_margeMin: "最低利润率", rpEd_f_roiMin: "最低成本回报率",
  rpEd_f_profitMax: "每单最高利润", rpEd_f_margeMax: "最高利润率", rpEd_f_roiMax: "最高成本回报率",
  rpEd_modeMin: "最低值：且 / 或", rpEd_modeMax: "最高值：且 / 或", rpEd_tousMin: "满足所有已设最低值", rpEd_tousMax: "满足所有已设最高值", rpEd_auMoins: "至少一个",
  rpEd_maxH0: "未设最高值：无上限。", rpEd_maxH1: "最高值只会缩小允许的价格范围。", rpEd_maxH2: "最高值绝不会解除最低值或保护措施。",
  rpEd_exDes: "允许价格自", rpEd_exSans: "· 无上限", rpEd_exJusq: (m) => `· 最高 ${m}`, rpEd_ok: "界限兼容", rpEd_exCout: "成本",
  rpEd_exAucun: "其价格表中没有价格满足这些界限", rpEd_exNone: "数值示例：正在读取某产品的价格表…",
  rpEd_vide: "没有允许的价格", rpEd_videD: (x) => `：${x} 无法同时成立。对所有产品都如此；修改其中之一才能保存。`,
  rpEd_contra: "界限相互矛盾", rpEd_contraD: (x) => `：${x}。最高值必须大于同一指标的最低值；修改后才能保存。`,
  rpEd_saveImp: "无法保存：没有允许的价格", rpEd_saveImpT: "没有允许的价格：请修改界限",
  rpEd_pays: "规则适用的国家", rpEd_tousPays: "账户的所有国家", rpEd_tousPaysD: "包括以后新增的国家", rpEd_certains: "部分国家", rpEd_certainsD: "在下方勾选",
  rpEd_paysH: "未勾选的国家：规则在该国从不生效。仍分配在该国的产品会标为「已分配，但不适用」，并写明实际应用的规则。",
  rpEd_soon: "计划中，尚未启用", rpEd_soonN: (n) => `${n} 项设置`,
  rpEd_x_pause: "定时暂停", rpEd_xd_pause: "在选定时段内保持价格不变。", rpEd_xf_pause: [["时段", "+ 添加时段"]],
  rpEd_x_conc: "竞争", rpEd_xd_conc: "如何应对亚马逊自营及卖家自配送的卖家。",
  rpEd_xf_conc: [["面对亚马逊", "有利润则跟价，否则放弃"], ["卖家自配送的卖家", "纳入考虑"], ["与目标价的差距", "0 · 跟价"], ["每日最大涨跌幅", "—"]],
  rpEd_x_cas: "特殊情况", rpEd_xd_cas: "推荐报价被撤销、竞争者低于底价、报价唯一或已持有推荐报价时如何处理。",
  rpEd_xf_cas: [["亚马逊撤销推荐报价", "不改价格"], ["竞争者低于底价", "不改价格"], ["商品页仅有一个报价", "不改价格"], ["已持有推荐报价", "不改价格"]],
  rpEd_x_battre: "目标价", rpEd_xd_battre: "以哪个价格为目标，计入哪些竞争者。", rpEd_xf_battre: [["目标价格", "推荐报价的价格"], ["卖家最低好评率", "—"]],
  rpEd_x_yoyo: "防反复保护", rpEd_xd_yoyo: "若价格与其他软件来回涨跌，暂停时间随每次重复而延长，原因写入日志。",
  rpEd_xf_yoyo: [["暂停", "冲突重复时 6 小时 › 24 小时 › 72 小时 · 绝不静默冻结"]],
  rpEd_x_auto: "自动化", rpEd_xd_auto: "产品不再售出时切换规则，按国家及共享库存分别计算。",
  rpEd_xf_auto: [["连续未售出", "20 › 35 › 50 › 65 天"], ["随后切换到", "下一条规则"]],
  rpEd_note: "保存不会修改亚马逊上的任何价格。", rpEd_facon: "您如何定价？", rpEd_fc_concurrents: "SmartPrice", rpEd_fcd_concurrents: "您的品牌对标其他品牌的竞争产品。",
  rpEd_vf_m001: (c) => `便宜 0.01 ${c}`, rpEd_vfRef_foep: "亚马逊建议价格", rpEd_vfRef_bas: "最低送达价格", rpEd_exT: "虚构示例 · 非真实商品", rpEd_exVed: "推荐报价", rpEd_exPl: "最低价", rpEd_exGarde: "保持在最低价", rpEd_vfRef: "推荐报价", rpEd_vfH: "在此规则计入的同一商品页卖家中", rpEd_vfPl: "计入的卖家", rpEd_vfExp_tous: "所有卖家", rpEd_vfExpD_tous: "商品页上记录到的每个卖家都计入，无论由谁发货。", rpEd_vfExp_amazon: "仅限亚马逊配送", rpEd_vfExpD_amazon: "只计入报价由亚马逊配送的卖家。不知道由谁发货的卖家不计入。", rpEd_vfExpH: "排除某个卖家：即将推出，可在商品页卖家列表中操作。", rpEd_vfPh_aucun: "请选择价差：价格将跟随推荐报价，绝不低于底价，也不高于上限。", rpEd_e_vf: "价差：正数，最多两位小数。", rpEd_fcRfOk: "已保存选择。在模拟中计算：不会向亚马逊发送任何价格。", rpEd_fcRfNonEnr: "将随规则一起保存。在模拟中计算：不会向亚马逊发送任何价格。", rpEd_fc_vendeurs_fiche: "Repricer", rpEd_fcd_vendeurs_fiche: "您与其他卖家在同一亚马逊商品页上。", rpEd_fcAClasser: "待分类：在选择方式之前，规则保持当前计算。", rpEd_fcNonEnr: "将随规则一起保存。此计算尚未启用：目前没有建议依赖它。", rpEd_fcInactif: "已保存选择。此计算尚未启用：目前没有建议依赖它。",
  rpEd_fcLe: (d) => `选择于 ${d}.`,
  rpEd_enr: "保存", rpEd_resAria: "规则预览", rpEd_pl_lim: "限制", rpEd_pl_ctb: "贡献", rpEd_pl_pays: "国家", rpEd_pl_mode: "模式", rpEd_plv_profit: "贡献", rpEd_plv_marge: "利润率", rpEd_plv_roi: "成本回报率", rpEd_plv_mini: (x) => `最低 ${x}`, rpEd_plv_maxi: (x) => `最高 ${x}`, rpEd_plv_aucune: "无限制", rpEd_plv_ctb: "不含税价格 − 费用 − 采购成本，广告前", rpEd_plv_mode_concurrents: "竞争产品", rpEd_plv_mode_vendeurs_fiche: "同一商品页的卖家",
  rpEd_clsRes: "在设置模式之前，此规则保持当前计算。", rpEd_clsN: (n) => `${n} 个报价使用此规则`, rpEd_fcSpOk: "已保存选择。", rpEd_fcSpNonEnr: "将随规则一起保存。", rpEd_fcSpSans: "没有价差时，SmartPrice 不跟随任何竞争对手；只会把超出规则的价格（过低、过高或不允许）拉回规则内。", rpEd_ecExPlC: (x) => `贡献 ${x}`, rpEd_ecCoChoisir: "选择一个可比竞争对手", rpEd_ecCoHors: (a) => `${a}（已不可比）`,
  rpEd_fcq_concurrents: "对标竞争产品", rpEd_fcq_vendeurs_fiche: "对标同一商品页的其他卖家", rpEd_clsT: "此规则尚未设置模式。", rpEd_clsD: (n) => `它早于 SmartPrice。${n} 个报价使用此规则。选择一次即可；其限制将保留。`, rpEd_passer_concurrents: "切换到 SmartPrice", rpEd_passer_vendeurs_fiche: "切换到 Repricer", rpEd_mq_facon: "请选择模式后保存。不会修改亚马逊上的任何价格。", rpEd_mq_ecart: "请选择价差后保存。不会修改亚马逊上的任何价格。",
  rpEd_ec: "价差", rpEd_ec_m5: "便宜 5%", rpEd_ec_0: "相同价格", rpEd_ec_p5: "贵 5%", rpEd_ec_autre: "其他", rpEd_ecQue: "相对于", rpEd_ecRef: "参考价", rpEd_ecC_moins_cher: "最低价", rpEd_ecC_mediane: "中位数", rpEd_ecC_choisi: "指定的竞争对手", rpEd_ecVal: "价差", rpEd_ecU: "单位", rpEd_ecS: "方向", rpEd_ecS_moins: "更便宜", rpEd_ecS_plus: "更贵", rpEd_ecAsin: "竞争对手 ASIN", rpEd_ecH: "在您标记为可比的竞争对手中，逐个产品", rpEd_e_ecart: "价差：正数，最多两位小数，低于 100%（或货币 10,000）。", rpEd_e_asin: "竞争对手 ASIN：10 位字母或数字。",
  rpEd_ecPh_aucun: "请选择价差：价格将跟随可比竞争对手，绝不低于底价，也不高于上限。", rpEd_ecPh_moins: (v, r) => `价格比参考（${r}）低 ${v}，绝不低于底价，也不高于上限。`, rpEd_ecPh_egal: (r) => `价格与参考（${r}）相同，绝不低于底价，也不高于上限。`, rpEd_ecPh_plus: (v, r) => `价格比参考（${r}）高 ${v}，绝不低于底价，也不高于上限。`, rpEd_ecR_moins_cher: "可比竞争对手中的最低价", rpEd_ecR_mediane: "可比竞争对手的中位数", rpEd_ecR_choisi: (a) => `竞争对手 ${a}`,
  rpEd_ecEx: (n) => `示例 · ${n}`, rpEd_ecExMoins: (n) => `${n} 个可比对手中最低`, rpEd_ecExMed: "中位数", rpEd_ecExMedD: (n) => `${n} 个可比对手`, rpEd_ecExChoisi: "指定的竞争对手", rpEd_ecExCons: "建议价格", rpEd_ecExCtb: "每单贡献", rpEd_ecExCtbD: "不含税、广告前、估算", rpEd_ecExPl: "底价", rpEd_ecExPlD: "限制允许的第一个价格", rpEd_ecExNone: "无法计算示例：已加载的产品中，没有足够的可比竞争对手有近期价格。",
  rpLb_fClasser: "待分类", rpEd_annuler: "取消", rpEd_saveV: (v) => `保存版本 ${v}`, rpEd_saveNew: "保存规则",
  rpEd_saveProp: "保存专属规则", rpEd_busy: "正在保存…", rpEd_ko: (m) => `未写入任何内容：${m}`,
  rpEd_cflProp: "专属规则已在别处更改：未写入任何内容。请关闭并重新打开，从已保存的版本开始。",
  rpEd_e_champ: "某个界限不是正数。", rpEd_e_grand: "最低利润：每单低于 100；最高利润：低于一百万。", rpEd_e_vide: "至少设置一个最低值：利润、利润率或成本回报率。",
  rpEd_e_maxi: "某个最高值不大于同一指标的最低值。", rpEd_e_nom: "规则名称：1 至 80 个字符。", rpEd_e_pays: "请至少选择一个国家。",
  rpEd_cflT: "修改期间该规则已被更改：未写入任何内容。",
  rpEd_cflD: (lu, v, le) => `读取的是版本 ${lu}；版本 ${v} 已在别处保存${le ? `（${le}）` : ""}。以下是建议的合并；只有点击「保存版本 ${v + 1}」才会保存。`,
  rpEd_cChamp: "字段", rpEd_cLu: (v) => `读取（v${v}）`, rpEd_cSaisie: "此处输入", rpEd_cTrouve: (v) => `版本 ${v}`, rpEd_cRes: (v) => `结果 v${v}`, rpEd_cOrig: "来源",
  rpEd_oSaisie: "保留输入", rpEd_oReprise: (v) => `采用版本 ${v}`, rpEd_oIdem: "没有字段不同：只有版本变化。", rpEd_abandon: (v) => `放弃输入（保留版本 ${v}）`,
  rpPp_ouvrir: "各国规则与价格", rpPp_retour: "所有产品", rpPp_cout: "采购成本", rpPp_coutMoy: "加权平均", rpPp_charge: "计算中…",
  rpPp_th_pays: "国家", rpPp_th_etat: "报价 · 推荐", rpPp_th_prix: "当前含税价", rpPp_th_cons: "建议 · 模拟", rpPp_th_ben: "利润", rpPp_th_marge: "不含税价利润率",
  rpPp_th_roi: "回报 / 成本", rpPp_th_eq: "保本价", rpPp_th_mini: "规则最低价", rpPp_th_aff: "已分配规则", rpPp_th_app: "实际应用规则",
  rpPp_conseil: "建议", rpPp_roi2: "成本回报率", rpPp_mini2: "规则最低价", rpPp_plus: "利润、利润率、保本价、最低价",
  rpPp_active: "有效", rpPp_inactive: "无效", rpPp_bbNous: "推荐报价：我们", rpPp_bbInc: "推荐报价未知", rpPp_inactif: "报价无效：无建议",
  rpPp_indispo: "不可用", rpPp_sansApp: "无适用规则", rpPp_garder: "保持", rpPp_releve: (h) => `${h} 小时前读取`,
  rpPp_foepT: "尚未读取亚马逊目标价：「保持」可能源于此缺失", rpPp_dansBornes: "在界限内",
  rpPp_g_buy_box_detenue: "推荐报价归我们", rpPp_g_seule_offre: "唯一报价", rpPp_g_buy_box_perdue_sans_prix_a_viser: "未读取目标价", rpPp_g_deja_au_prix_vise: "已在目标价",
  rpPp_horsGrille: "不在价格表中", rpPp_enConflit: "冲突",
  rpPp_selAucune: "— 无", rpPp_selNonCouv: "（未覆盖该国）", rpPp_introuvable: "找不到规则", rpPp_choisir: (mp) => `已分配规则 · ${mp}`,
  rpPp_propreSeule: "仅专属规则", rpPp_rempl: (v) => `v${v} · 被专属规则取代`,
  rpPp_et_pays_non_couvert: "已分配，但不适用", rpPp_et_archivee: "已归档 · 未应用", rpPp_et_introuvable: "找不到 · 未应用",
  rpPp_aucuneApp: "无", rpPp_compteAbs: "无账户规则", rpPp_sansRegle: "无规则", rpPp_propre: "专属规则",
  rpPp_src_produit: "专属", rpPp_src_nommee: "命名", rpPp_src_defaut: "账户",
  rpPp_motif_pays_non_couvert: "代替已分配规则：未覆盖该国", rpPp_motif_archivee: "代替已分配规则：已归档",
  rpPp_motif_introuvable: "代替已分配规则：找不到",
  rpPp_calcT: (p) => `计算明细 · ${p} 当前价格`, rpPp_ttc: "含税", rpPp_tva: "增值税", rpPp_ht: "不含税", rpPp_frais: "该价格下的亚马逊费用", rpPp_coutA: "采购成本",
  rpPp_benef: "利润", rpPp_marge: "利润率", rpPp_roi: "成本回报率",
  rpPp_fxT_remplacee: "已分配命名规则，但被该产品的专属规则取代。", rpPp_fxD_remplacee: (nom, v, p) => `「${nom}」v${v} 已为 ${p} 保存；应用的是专属规则。`,
  rpPp_creerPropre: "创建专属规则", rpPp_retirerPropre: "移除专属规则", rpPp_modPropre: "修改专属规则", rpPp_modRegle: "修改规则",
  rpPp_fxT_pays: "已分配的规则未覆盖该国。", rpPp_fxD_pays: (nom, p) => `「${nom}」未覆盖 ${p}：在此不生效。改为应用账户规则，并在「实际应用规则」中写明。`,
  rpPp_ajouterPays: (c) => `将 ${c} 加入规则`, rpPp_autreRegle: "分配其他规则",
  rpPp_fxT_archivee: "命名规则已归档：未应用。", rpPp_fxD_archivee: (nom) => `「${nom}」已归档；改为应用账户规则。`,
  rpPp_fxT_introuvable: "找不到命名规则：未应用。", rpPp_fxD_introuvable: "分配指向已不存在的规则；改为应用账户规则。",
  rpPp_fxT_aucune: "无适用规则：无建议。", rpPp_fxD_aucune: "已分配规则在此不适用，且账户没有规则：不会被悄悄替代。",
  rpPp_fxT_conflit: "没有允许的价格", rpPp_fxD_conflit: "：实际应用规则的界限使价格表中没有任何价格可用。",
  rpPp_fxT_perime: (h) => `价格读取过旧（${h} 小时）`, rpPp_fxD_perime: "：在收到 36 小时内的读取前不给任何建议。",
  rpPp_coutT: "采购成本未知", rpPp_coutD: (n) => `：${n} 个国家的利润、利润率和最低价都无法计算；无建议。`, rpPp_saisirCout: "填写采购成本",
  rpPp_f1T: "尚未读取亚马逊目标价", rpPp_f1D: "：「保持」可能源于此缺失。",
  rpPp_f2T: "推荐报价", rpPp_f2D: "：「我们」或「未知」；读取尚无法判断「已失去」。",
  rpPp_f3T: "数字", rpPp_f3D: " 按当前含税价、广告前计算；利润率基于不含税价 · 每次模拟记录规则与版本 · 超过 36 小时的读取 = 不可用。",
  rpAf_sel: (n) => `已选 ${n} 个产品`, rpAf_sur: (n) => `共 ${n} 个`, rpAf_desel: "全部取消", rpAf_tout: "全选", rpAf_cocher: "选择",
  rpAf_th_prod: "产品", rpAf_th_pays: "销售国家", rpAf_th_regles: "当前规则", rpAf_titre: (n) => `分配规则 · ${n} 个产品`,
  rpAf_regle: "规则", rpAf_choisir: "选择规则", rpAf_pays: "国家", rpAf_apercu: "预览", rpAf_nonCouv: "未覆盖",
  rpAf_vendus: (tot, sans) => `个所选国家中有销售的产品 × 国家（共 ${tot} 个；${sans} 个无报价，未改动）`,
  rpAf_chg: "更换规则：所选规则生效", rpAf_deja: "已在此规则上：不变", rpAf_prop: "保留专属规则：分配已保存，但不生效",
  rpAf_hint: "不附加任何自动操作：只更改分配。仅模拟，不修改任何亚马逊价格。", rpAf_aucunSel: "请在列表中勾选产品。",
  rpRe_envLc: (a) => `复核 ${a}`, rpRe_coutEstC: "估算成本", rpRe_coutDc: "无法计算价格", rpRe_gc_tenue: (n) => `${n} 个已持有`, rpRe_gc_perdue: (n) => `${n} 个已失去`, rpRe_gc_aucune: (n) => `${n} 个无推荐报价`, rpRe_gc_inconnue: (n) => `${n} 个未知`,
  rpRe_iAria: "推荐报价状态", rpRe_i_offres: "报价", rpRe_i_tenue: "已持有", rpRe_i_perdue: "已失去", rpRe_i_aucune: "无推荐报价", rpRe_i_inconnue: "未知",
  rpRe_g_tenue: (n) => `${n} 个持有推荐报价`, rpRe_g_perdue: (n) => `${n} 个推荐报价已失去`, rpRe_g_aucune: (n) => `${n} 个商品页无推荐报价`, rpRe_g_inconnue: (n) => `${n} 个状态未知`,
  rpRe_simuP: "模拟：", rpRe_aLire: (n) => `${n} 条建议待阅读`, rpRe_pos: (n) => `推荐报价状态，共 ${n} 个报价`,
  rpRe_rien: "无需操作", rpRe_rienD: (h, n) => `没有报价需要操作。最近一次计算于 ${h}，共 ${n} 个报价。`, rpRe_rienDx: (n) => `没有报价需要操作，共 ${n} 个报价。`, rpRe_prochaines: "后续操作将显示在这里。",
  rpRe_coutEst: "估算采购成本：", rpRe_coutInc: "采购成本未知", rpRe_aConf: "待确认", rpRe_coutD: "在 COGS 中确认成本之前无法计算价格", rpRe_confCogs: "在 COGS 中确认",
  rpRe_conflitD: (p, f) => `下限 ${p} 高于上限 ${f}`, rpRe_sousPl: "推荐报价低于您的下限", rpRe_sousPlD: "价格保持在下限 · 有利可图的选择", rpRe_sousPlDx: "价格保持不变 · 有利可图的选择",
  rpRe_nivInc: "级别未知", rpRe_pays: "国家：",
  rpRe_trier: "排序", rpRe_trierP: "排序：", rpRe_tri_pays: "国家", rpRe_tri_produit: "产品", rpRe_tri_variation: "变化", rpRe_tri_contribution: "贡献",
  rpRf_regle: (n) => `规则：${n}`, rpRf_st_tenue: "已持有推荐报价", rpRf_st_perdue: "已失去推荐报价", rpRf_st_aucune: "无推荐报价", rpRf_st_inconnue: "推荐报价未知",
  rpRf_simt: "模拟 · 不向亚马逊发送", rpRf_conserve: "价格保持在底价", rpRf_garde: "价格保持", rpRf_ved: "推荐报价", rpRf_suiv: "下一个报价",
  rpRf_actuel: "当前价格", rpRf_propose: "建议价格", rpRf_veut: "这意味着什么", rpRf_faire: "您可以做什么",
  rpRf_alignB: "与推荐报价含运费价格相同", rpRf_align: (q, p, port, x) => `，由${q}持有：您的商品价格 ${p} + 运费 ${port}${x}，`, rpRf_align2: "。对齐而非更便宜：达到此价格并不保证获得推荐报价。",
  rpRf_viseB: (p) => `目标价格：${p}`, rpRf_vise: (pv, port) => `，对应含运费 ${pv} 的推荐报价（您的运费：${port}）。达到此价格并不保证获得推荐报价。`,
  rpRf_plafB: "处于您规则的上限", rpRf_plaf: (pv, pf) => `：推荐报价含运费为 ${pv}，高于您的上限 ${pf}。达到此价格并不保证获得推荐报价。`,
  rpRf_tenueB: "您持有推荐报价。", rpRf_suivTxt: (p, l) => ` 下一个计入的报价${l ? `（${l}）` : ""}含运费为 ${p}。`, rpRf_hausse24: (m, h) => ` 可选提价：24 小时内最多 ${m}，以您昨天的价格（${h}）为起点。`,
  rpRf_hausse: " 可选提价。", rpRf_risque: " 提价可能使您失去推荐报价。", rpRf_tenueGarde: " 价格保持。",
  rpRf_sousPl: (q, pv, ec) => `${q}以 ${pv} 持有推荐报价，比您的底价低 ${ec}。`, rpRf_sousPlCtb: (x) => ` 在该价格下，您每单的贡献将降至 ≈ ${x}`, rpRf_minDe: (m) => `，最低为 ${m}`,
  rpRf_inconnue: "推荐报价状态未知：不计算任何价格。", rpRf_cause: (x) => `原因：${x}。`, rpRf_aucune: "上次读取时此商品页无推荐报价：不计算任何价格。",
  rpRf_ctbK: "预估贡献（不含税）", rpRf_ctbK2: "广告前预估贡献", rpRf_vente: " / 单",
  rpRf_ctbAu: (b, ec, m) => `广告前预估贡献：每单 ${b}，比您的最低值 ${m} 高 ${ec}。`, rpRf_ctbSur: (b, ec, m) => `广告前预估贡献：每单 ${b}，比您的最高值 ${m} 高 ${ec}。`, rpRf_ctbSous: (b, ec, m) => `广告前预估贡献：每单 ${b}，比您的最低值 ${m} 低 ${ec}。`,
  rpRf_ctbPerte: "如果失去推荐报价，新的计算将建议降价，需确认。", rpRf_ctbAct: (p) => `按您当前价格 ${p}。`, rpRf_ctbActMin: (p) => `按您当前价格 ${p}：这是您的最低值。`,
  rpRf_simnB: "模拟。", rpRf_simn: " 不会有价格发送到亚马逊。此建议仅供阅读，不会发送。",
  rpRf_f_garder: (p) => `保持 ${p}`, rpRf_f_garderPl: "，即您的底价：一个有利可图的选择。", rpRf_f_remonte: "如果推荐报价回升，新的计算将建议提价，需确认。", rpRf_f_min: (n) => `或降低规则的最低值（${n} 个报价）。`,
  rpRf_vdr: "商品页卖家", rpRf_mInc: "资格未知", rpRf_mBientot: "即将推出", rpRf_mSecu: "模拟 · 尚未开放发送", rpRf_deux: (a, b) => `${a}：${b}`, rpRf_vdL: (l) => `卖家 ${l}`, rpRf_autreV: "另一卖家", rpRf_autreVM: "另一卖家", rpRf_nOffres: (n) => `${n} 个报价`, rpRf_expA: "（亚马逊配送）", rpRf_expV: "（自行配送）", rpRf_vdrInc: "读取时间未知", rpRf_hist: "价格历史",
  rpRe_videT: "没有报价使用 Repricer", rpRe_videD: "Repricer 将您的价格与同一亚马逊商品页的其他卖家对比，以保持推荐报价。两步即可获得首批建议。",
  rpRe_e_1: "规则", rpRe_e_1d: "差价与限制", rpRe_e_1a: "创建规则", rpRe_e_2: "报价", rpRe_e_2d: "应用规则", rpRe_videB: "每个商品页的卖家均从亚马逊读取：无需其他选择。",
  rpC_simulation: "模拟", rpRzK_offre_vedette_perdue_prix_vise: "按推荐报价价格", rpRzK_offre_vedette_perdue_prix_vise_plafond: "处于上限，低于推荐报价",
  rpRzK_hausse_vers_vendeur_suivant: "可选涨价", rpRzK_hausse_vers_vendeur_suivant_plafond: "可选涨价", rpRzK_hausse_vers_vendeur_suivant_limite_24h: "可选涨价",
  rpSpF_rien: "无需操作", rpSpF_aCompleter: "待完善的设置", rpSpF_sansTxt: (n, p) => `${n} 个报价，价格保持不变${p ? `：${p}` : ""}`, rpSpF_dVise: (n) => `${n} 个处于目标价`,
  rpSpFcD: "价格无法计算", rpSpFcD_cout_inconnu: "缺少此成本，价格无法计算", rpSpFcD_bornes_en_conflit: "在这些限制下价格无法计算",
  rpK5_aria: "价格相对目标价的位置", rpK5_offres: "报价", rpK5_vise: "处于目标价", rpK5_ajuster: "待调整", rpK5_plancher: "处于下限", rpK5_nonCalc: "无法计算",
  rpK5_aFaire: "待办：", rpK5_env: (n) => `${n} 个发送待核实`, rpK5_prix: (n) => `${n} 个价格待确认`, rpK5_conf: (n) => `${n} 项设置待完善`,
  rpK5_pos: (n) => `您的价格相对目标价的位置，共 ${n} 个报价`, rpSl_thVar: "变化", rpSl_thRaison: "原因", rpSl_thCtb: "贡献*",
  rpSl_ctbNote: "* 按建议价估算的每笔销售贡献，不含税，未计广告。", rpSl_sku: (s) => `SKU：${s}`, rpSl_skuInc: "SKU 未知", rpSp_apres: (n) => `第 ${n} 步之后`,
  rpRzK_sous_le_plancher: "升至下限", rpRzK_au_dessus_du_plafond: "降至上限", rpRzK_prix_actuel_non_admissible: "回到规则范围内", rpRzK_cible_concurrents: "处于目标价", rpRzK_cible_concurrents_plancher: "目标低于下限", rpRzK_cible_concurrents_plafond: "目标高于上限", rpRzK_cible_concurrents_hors_regle: "目标超出规则", rpRzK_cible_concurrents_non_estimable: "最接近的允许价格", rpRzK_buy_box_perdue_prix_a_viser: "与推荐报价对齐",
  rpRzQ: (e, s, c) => { const a = { moins_cher: "最便宜的", mediane: "中位数", choisi: "所选竞争对手" }[c]; return !a ? null : s < 0 ? `比${a}低 ${e}` : s > 0 ? `比${a}高 ${e}` : `与${a}同价`; }, rpSpF_dSansPl: (n) => `${n} 个下限未知`, rpSpF_dSansPrix: (n) => `${n} 个未读取当前价格`,
  rpSl_envoi: "待核实的发送", rpSl_envT: "亚马逊结果未确认", rpSl_envD: (a) => `请求 ${a}`, rpSl_envL: (a) => `亚马逊复核 ${a}`,
  rpSl_verifier: "核实", rpSl_ec: (s, v) => `${s}${v}%`, rpSl_barre: "规则使用 SmartPrice 的报价",
  rpSl_voirRe: (n) => `查看 ${n} 个 Repricer 报价`, rpSl_voirReC: (n) => `${n} 个 Repricer 报价`, rpSpTh_regle: "规则",
  rpSpTh_prix: "当前价格", rpSpTh_sit: "当前状况", rpSpTh_conseil: "拟定价格", rpSl_aff: (a, b) => `显示 ${a} / ${b}`, rpSl_suiv: "更多",
  rpSl_auj: (s) => `今日：${s}`, rpSl_trier: "排序", rpSl_sousPl: "低于下限",
  rpSd_refAria: "参考价", rpSd_mediane: "中位数", rpSd_pct: (v) => `${v}%`, rpSd_sous: (e, n) => `比${n}低 ${e}`, rpSd_dessus: (e, n) => `比${n}高 ${e}`, rpSd_egal: (n) => `与${n}同价`,
  rpSd_ilYa: (a) => `${a}前`, rpSd_sousPl: (m) => `当前价格低于下限 ${m}。`, rpSd_remonte: (p, c, pl) => `${p}将得到 ${c}：建议价上调至下限 ${pl}。`,
  rpSd_cz_moins_cher: (p, n) => (n ? `${p}，即 ${n} 个有已知价格的可比竞品中最便宜的。` : `${p}，即可比竞品中最便宜的。`),
  rpSd_cz_mediane: (p, n) => (n ? `${p}（${n} 个有已知价格的可比竞品）。` : `${p}（可比竞品）。`), rpSd_cz_choisi: (p) => `${p}，即所选竞品。`,
  rpSd_ctb: "每单贡献", rpSd_ctbD: "不含税，广告前", rpSd_seuilPlus: (n) => `销量增加 ${n}% 时收益相同。`, rpSd_seuilMoins: (n) => `即使销量下降 ${n}%，收益也相同。`,
  rpSd_recapT: "将此价格发送到亚马逊？", rpSd_recapSous: "发送到亚马逊之前", rpSd_pays: "国家", rpSd_prixDem: "申请价格", rpSd_regle: "规则", rpSd_envoyer: (p) => `将 ${p} 发送到亚马逊`, rpSd_retour: "返回",
  rpSd_recapNote: "随后确认栏会请求最后一次确认。发送后，GTINPilot 会重新读取亚马逊显示的价格；确认之前，该报价保留在“待核实的发送”中。",
  rpSd_coutT: "单位采购成本", rpSd_coutP: "只在一个地方填写：采购成本页面。", rpSd_coutLien: "填写采购成本", rpSd_aussi: (p) => `在${p}也被阻止`,
  rpSd_pub: "广告", rpSd_pubV: (m) => `每单 ${m}`, rpSd_pubNon: "未测量", rpSd_nonCalc: "未计算", rpSd_ramene: "含运费，按您的规格换算",
  rpF_aValider: "待确认", rpF_conseils: "建议", rpF_aDebloquer: "待解决", rpF_sans: "无变化", rpF_examiner: "查看", rpF_voir: "查看",
  rpF_saisirCout: "填写成本", rpF_modifRegle: "修改规则", rpF_toutVoir: "查看全部", rpF_nOffres: (n) => `${n} 个报价`,
  rpF_sansTxt: (n, p) => `${n} 个报价${p ? `，其中 ${p}` : ""}`, rpF_dPl: (n) => `${n} 个在下限`, rpF_dPromo: (n) => `${n} 个促销中`,
  rpF_dStock: (n) => `${n} 个无可售库存`, rpF_rien: "没有待决事项", rpF_derniere: "最近一次修改", rpF_prochaines: "后续决策将显示在这里。",
  rpF_dIgn: (n) => `${n} 个已忽略`, rpF_ignores: "已忽略的建议", rpD_ignorer: "忽略此建议", rpD_ignLe: (d) => `已于 ${d} 忽略建议`,
  rpD_ignRevient: "情况变化时会重新出现在列表中。", rpD_ignRet: "取消忽略", rpD_ignOk: (h) => `已忽略建议（${h} 的计算）`,
  rpD_ignNouveau: "情况已变化：该建议仍待查看。", rpD_ignRelErr: "已保存；无法重新读取：请刷新页面。", rpD_ignRetEncore: "该建议仍被忽略：请刷新页面。", rpD_ignRetOk: "该建议不再被忽略。",
  rpD_ignIll: "已忽略建议列表无法读取：“忽略”不可用。", rpD_ignErr: (m) => `未保存：${m}`, rpD_ignBusy: "保存中…",
  rpFc_envoi_non_confirme: "发送未确认", rpFc_envoi_refuse: "发送被拒", rpFc_refuse_amazon: "被亚马逊拒绝", rpFc_cout_inconnu: "采购成本未知",
  rpFc_bornes_en_conflit: "上下限冲突", rpFc_frais_inconnus: "亚马逊费用未知", rpFc_sans_prix: "当前价格未知或采集过旧", rpFc_aucun: "从未计算",
  rpFc_bloque: "已阻止", rpFc_situation_changee: "计算后情况已变化",
  rpD_regle: (n) => `规则 ${n}`, rpD_conseille: "建议价", rpD_actuel: "当前价格", rpD_releve: (a) => `${a}前采集`, rpD_plancher: "下限", rpD_plafond: "上限",
  rpD_sousPl: "低于下限", rpD_dessusPf: "高于上限", rpD_valider: (p) => `确认 ${p}`, rpD_recap: "发送到亚马逊之前会打开一份摘要。",
  rpD_simu: "模拟：不会向亚马逊发送任何价格。此建议仅供查看，不会发送。", rpD_benef: (p) => `售价 ${p} 时每单利润`, rpD_calcPl: "下限的计算",
  rpD_calcPlD: "亚马逊价格表中符合规则（利润、利润率、成本回报率）的最低价格，按该价格的预估费用计算。",
  rpD_sitChg: (h) => `${h} 计算后情况已变化`, rpD_sitRegle: "此次计算后规则已更改。", rpD_sitPrixAct: (p) => `此后采集的当前价格：${p}。`,
  rpD_sitPrix: (p) => `在亚马逊读取的价格：${p}。未提交任何提议。`, rpD_prochain: "下次计算时给出新建议。", rpD_limChg: (h) => `${h} 计算后上下限已变化`,
  rpD_nonCalc: "价格无法计算", rpD_coutPl: "采购成本未知：无法计算下限。", rpD_coutEst: "预估成本",
  rpD_estDe: (j) => `依据上一批已确认批次 · ${j} 入库`, rpD_aConfirmer: "请在 COGS 标签页中确认", rpD_ouvrirCogs: "打开 COGS", rpD_coutND: "成本无法确定",
  rpD_coutR_change_absent: "缺少入库当日汇率", rpD_coutR_sans_jour: "入库无日期", rpD_coutR_autre_zone_seulement: "仅在其他区域有已确认批次",
  rpD_coutR_aucun_lot_avant: "此次入库之前无已确认批次", rpD_coutR_egalite_ambigue: "同一天有多个不同成本",
  rpD_coutR_aucune_estimation: "此区域内该产品无预估", rpD_coutR_aucune_reception: "此区域内该产品无入库", rpD_coutR_zone_inconnue: "该国家的库存区域未知",
  rpD_envAttente: "等待确认", rpD_env_PENDING: "提议已就绪：屏幕底部的“确认”栏会在显示摘要后发送。",
  rpD_env_EN_COURS: "发送进行中：结果未知前不会再次发送。", rpD_attente: "建议将重新计算；在此之前，不会根据此建议发送任何内容。", rpP_envBloque: "此报价的发送未确认：结果未知前不会从这里再次发送（决策标签页）。",
  rpD_env_UNKNOWN: "亚马逊结果未知：此界面不会再次发送。请在 Seller Central 中核对价格。", rpD_motif: "原因", rpD_motifNC: "未告知原因",
  rpD_envRetour: "下次计算后将显示新建议。",
  rpMo_VALUE_CHANGED: "提议后亚马逊上的价格或上下限已更改（Seller Central）", rpMo_RULE_CHANGED: "提议后价格规则已更改：请重新提议。未发送任何内容。", rpMo_RULE_UNVERIFIABLE: "无法核实价格规则：请重新提议。未发送任何内容。", rpMo_UNSUPPORTED_DISCOUNT: "亚马逊上存在已计划的折扣价",
  rpMo_UNSUPPORTED_OFFER: "不支持该报价", rpMo_PREVIEW_INVALID: "亚马逊拒绝了预览", rpMo_PREVIEW_FAILED: "无法在亚马逊预览", rpMo_FROZEN: "此账户的发送已冻结",
  rpMo_TOO_SLOW: "发送过慢，发出前已停止", rpMo_TOKEN_FAILED: "亚马逊访问不可用", rpMo_READ_FAILED: "无法读取亚马逊价格", rpMo_OFFER_BUSY: "另一个价格正在发送",
  rpMo_CURRENCY: "报价币种不同", rpMo_NO_PRODUCT_TYPE: "商品页面缺少产品类型", rpMo_INVALID: "亚马逊判定请求无效", rpMo_http: (c) => `亚马逊拒绝了请求（HTTP ${c}）`,
  rpRz_sous_le_plancher: "当前价格低于下限", rpRz_au_dessus_du_plafond: "当前价格高于上限", rpRz_prix_actuel_non_admissible: "当前价格不符合规则：调整到最近的允许价格",
  rpRz_buy_box_perdue_prix_a_viser: "已失去推荐报价：价格对齐推荐报价", rpRz_seule_offre: "页面唯一报价：保持价格", rpRz_buy_box_detenue: "持有推荐报价：保持价格",
  rpRz_buy_box_perdue_sans_prix_a_viser: "已失去推荐报价，未采集到目标价", rpRz_deja_au_prix_vise: "已在目标价", rpRz_promotion_en_cours: "促销进行中：建议暂停",
  rpRz_non_achetable: "无可售库存", rpRz_aucun_prix_admissible: "没有价格满足规则的全部限制",
  rpRzF: (f, e) => `${f}：${e}`, rpRzF_releve_prix: "我方价格采集", rpRzF_prix_actuel: "当前价格", rpRzF_stock: "库存采集", rpRzF_promotions: "促销采集",
  rpRzF_cout_achat: "采购成本", rpRzF_frais_prix_actuel: "当前价格下的亚马逊费用", rpRzE_absent: "缺失", rpRzE_perime: "过旧", rpRzE_invalide: "无法读取", rpRzE_inconnu: "未知",
  rpRz_concurrents_parametres_absents: "对比竞争对手：规则中未设置目标", rpRz_concurrents_choisi_absent: "对比竞争对手：所选竞争对手不在列表中", rpRz_concurrents_choisi_exclu: "对比竞争对手：所选竞争对手被排除在计算之外", rpRz_concurrents_aucun_prix_admissible: "对比竞争对手：没有可用的竞争对手价格", rpRz_concurrents_couverture_insuffisante: "对比竞争对手：近期价格太少，无法得出结论", rpRz_concurrents_mediane_moins_de_2_prix: "对比竞争对手：少于 2 个价格，无法计算中位数",
  rpRz_cible_concurrents: "对比竞争对手：价格设在目标上", rpRz_cible_concurrents_plancher: "对比竞争对手：目标低于下限，价格设为下限", rpRz_cible_concurrents_plafond: "对比竞争对手：目标高于上限，价格设为上限", rpRz_deja_a_la_cible_concurrents: "对比竞争对手：已在目标价", rpRz_deja_a_la_cible_concurrents_plancher: "对比竞争对手：已在下限（目标更低）", rpRz_deja_a_la_cible_concurrents_plafond: "对比竞争对手：已在上限（目标更高）", rpRz_cible_concurrents_hors_regle: "对比竞争对手：目标不符合规则，取目标一侧最接近的允许价格", rpRz_deja_au_prix_autorise_concurrents: "对比竞争对手：目标不符合规则，已在目标一侧最接近的允许价格", rpRz_cible_concurrents_non_estimable: "对比竞争对手：无法精确到分计算价格，取目标一侧最接近的允许价格", rpRz_deja_au_prix_grille_concurrents: "对比竞争对手：无法精确到分计算价格，已在目标一侧最接近的允许价格", rpRz_ecart_sous_minimum_concurrents: "对比竞争对手：目标与当前价格太接近，保持价格",
  rpRzN: (e) => `对比竞争对手：我方报价，${e}`, rpRzC_offre_invalide: "记录格式错误", rpRzC_etat_inconnu: "商品状况未知", rpRzC_expedition_inconnue: "配送方式未知", rpRzC_heure_inconnue: "记录时间未知", rpRzC_donnee_future: "记录时间在未来", rpRzC_donnee_perimee: "记录过旧", rpRzC_port_inconnu: "运费未知", rpRzC_total_incoherent: "送达总价不一致", rpRzC_port_incoherent: "运费不一致",
  rpCo_pli: "竞争对手", rpCo_nSurM: (n, m) => `${m} 个中 ${n} 个可比`, rpCo_indispo: "列表不可用", rpCo_aucunCourt: "无", rpCo_indispoD: "竞争对手列表不可用：无法读取监控状态。未做任何修改。", rpCo_etat: (n, max) => `已跟踪 ${n} 个 · 最多 ${max} 个`, rpCo_aucun: "此国家/地区中没有为该产品跟踪的竞争对手。请在下方添加，或在监控中选择。", rpCo_sansPrix: "未记录价格", rpCo_parUnite: (p) => `${p}/件`, rpCo_lotDe: (n, p) => `${n} 件装：${p}`, rpCo_releveIlYa: (a) => `${a}前记录`, rpCo_sansOffre: (a) => `最近一次记录（${a}前）没有推荐报价，不计入计算`, rpCo_dernierConnu: (p, a) => `最近已知价格 ${p}（${a}前）`, rpCo_perime: (h) => `已过期（超过 ${h} 小时），不计入计算`, rpCo_photo: (a) => `${a} 前拍摄的报价`, rpCo_format: "每包件数", rpCo_fmtOk: "保存规格", rpCo_retirer: "为此产品移除", rpCo_aDeclarer: "待声明 · 不计入", rpCo_cmp: "可比", rpCo_cmpLot: (n) => `可比 · ${n} 件装`, rpCo_hors: "不计入", rpCo_srcManuel: "手动添加", rpCo_srcVeille: "监控", rpCo_actions: "对此竞争对手的操作", rpCo_ajouter: "添加竞争对手", rpCo_ph: "ASIN 或亚马逊链接", rpCo_ajouterBtn: "添加", rpCo_veille: "在监控中选择", rpCo_note: "价格：最近记录的推荐报价价格，含运费，并显示其时长；超过 2 小时即过期，不再计入计算。最近一次记录没有推荐报价时，同样不计入。不计入的竞争对手仍受监控。亚马逊上不会有任何更改。", rpCo_okAjout: "已添加竞争对手。", rpCo_okFmt: "规格已保存。", rpCo_okRet: "已为此产品移除竞争对手。", rpCo_okCmp: "已计入计算。", rpCo_okHors: "不计入，仍受监控。", rpCo_errMax: "已拒绝：每个产品每个国家最多跟踪 10 个竞争对手（或 100 个添加）。未写入任何内容。", rpCo_errNonSuivi: "已拒绝：此产品不再跟踪该竞争对手。未写入任何内容。", rpCo_err: "保存失败。未写入任何内容。", rpCo_errAsin: "ASIN 无效：10 位字母或数字，或亚马逊商品页链接。", rpCo_errFmt: "规格无效：1 到 100 的整数。",
});
var rp = { d: null, st: "idle", tab: "conseils", pays: "", sit: "", sel: undefined, det: {}, detSt: {}, vdr: {}, vdrSt: {}, ix: {}, prop: {}, busy: false, msg: null, vMsg: null, sitChg: {},
  j: null, jSt: "idle", jOuv: {}, ed: {}, rBusy: false, rMsg: null, plis: {},
  bib: { ed: null, pend: null, res: {}, menu: null, defs: false, aff: null, busy: false, msg: null, flash: null, retour: null, voir: {} }, prod: null, pOuv: {},
  porte: "repricer" };
const rpKey = (r) => (r.sku ? `${r.marketplace}|${r.sku}` : `${r.marketplace}|#${r.asin ?? ""}`);
const rpCents = (v) => Math.round(Number(v) * 100);
function rpM(v, cur) {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  return cur ? fmtUnitPriceNative(v, cur) : new Intl.NumberFormat(LOCALE(), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
}
const rpUnk = (k = "rpL_inconnu") => `<span class="rp-unk">${escapeHtml(t(k))}</span>`;
const rpPrixAbs = (r) => rpUnk(!r ? "rpL_nonReleve" : r.annonce != null && r.annonce !== "Active" ? "rpL_pxInactive"
  : r.prixFiche != null ? "rpL_pxFiche" : r.annonce == null && (r.annoncesLues === false || rp.d?.annonces?.lu === false) ? "rpL_pxNonLu"
  : r.annonce == null ? "rpL_pxSansOffre" : "rpL_pxNonAch");
const RP_PRECREEES = { r0000000001: ["prudent", "Marge protégée"], r0000000002: ["equilibre", "Buy Box équilibrée"],
  r0000000003: ["offensif", "Conquête (Q4)"], r0000000004: ["destockage", "Déstockage"] };
const rpNomR = (x) => { const p = x && Object.hasOwn(RP_PRECREEES, x.id) ? RP_PRECREEES[x.id] : null; return p && x.nom === p[1] ? t("rpLb_n_" + p[0]) : x?.nom ?? ""; };
const rpNomEnvoi = (e, nom) => { const p = e && Object.hasOwn(RP_PRECREEES, e.id) ? RP_PRECREEES[e.id] : null;
  return p && e.nom === p[1] && Object.values(I18N).some((d) => d && d["rpLb_n_" + p[0]] === nom) ? e.nom : nom; };
const RP_LANGUE_MP = { fr: ["FR", "BE"], en: ["UK", "US", "CA", "IE", "AU"], es: ["ES", "MX"], de: ["DE"], it: ["IT"], zh: [] };
function rpNomCourt(titre, max = 44) {
  const s = String(titre ?? "").replace(/\s+/g, " ").trim();
  if (!s) return "";
  const parts = s.split(/\s+[|–—-]\s+|\s+\|(?=\S)|(?<=\S)\|\s+|,\s+/).map((x) => x.trim()).filter(Boolean);
  if (parts.length > 1 && /\p{L}/u.test(parts[0]) && parts[0] === parts[0].toUpperCase() && !/\d/.test(parts[0])) parts.shift();
  let out = parts[0] || s, i = 1;
  while (out.length < 18 && i < parts.length) out += " · " + parts[i++];
  if (out.length <= max) return out;
  const cut = out.slice(0, max - 1), sp = cut.lastIndexOf(" ");
  return (sp > max / 2 ? cut.slice(0, sp) : cut).replace(/[\s·,;:|–—-]+$/, "") + "…";
}
function rpTitre(r, titres) {
  const T = (titres && r && titres[r.asin]) || {};
  const mp = (RP_LANGUE_MP[lang] || []).find((m) => typeof T[m] === "string" && T[m]);
  return (mp ? T[mp] : T[r?.marketplace] || Object.values(T).find((x) => typeof x === "string" && x)) || r?.nom || "";
}
const rpNom = (r) => rpNomCourt(rpTitre(r, rp.d?.titres)) || r?.sku || r?.asin || "";
function rpThumb(r) {
  const ini = escapeHtml(String(rpNom(r) || "?").trim().charAt(0).toUpperCase());
  return `<span class="rp-th" aria-hidden="true">${ini}${r?.asin ? `<img src="assets/product-${encodeURIComponent(r.asin)}.jpg" alt="" width="160" height="160" loading="lazy" decoding="async" onerror="this.remove()">` : ""}</span>`;
}
function rpRang(r) { return r.conseil?.aValider || r.conseil?.etat === "propose" ? 0 : r.situation === "perdue" ? 1 : 2; }
function rpTri(rows) {
  const v = (r) => rpVentesHv(r) ?? -1;
  return [...rows].sort((a, b) => rpRang(a) - rpRang(b) || v(b) - v(a) || String(a.sku ?? "").localeCompare(String(b.sku ?? "")) || String(a.marketplace).localeCompare(String(b.marketplace)));
}
function rpRanger(rows) {
  const out = { actifs: [], inactifs: [], masques: [], desactives: [] };
  for (const r of rows) (r.desactive ? out.desactives : r.masque ? out.masques : r.enVente === false ? out.inactifs : out.actifs).push(r);
  for (const k of Object.keys(out)) out[k] = rpTri(out[k]);
  return out;
}
function rpPointAuPrix(r, d, prix) {
  const mg = r?.ombre?.margeProposee;
  if (typeof mg === "number" && Number.isFinite(mg) && rpCents(r.ombre.prixPropose) === rpCents(prix)) return { prix, beneficeAvantPub: mg };
  return (d?.lignes || []).find((l) => rpCents(l.prix) === rpCents(prix));
}
function rpBenDe(d, l) {
  const av = l?.beneficeAvantPub, pub = d?.publiciteParUnite?.valeur;
  if (typeof av !== "number") return { v: null, apresPub: false };
  return typeof pub === "number" ? { v: Math.round((av - pub) * 100) / 100, apresPub: true } : { v: av, apresPub: false };
}
function rpVentesHv(r) { const v = r?.ventes; return v && typeof v.unites === "number" ? v.unites - (v.vine || 0) : null; }
const RP_SIT_ORDRE = ["sans_offre", "perdue", "cout_inconnu", "au_plancher", "detenue", "seul_vendeur", "inconnue"];
function rpSitCle(r) {
  const ct = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 100) : null);
  if (r.situation === "sans_offre") return "sans_offre";
  if (r.situation === "perdue") return "perdue";
  if (r.conseil?.etat === "cout_inconnu") return "cout_inconnu";
  if (ct(r.prixActuel) !== null && ct(r.prixActuel) === ct(r.ombre?.plancher)) return "au_plancher";
  return ["seul_vendeur", "detenue", "perdue"].includes(r.situation) ? r.situation : "inconnue";
}
const RP_SIT_CLS = { perdue: "rp-att", au_plancher: "rp-att", cout_inconnu: "rp-att", sans_offre: "rp-mut" };
function rpSitHtml(r) {
  const k = rpSitCle(r), lbl = t("rpSit_" + k);
  if (k === "inconnue") return `<span class="rp-unk" title="${escapeHtml(lbl)}">${escapeHtml(lbl)}</span>`;
  return `<span class="rp-cel${RP_SIT_CLS[k] ? " " + RP_SIT_CLS[k] : ""}" title="${escapeHtml(lbl)}">${escapeHtml(lbl)}</span>`;
}
function rpConseilCourt(r) {
  const c = r.conseil || { etat: "aucun" }, e = c.etat, attTxt = c.aValider ? t("rpC_aValider") : "";
  const att = attTxt ? ` <small class="rp-att">${escapeHtml(attTxt)}</small>` : "", tip = (x) => escapeHtml(attTxt ? `${x} · ${attTxt}` : x);
  if (e === "propose") { const p = rpM(c.prix, r.devise) ?? "—"; return `<b class="rp-cel" title="${tip(p)}">${escapeHtml(p)}${att}</b>`; }
  if (e === "simulation" && Number.isFinite(c.prix)) { const p = rpM(c.prix, r.devise); return `<b class="rp-cel" data-rp-simu title="${tip(`${p} · ${t("rpC_simulation")}`)}">${escapeHtml(p)} <small class="rp-fnt">${escapeHtml(t("rpC_simulation"))}</small>${att}</b>`; }
  if (["cout_inconnu", "frais_inconnus", "sans_prix", "bornes_en_conflit", "bloque"].includes(e)) {
    const lbl = t("rpC_" + e);
    return `<span class="rp-unk rp-cel" title="${tip(lbl)}">${escapeHtml(lbl)}${att}</span>`;
  }
  const k = ["garder", "pause_promo", "non_achetable", "desactive"].includes(e) ? "rpC_" + e : null;
  if (!k) return `<span class="rp-fnt" title="${tip(t("rpC_aucun"))}">—${att}</span>`;
  return `<span class="rp-cel ${e === "non_achetable" ? "rp-att" : "rp-mut"}" title="${tip(t(k))}">${escapeHtml(t(k))}${att}</span>`;
}
function rpVentesHtml(r) {
  const v = r.ventes;
  if (v?.qteAbsente > 0) { const m = t("pfPpNoQty", v.qteAbsente); return `<span class="rp-unk" title="${escapeHtml(m)}">?<span class="sr-only">${escapeHtml(m)}</span></span>`; }
  if (!v || typeof v.unites !== "number") return `<span class="rp-unk rp-los" title="${escapeHtml(t("rpV_aucune"))}"><span class="sr-only">${escapeHtml(t("rpV_aucune"))}</span></span>`;
  const vine = v.vine > 0 ? ` <small class="rp-fnt">${escapeHtml(t("rpV_vine", fmtInt(v.vine)))}</small>` : "";
  const court = typeof v.jours === "number" && v.jours < 30 ? ` <small class="rp-att" data-rp-vj="${v.jours}">${escapeHtml(t("rpV_jours", v.jours))}</small>` : "";
  const tip = [t("rpV_tip", fmtInt(v.unites - (v.vine || 0)), v.jours ?? 30), v.vine > 0 ? t("rpV_vine", fmtInt(v.vine)) : "", v.sansArticle > 0 ? t("rpV_sansArt", fmtInt(v.sansArticle)) : ""].filter(Boolean).join(" · ");
  return `<span class="rp-cel" title="${escapeHtml(tip)}">${v.sansArticle > 0 ? "≥ " : ""}${escapeHtml(fmtInt(v.unites - (v.vine || 0)))}${vine}${court}</span>`;
}
function rpLigneHtml(r) {
  const k = rpKey(r), sel = k === rp.sel, titre = rpTitre(r, rp.d?.titres), ref = r.sku || [t("rpSl_skuInc"), r.asin].filter(Boolean).join(" · ");
  const prix = r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, r.devise));
  const tip = [titre || rpNom(r), ref].filter(Boolean).join(" · ");
  const pc = r.prixConfigure, d = pc?.le ? new Date(pc.le) : null;
  const pcTip = pc ? ` title="${escapeHtml(t("rpL_pxConf", rpM(pc.prix, r.devise), d && Number.isFinite(d.getTime()) ? d.toLocaleDateString(LOCALE()) : "?"))}"` : "";
  return `<tr data-rp-k="${escapeHtml(k)}" tabindex="0" class="${sel ? "sel" : ""}${r.desactive || r.enVente === false ? " rp-off" : ""}"${sel ? ' aria-selected="true"' : ""}>`
    + `<td><div class="rp-nm">${rpThumb(r)}<span class="rp-n" title="${escapeHtml(tip)}">${escapeHtml(rpNom(r))}<small> · ${escapeHtml(ref)}</small></span>`
    + `<span class="rp-dmob">${rpDrapeau(r.marketplace)}</span></div></td>`
    + `<td class="rp-cpays">${rpDrapeau(r.marketplace)}</td><td class="num rp-cprix"${pcTip}>${prix}</td><td class="rp-csit">${rpSitHtml(r)}</td>`
    + `<td class="num rp-ccons${r.conseil?.etat === "propose" || rpEstSimu(r) ? " rp-cfl" : ""}"><span class="rp-pmob" aria-hidden="true">${prix}</span>${rpConseilCourt(r)}</td><td class="num rp-cv">${rpVentesHtml(r)}</td></tr>`;
}
const RP_OFFRES_TH = [["rpTh_prod", 0, "rp-wp"], ["rpTh_pays", 0, "rp-wpa"], ["rpTh_prix", 1, "rp-wpr"], ["rpTh_situation", 0, "rp-ws", "rpTh_situationTip"], ["rpTh_conseil", 1, "rp-wc"],
  ["rpTh_ventes", 1, "rp-wv", "rpTh_ventesTip"]];
function rpOffresHtml(ls) {
  const col = RP_OFFRES_TH.map(([, , w]) => `<col class="${w}">`).join("");
  const th = RP_OFFRES_TH.map(([k, n, , tip]) => `<th${n ? ' class="num"' : ""}${tip ? ` title="${escapeHtml(t(tip))}"` : ""}>${escapeHtml(t(k))}</th>`).join("");
  return `<div class="rp-tw"><table class="rp-t rp-offres"><colgroup>${col}</colgroup><thead><tr>${th}</tr></thead><tbody>${ls.map((r) => rpLigneHtml(r)).join("")}</tbody></table></div>`;
}
function rpNiveau(verrou) { return verrou === "ferme" ? "ombre" : verrou === "ouvert" ? "propose" : null; }
const RP_NIVEAUX = ["ombre", "propose", "auto"];
function rpNiveauHtml(niv) {
  return RP_NIVEAUX.map((x) => `<span class="${x === niv ? "on" : ""}${x === "auto" ? " rp-dis" : ""}"${x === niv ? ' aria-current="true"' : ""}>${escapeHtml(t("rpLvl_" + x))}</span>`).join("");
}
function rpReNivHtml(niv) {
  return `<span class="rp-reniv" role="status" data-rp-niv="${escapeHtml(niv || "")}" title="${escapeHtml(t(niv ? "rpLvlTip" : "rpLvlUnk"))}"><span class="rp-renivk">${escapeHtml(t("rpRe_mode"))}</span>${escapeHtml(t(niv ? "rpLvl_" + niv : "rpRe_nivInc"))}</span>`;
}
function rpHeure(iso) {
  if (typeof iso !== "string" || !iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleTimeString(LOCALE(), { hour: "2-digit", minute: "2-digit" });
}
function rpEtatHtml(n, iso) {
  if (typeof n !== "number") return "";
  const h = rpHeure(iso);
  return `<span class="rp-etat">${escapeHtml(t("rpEtatN", fmtInt(n), n))}${h ? ` · ${escapeHtml(t("rpEtatCalc", h))}` : ""}</span>`;
}
const rpFcDe = (r) => r.regle?.facon || "-";
function rpFiltre(rows, { pays, sit }) {
  return rows.filter((r) => (!pays || r.marketplace === pays) && (!sit || rpSitCle(r) === sit));
}
const rpPorteLigne = (r) => (rpFcDe(r) === "concurrents" ? "smartprice" : "repricer");
function rpPorteLignes(rows, porte) { return rows.filter((r) => rpPorteLigne(r) === (porte === "smartprice" ? "smartprice" : "repricer")); }
function rpPorteDe(hash) { return hash === "#smartprice" ? "smartprice" : "repricer"; }
function rpSpVideHtml() {
  const etape = (n, act) => `<li class="rp-fc rp-step${n > 1 ? " rp-step-off" : ""}"><span class="rp-fct"><span><b>${n} · ${escapeHtml(t("rpSp_e_" + n))}</b> · ${escapeHtml(t("rpSp_e_" + n + "d"))}</span></span><span class="rp-fx">${act}</span></li>`;
  const verrou = (n) => `<span class="rp-lock">${rpSvg("cad")}${escapeHtml(t("rpSp_apres", n))}</span>`;
  return `<div class="rp-file rp-calm rp-vide"><div class="rp-calmh"><h3>${escapeHtml(t("rpSp_videT"))}</h3></div><p class="rp-videp">${escapeHtml(t("rpSp_videD"))}</p>`
    + `<section class="rp-sec rp-sec-neu"><ol class="rp-fl rp-steps" aria-label="${escapeHtml(t("rpSp_aria"))}">`
    + etape(1, `<button type="button" class="rp-go" data-rp-sp-creer>${escapeHtml(t("rpSp_e_1a"))}</button>`)
    + etape(2, verrou(1)) + etape(3, verrou(2)) + `</ol></section></div>`;
}
function rpSpEcart(actuel, conseil) {
  if (!Number.isFinite(actuel) || !Number.isFinite(conseil) || actuel <= 0) return null;
  const p = Math.round(((conseil - actuel) / actuel) * 1000) / 10;
  return t("rpSl_ec", p > 0 ? "+" : p < 0 ? "−" : "", Math.abs(p).toLocaleString(LOCALE(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }));
}
const RP_SP_BLOC = ["cout_inconnu", "frais_inconnus", "sans_prix", "bornes_en_conflit", "bloque"];
function rpSpRegleNom(r) {
  return !r.regle ? t("rpPp_aucuneApp") : r.regle.source === "produit" ? t("rpPp_propre") : r.regle.source === "nommee" ? rpNomR(r.regle) || "—" : t("rpLb_compte");
}
function rpSpPosActuelle(r) {
  const ct = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 100) : null), ref = r?.ombre?.concurrents;
  const a = ct(r?.prixActuel), re = ct(ref?.reference), ci = ct(ref?.prixCible);
  if (a === null || a <= 0 || re === null || re <= 0 || ci === null || typeof ref.cible !== "string" || !Number.isFinite(ref.ecart) || !["pct", "eur"].includes(ref.unite)) return null;
  if (Math.abs((ref.unite === "pct" ? re * (1 + ref.ecart / 100) : re + ref.ecart * 100) - ci) > 2) return null;
  const d = a - re, v = ref.unite === "pct" ? (Math.abs(d) * 100) / re : Math.abs(d) / 100;
  const pz = ref.unite === "pct" && d !== 0 && Math.round(v * 100) === 0;
  const e = ref.unite === "pct" && !pz ? t("rpSd_pct", v.toLocaleString(LOCALE(), { maximumFractionDigits: v >= 1 ? 0 : 2 })) : rpM(pz ? Math.abs(d) / 100 : v, r.devise);
  return t("rpRzQ", e, Math.sign(d), ref.cible) || null;
}
function rpSpSit(r) {
  const k = rpSitCle(r), e = r.conseil?.etat, ct = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 100) : null);
  if (k !== "sans_offre" && RP_SP_BLOC.includes(e)) return { txt: t("rpC_" + e), cls: "rp-att", neutre: false };
  const base = () => { const cls = k === "inconnue" ? "rp-unk" : RP_SIT_CLS[k] || ""; return { txt: t("rpSit_" + k), cls, neutre: !cls }; };
  if (k === "sans_offre" || k === "perdue") return base();
  const pa = ct(r.prixActuel), pl = ct(r.ombre?.plancher);
  if (pa !== null && pl !== null && pa < pl) return { txt: t("rpSl_sousPl"), cls: "rp-neg", neutre: false };
  if (k === "au_plancher") return base();
  const pos = rpSpPosActuelle(r);
  return pos ? { txt: pos, cls: "", neutre: true } : base();
}
function rpSpConseilHtml(r) {
  if (RP_SP_BLOC.includes(r.conseil?.etat)) return `<span class="rp-pnc">${escapeHtml(t("rpSpFcD"))}</span>`;
  return rpConseilCourt(r);
}
const RP_SP_COLS = [["pays", "rpTh_pays", 0], ["prod", "rpTh_prod", 0], ["regle", "rpSpTh_regle", 0], ["prix", "rpSpTh_prix", 1], ["sit", "rpSpTh_sit", 0],
  ["conseil", "rpSpTh_conseil", 1], ["ventes", "rpTh_ventes", 1]];
const rpSpTriDe = (tri) => ({ c: RP_SP_COLS.some(([id]) => id === tri?.c) ? tri.c : "pays", d: tri?.d === -1 ? -1 : 1 });
function rpSpTri(rows, tri) {
  const { c, d } = rpSpTriDe(tri);
  const sit = (r) => { const s = rpSpSit(r).txt, ct = (v) => Math.round(v * 100);
    return s && s === rpSpPosActuelle(r) ? (ct(r.prixActuel) - ct(r.ombre.concurrents.reference)) / ct(r.ombre.concurrents.reference) : s; };
  const val = (r) => { const x = c === "pays" ? r.marketplace : c === "prod" ? rpNom(r) : c === "regle" ? rpSpRegleNom(r) : c === "prix" ? r.prixActuel
    : c === "sit" ? sit(r) : c === "conseil" ? (r.conseil?.etat === "propose" ? r.conseil.prix : null) : rpVentesHv(r);
    return typeof x === "number" ? (Number.isFinite(x) ? x : null) : x == null || x === "" ? null : String(x); };
  return rpTri(rows).map((r, i) => ({ r, i, x: val(r) })).sort((a, b) => {
    if ((a.x === null) !== (b.x === null)) return a.x === null ? 1 : -1;
    const k = a.x === null ? 0 : typeof a.x === "number" && typeof b.x === "number" ? a.x - b.x
      : typeof a.x === "number" || typeof b.x === "number" ? (typeof a.x === "number" ? -1 : 1) : String(a.x).localeCompare(String(b.x), LOCALE());
    return d * k || a.i - b.i;
  }).map((o) => o.r);
}
function rpSpOffresHtml(ls, tri) {
  const { c, d } = rpSpTriDe(tri), rows = rpSpTri(ls, tri);
  const th = RP_SP_COLS.map(([id, k, n]) => { const on = id === c;
    return `<th${n ? ' class="num"' : ""} aria-sort="${on ? (d === 1 ? "ascending" : "descending") : "none"}"><button type="button" class="rp-sptri${on ? " on" : ""}" data-rp-sptri="${id}">`
      + `${escapeHtml(t(k))}<span class="rp-sptf" aria-hidden="true">${on ? (d === 1 ? "↑" : "↓") : "↕"}</span></button></th>`; }).join("");
  const col = ["rp-spw-pa", "rp-spw-p", "rp-spw-r", "rp-spw-pr", "rp-spw-s", "rp-spw-c", "rp-spw-v"].map((w) => `<col class="${w}">`).join("");
  const prix = (r) => (r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, r.devise)));
  const tr = (r) => { const k = rpKey(r), sel = k === rp.sel, s = rpSpSit(r), rg = rpSpRegleNom(r), tip = [rpTitre(r, rp.d?.titres) || rpNom(r), r.sku || r.asin].filter(Boolean).join(" · ");
    return `<tr data-rp-k="${escapeHtml(k)}" tabindex="0" class="${sel ? "sel" : ""}${r.desactive || r.enVente === false ? " rp-off" : ""}"${sel ? ' aria-selected="true"' : ""}>`
      + `<td class="rp-cpays">${rpDrapeau(r.marketplace)}</td><td><div class="rp-nm">${rpThumb(r)}<span class="rp-tn"><span class="rp-n" title="${escapeHtml(tip)}">${escapeHtml(rpNom(r))}</span>${rpSkuTag(r)}</span></div></td>`
      + `<td class="rp-sprg"><span class="rp-cel" title="${escapeHtml(rg)}">${escapeHtml(rg)}</span></td><td class="num rp-cprix">${prix(r)}</td>`
      + `<td class="rp-csit"><span class="rp-cel${s.cls ? " " + s.cls : ""}" title="${escapeHtml(s.txt)}">${escapeHtml(s.txt)}</span></td>`
      + `<td class="num rp-ccons">${rpSpConseilHtml(r)}</td><td class="num rp-cv">${rpVentesHtml(r)}</td></tr>`; };
  const li = (r) => { const k = rpKey(r), s = rpSpSit(r), ce = r.conseil?.etat;
    const pr = `<span class="rp-fa">${prix(r)}</span>` + (ce === "propose" ? `${rpFleche()}<b>${escapeHtml(rpM(r.conseil.prix, r.devise) ?? "—")}</b>`
      : RP_SP_BLOC.includes(ce) ? ` <span class="rp-fnt">·</span> ${rpSpConseilHtml(r)}` : ` <span class="rp-fnt">·</span> ${rpConseilCourt(r)}`);
    return `<li><button type="button" class="rp-splo${k === rp.sel ? " sel" : ""}" data-rp-k="${escapeHtml(k)}"${k === rp.sel ? ' aria-current="true"' : ""}>`
      + `<span class="rp-fn">${rpDrapeau(r.marketplace)}${rpThumb(r)}<span class="rp-tn"><span class="rp-fnn">${escapeHtml(rpNom(r))}</span>${rpSkuTag(r)}</span></span>`
      + `<span class="rp-sprgt">${escapeHtml(rpSpRegleNom(r))}</span><span class="rp-fp rp-sppr">${pr}</span>`
      + `<span class="rp-spsi${s.cls ? " " + s.cls : ""}">${escapeHtml(s.neutre ? t("rpSl_auj", s.txt) : s.txt)}</span></button></li>`; };
  return `<div class="rp-sptw"><div class="rp-tw"><table class="rp-t rp-offres rp-sp6"><colgroup>${col}</colgroup><thead><tr>${th}</tr></thead><tbody>${rows.map(tr).join("")}</tbody></table></div>`
    + `<ul class="rp-fl rp-splst">${rows.map(li).join("")}</ul></div>`;
}
function rpSpBarreHtml(nRe, paysL, pays, tri) {
  const { c, d } = rpSpTriDe(tri), opt = (v, lbl, on) => `<option value="${escapeHtml(v)}"${on ? " selected" : ""}>${escapeHtml(lbl)}</option>`;
  const tris = RP_SP_COLS.flatMap(([id, k]) => [[id, 1, "↑"], [id, -1, "↓"]].map(([, s, f]) => opt(`${id}:${s}`, `${t(k)} ${f}`, id === c && s === d))).join("");
  return `<div class="rp-spbarre"><span class="rp-spbt">${escapeHtml(t("rpSl_barre"))}</span>`
    + (nRe > 0 ? `<a class="rp-fact" href="#prix"><span class="rp-spl">${escapeHtml(t("rpSl_voirRe", nRe))}</span><span class="rp-sps">${escapeHtml(t("rpSl_voirReC", nRe))}</span>${rpChev()}</a>` : "")
    + `<span class="rp-grow"></span><label class="rp-fbtn rp-sptel">${escapeHtml(t("rpSl_trier"))} <select data-rp-sptri-sel>${tris}</select></label>`
    + `<label class="rp-fbtn">${escapeHtml(t("rpFPays"))} <select data-rp-pays>${opt("", t("rpFAll"), !pays)}${paysL.map((p) => opt(p, p, p === pays)).join("")}</select></label></div>`;
}
function rpSpPiedHtml(vus, total) {
  return `<div class="rp-sppied"><span>${escapeHtml(t("rpSl_aff", fmtInt(vus.length), total))}</span>`
    + `<span class="rp-grow"></span>${vus.length < total ? `<button type="button" class="rp-fact" data-rp-spplus>${escapeHtml(t("rpSl_suiv"))}${rpChev()}</button>` : ""}</div>`;
}
const RP_SP_PAGE = 50;
function rpComptes(rows) {
  const v = rpRanger(rows).actifs;
  return { decisions: rpFileDe(rows).decisions, produits: new Set(v.map((r) => r.asin)).size, pays: new Set(v.map((r) => r.marketplace)).size };
}
function rpFileDe(rows) {
  const NON_CONFIRME = ["PENDING", "CONFIRMED", "SENDING", "UNKNOWN"];
  const BLOCAGES = ["cout_inconnu", "bornes_en_conflit", "frais_inconnus", "sans_prix", "aucun", "bloque"];
  const HORS = ["sous_le_plancher", "au_dessus_du_plafond", "prix_actuel_non_admissible"];
  const ORDRE = ["envoi_non_confirme", "envoi_refuse", "refuse_amazon", ...BLOCAGES, "situation_changee"];
  const cle = (r) => (r.sku ? `${r.marketplace}|${r.sku}` : `${r.marketplace}|#${r.asin ?? ""}`);
  const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const cts = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 100) : null);
  const ms = (v) => { const x = typeof v === "string" ? Date.parse(v) : NaN; return Number.isFinite(x) ? x : null; };
  const situationChangee = (r) => { const d = r.ombre?.regle, g = r.regle;
    const memeRegle = d && g && d.source && d.source === g.source && (d.source !== "nommee" || d.id === g.id) && Number.isSafeInteger(d.version) && d.version === g.versionRegle;
    return !memeRegle || cts(r.ombre?.prixActuel) === null || cts(r.ombre.prixActuel) !== cts(r.prixActuel); };
  const av = [], causes = new Map(), classe = {}, vues = new Set();
  const calme = { n: 0, cles: [], auPlancher: 0, enPromo: 0, sansStock: 0, ignores: 0 };
  const ranger = (k, cause) => { (causes.get(cause) ?? causes.set(cause, []).get(cause)).push(k); classe[k] = cause; };
  for (const r of rows || []) {
    if (!r || r.desactive || r.masque || r.situation === "sans_offre" || (r.annonce != null && r.annonce !== "Active")) continue;
    const c = r.conseil || {}, st = r.dernierPrix?.status ?? null, k = cle(r);
    if (vues.has(k)) continue;
    vues.add(k);
    const fin = ms(r.dernierPrix?.finA) ?? ms(r.dernierPrix?.at);
    const recalcule = ms(r.ombre?.decideLe) !== null && fin !== null && ms(r.ombre.decideLe) > fin;
    if (NON_CONFIRME.includes(st)) ranger(k, "envoi_non_confirme");
    else if ((st === "REFUSED" || st === "NOT_APPLIED") && !recalcule) ranger(k, st === "REFUSED" ? "envoi_refuse" : "refuse_amazon");
    else if (c.etat === "propose") {
      if (situationChangee(r)) ranger(k, "situation_changee");
      else if (r.ignore?.actif === true) { calme.n++; calme.cles.push(k); classe[k] = "sans_changement"; calme.ignores++; }
      else { av.push({ k, hors: HORS.includes(c.raison), t: ms(r.ombre?.decideLe) }); classe[k] = "a_valider"; }
    } else if (["garder", "pause_promo", "non_achetable"].includes(c.etat)) {
      calme.n++; calme.cles.push(k); classe[k] = "sans_changement";
      if (c.etat === "garder" && cts(r.prixActuel) !== null && cts(r.prixActuel) === cts(r.ombre?.plancher)) calme.auPlancher++;
      if (c.etat === "pause_promo") calme.enPromo++;
      if (c.etat === "non_achetable") calme.sansStock++;
    } else ranger(k, BLOCAGES.includes(c.etat) ? c.etat : "bloque");
  }
  av.sort((a, b) => Number(b.hors) - Number(a.hors) || (a.t ?? Infinity) - (b.t ?? Infinity) || cmp(a.k, b.k));
  const aDebloquer = ORDRE.filter((x) => causes.has(x)).map((x) => ({ cause: x, cles: causes.get(x).sort(cmp) }));
  calme.cles.sort(cmp);
  const nDeb = aDebloquer.reduce((s, x) => s + x.cles.length, 0);
  return { aValider: av.map((x) => x.k), aDebloquer, sansChangement: calme, decisions: av.length + nDeb, classe };
}
function rpRaisonTxt(raison) {
  if (typeof raison !== "string" || !raison) return null;
  const k = "rpRz_" + raison;
  if (t(k) !== k) return t(k);
  const n = raison.match(/^concurrents_notre_offre_(.+)$/);
  if (n) return t("rpRzC_" + n[1]) !== "rpRzC_" + n[1] ? t("rpRzN", t("rpRzC_" + n[1])) : raison;
  const m = raison.match(/^(releve_prix|prix_actuel|stock|promotions|cout_achat|frais_prix_actuel)_(absent|perime|invalide|inconnu)$/);
  return m ? t("rpRzF", t("rpRzF_" + m[1]), t("rpRzE_" + m[2])) : raison;
}
function rpMotifTxt(code) {
  if (typeof code !== "string" || !code) return t("rpD_motifNC");
  const k = "rpMo_" + code;
  if (t(k) !== k) return t(k);
  const h = code.match(/^HTTP_(\d{3})$/);
  return h ? t("rpMo_http", h[1]) : code;
}
const rpCleF = rpKey;
const rpSkuTag = (r, ks = null) => { const L = [...new Set((ks || [r]).map((x) => x?.sku).filter(Boolean))], inc = (ks || [r]).some((x) => x && !x.sku);
  return `<small class="rp-sku${!L.length ? " rp-skuinc" : ""}">${escapeHtml([L.length ? t("rpSl_sku", L.join(", ")) : null, inc ? t("rpSl_skuInc") : null].filter(Boolean).join(" · "))}</small>`; };
function rpLignesFile(rows) {
  const m = new Map();
  for (const r of rows || []) { if (!r || r.desactive || r.masque || r.situation === "sans_offre" || (r.annonce != null && r.annonce !== "Active")) continue; const k = rpCleF(r); if (!m.has(k)) m.set(k, r); }
  return m;
}
function rpDecompte(rows, lu = true) {
  const L = (rows || []).filter(Boolean), F = rpFileDe(L).classe;
  const BLOQ = ["cout_inconnu", "bornes_en_conflit", "frais_inconnus", "sans_prix", "aucun", "bloque"];
  const n = { expl: 0, bloq: 0, inact: 0, nonAch: 0, nonConf: 0, sansOffre: 0, nonLu: 0, ecart: 0 };
  for (const r of L) {
    if (r.desactive || r.masque) n.ecart++;
    else if (r.annonce != null && r.annonce !== "Active") n.inact++;
    else if (r.annonce == null && (lu === false || r.annoncesLues === false)) n.nonLu++;
    else if (r.prixActuel == null && r.prixFiche != null) n.nonConf++;
    else if (r.prixActuel == null && r.annonce == null) n.sansOffre++;
    else if (r.prixActuel == null || r.situation === "sans_offre" || r.conseil?.etat === "non_achetable") n.nonAch++;
    else if (r.annonce == null) n.nonConf++;
    else if (BLOQ.includes(F[rpCleF(r)])) n.bloq++;
    else n.expl++;
  }
  return n;
}
const rpDecompteTxt = (n) => ["expl", "bloq", "inact", "nonAch", "nonConf", "sansOffre", "nonLu", "ecart"].filter((k) => k === "expl" || n[k] > 0)
  .map((k) => t("rpRe_c_" + k, fmtInt(n[k]), n[k])).join(" · ");
function rpPeutValider(r, d, verrou) {
  if (!r || !r.sku || r.conseil?.etat !== "propose" || !Number.isFinite(r.ombre?.prixActuel)) return { ok: false, motif: "conseil" };
  if (verrou !== "ouvert") return { ok: false, motif: "simu" };
  if (rpFileDe([r]).classe[rpCleF(r)] !== "a_valider") return { ok: false, motif: "classe" };
  if (!d) return { ok: false, motif: "charge" };
  const o = r.ombre;
  if (rpCents(d.plancher) !== rpCents(o.plancher) || rpCents(d.plafond) !== rpCents(o.plafond)) return { ok: false, motif: "limites" };
  const k = rpKey(r);
  if (rp.sitChg[k] !== undefined && rp.sitChg[k] === (o.decideLe ?? "")) return { ok: false, motif: "sit" };
  return { ok: true, motif: null };
}
const rpChev = () => `<svg class="rp-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>`;
const rpFleche = () => `<svg class="rp-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5"/></svg>`;
function rpDerniereModif(entrees, rowsAll, pays, zone = null) {
  const e = (entrees || []).find((x) => x.type === "proposition" && x.statut === "APPLIED" && (!zone || zone.has(x.marketplace)) && (!pays || x.marketplace === pays));
  if (!e) return null;
  const r = (rowsAll || []).find((y) => y.marketplace === e.marketplace && y.sku === e.sku) || null;
  return { quand: rpQuand(e.decideLe || e.at), nom: r ? rpNom(r) : e.sku || "—", prix: rpM(e.apres, r?.devise || rpDevise(rowsAll)) };
}
function rpIndicDe(rows, F) {
  const parK = rpLignesFile(rows), cts = (v) => (typeof v === "number" && Number.isFinite(v) ? Math.round(v * 100) : null);
  const AJ = ["a_valider", "envoi_non_confirme", "envoi_refuse", "refuse_amazon", "situation_changee"];
  const n = { offres: 0, vise: 0, ajuster: 0, plancher: 0, nonCalc: 0 }, de = {};
  for (const [k, cl] of Object.entries(F?.classe || {})) {
    const r = parK.get(k), c = r?.conseil || {};
    const i = AJ.includes(cl) ? "ajuster" : cl !== "sans_changement" ? "nonCalc" : c.etat === "propose" ? "ajuster"
      : c.etat === "garder" ? (cts(r?.prixActuel) === null || cts(r?.ombre?.plancher) === null ? "nonCalc"
        : cts(r.prixActuel) === cts(r.ombre.plancher) ? "plancher" : "vise") : "nonCalc";
    de[k] = i; n[i]++; n.offres++;
  }
  return { ...n, de };
}
function rpCtbListe(r) {
  const c = r?.conseil || {}, o = r?.ombre || {};
  return c.etat === "propose" && typeof o.margeProposee === "number" && Number.isFinite(o.margeProposee) && Number.isFinite(o.prixPropose)
    && rpCents(o.prixPropose) === rpCents(c.prix) ? o.margeProposee : null;
}
function rpRaisonCourte(r) {
  const c = r?.conseil || {}, k = "rpRzK_" + c.raison, ref = r?.ombre?.concurrents;
  if (c.raison === "cible_concurrents" && ref && Number.isFinite(ref.prixCible) && rpCents(ref.prixCible) === rpCents(c.prix)) {
    const pos = rpPosMots(ref, r.devise);
    if (pos) return pos;
  }
  return typeof c.raison === "string" && c.raison && t(k) !== k ? t(k) : rpRaisonTxt(c.raison);
}
function rpPosMots(ref, cur) {
  if (typeof ref.cible !== "string" || !Number.isFinite(ref.ecart) || !ref.unite) return null;
  const v = Math.abs(ref.ecart), e = ref.unite === "pct" ? t("rpSd_pct", v.toLocaleString(LOCALE(), { maximumFractionDigits: 2 })) : rpM(v, cur);
  return t("rpRzQ", e, Math.sign(ref.ecart), ref.cible) || null;
}
const RP_IC = { mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>', ok: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  aj: '<path d="M8 20V5M4.5 8.5L8 5l3.5 3.5M16 4v15M12.5 15.5L16 19l3.5-3.5"/>', sol: '<path d="M4 19.5h16M12 4v11M7.5 10.5L12 15l4.5-4.5"/>',
  los: '<path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/>', i1: '<path d="M12 10.5v7M12 6.5v.6"/>', cad: '<rect x="5.5" y="11" width="13" height="9.5" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 017 0v3"/>',
  cfg: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>' ,
  dn: '<path d="M12 5v14M6 13l6 6 6-6"/>', tag: '<path d="M3.5 12V4.5h7.5l9.5 9.5-7.5 7.5z"/><circle cx="8" cy="9" r="1.2"/>', inf: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.5v.4"/>' };
const rpSvg = (k, cls = "rp-i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${RP_IC[k]}</svg>`;
function rpIndHtml(I, F, nEnv, nConf) {
  const tu = (ton, ic, k, v) => `<div class="rp-indt${ton ? " " + ton : ""}"><span class="rp-indi">${rpSvg(ic)}</span><span class="rp-indk">${escapeHtml(t(k))}<i class="rp-dsk"> :</i></span><b>${fmtInt(v)}</b></div>`;
  const nAv = F.aValider.length, faire = [nEnv ? t("rpK5_env", fmtInt(nEnv)) : null, nAv ? t("rpK5_prix", fmtInt(nAv)) : null, nConf ? t("rpK5_conf", fmtInt(nConf)) : null].filter(Boolean);
  return `<div class="rp-ind" role="group" aria-label="${escapeHtml(t("rpK5_aria"))}">${tu("rp-indtot", "mail", "rpK5_offres", I.offres)}${tu("ok", "ok", "rpK5_vise", I.vise)}`
    + `${tu("warn", "aj", "rpK5_ajuster", I.ajuster)}${tu("info", "sol", "rpK5_plancher", I.plancher)}${tu("unk", "los", "rpK5_nonCalc", I.nonCalc)}</div>`
    + `<p class="rp-etatv"><span class="rp-dsk">${faire.length ? `${escapeHtml(t("rpK5_aFaire"))} ${faire.map((x) => `<b>${escapeHtml(x)}</b>`).join(" · ")}` : escapeHtml(t("rpSpF_rien"))}</span>`
    + `<span class="rp-tel">${escapeHtml(t("rpK5_pos", fmtInt(I.offres)))}</span></p>`;
}
function rpSecHtml(ton, ic, titre, nb, corps) {
  return `<section class="rp-sec rp-sec-${ton}"><h3 class="rp-sech"><span class="rp-seci">${rpSvg(ic)}</span>${escapeHtml(titre)}<span class="rp-secn">${fmtInt(nb)}</span></h3>${corps}</section>`;
}
function rpSpFileHtml(rows, F, o = {}) {
  const parK = rpLignesFile(rows), n = (v) => fmtInt(v), sel = (k) => (k === rp.sel ? " sel" : "");
  const bt = (lbl, attrs, tag = "button") => (tag === "a" ? `<a class="rp-fact rp-bt" ${attrs}>${escapeHtml(lbl)}${rpChev()}</a>` : `<button type="button" class="rp-fact rp-bt" ${attrs}>${escapeHtml(lbl)}${rpChev()}</button>`);
  const S = F.sansChangement, I = rpIndicDe(rows, F);
  const nVise = S.cles.filter((k) => I.de[k] === "vise").length, nPl = S.cles.filter((k) => I.de[k] === "plancher").length;
  const gNc = S.cles.filter((k) => I.de[k] === "nonCalc" && parK.get(k)?.conseil?.etat === "garder");
  const nSansPrix = gNc.filter((k) => parK.get(k)?.prixActuel == null).length, nSansPl = gNc.length - nSansPrix;
  const dont = [nVise ? t("rpSpF_dVise", n(nVise)) : null, nPl ? t("rpF_dPl", n(nPl)) : null, S.enPromo ? t("rpF_dPromo", n(S.enPromo)) : null,
    S.sansStock ? t("rpF_dStock", n(S.sansStock)) : null, S.ignores ? t("rpF_dIgn", n(S.ignores)) : null,
    nSansPl ? t("rpSpF_dSansPl", n(nSansPl)) : null, nSansPrix ? t("rpSpF_dSansPrix", n(nSansPrix)) : null].filter(Boolean).map((x) => `<b>${escapeHtml(x)}</b>`).join(", ");
  const sansH = `<span>${escapeHtml(t("rpSpF_sansTxt", n(S.n), dont ? "\u0001" : "")).replace("\u0001", dont)}</span>`;
  const ign = S.cles.filter((k) => parK.get(k)?.ignore?.actif === true);
  const ligneIgn = ign.length ? `<li class="rp-fc" data-rp-ignores><span class="rp-fct"><b>${escapeHtml(t("rpF_ignores"))}</b><span class="rp-fnb">${escapeHtml(t("rpF_nOffres", n(ign.length)))}</span></span>`
    + `<span class="rp-fco">${ign.map((k) => { const r = parK.get(k); return `<button type="button" class="rp-fo${sel(k)}" data-rp-fk="${escapeHtml(k)}">${rpDrapeau(r.marketplace)}${escapeHtml(rpNom(r))}</button>`; }).join("")}</span></li>` : "";
  if (!F.aValider.length && !F.aDebloquer.length) {
    const dm = o.derniere;
    return `<div class="rp-file rp-calm" data-rp-porte="smartprice"><div class="rp-calmh"><span class="rp-okc" aria-hidden="true">${rpIc("check")}</span><h3>${escapeHtml(t("rpSpF_rien"))}</h3></div>`
      + `<section class="rp-sec rp-sec-neu rp-sec-nh"><ul class="rp-fl">`
      + `<li class="rp-fc rp-rest"><span class="rp-fct"><span><b>${escapeHtml(t("rpF_sans"))}</b> · ${escapeHtml(t("rpF_nOffres", n(S.n)))}</span></span>${S.n ? bt(t("rpF_toutVoir"), 'data-rp-tab="tous"') : ""}</li>` + ligneIgn
      + (dm ? `<li class="rp-fc rp-rest"><span class="rp-fct"><span><b>${escapeHtml(t("rpF_derniere"))}</b> · ${escapeHtml([dm.quand, dm.nom, dm.prix].filter(Boolean).join(" · "))}</span></span>${bt(t("rpTabJournal"), 'data-rp-tab="journal"')}</li>` : "")
      + `</ul></section></div>`;
  }
  const offres = (cles) => { const prods = new Map();
    for (const k of cles) { const r = parK.get(k); const p = prods.get(r.asin) ?? prods.set(r.asin, { k, r, mps: [] }).get(r.asin); p.mps.push(r.marketplace); if (k === rp.sel) { p.k = k; p.r = r; } }
    const vus = [...prods.values()], aff = vus.slice(0, 3), plus = vus.length - aff.length;
    return aff.map((p) => `<button type="button" class="rp-fo${sel(p.k)}" data-rp-fk="${escapeHtml(p.k)}">${p.mps.map((m) => rpDrapeau(m)).join("")}${escapeHtml(rpNom(p.r))}</button>`).join("")
      + (plus > 0 ? `<span class="rp-fnt">+${n(plus)}</span>` : ""); };
  const ms = (v) => { const x = typeof v === "string" ? Date.parse(v) : NaN; return Number.isFinite(x) ? x : null; };
  const ligneEnv = (cles, attente) => {
    const r0 = parK.get(cles[0]), dp = r0.dernierPrix || {};
    const lu = r0.prixActuel != null && ms(r0.releveAt) !== null && ms(dp.at) !== null && ms(r0.releveAt) > ms(dp.at);
    const sous = cles.length === 1 && !attente && typeof dp.after === "number"
      ? `<small class="rp-fsub">${escapeHtml([t("rpSl_envD", rpM(dp.after, r0.devise)), lu ? t("rpSl_envL", rpM(r0.prixActuel, r0.devise)) : null].filter(Boolean).join(" · "))}</small>` : "";
    return `<li class="rp-fc" data-rp-cause="envoi_non_confirme" data-rp-env="${attente ? "attente" : "envoye"}"><span class="rp-fct"><b>${escapeHtml(t(attente ? "rpD_envAttente" : "rpSl_envT"))}</b>${sous}</span>`
      + `<span class="rp-fnb">${escapeHtml(t("rpF_nOffres", n(cles.length)))}</span><span class="rp-fco">${offres(cles)}</span><span class="rp-fx">${bt(t("rpSl_verifier"), `data-rp-fk="${escapeHtml(cles[0])}"`)}</span></li>`;
  };
  const env = F.aDebloquer.find((x) => x.cause === "envoi_non_confirme") || null, deb = F.aDebloquer.filter((x) => x.cause !== "envoi_non_confirme");
  const att = env ? env.cles.filter((k) => parK.get(k).dernierPrix?.status === "PENDING") : [], env2 = env ? env.cles.filter((k) => !att.includes(k)) : [];
  const nEnv = env ? env.cles.length : 0, nDeb = deb.reduce((s, x) => s + x.cles.length, 0);
  const ligneAv = (k) => {
    const r = parK.get(k), c = r.conseil || {}, hors = ["sous_le_plancher", "au_dessus_du_plafond", "prix_actuel_non_admissible", "cible_concurrents_plancher"].includes(c.raison);
    const titreC = rpTitre(r, rp.d?.titres), act = r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, r.devise));
    const rz = rpRaisonCourte(r) ?? "", ec = rpSpEcart(r.prixActuel, c.prix), ctb = rpCtbListe(r);
    return `<li><button type="button" class="rp-tr${sel(k)}" data-rp-fk="${escapeHtml(k)}"${k === rp.sel ? ' aria-current="true"' : ""}>`
      + `<span class="rp-tc rp-tnom">${rpDrapeau(r.marketplace)}${rpThumb(r)}<span class="rp-tn"><span class="rp-fnn"${titreC ? ` title="${escapeHtml(titreC)}"` : ""}>${escapeHtml(rpNom(r))}</span>`
      + `${rpSkuTag(r)}</span></span>`
      + `<span class="rp-tc rp-tpa">${act}</span><span class="rp-tc rp-tpb">${rpFleche()}<b>${escapeHtml(rpM(c.prix, r.devise) ?? "—")}</b></span>`
      + `<span class="rp-tc rp-tec">${ec ? escapeHtml(ec) : ""}</span>`
      + `<span class="rp-tc rp-twhy">${rz ? `<span class="rp-pil${hors ? " neg" : ""}">${escapeHtml(rz)}</span>` : ""}</span>`
      + `<span class="rp-tc rp-tctb" data-rp-ctb="${ctb === null ? "nc" : "ok"}"><span class="rp-tel">${escapeHtml(t("rpSl_thCtb"))} </span>${ctb === null ? `<span class="rp-fnt">${escapeHtml(t("rpSd_nonCalc"))}</span>` : "≈ " + escapeHtml(rpM(ctb, r.devise))}</span>`
      + `<span class="rp-tc rp-tact"><span class="rp-bt"><span class="rp-dsk">${escapeHtml(t("rpF_examiner"))}</span>${rpChev()}</span></span></button></li>`;
  };
  const ligneCause = ({ cause, cles }) => {
    const g = cause === "cout_inconnu" ? bt(t("rpF_saisirCout"), 'href="#stock/cogs"', "a")
      : cause === "bornes_en_conflit" ? bt(t("rpF_modifRegle"), 'data-rp-tab="regles"') : bt(t("rpF_voir"), `data-rp-fk="${escapeHtml(cles[0])}"`);
    const d = t("rpSpFcD_" + cause) !== "rpSpFcD_" + cause ? t("rpSpFcD_" + cause) : ["frais_inconnus", "sans_prix", "aucun", "bloque"].includes(cause) ? t("rpSpFcD") : null;
    return `<li class="rp-fc" data-rp-cause="${escapeHtml(cause)}"><span class="rp-fct"><b>${escapeHtml(t("rpFc_" + cause))}</b>${d ? `<small class="rp-fsub">${escapeHtml(d)}</small>` : ""}</span>`
      + `<span class="rp-fnb">${escapeHtml(t("rpF_nOffres", n(cles.length)))}</span><span class="rp-fco">${offres(cles)}</span><span class="rp-fx">${g}</span></li>`;
  };
  const tete = `<div class="rp-thd" aria-hidden="true"><span>${escapeHtml(t("rpTh_prod"))}</span><span class="rp-tpa">${escapeHtml(t("rpSpTh_prix"))}</span><span class="rp-tpb">${escapeHtml(t("rpSpTh_conseil"))}</span>`
    + `<span>${escapeHtml(t("rpSl_thVar"))}</span><span>${escapeHtml(t("rpSl_thRaison"))}</span><span>${escapeHtml(t("rpSl_thCtb"))}</span><span></span></div>`;
  return `<div class="rp-file" data-rp-porte="smartprice">` + rpIndHtml(I, F, nEnv, nDeb)
    + (env ? rpSecHtml("info", "i1", t("rpSl_envoi"), nEnv, `<ul class="rp-fl">${env2.length ? ligneEnv(env2, false) : ""}${att.length ? ligneEnv(att, true) : ""}</ul>`) : "")
    + (F.aValider.length ? rpSecHtml("id", "ok", t(o.verrou === "ouvert" ? "rpF_aValider" : "rpF_conseils"), F.aValider.length, `<div class="rp-tbl rp-tbl7">${tete}<ul class="rp-fl">${F.aValider.map(ligneAv).join("")}</ul></div>`) : "")
    + (nDeb ? rpSecHtml("warn", "cfg", t("rpSpF_aCompleter"), nDeb, `<ul class="rp-fl">${deb.map(ligneCause).join("")}</ul>`) : "")
    + (S.n ? rpSecHtml("neu", "ok", t("rpF_sans"), S.n, `<ul class="rp-fl"><li class="rp-fc rp-rest"><span class="rp-fct rp-mut">${sansH}</span>${bt(t("rpF_toutVoir"), 'data-rp-tab="tous"')}</li>${ligneIgn}</ul>`) : "")
    + (F.aValider.length ? `<p class="rp-fnt rp-ast">${escapeHtml(t("rpSl_ctbNote"))}</p>` : "")
    + `</div>`;
}
function rpVedEtat(r) {
  const v = r?.ombre?.vedette?.etat;
  if (r?.ombre?.sousType === "vendeurs_fiche" && r.ombre.vedette) return ["tenue", "perdue", "inconnue", "aucune"].includes(v) ? v : "inconnue";
  return ["detenue", "seul_vendeur"].includes(r?.situation) ? "tenue" : r?.situation === "perdue" ? "perdue" : "inconnue";
}
const rpEstSimu = (r) => r?.conseil?.etat === "simulation" && Number.isFinite(r.conseil.prix);
function rpReCtb(r) {
  const c = r?.conseil || {}, o = r?.ombre || {};
  return (c.etat === "propose" || rpEstSimu(r)) && typeof o.margeProposee === "number" && Number.isFinite(o.margeProposee) && Number.isFinite(o.prixPropose)
    && rpCents(o.prixPropose) === rpCents(c.prix) ? o.margeProposee : null;
}
function rpReVideHtml() {
  const etape = (n, act) => `<li class="rp-fc rp-step${n > 1 ? " rp-step-off" : ""}"><span class="rp-fct"><span><b>${n} · ${escapeHtml(t("rpRe_e_" + n))}</b> · ${escapeHtml(t("rpRe_e_" + n + "d"))}</span></span><span class="rp-fx">${act}</span></li>`;
  return `<div class="rp-file rp-calm rp-vide rp-re" data-rp-vide="repricer"><div class="rp-calmh"><h3>${escapeHtml(t("rpRe_videT"))}</h3></div><p class="rp-videp">${escapeHtml(t("rpRe_videD"))}</p>`
    + `<section class="rp-sec rp-sec-neu"><ol class="rp-fl rp-steps" aria-label="${escapeHtml(t("rpRe_videT"))}">`
    + etape(1, `<button type="button" class="rp-go" data-rp-tab="regles">${escapeHtml(t("rpRe_e_1a"))}</button>`)
    + etape(2, `<span class="rp-lock">${rpSvg("cad")}${escapeHtml(t("rpSp_apres", 1))}</span>`) + `</ol></section>`
    + `<p class="rp-fnt rp-ast">${escapeHtml(t("rpRe_videB"))}</p></div>`;
}
const RP_RE_TRIS = ["pays", "produit", "variation", "contribution"];
function rpReTriVal(r, c) {
  if (!r) return null;
  if (c === "pays") return r.marketplace || null;
  if (c === "produit") return rpNom(r) || null;
  if (c === "contribution") return rpReCtb(r);
  const p = r.conseil?.prix, a = r.prixActuel;
  return (r.conseil?.etat === "propose" || rpEstSimu(r)) && Number.isFinite(p) && Number.isFinite(a) && a > 0 ? (p - a) / a : null;
}
function rpReTri(ks, parK, tri) {
  const c = RP_RE_TRIS.includes(tri?.c) ? tri.c : "pays", d = tri?.d === -1 ? -1 : 1;
  const v = new Map(ks.map((k) => [k, rpReTriVal(parK.get(k), c)]));
  return [...ks].sort((x, y) => {
    const a = v.get(x), b = v.get(y);
    if (a === null || b === null) return a === null && b === null ? (x < y ? -1 : x > y ? 1 : 0) : a === null ? 1 : -1;
    const o = typeof a === "number" ? a - b : String(a).localeCompare(String(b), LOCALE(), { sensitivity: "base" });
    return o ? d * o : x < y ? -1 : x > y ? 1 : 0;
  });
}
function rpReFileHtml(rows, F, o = {}) {
  const parK = rpLignesFile(rows), n = (v) => fmtInt(v), sel = (k) => (k === rp.sel ? " sel" : "");
  const bt = (lbl, attrs, tag = "button") => (tag === "a" ? `<a class="rp-fact rp-bt" ${attrs}>${lbl}${rpChev()}</a>` : `<button type="button" class="rp-fact rp-bt" ${attrs}>${lbl}${rpChev()}</button>`);
  const S = F.sansChangement, cles = Object.keys(F.classe);
  const I = { offres: 0, tenue: 0, perdue: 0, aucune: 0, inconnue: 0 }, de = {};
  for (const k of cles) { const e = rpVedEtat(parK.get(k)); de[k] = e; I[e]++; I.offres++; }
  const simu = (F.aDebloquer.find((x) => x.cause === "bloque")?.cles || []).filter((k) => rpEstSimu(parK.get(k)));
  const tri = (ks) => rpReTri(ks, parK, rp.reTri);
  const conseils = tri([...F.aValider, ...simu]);
  const env0 = F.aDebloquer.find((x) => x.cause === "envoi_non_confirme") || null, env = env0 ? { ...env0, cles: tri(env0.cles) } : null;
  const deb = F.aDebloquer.filter((x) => x.cause !== "envoi_non_confirme").map((x) => ({ cause: x.cause, cles: tri(x.cles.filter((k) => !simu.includes(k))) })).filter((x) => x.cles.length);
  const nEnv = env ? env.cles.length : 0, nDeb = deb.reduce((s, x) => s + x.cles.length, 0);
  const tu = (ton, ic, k, v) => `<div class="rp-indt${ton ? " " + ton : ""}" data-rp-ind="${k}"><span class="rp-indi">${rpSvg(ic)}</span><span class="rp-indk">${escapeHtml(t("rpRe_i_" + k))}<i class="rp-dsk"> :</i></span><b>${n(v)}</b></div>`;
  const ind = `<div class="rp-ind" role="group" aria-label="${escapeHtml(t("rpRe_iAria"))}">${tu("rp-indtot", "mail", "offres", I.offres)}${tu("ok", "ok", "tenue", I.tenue)}`
    + `${tu("warn", "dn", "perdue", I.perdue)}${tu("info", "tag", "aucune", I.aucune)}${tu("unk", "inf", "inconnue", I.inconnue)}</div>`;
  const sousPl = tri(S.cles.filter((k) => { const r = parK.get(k); return r?.conseil?.etat === "garder" && r.conseil.raison === "cible_vedette_sous_le_plancher"; }));
  const reste = S.cles.filter((k) => !sousPl.includes(k)), cpt = { tenue: 0, perdue: 0, aucune: 0, inconnue: 0 };
  for (const k of reste) cpt[de[k] || "inconnue"]++;
  const parts = ["tenue", "perdue", "aucune", "inconnue"].filter((e) => cpt[e]).map((e) => `<b><span class="rp-dsk">${escapeHtml(t("rpRe_g_" + e, n(cpt[e])))}</span><span class="rp-tel">${escapeHtml(t("rpRe_gc_" + e, n(cpt[e])))}</span></b>`).join(", ");
  const resteH = reste.length ? `<div class="rp-sec rp-reste"><ul class="rp-fl"><li class="rp-fc rp-rest"><span class="rp-fct rp-mut"><span>${escapeHtml(t("rpSpF_sansTxt", n(reste.length), parts ? "\u0001" : "")).replace("\u0001", parts)}</span></span>${bt(escapeHtml(t("rpF_toutVoir")), 'data-rp-tab="tous"')}</li></ul></div>` : "";
  const ign = S.cles.filter((k) => parK.get(k)?.ignore?.actif === true);
  const ligneIgn = ign.length ? `<li class="rp-fc" data-rp-ignores><span class="rp-fct"><b>${escapeHtml(t("rpF_ignores"))}</b><span class="rp-fnb">${escapeHtml(t("rpF_nOffres", n(ign.length)))}</span></span>`
    + `<span class="rp-fco">${ign.map((k) => { const r = parK.get(k); return `<button type="button" class="rp-fo${sel(k)}" data-rp-fk="${escapeHtml(k)}">${rpDrapeau(r.marketplace)}<span class="rp-tn"><span>${escapeHtml(rpNom(r))}</span>${rpSkuTag(r)}</span></button>`; }).join("")}</span></li>` : "";
  if (!conseils.length && !nDeb && !nEnv) {
    const h = rpHeure(o.calculeLe);
    return `<div class="rp-file rp-calm rp-re" data-rp-rien><div class="rp-calmh"><span class="rp-okc" aria-hidden="true">${rpIc("check")}</span><div><h3>${escapeHtml(t("rpRe_rien"))}</h3>`
      + `<p class="rp-mut">${escapeHtml(h ? t("rpRe_rienD", h, n(I.offres)) : t("rpRe_rienDx", n(I.offres)))}</p></div></div>${ind}`
      + `<p class="rp-etatv rp-tel">${escapeHtml(t("rpRe_pos", n(I.offres)))}</p>`
      + (sousPl.length || ligneIgn || o.derniere ? `<section class="rp-sec rp-sec-neu rp-sec-nh"><ul class="rp-fl">${sousPl.length ? rpReSousPl(sousPl, parK, bt, sel) : ""}${ligneIgn}`
        + (o.derniere ? `<li class="rp-fc rp-rest"><span class="rp-fct"><span><b>${escapeHtml(t("rpF_derniere"))}</b> · ${escapeHtml([o.derniere.quand, o.derniere.nom, o.derniere.prix].filter(Boolean).join(" · "))}</span></span>${bt(escapeHtml(t("rpTabJournal")), 'data-rp-tab="journal"')}</li>` : "")
        + `</ul></section>` : "")
      + resteH + `<p class="rp-fnt rp-ast">${escapeHtml(t("rpRe_prochaines"))}</p></div>`;
  }
  const simuP = o.verrou !== "ouvert" || !F.aValider.length;
  const lire = simuP ? conseils.length : simu.length;
  const faire = [nEnv ? t("rpK5_env", n(nEnv)) : null, simuP ? null : t("rpK5_prix", n(F.aValider.length)), lire ? t("rpRe_aLire", n(lire)) : null, nDeb ? t("rpK5_conf", n(nDeb)) : null].filter(Boolean);
  const etatv = `<p class="rp-etatv"><span class="rp-dsk">${escapeHtml(t(simuP ? "rpRe_simuP" : "rpK5_aFaire"))} ${faire.map((x) => `<b>${escapeHtml(x)}</b>`).join(" · ")}</span>`
    + `<span class="rp-tel">${escapeHtml(t("rpRe_pos", n(I.offres)))}</span></p>`;
  const offres = (ks) => { const prods = new Map();
    for (const k of ks) { const r = parK.get(k); const p = prods.get(r.asin) ?? prods.set(r.asin, { k, r, mps: [], rs: [] }).get(r.asin); p.mps.push(r.marketplace); p.rs.push(r); if (k === rp.sel) { p.k = k; p.r = r; } }
    const vus = [...prods.values()], aff = vus.slice(0, 3), plus = vus.length - aff.length;
    return aff.map((p) => `<button type="button" class="rp-fo${sel(p.k)}" data-rp-fk="${escapeHtml(p.k)}">${p.mps.map((m) => rpDrapeau(m)).join("")}<span class="rp-tn"><span>${escapeHtml(rpNom(p.r))}</span>${rpSkuTag(p.r, p.rs)}</span></button>`).join("")
      + (plus > 0 ? `<span class="rp-fnt">+${n(plus)}</span>` : ""); };
  const ms = (v) => { const x = typeof v === "string" ? Date.parse(v) : NaN; return Number.isFinite(x) ? x : null; };
  const ligneEnv = (ks) => { const r0 = parK.get(ks[0]), dp = r0.dernierPrix || {}, att = dp.status === "PENDING";
    const lu = r0.prixActuel != null && ms(r0.releveAt) !== null && ms(dp.at) !== null && ms(r0.releveAt) > ms(dp.at);
    const sous = ks.length === 1 && !att && typeof dp.after === "number" ? `<small class="rp-fsub">${escapeHtml(t("rpSl_envD", rpM(dp.after, r0.devise)))}${lu ? ` · <span class="rp-dsk">${escapeHtml(t("rpSl_envL", rpM(r0.prixActuel, r0.devise)))}</span><span class="rp-tel">${escapeHtml(t("rpRe_envLc", rpM(r0.prixActuel, r0.devise)))}</span>` : ""}</small>` : "";
    return `<li class="rp-fc" data-rp-cause="envoi_non_confirme"><span class="rp-fct"><b>${escapeHtml(t(att ? "rpD_envAttente" : "rpSl_envT"))}</b>${sous}</span>`
      + `<span class="rp-fnb">${escapeHtml(t("rpF_nOffres", n(ks.length)))}</span><span class="rp-fco">${offres(ks)}</span><span class="rp-fx">${bt(escapeHtml(t("rpSl_verifier")), `data-rp-fk="${escapeHtml(ks[0])}"`)}</span></li>`; };
  const ligneAv = (k) => {
    const r = parK.get(k), c = r.conseil || {}, hors = ["sous_le_plancher", "au_dessus_du_plafond", "prix_actuel_non_admissible"].includes(c.raison);
    const titreC = rpTitre(r, rp.d?.titres), act = r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, r.devise));
    const rz = rpRaisonCourte(r) ?? "", ec = rpSpEcart(r.prixActuel, c.prix), ctb = rpReCtb(r), hausse = r.ombre?.vedette?.sens === "hausse" && de[k] === "tenue";
    return `<li><button type="button" class="rp-tr${sel(k)}" data-rp-fk="${escapeHtml(k)}" data-rp-conseil="${escapeHtml(c.etat)}"${k === rp.sel ? ' aria-current="true"' : ""}>`
      + `<span class="rp-tc rp-tnom">${rpDrapeau(r.marketplace)}${rpThumb(r)}<span class="rp-tn"><span class="rp-fnn"${titreC ? ` title="${escapeHtml(titreC)}"` : ""}>${escapeHtml(rpNom(r))}</span>`
      + `${rpSkuTag(r)}</span></span>`
      + `<span class="rp-tc rp-tpa">${act}</span><span class="rp-tc rp-tpb">${rpFleche()}<b>${escapeHtml(rpM(c.prix, r.devise) ?? "—")}</b></span>`
      + `<span class="rp-tc rp-tec">${ec ? escapeHtml(ec) : ""}</span>`
      + `<span class="rp-tc rp-twhy">${rz ? `<span class="rp-pil${hors ? " neg" : hausse ? " info" : ""}">${escapeHtml(rz)}</span>` : ""}</span>`
      + `<span class="rp-tc rp-tctb" data-rp-ctb="${ctb === null ? "nc" : "ok"}"><span class="rp-tel">${escapeHtml(t("rpSl_thCtb"))} </span>${ctb === null ? `<span class="rp-fnt">${escapeHtml(t("rpSd_nonCalc"))}</span>` : "≈ " + escapeHtml(rpM(ctb, r.devise))}</span>`
      + `<span class="rp-tc rp-tact"><span class="rp-bt"><span class="rp-dsk">${escapeHtml(t("rpF_examiner"))}</span>${rpChev()}</span></span></button></li>`;
  };
  const ligneCause = ({ cause, cles: ks }) => {
    const r0 = parK.get(ks[0]), o0 = r0?.ombre || {};
    let titre = escapeHtml(t("rpFc_" + cause)), sous = t("rpSpFcD_" + cause) !== "rpSpFcD_" + cause ? escapeHtml(t("rpSpFcD_" + cause)) : "", g;
    if (cause === "cout_inconnu") {
      const e = new Set(ks.map((k) => parK.get(k)?.asin)).size === 1 ? ks.map((k) => rp.det[rpKey(parK.get(k))]?.coutEstime).find((x) => x?.etat === "estime") : null, v = e?.etat === "estime" && typeof e.unitCost === "number" ? rpM(e.unitCost, e.devise || r0.devise) : null;
      titre = v ? `<span class="rp-dsk">${escapeHtml(t("rpRe_coutEst"))}</span><span class="rp-tel">${escapeHtml(t("rpRe_coutEstC"))}</span><span class="rp-cestl">${escapeHtml(v)}</span><i class="rp-cexc" aria-hidden="true">!</i><span class="rp-caco rp-dsk">${escapeHtml(t("rpRe_aConf"))}</span>`
        : `${escapeHtml(t("rpRe_coutInc"))}<i class="rp-cexc" aria-hidden="true">!</i><span class="rp-caco">${escapeHtml(t("rpRe_aConf"))}</span>`;
      sous = `<span class="rp-dsk">${escapeHtml(t("rpRe_coutD"))}</span><span class="rp-tel"><span class="rp-caco">${escapeHtml(t("rpRe_aConf"))}</span> · ${escapeHtml(t("rpRe_coutDc"))}</span>`;
      g = bt(`<span class="rp-dsk">${escapeHtml(t("rpRe_confCogs"))}</span><span class="rp-tel">${escapeHtml(t("rpF_voir"))} COGS</span>`, 'href="#stock/cogs"', "a");
    } else if (cause === "bornes_en_conflit") {
      const pl = o0.plancher, pf = o0.plafond;
      sous = ks.length === 1 && Number.isFinite(pl) && Number.isFinite(pf) && rpCents(pl) > rpCents(pf) ? escapeHtml(t("rpRe_conflitD", rpM(pl, r0.devise), rpM(pf, r0.devise))) : "";
      g = bt(escapeHtml(t("rpF_modifRegle")), 'data-rp-tab="regles"');
    } else g = bt(escapeHtml(t("rpF_voir")), `data-rp-fk="${escapeHtml(ks[0])}"`);
    return `<li class="rp-fc" data-rp-cause="${escapeHtml(cause)}"><span class="rp-fct"><b>${titre}</b>${sous ? `<small class="rp-fsub">${sous}</small>` : ""}</span>`
      + `<span class="rp-fnb">${escapeHtml(t("rpF_nOffres", n(ks.length)))}</span><span class="rp-fco">${offres(ks)}</span><span class="rp-fx">${g}</span></li>`;
  };
  const tete = `<div class="rp-thd" aria-hidden="true"><span>${escapeHtml(t("rpTh_prod"))}</span><span class="rp-tpa">${escapeHtml(t("rpSpTh_prix"))}</span><span class="rp-tpb">${escapeHtml(t("rpSpTh_conseil"))}</span>`
    + `<span>${escapeHtml(t("rpSl_thVar"))}</span><span>${escapeHtml(t("rpSl_thRaison"))}</span><span>${escapeHtml(t("rpSl_thCtb"))}</span><span></span></div>`;
  const sansCorps = (sousPl.length ? rpReSousPl(sousPl, parK, bt, sel) : "") + ligneIgn;
  return `<div class="rp-file rp-re">` + ind + etatv
    + (env ? rpSecHtml("info", "i1", t("rpSl_envoi"), nEnv, `<ul class="rp-fl">${ligneEnv(env.cles)}</ul>`) : "")
    + (conseils.length ? rpSecHtml("id", "ok", t(simuP ? "rpF_conseils" : "rpF_aValider"), conseils.length, `<div class="rp-tbl rp-tbl7">${tete}<ul class="rp-fl">${conseils.map(ligneAv).join("")}</ul></div>`) : "")
    + (nDeb ? rpSecHtml("warn", "cfg", t("rpSpF_aCompleter"), nDeb, `<ul class="rp-fl">${deb.map(ligneCause).join("")}</ul>`) : "")
    + (sansCorps ? rpSecHtml("neu", "ok", t("rpF_sans"), S.n, `<ul class="rp-fl">${sansCorps}</ul>`) : "")
    + resteH + (conseils.length ? `<p class="rp-fnt rp-ast">${escapeHtml(t("rpSl_ctbNote"))}</p>` : "") + `</div>`;
}
function rpReSousPl(ks, parK, bt, sel) {
  const auPl = ks.every((k) => { const r = parK.get(k); return Number.isFinite(r?.prixActuel) && Number.isFinite(r?.ombre?.plancher) && rpCents(r.prixActuel) === rpCents(r.ombre.plancher); });
  const r0 = parK.get(ks[0]);
  return `<li class="rp-fc" data-rp-cause="sous_plancher"><span class="rp-fct"><b>${escapeHtml(t("rpRe_sousPl"))}</b><small class="rp-fsub">${escapeHtml(t(auPl ? "rpRe_sousPlD" : "rpRe_sousPlDx"))}</small></span>`
    + `<span class="rp-fnb">${escapeHtml(t("rpF_nOffres", fmtInt(ks.length)))}</span><span class="rp-fco"><button type="button" class="rp-fo${sel(ks[0])}" data-rp-fk="${escapeHtml(ks[0])}">${rpDrapeau(r0.marketplace)}<span class="rp-tn"><span>${escapeHtml(rpNom(r0))}</span>${rpSkuTag(r0)}</span></button>${ks.length > 1 ? `<span class="rp-fnt">+${fmtInt(ks.length - 1)}</span>` : ""}</span>`
    + `<span class="rp-fx">${bt(escapeHtml(t("rpF_voir")), `data-rp-fk="${escapeHtml(ks[0])}"`)}</span></li>`;
}
function rpFileHtml(rows, F, o = {}) {
  if (o.porte === "smartprice") return rpSpFileHtml(rows, F, o);
  if (o.porte === "repricer") return rpReFileHtml(rows, F, o);
  const parK = rpLignesFile(rows);
  const sel = (k) => (k === rp.sel ? " sel" : "");
  const n = (v) => fmtInt(v);
  const geste = (lbl, attrs) => `<button type="button" class="rp-fact" ${attrs}>${escapeHtml(lbl)}${rpChev()}</button>`;
  const S = F.sansChangement, dont = [S.auPlancher ? t("rpF_dPl", n(S.auPlancher)) : null, S.enPromo ? t("rpF_dPromo", n(S.enPromo)) : null,
    S.sansStock ? t("rpF_dStock", n(S.sansStock)) : null, S.ignores ? t("rpF_dIgn", n(S.ignores)) : null].filter(Boolean).join(", ");
  const sansTxt = t("rpF_sansTxt", n(S.n), dont);
  const sansH = escapeHtml(sansTxt);
  const ign = S.cles.filter((k) => parK.get(k)?.ignore?.actif === true);
  const ligneIgn = ign.length ? `<li class="rp-fc" data-rp-ignores><span class="rp-fct"><b>${escapeHtml(t("rpF_ignores"))}</b><span class="rp-fnb">${escapeHtml(t("rpF_nOffres", n(ign.length)))}</span></span>`
    + `<span class="rp-fco">${ign.map((k) => { const r = parK.get(k); return `<button type="button" class="rp-fo${sel(k)}" data-rp-fk="${escapeHtml(k)}">${escapeHtml(rpNom(r))}${rpDrapeau(r.marketplace)}</button>`; }).join("")}</span></li>` : "";
  const titre = (lbl, nb, cls = "") => `<h3 class="rp-fh${cls}">${escapeHtml(lbl)}<span>${n(nb)}</span></h3>`;
  if (!F.aValider.length && !F.aDebloquer.length) {
    const dm = o.derniere;
    return `<div class="rp-file rp-calm"><div class="rp-calmh"><span class="rp-okc" aria-hidden="true">${rpIc("check")}</span><h3>${escapeHtml(t("rpF_rien"))}</h3></div><ul class="rp-fl">`
      + `<li class="rp-fc"><span class="rp-fct"><b>${escapeHtml(t("rpF_sans"))}</b> · ${sansH}</span>${S.n ? geste(t("rpF_toutVoir"), 'data-rp-tab="tous"') : ""}</li>` + ligneIgn
      + (dm ? `<li class="rp-fc"><span class="rp-fct"><b>${escapeHtml(t("rpF_derniere"))}</b> · ${escapeHtml([dm.quand, dm.nom, dm.prix].filter(Boolean).join(" · "))}</span>${geste(t("rpTabJournal"), 'data-rp-tab="journal"')}</li>` : "")
      + `</ul>${S.auPlancher ? "" : `<p class="rp-fnt rp-calmp">${escapeHtml(t("rpF_prochaines"))}</p>`}</div>`;
  }
  const ligneAv = (k) => {
    const r = parK.get(k), c = r.conseil || {}, hors = ["sous_le_plancher", "au_dessus_du_plafond", "prix_actuel_non_admissible"].includes(c.raison);
    const titreC = rpTitre(r, rp.d?.titres), act = r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, r.devise));
    return `<li><button type="button" class="rp-fr${sel(k)}" data-rp-fk="${escapeHtml(k)}"${k === rp.sel ? ' aria-current="true"' : ""}>`
      + `<span class="rp-fn">${rpThumb(r)}<span class="rp-fnn"${titreC ? ` title="${escapeHtml(titreC)}"` : ""}>${escapeHtml(rpNom(r))}</span>${rpDrapeau(r.marketplace)}</span>`
      + `<span class="rp-fp"><span class="rp-fa">${act}</span>${rpFleche()}<b>${escapeHtml(rpM(c.prix, r.devise) ?? "—")}</b></span>`
      + `<span class="rp-fz${hors ? " ko" : ""}" title="${escapeHtml(rpRaisonTxt(c.raison) ?? "")}">${escapeHtml(rpRaisonTxt(c.raison) ?? "")}</span>`
      + `<span class="rp-fx">${escapeHtml(t("rpF_examiner"))}${rpChev()}</span></button></li>`;
  };
  const ligneCause = ({ cause, cles }) => {
    const prods = new Map();
    for (const k of cles) { const r = parK.get(k); const p = prods.get(r.asin) ?? prods.set(r.asin, { k, r, mps: [] }).get(r.asin); p.mps.push(r.marketplace); }
    const vus = [...prods.values()], aff = vus.slice(0, 3), plus = vus.length - aff.length;
    const offres = aff.map((p) => `<button type="button" class="rp-fo${sel(p.k)}" data-rp-fk="${escapeHtml(p.k)}">${escapeHtml(rpNom(p.r))}${p.mps.map((m) => rpDrapeau(m)).join("")}</button>`).join("")
      + (plus > 0 ? `<span class="rp-fnt">+${n(plus)}</span>` : "");
    const g = cause === "cout_inconnu" ? `<a class="rp-fact" href="#stock/cogs">${escapeHtml(t("rpF_saisirCout"))}${rpChev()}</a>`
      : cause === "bornes_en_conflit" ? geste(t("rpF_modifRegle"), 'data-rp-tab="regles"') : geste(t("rpF_voir"), `data-rp-fk="${escapeHtml(cles[0])}"`);
    return `<li class="rp-fc" data-rp-cause="${escapeHtml(cause)}"><span class="rp-fct"><b>${escapeHtml(t("rpFc_" + cause))}</b><span class="rp-fnb">${escapeHtml(t("rpF_nOffres", n(cles.length)))}</span></span>`
      + `<span class="rp-fco">${offres}</span><span class="rp-fx">${g}</span></li>`;
  };
  const nDeb = F.aDebloquer.reduce((s, x) => s + x.cles.length, 0);
  return `<div class="rp-file">`
    + (F.aValider.length ? `<section class="rp-fg">${titre(t(o.verrou === "ouvert" ? "rpF_aValider" : "rpF_conseils"), F.aValider.length)}<ul class="rp-fl">${F.aValider.map(ligneAv).join("")}</ul></section>` : "")
    + (nDeb ? `<section class="rp-fg">${titre(t("rpF_aDebloquer"), nDeb, " wa")}<ul class="rp-fl">${F.aDebloquer.map(ligneCause).join("")}</ul></section>` : "")
    + (S.n ? `<section class="rp-fg">${titre(t("rpF_sans"), S.n)}<ul class="rp-fl"><li class="rp-fc"><span class="rp-fct rp-mut">${sansH}</span>${geste(t("rpF_toutVoir"), 'data-rp-tab="tous"')}</li>${ligneIgn}</ul></section>` : "")
    + `</div>`;
}
function rpGradueeHtml(r, ref = null) {
  const o = r.ombre || {}, pl = o.plancher, pf = o.plafond, cur = r.devise;
  if (!Number.isFinite(pl) || !Number.isFinite(pf) || !(pf >= pl)) return "";
  const pos = (v) => (!Number.isFinite(v) ? null : rpCents(v) < rpCents(pl) ? { x: 2, hors: "sous" } : rpCents(v) > rpCents(pf) ? { x: 98, hors: "dessus" }
    : { x: pf > pl ? 8 + ((v - pl) / (pf - pl)) * 84 : 50, hors: null });
  const c = r.conseil?.etat === "propose" ? pos(r.conseil.prix) : null, a = pos(r.prixActuel);
  const chev = (h) => (h ? `<svg class="rp-gch" viewBox="0 0 24 24" aria-hidden="true"><path d="${h === "sous" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}"/></svg>` : "");
  const pc = (x) => Math.round(x * 100) / 100;
  const lbl = c ? `<span class="rp-glbl" style="left:${pc(c.x)}%">${escapeHtml(rpM(r.conseil.prix, cur))}</span>` : "";
  const mA = a ? `<i class="rp-gm a${a.hors ? " hors" : ""}" style="left:${pc(a.x)}%">${chev(a.hors)}</i>` : "";
  const mC = c ? `<i class="rp-gm c${c.hors ? " hors" : ""}" style="left:${pc(c.x)}%">${chev(c.hors)}</i>` : "";
  const rf = ref && Number.isFinite(ref.reference) ? pos(ref.reference) : null;
  const mR = rf ? `<i class="rp-gm r" style="left:${pc(rf.x)}%" data-rp-sp-ref></i>` : "";
  const desc = [c ? `${t("rpD_conseille")} ${rpM(r.conseil.prix, cur)}` : null, a ? `${t("rpD_actuel")} ${rpM(r.prixActuel, cur)}` : null,
    rf ? `${t("rpSd_refAria")} ${rpM(ref.reference, cur)}` : null,
    `${t("rpD_plancher")} ${rpM(pl, cur)}`, `${t("rpD_plafond")} ${rpM(pf, cur)}`].filter(Boolean).join(" · ");
  return `<div class="rp-grad" role="img" aria-label="${escapeHtml(desc)}"><div class="rp-glbls">${lbl}</div><div class="rp-gt"><i class="rp-gb"></i>${mR}${mA}${mC}</div>`
    + `<div class="rp-gends"><span>${escapeHtml(t("rpD_plancher"))} <b>${escapeHtml(rpM(pl, cur))}</b></span><span>${escapeHtml(t("rpD_plafond"))} <b>${escapeHtml(rpM(pf, cur))}</b></span></div></div>`;
}
function rpLegendeHtml(r) {
  const o = r.ombre || {}, cur = r.devise, horsTxt = (v) => (typeof v !== "number" || typeof o.plancher !== "number" || typeof o.plafond !== "number" ? ""
    : rpCents(v) < rpCents(o.plancher) ? ` · ${t("rpD_sousPl")}` : rpCents(v) > rpCents(o.plafond) ? ` · ${t("rpD_dessusPf")}` : "");
  const age = r.releveAt ? ` <small>${escapeHtml(t("rpD_releve", rpAgeTxt(r.releveAt)))}</small>` : "";
  const c = r.conseil?.etat === "propose" ? `<span><i class="rp-ld c" aria-hidden="true"></i>${escapeHtml(t("rpD_conseille"))}</span><b class="rp-pos">${escapeHtml(rpM(r.conseil.prix, cur) ?? "—")}</b>` : "";
  const a = `<span><i class="rp-ld a" aria-hidden="true"></i>${escapeHtml(t("rpD_actuel"))}${age}${escapeHtml(horsTxt(r.prixActuel))}</span>`
    + `<b${horsTxt(r.prixActuel) ? ' class="rp-neg"' : ""}>${r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, cur))}</b>`;
  return `<div class="rp-leg">${c}${a}</div>`;
}
function rpEnvoiHtml(r, cls) {
  const dp = r.dernierPrix || {}, st = String(dp.status || ""), cur = r.devise;
  const titre = cls === "envoi_non_confirme" ? t(st === "PENDING" ? "rpD_envAttente" : "rpFc_envoi_non_confirme") : t("rpFc_" + cls);
  const txt = cls !== "envoi_non_confirme" ? `${t("rpD_motif")} : ${rpMotifTxt(dp.reason)}`
    : t(st === "PENDING" ? "rpD_env_PENDING" : st === "UNKNOWN" ? "rpD_env_UNKNOWN" : "rpD_env_EN_COURS");
  const prix = `${typeof dp.before === "number" ? rpM(dp.before, cur) : "—"} → ${typeof dp.after === "number" ? rpM(dp.after, cur) : "—"}`;
  return `<div class="rp-dst ${cls === "envoi_non_confirme" ? "wa" : "ko"}" data-rp-envoi="${escapeHtml(st)}"><b>${escapeHtml(titre)}</b>`
    + `<span class="rp-fnt">${escapeHtml(prix)}${dp.at ? ` · ${escapeHtml(rpQuand(dp.at))}` : ""}</span><p>${escapeHtml(txt)}</p>`
    + (cls === "envoi_non_confirme" ? "" : `<p class="rp-fnt">${escapeHtml(t("rpD_envRetour"))}</p>`) + `</div>`;
}
function rpCoutEstHtml(r, d) {
  const lien = `<a class="rp-fact" href="#stock/cogs">${escapeHtml(t("rpD_ouvrirCogs"))}${rpChev()}</a>`;
  if (!d) return "";
  const e = d.coutEstime || {}, raisonFx = d.coutAchat?.raison === "change_absent";
  if (e.etat === "estime" && typeof e.unitCost === "number") {
    return `<div class="rp-cest"><span class="rp-cesti" aria-hidden="true">!</span><div><div class="rp-kv"><span>${escapeHtml(t("rpD_coutEst"))}</span>`
      + `<span class="rp-cestv">${escapeHtml(rpM(e.unitCost, e.devise || null) ?? "—")}</span></div>`
      + (e.jour ? `<p class="rp-fnt">${escapeHtml(t("rpD_estDe", rpDate(e.jour)))}</p>` : "")
      + (raisonFx ? `<p class="rp-fnt">${escapeHtml(t("rpD_coutR_change_absent"))}</p>` : "")
      + `<p class="rp-cestw">${escapeHtml(t("rpD_aConfirmer"))}</p>${lien}</div></div>`;
  }
  const raison = raisonFx ? "change_absent" : e.raison;
  const rt = raison && t("rpD_coutR_" + raison) !== "rpD_coutR_" + raison ? t("rpD_coutR_" + raison) : raison || "";
  return `<div class="rp-cest nd"><span class="rp-cesti" aria-hidden="true">!</span><div><b>${escapeHtml(t("rpD_coutND"))}</b>`
    + (rt ? `<p class="rp-fnt">${escapeHtml(rt)}</p>` : "") + `<p class="rp-cestw">${escapeHtml(t("rpD_aConfirmer"))}</p>${lien}</div></div>`;
}
function rpSpRefNom(ref, d) {
  if (!ref) return null;
  if (ref.cible === "mediane") return t("rpSd_mediane");
  const u = Array.isArray(ref.utilises) && ref.utilises.length === 1 ? ref.utilises[0] : null;
  if (!u) return null;
  const c = Array.isArray(d?.concurrents) ? d.concurrents.find((x) => x.asin === u.asin) : null;
  return c?.titre || u.asin;
}
function rpSpPosTxt(ref, d, cur) {
  const nom = rpSpRefNom(ref, d);
  if (!nom || !Number.isFinite(ref.ecart) || !ref.unite) return null;
  const v = Math.abs(ref.ecart), e = ref.unite === "pct" ? t("rpSd_pct", v.toLocaleString(LOCALE(), { maximumFractionDigits: 2 })) : rpM(v, cur);
  return ref.ecart < 0 ? t("rpSd_sous", e, nom) : ref.ecart > 0 ? t("rpSd_dessus", e, nom) : t("rpSd_egal", nom);
}
function rpSpChgHtml(r) {
  const c = r.conseil || {}, cur = r.devise, pl = r.ombre?.plancher;
  if (c.etat !== "propose") return "";
  const sous = Number.isFinite(r.prixActuel) && Number.isFinite(pl) && rpCents(r.prixActuel) < rpCents(pl), ec = rpSpEcart(r.prixActuel, c.prix);
  return `<div class="rp-spchg" data-rp-sp-chg><i class="rp-ld a${sous ? " hors" : ""}" aria-hidden="true"></i><span class="rp-spa">${r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, cur))}</span>`
    + `${rpFleche()}<i class="rp-ld c" aria-hidden="true"></i><b>${escapeHtml(rpM(c.prix, cur) ?? "—")}</b>${ec ? `<span class="rp-fec">${escapeHtml(ec)}</span>` : ""}</div>`;
}
function rpSpRefLegHtml(ref, d, cur) {
  const u = ref && ref.cible !== "mediane" && Array.isArray(ref.utilises) && ref.utilises.length === 1 ? ref.utilises[0] : null;
  if (!u || !Number.isFinite(u.prix)) return "";
  const age = u.le ? ` <small>${escapeHtml(t("rpSd_ilYa", rpAgeTxt(u.le)))}</small>` : "";
  return `<div class="rp-leg rp-spleg" data-rp-sp-leg><span><i class="rp-ld r" aria-hidden="true"></i><span class="rp-spn">${escapeHtml(rpSpRefNom(ref, d))}</span>${age}</span><b>${escapeHtml(rpM(u.prix, cur))}</b>`
    + `<small class="rp-spram">${escapeHtml(t("rpSd_ramene"))}</small></div>`;
}
function rpSpCauseHtml(r, d) {
  const c = r.conseil || {}, o = r.ombre || {}, ref = o.concurrents || null, cur = r.devise;
  const brute = rpRaisonTxt(c.raison), pos = rpSpPosTxt(ref, d, cur);
  const gras = (k, p, ...a) => escapeHtml(t(k, "\u0001", ...a)).replace("\u0001", `<b>${escapeHtml(p)}</b>`);
  if (c.etat === "propose" && Number.isFinite(r.prixActuel) && Number.isFinite(o.plancher) && rpCents(r.prixActuel) < rpCents(o.plancher)) {
    const ecart = `<b class="rp-neg">${escapeHtml(t("rpSd_sousPl", rpM(Math.round((o.plancher - r.prixActuel) * 100) / 100, cur)))}</b>`;
    const suite = pos && Number.isFinite(ref.prixCible) && rpCents(ref.prixCible) < rpCents(o.plancher) && rpCents(c.prix) === rpCents(o.plancher)
      ? escapeHtml(t("rpSd_remonte", pos, rpM(ref.prixCible, cur), rpM(o.plancher, cur))) : brute ? escapeHtml(brute) : "";
    return `<p class="rp-cause" data-rp-sp-sousPl>${ecart}${suite ? " " + suite : ""}</p>`;
  }
  if (c.etat === "propose" && pos && ["moins_cher", "mediane", "choisi"].includes(ref.cible)) {
    const n = Number.isSafeInteger(ref.avecPrix) && ref.avecPrix > 0 ? ref.avecPrix : null;
    const autre = c.raison !== "cible_concurrents" && brute ? ` <span class="rp-fnt">${escapeHtml(brute)}</span>` : "";
    return `<p class="rp-cause" data-rp-sp-pos>${gras("rpSd_cz_" + ref.cible, pos, n)}${autre}</p>`;
  }
  return brute ? `<p class="rp-cause">${escapeHtml(brute)}</p>` : "";
}
function rpSpCtb(r, d) {
  const c = r.conseil || {}, o = r.ombre || {};
  if (c.etat !== "propose") return null;
  const lc = (d?.lignes || []).find((x) => rpCents(x.prix) === rpCents(c.prix));
  const b = typeof o.margeProposee === "number" && Number.isFinite(o.margeProposee) && rpCents(o.prixPropose) === rpCents(c.prix) ? o.margeProposee
    : typeof lc?.beneficeAvantPub === "number" ? lc.beneficeAvantPub : null;
  const a = typeof d?.avant?.beneficeAvantPub === "number" ? d.avant.beneficeAvantPub : null;
  let seuil = null;
  if (a > 0 && b > 0 && rpCents(a) !== rpCents(b)) {
    const p = b < a ? Math.round((a / b - 1) * 100) : Math.round((1 - a / b) * 100);
    if (p > 0) seuil = t(b < a ? "rpSd_seuilPlus" : "rpSd_seuilMoins", p);
  }
  return { a, b, seuil };
}
function rpSpCtbVal(x, cur) {
  const v = (m) => (m === null ? `<span class="rp-fnt">${escapeHtml(t("rpSd_nonCalc"))}</span>` : "≈ " + escapeHtml(rpM(m, cur)));
  return x.a === null && x.b === null ? v(null) : `${v(x.a)} ${rpFleche()} ${v(x.b)}`;
}
function rpSpCtbHtml(r, d) {
  const x = rpSpCtb(r, d), cur = r.devise || d?.devise || null;
  if (!x) return "";
  return `<div class="rp-spctb" data-rp-sp-ctb><span class="rp-spk">${escapeHtml(t("rpSd_ctb"))}</span><span class="rp-spv">${rpSpCtbVal(x, cur)}</span>`
    + `<small>${escapeHtml(t("rpSd_ctbD"))}${x.seuil ? `<br><b>${escapeHtml(x.seuil)}</b>` : ""}</small></div>`;
}
function rpSpRecapHtml(r, d, opts, regle) {
  const c = r.conseil || {}, cur = r.devise || d?.devise || null, k = rpKey(r), x = rpSpCtb(r, d), ec = rpSpEcart(r.prixActuel, c.prix);
  const vm = rp.vMsg && rp.vMsg.k === k ? `<p class="${rp.vMsg.ko ? "rp-ko" : "rp-mut"}" role="status">${escapeHtml(rp.vMsg.text)}</p>` : "";
  const kv = (lbl, v, sous = "") => `<span>${escapeHtml(lbl)}${sous ? `<small>${escapeHtml(sous)}</small>` : ""}</span><b>${v}</b>`;
  return `<div class="rp-sprecap" data-rp-recap><h4 tabindex="-1">${escapeHtml(t("rpSd_recapT"))}</h4><div class="rp-spsu">`
    + kv(t("rpSd_pays"), escapeHtml(rpPaysNom(r.marketplace))) + kv(t("rpD_actuel"), r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, cur)))
    + kv(t("rpSd_prixDem"), `${escapeHtml(rpM(c.prix, cur))}${ec ? `<small>${escapeHtml(ec)}</small>` : ""}`)
    + (regle ? kv(t("rpSd_regle"), escapeHtml(regle)) : "") + (x ? kv(t("rpSd_ctb"), rpSpCtbVal(x, cur), t("rpSd_ctbD")) : "") + `</div>`
    + `<div class="rp-dacts"><button type="button" class="rp-go rp-val" data-rp-valider${opts.busy ? " disabled" : ""}>${escapeHtml(t(opts.busy ? "rpPropBusy" : "rpSd_envoyer", rpM(c.prix, cur)))}</button>`
    + `<button type="button" class="rp-fact rp-spbtn" data-rp-recap-retour${opts.busy ? " disabled" : ""}>${escapeHtml(t("rpSd_retour"))}</button></div>${vm}`
    + `<p class="rp-fnt rp-small">${escapeHtml(t("rpSd_recapNote"))}</p></div>`;
}
function rpSpCoutHtml(d) {
  const e = d?.coutEstime, cur = d?.devise || null;
  const est = e?.etat === "estime" && typeof e.unitCost === "number" ? `<p class="rp-fnt">${escapeHtml(t("rpD_coutEst"))} : ${escapeHtml(rpM(e.unitCost, e.devise || cur) ?? "—")} · ${escapeHtml(t("rpD_aConfirmer"))}</p>` : "";
  return `<div class="rp-spcout" data-rp-sp-cout><b>${escapeHtml(t("rpSd_coutT"))}</b><p class="rp-fnt">${escapeHtml(t("rpSd_coutP"))}</p>${est}`
    + `<a class="rp-go rp-spcl" href="#stock/cogs" data-rp-sp-cogs>${escapeHtml(t("rpSd_coutLien"))}${rpChev()}</a></div>`;
}
function rpSpAussi(r, e) {
  const L = (rp.d?.rows || []).filter((x) => x !== r && x.asin === r.asin && x.marketplace !== r.marketplace && x.conseil?.etat === e).map((x) => rpPaysNom(x.marketplace));
  return L.length ? t("rpSd_aussi", [...new Set(L)].join(", ")) : null;
}
const RP_RF_IC = {
  coins: '<ellipse cx="9" cy="7" rx="5.5" ry="2.5"/><path d="M3.5 7v4c0 1.4 2.5 2.5 5.5 2.5M3.5 11v4c0 1.4 2.5 2.5 5.5 2.5"/><ellipse cx="15" cy="13" rx="5.5" ry="2.5"/><path d="M9.5 13v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 7.5h7M8.5 12h.01M12 12h.01M15.5 12h.01M8.5 16h.01M12 16h.01M15.5 16h.01"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.2a3.2 3.2 0 010 5.6M17.5 13.8c2 .7 3.5 2.6 3.5 5.2"/>',
  cfg: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  hist: '<path d="M4 20V10M10 20V4M16 20v-8M21 20H3"/>',
};
const rpRfSvg = (k, cls = "rp-i") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${RP_RF_IC[k]}</svg>`;
const rpReMin = (r) => (typeof r?.regle?.profitMin === "number" && Number.isFinite(r.regle.profitMin) ? r.regle.profitMin : null);
const rpReMax = (r) => (typeof r?.regle?.profitMax === "number" && Number.isFinite(r.regle.profitMax) ? r.regle.profitMax : null);
const rpReArt = (livre, port) => (Number.isFinite(livre) && Number.isFinite(port) ? Math.round((livre - port) * 100) / 100 : null);
function rpReVdr(r) {
  const x = rp.vdr?.[rpKey(r)], L = Array.isArray(x?.vendeurs) ? x.vendeurs : [], ok = x?.releve?.etat === "ok";
  const lettre = (id) => { const v = id ? L.find((y) => y.sellerId === id && y.nous === false) : null; return typeof v?.lettre === "string" && v.lettre ? v.lettre : null; };
  const n = ok && Number.isSafeInteger(x.releve.entrees) && x.releve.entrees > 0 ? x.releve.entrees : null;
  return { lettre, n, le: n !== null ? x.releve.le ?? null : null, exp: L.find((y) => y.nous === true)?.expedition ?? null };
}
function rpReTeteHtml(r) {
  const o = r.ombre || {}, ve = rpVedEtat(r), sousPl = r.conseil?.raison === "cible_vedette_sous_le_plancher";
  const st = sousPl ? null : { tenue: "ok", perdue: "att", aucune: "neu", inconnue: "neu" }[ve];
  const regle = o.regle?.source ? (o.regle.source === "nommee" ? rpNomR(o.regle) || rpRegleNomDec(o.regle) : rpRegleNomDec(o.regle)) : null;
  return `<button type="button" class="rp-back" data-rp-close>${rpIc("back")}${escapeHtml(t("rpTabConseils"))}</button>`
    + `<div class="rp-rfh"><span class="rp-rfvg">${rpThumb(r)}</span><div><h3>${escapeHtml(rpNom(r))}</h3>`
    + `<p class="rp-rfsku">${r.sku ? escapeHtml(t("rpSl_sku", r.sku)) : `<span class="rp-skuinc">${escapeHtml(t("rpSl_skuInc"))}</span>`}${st ? `<span class="rp-rfstv ${st}" data-rp-rf-ved="${ve}">${escapeHtml(t("rpRf_st_" + ve))}</span>` : ""}</p>`
    + `<p>${rpDrapeau(r.marketplace, true)}${escapeHtml(rpPaysNom(r.marketplace))}${regle ? ` · ${escapeHtml(t("rpRf_regle", regle))}` : ""}</p></div>`
    + `<button type="button" class="rp-x" data-rp-close aria-label="${escapeHtml(t("rpP_close"))}">${rpIc("x")}</button></div>`;
}
function rpReJaugeHtml(r, px, ref) {
  const o = r.ombre || {}, lo = o.plancher, hi = o.plafond, cur = r.devise;
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || !(hi >= lo)) return "";
  const A = 8, B = 92, pc = (x) => Math.round(x * 100) / 100;
  const pos = (v) => (rpCents(v) < rpCents(lo) ? { p: 1.5, out: -1 } : rpCents(v) > rpCents(hi) ? { p: 98.5, out: 1 } : { p: hi > lo ? A + ((v - lo) / (hi - lo)) * (B - A) : 50, out: 0 });
  const cvr = (m) => (m.out ? `<svg class="rp-rfcvr" style="left:calc(${pc(m.p)}% ${m.out < 0 ? "- 14px" : "+ 14px"})" viewBox="0 0 24 24" aria-hidden="true"><path d="${m.out < 0 ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}"/></svg>` : "");
  let mR = "";
  if (ref && Number.isFinite(ref.art)) {
    const m = pos(ref.art), g = m.p <= 55;
    mR = `<span class="rp-rfmk ref${m.out ? " out" : ""}" style="left:${pc(m.p)}%" data-rp-rf-ref>${ref.l ? escapeHtml(ref.l) : ""}</span>${cvr(m)}`
      + `<span class="rp-rfrlb" style="${g ? `left:calc(${pc(m.p)}% + 15px)` : `right:calc(${pc(100 - m.p)}% + 15px)`}">${escapeHtml(ref.n)} <b>${escapeHtml(rpM(ref.v, cur))}</b>${ref.ec ? ` <em>(${escapeHtml(ref.ec)})</em>` : ""}</span>`;
  }
  const fusion = !Number.isFinite(px), a = Number.isFinite(r.prixActuel) ? pos(r.prixActuel) : null, c = fusion ? a : pos(px);
  const desc = [ref && Number.isFinite(ref.art) ? `${ref.n} ${rpM(ref.v, cur)}` : null, !fusion && a ? `${t("rpRf_actuel")} ${rpM(r.prixActuel, cur)}` : null,
    c ? `${t(fusion ? "rpRf_actuel" : "rpRf_propose")} ${rpM(fusion ? r.prixActuel : px, cur)}` : null, `${t("rpD_plancher")} ${rpM(lo, cur)}`, `${t("rpD_plafond")} ${rpM(hi, cur)}`].filter(Boolean).join(" · ");
  return `<div class="rp-rfrg" role="img" aria-label="${escapeHtml(desc)}"><span class="rp-rfbd" style="left:${A}%;width:${B - A}%"></span>${mR}`
    + (!fusion && a ? `<span class="rp-rfmk act" style="left:${pc(a.p)}%"></span>` : "") + (c ? `<span class="rp-rfmk con" style="left:${pc(c.p)}%"></span>` : "")
    + `<span class="rp-rfen" style="left:${A}%">${escapeHtml(t("rpD_plancher"))}<b>${escapeHtml(rpM(lo, cur))}</b></span><span class="rp-rfen d" style="left:${B}%">${escapeHtml(t("rpD_plafond"))}<b>${escapeHtml(rpM(hi, cur))}</b></span>`
    + (fusion ? "" : `<span class="rp-rflgd"><i class="rp-rfgl act"></i>${escapeHtml(t("rpRf_actuel"))}<i class="rp-rfgl con"></i>${escapeHtml(t("rpRf_propose"))}</span>`) + `</div>`;
}
function rpReCadre(a, b, min, max = null) {
  const v = Number.isFinite(b) ? b : a;
  if (Number.isFinite(v) && Number.isFinite(min) && rpCents(v) < rpCents(min)) return "ko";
  if (Number.isFinite(v) && Number.isFinite(max) && rpCents(v) > rpCents(max)) return "ko";
  return Number.isFinite(a) && Number.isFinite(b) && rpCents(b) > rpCents(a) ? "up" : "neu";
}
function rpReFicheCorps(r, d, verrou) {
  const c = r.conseil || {}, o = r.ombre || {}, cur = r.devise || d?.devise || null, M = (x) => escapeHtml(rpM(x, cur));
  const v = o.sousType === "vendeurs_fiche" && o.vedette && typeof o.vedette === "object" ? o.vedette : null, ve = rpVedEtat(r);
  const simu = rpEstSimu(r), px = simu || (c.etat === "propose" && Number.isFinite(c.prix)) ? c.prix : null;
  const sousPl = c.raison === "cible_vedette_sous_le_plancher", min = rpReMin(r), max = rpReMax(r), port = v && Number.isFinite(v.notrePort) ? v.notrePort : null;
  const pv = v && Number.isFinite(v.prixVedette) ? v.prixVedette : null, h = v?.hausse && typeof v.hausse === "object" ? v.hausse : null;
  const sv = h?.suivant && Number.isFinite(h.suivant.prixLivre) ? h.suivant.prixLivre : null;
  const ec = Number.isFinite(r.prixActuel) && Number.isFinite(px) ? rpSpEcart(r.prixActuel, px) : null;
  const vd = rpReVdr(r), lV = v ? vd.lettre(v.vendeur) : null, lS = vd.lettre(h?.suivant?.vendeur);
  const gl = (k) => `<i class="rp-rfgl ${k}" aria-hidden="true"></i>`;
  const chg = Number.isFinite(px)
    ? `<div class="rp-rfchg">${gl("act")}<span class="a">${r.prixActuel == null ? rpPrixAbs(r) : M(r.prixActuel)}</span>${rpFleche()}${gl("con")}<b class="b" data-rp-rf-px>${M(px)}</b>${ec ? `<span class="ec">${escapeHtml(ec)}</span>` : ""}</div>`
    : r.prixActuel == null ? "" : `<div class="rp-rfchg">${gl("con")}<b class="b">${M(r.prixActuel)}</b><span class="ec txt">${escapeHtml(t(sousPl ? "rpRf_conserve" : "rpRf_garde"))}</span></div>`;
  const artV = rpReArt(pv, port), artS = rpReArt(sv, port);
  const ref = ve === "perdue" && artV !== null ? { n: t("rpRf_ved"), l: lV, v: pv, art: artV, ec: sousPl && Number.isFinite(r.prixActuel) && artV < r.prixActuel ? `−${rpM(r.prixActuel - artV, cur)}` : null }
    : ve === "tenue" && artS !== null ? { n: t("rpRf_suiv"), l: lS, v: sv, art: artS } : null;
  const jauge = rpReJaugeHtml(r, px, ref);
  let veut = "";
  if (ve === "perdue" && sousPl) {
    const lc = artV !== null ? (d?.lignes || []).find((x) => rpCents(x.prix) === rpCents(artV)) : null, b = typeof lc?.beneficeAvantPub === "number" ? lc.beneficeAvantPub : null;
    veut = (pv !== null && artV !== null && Number.isFinite(o.plancher) ? escapeHtml(t("rpRf_sousPl", lV ? t("rpRf_vdL", lV) : t("rpRf_autreVM"), rpM(pv, cur), rpM(o.plancher - artV, cur))) : "")
      + (b !== null ? escapeHtml(t("rpRf_sousPlCtb", rpM(b, cur)) + (min !== null ? t("rpRf_minDe", rpM(min, cur)) : "") + ".") : "");
  } else if (ve === "perdue" && Number.isFinite(px)) {
    if (/_plafond$/.test(c.raison || "") && pv !== null && Number.isFinite(o.plafond)) veut = `<b>${escapeHtml(t("rpRf_plafB"))}</b>${escapeHtml(t("rpRf_plaf", rpM(pv, cur), rpM(o.plafond, cur)))}`;
    else if (pv !== null && port !== null && rpCents(px + port) === rpCents(pv)) veut = `<b>${escapeHtml(t("rpRf_alignB"))}</b>${escapeHtml(t("rpRf_align", lV ? t("rpRf_vdL", lV) : t("rpRf_autreV"), rpM(px, cur), rpM(port, cur),
      vd.exp === "amazon" ? t("rpRf_expA") : vd.exp === "vendeur" ? t("rpRf_expV") : ""))}<span class="rp-rfm" data-rp-rf-m="inconnu">${escapeHtml(t("rpRf_mInc"))}</span>${escapeHtml(t("rpRf_align2"))}`;
    else if (pv !== null) veut = `<b>${escapeHtml(t("rpRf_viseB", rpM(px, cur)))}</b>${escapeHtml(t("rpRf_vise", rpM(pv, cur), port === null ? t("rpSd_nonCalc") : rpM(port, cur)))}`;
  } else if (ve === "tenue") {
    const lim = h && Number.isFinite(h.plafond24h) && Number.isFinite(h.prixEnLigne24h) ? t("rpRf_hausse24", rpM(h.plafond24h, cur), rpM(h.prixEnLigne24h, cur)) : t("rpRf_hausse");
    veut = `<b>${escapeHtml(t("rpRf_tenueB"))}</b>` + escapeHtml(Number.isFinite(px) ? (sv !== null ? t("rpRf_suivTxt", rpM(sv, cur), lS ? t("rpRf_vdL", lS) : null) : "") + lim + t("rpRf_risque") : t("rpRf_tenueGarde"));
  } else if (ve === "inconnue" || ve === "aucune") {
    const cz = c.raison ? rpRaisonTxt(c.raison) : null;
    veut = escapeHtml(t(ve === "aucune" ? "rpRf_aucune" : "rpRf_inconnue")) + (cz ? ` ${escapeHtml(t("rpRf_cause", cz))}` : "");
  }
  if (!veut && c.raison) veut = escapeHtml(rpRaisonTxt(c.raison) || "");
  const cq = veut ? `<div class="rp-rfcq"><h4>${escapeHtml(t("rpRf_veut"))}</h4><p>${veut}</p></div>` : "";
  const a = typeof d?.avant?.beneficeAvantPub === "number" ? d.avant.beneficeAvantPub : null, b = rpReCtb(r);
  const nc = `<span class="rp-fnt">${escapeHtml(t("rpSd_nonCalc"))}</span>`, val = (x) => (x === null ? nc : "≈ " + M(x));
  let ctb = "";
  if (Number.isFinite(px)) {
    const note = ve === "tenue" ? t("rpRf_ctbPerte") : b !== null && max !== null && rpCents(b) > rpCents(max) ? t("rpRf_ctbSur", rpM(b, cur), rpM(b - max, cur), rpM(max, cur)) : b !== null && min !== null ? t(rpCents(b) >= rpCents(min) ? "rpRf_ctbAu" : "rpRf_ctbSous", rpM(b, cur), rpM(Math.abs(b - min), cur), rpM(min, cur)) : "";
    ctb = `<div class="rp-rfctb ${rpReCadre(a, b, min, max)}" data-rp-rf-ctb><span class="ci">${rpRfSvg("coins")}</span><span class="k">${escapeHtml(t(ve === "tenue" ? "rpRf_ctbK2" : "rpRf_ctbK"))}</span>`
      + `<span class="v">${val(a)} ${rpFleche()} ${val(b)}<em>${escapeHtml(t("rpRf_vente"))}</em></span>${note ? `<small>${escapeHtml(note)}</small>` : ""}</div>`;
  } else if (a !== null && Number.isFinite(r.prixActuel)) {
    const note = min !== null && rpCents(a) === rpCents(min) ? t("rpRf_ctbActMin", rpM(r.prixActuel, cur)) : t("rpRf_ctbAct", rpM(r.prixActuel, cur));
    ctb = `<div class="rp-rfctb ${rpReCadre(a, null, min, max)}" data-rp-rf-ctb><span class="ci">${rpRfSvg("coins")}</span><span class="k">${escapeHtml(t("rpRf_ctbK2"))}</span>`
      + `<span class="v">${val(a)}<em>${escapeHtml(t("rpRf_vente"))}</em></span><small>${escapeHtml(note)}</small></div>`;
  }
  let faire = "";
  if (sousPl && Number.isFinite(r.prixActuel)) {
    const n = o.regle?.source === "nommee" ? (rp.d?.rows || []).filter((x) => x.ombre?.regle?.source === "nommee" && x.ombre.regle.id === o.regle.id).length : 0;
    const auPl = Number.isFinite(o.plancher) && rpCents(r.prixActuel) === rpCents(o.plancher);
    faire = `<div class="rp-rfcq" data-rp-rf-faire><h4>${escapeHtml(t("rpRf_faire"))}</h4><ul class="rp-rfpu"><li><b>${escapeHtml(t("rpRf_f_garder", rpM(r.prixActuel, cur)))}</b>${auPl ? escapeHtml(t("rpRf_f_garderPl")) : ""}</li>`
      + `<li>${escapeHtml(t("rpRf_f_remonte"))}</li>${n ? `<li>${escapeHtml(t("rpRf_f_min", n))}</li>` : ""}</ul></div>`;
  }
  return (simu && verrou !== "ouvert" ? `<p class="rp-rfsimt"><span>${escapeHtml(t("rpRf_simt"))}</span></p>` : "") + chg + jauge + cq + ctb + faire;
}
function rpReGesteSimu(r, cur) {
  const m3 = t("rpRf_mSecu"), m2 = t("rpRf_mBientot");
  return `<div class="rp-rfact rp-rfac" data-rp-rf-geste><button type="button" class="rp-rfgo" disabled title="${escapeHtml(m3)}" aria-describedby="rp-rf-m3" data-rp-rf-val>${escapeHtml(t("rpD_valider", rpM(r.conseil.prix, cur)))}</button>`
    + `<button type="button" class="rp-rfign" disabled title="${escapeHtml(m2)}" aria-describedby="rp-rf-m2" data-rp-rf-ign>${escapeHtml(t("rpD_ignorer"))}</button></div>`
    + `<p class="rp-rfact rp-rfnt"><span id="rp-rf-m3" data-rp-rf-m="secu">${escapeHtml(m3)}</span> · <span id="rp-rf-m2" data-rp-rf-m="bientot">${escapeHtml(t("rpRf_deux", t("rpD_ignorer"), m2))}</span></p>`;
}
function rpReOutilsHtml(r, d, opts, regle) {
  const o = r.ombre || {}, v = o.vedette && typeof o.vedette === "object" ? o.vedette : null, k = rpKey(r), cur = r.devise;
  const test = !!rp.plis.d_test;
  const vd = rpReVdr(r), le = vd.n !== null && vd.le ? vd.le : v?.releve?.le;
  const age = (vd.n !== null && vd.le ? t("rpRf_nOffres", vd.n) + " · " : "") + (le ? t("rpSd_ilYa", rpAgeTxt(le)) : t("rpRf_vdrInc"));
  const pliL = (id, ic, lbl, val, corps) => `<details class="rp-pli rp-dpli rp-rfpl" data-rp-pli="d_${id}"${rp.plis["d_" + id] ? " open" : ""}><summary>${rpRfSvg(ic, "rp-i rp-rfpi")}<span>${escapeHtml(lbl)}</span>`
    + `<span class="rp-grow"></span>${val ? `<span class="rp-rfplv">${val}</span>` : ""}${rpChev()}</summary><div class="rp-dplc">${corps}</div></details>`;
  return `<div class="rp-rfout"><button type="button" class="rp-rfbtn vert" data-rp-tab="regles">${rpRfSvg("cfg")}${escapeHtml(t("rpF_modifRegle"))}</button>`
    + `<button type="button" class="rp-rfbtn" data-rp-rf-test aria-expanded="${test}"${d ? "" : " disabled"}>${rpRfSvg("calc")}${escapeHtml(t("rpSimTest"))}</button></div>`
    + (test && d ? `<div class="rp-rftest" data-rp-rf-testp>${rpPanneau(r, d, rp.ix[k] ?? 0, { ...opts, sansTete: true, sansProposer: true })}</div>` : "")
    + pliL("vdr", "users", t("rpRf_vdr"), escapeHtml(age), `<p class="rp-fnt" data-rp-rf-vdr><span data-rp-rf-m="bientot">${escapeHtml(t("rpRf_mBientot"))}</span></p>`)
    + pliL("pl", "calc", t("rpD_calcPl"), Number.isFinite(o.plancher) ? escapeHtml(rpM(o.plancher, cur)) : "", `<p class="rp-fnt">${escapeHtml(t("rpD_calcPlD"))}</p>` + (regle ? `<p class="rp-fnt">${escapeHtml(regle)}</p>` : ""))
    + `<button type="button" class="rp-rfpl rp-rfjr" data-rp-tab="journal">${rpRfSvg("hist", "rp-i rp-rfpi")}<span>${escapeHtml(t("rpRf_hist"))}</span><span class="rp-grow"></span><span class="rp-rfplv">${escapeHtml(t("rpTabJournal"))}</span>${rpChev()}</button>`;
}
function rpDetailHtml(r, d, cls, opts = {}) {
  const k = rpKey(r), c = r.conseil || {}, cur = r.devise || d?.devise || null, o = r.ombre || {};
  const titre = rpTitre(r, rp.d?.titres), h = rpHeure(o.decideLe) || "—";
  const regle = o.regle?.source ? (o.regle.source === "nommee" ? t("rpD_regle", rpRegleNomDec(o.regle)) : rpRegleNomDec(o.regle)) : null;
  const sp = opts.porte === "smartprice", BLOCS = ["cout_inconnu", "bornes_en_conflit", "frais_inconnus", "sans_prix", "aucun", "bloque"];
  const re = opts.porte === "repricer";
  const eBloc = re && rpEstSimu(r) ? null : BLOCS.includes(cls) ? cls : !cls && BLOCS.includes(c.etat) ? c.etat : null;
  const recap = sp && rp.recap === k && c.etat === "propose" && cls === "a_valider" && rpPeutValider(r, d, opts.verrou).ok;
  const sousTitre = recap ? t("rpSd_recapSous") : sp && eBloc === "cout_inconnu" ? rpSpAussi(r, "cout_inconnu") ?? regle : regle;
  const head = re ? rpReTeteHtml(r) : `<button type="button" class="rp-back" data-rp-close>${rpIc("back")}${escapeHtml(t("rpTabConseils"))}</button>`
    + `<div class="rp-ih"><div><h3${titre ? ` title="${escapeHtml(titre)}"` : ""}>${escapeHtml(rpNom(r))}</h3>`
    + `<div class="rp-sub">${rpDrapeau(r.marketplace, true)}${escapeHtml(rpPaysNom(r.marketplace))}${sousTitre ? ` · ${escapeHtml(sousTitre)}` : ""}</div></div>`
    + `<button type="button" class="rp-x" data-rp-close aria-label="${escapeHtml(t("rpP_close"))}">${rpIc("x")}</button></div>`;
  if (recap) return head + rpSpRecapHtml(r, d, opts, o.regle?.source ? rpRegleNomDec(o.regle) : null);
  const envoi = ["envoi_non_confirme", "envoi_refuse", "refuse_amazon"].includes(cls) ? rpEnvoiHtml(r, cls) : "";
  if (eBloc) {
    const e = eBloc;
    const phrase = e === "cout_inconnu" ? t("rpD_coutPl") : e === "aucun" ? t("rpFc_aucun") : rpRaisonTxt(c.raison) ?? t("rpFc_" + e);
    const g = e === "bornes_en_conflit" ? `<button type="button" class="rp-fact" data-rp-tab="regles">${escapeHtml(t("rpF_modifRegle"))}${rpChev()}</button>` : "";
    const connu = `<div class="rp-kv"><span>${escapeHtml(t("rpD_actuel"))}${r.releveAt ? ` <small class="rp-fnt">${escapeHtml(t("rpD_releve", rpAgeTxt(r.releveAt)))}</small>` : ""}</span>`
      + `<span>${r.prixActuel == null ? rpPrixAbs(r) : escapeHtml(rpM(r.prixActuel, cur))}</span></div>`;
    const charge = `<p class="rp-mut">${escapeHtml(t(opts.err ? "rpDetErr" : "loading"))}</p>`;
    const cout = e === "cout_inconnu" ? (sp ? rpSpCoutHtml(d) + (d ? "" : charge) : d ? rpCoutEstHtml(r, d) : charge) : "";
    const ic = sp ? `<svg class="rb-ic rp-splos" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l8.5 8.5-8.5 8.5L3.5 12z"/></svg>` : rpIc("info");
    const plisB = !sp ? "" : (d ? rpDPli("co", t("rpCo_pli"), escapeHtml(rpCoResume(d.concurrents)), rpCoHtml(r, d)) : "")
      + (regle ? rpDPli("rg", t("rpSd_regle"), escapeHtml(o.regle?.source ? rpRegleNomDec(o.regle) : regle), `<button type="button" class="rp-fact" data-rp-tab="regles">${escapeHtml(t("rpF_modifRegle"))}${rpChev()}</button>`) : "");
    return head + `<div class="rp-nc"><h4>${ic}${escapeHtml(t(e === "cout_inconnu" ? "rpD_nonCalc" : "rpFc_" + e))}</h4><p>${escapeHtml(phrase)}</p>${g}</div>` + cout + connu
      + (plisB ? `<div class="rp-dplis">${plisB}</div>` : "");
  }
  const phrase = rpRaisonTxt(c.raison);
  let act = "";
  if (c.etat === "propose" && cls === "situation_changee") {
    const pa = rpCents(o.prixActuel) !== rpCents(r.prixActuel) && typeof r.prixActuel === "number" ? t("rpD_sitPrixAct", rpM(r.prixActuel, cur)) : t("rpD_sitRegle");
    act = `<div class="rp-dst wa" data-rp-sit><b>${escapeHtml(t("rpD_sitChg", h))}</b><p>${escapeHtml(pa)} ${escapeHtml(t("rpD_prochain"))}</p></div>`;
  } else if (c.etat === "propose" && cls === "a_valider") {
    const vm = rp.vMsg && rp.vMsg.k === k ? `<p class="${rp.vMsg.ko ? "rp-ko" : "rp-mut"}" role="status">${escapeHtml(rp.vMsg.text)}</p>` : "";
    const pv = rpPeutValider(r, d, opts.verrou);
    if (pv.motif === "simu") act = `<p class="rp-mut">${escapeHtml(t("rpD_simu"))}</p>`;
    else if (pv.motif === "charge") act = `<p class="rp-mut">${escapeHtml(t(opts.err ? "rpDetErr" : "loading"))}</p>`;
    else if (pv.motif === "limites") act = `<div class="rp-dst wa" data-rp-lim><b>${escapeHtml(t("rpD_limChg", h))}</b><p>${escapeHtml(t("rpD_attente"))}</p></div>`;
    else if (pv.motif === "sit") act = `<div class="rp-dst wa" data-rp-sit><b>${escapeHtml(t("rpD_sitChg", h))}</b>${vm}<p>${escapeHtml(t("rpD_attente"))}</p></div>`;
    else if (pv.ok && sp) act = `<div class="rp-dacts"><button type="button" class="rp-go rp-val" data-rp-recap-ouvrir${opts.busy ? " disabled" : ""}>${escapeHtml(t("rpD_valider", rpM(c.prix, cur)))}</button>${rpIgnHtml(r, d, opts)}</div>`
      + `<p class="rp-fnt rp-small">${escapeHtml(t("rpD_recap"))}</p>${vm}`;
    else if (pv.ok) act = `<div class="rp-dacts"><button type="button" class="rp-go rp-val" data-rp-valider${opts.busy ? " disabled" : ""}>${escapeHtml(t(opts.busy ? "rpPropBusy" : "rpD_valider", rpM(c.prix, cur)))}</button></div>`
      + `<p class="rp-fnt rp-small">${escapeHtml(t("rpD_recap"))}</p>${vm}`;
    if (!(pv.ok && sp)) act += rpIgnHtml(r, d, opts);
  } else if (c.etat === "propose" && cls === "sans_changement" && r.ignore?.actif === true) {
    const jj = (() => { const x = new Date(r.ignore.le); return Number.isNaN(x.getTime()) ? "—" : x.toLocaleDateString(LOCALE(), { day: "2-digit", month: "2-digit", year: "numeric" }); })();
    act = `<div class="rp-dst ne" data-rp-ign><b>${escapeHtml(t("rpD_ignLe", jj))}</b><p>${escapeHtml(t("rpD_ignRevient"))}</p>${rpIgnMsg(k)}`
      + (rp.d?.ignores?.etat === "ok" ? `<button type="button" class="rp-fact" data-rp-retirer${opts.busy ? " disabled" : ""}>${escapeHtml(t(opts.busy ? "rpD_ignBusy" : "rpD_ignRet"))}</button>` : "") + `</div>`;
  }
  const L = d?.lignes || [], lc = c.etat === "propose" ? L.find((x) => rpCents(x.prix) === rpCents(c.prix)) : null, B = lc ? rpBenDe(d, lc) : null;
  const pli = rpDPli;
  const benCorps = lc ? `<div class="rp-kv"><span>${escapeHtml(t("rpL_ttc"))}</span><span>${escapeHtml(rpM(lc.prix, cur))}</span><span>${escapeHtml(t("rpL_tvaX"))}</span><span>${typeof lc.tva === "number" ? escapeHtml(rpM(-lc.tva || 0, cur)) : rpUnk()}</span>`
    + `<span>${escapeHtml(t("rpL_frais"))}</span><span>${typeof lc.frais === "number" ? escapeHtml(rpM(-lc.frais || 0, cur)) : rpUnk()}</span>`
    + `<span>${escapeHtml(t("rpL_cout"))}</span><span>${typeof d.coutAchat?.valeur === "number" ? escapeHtml(rpM(-d.coutAchat.valeur, cur)) : rpUnk()}</span>`
    + `<span class="rp-tot rp-tt">${escapeHtml(t("rpL_ben"))}${B.apresPub ? "" : ` <small>${escapeHtml(t("rpL_benAv"))}</small>`}</span><span class="rp-tot rp-tt">${typeof B.v === "number" ? escapeHtml(rpM(B.v, cur)) : rpUnk()}</span></div>` : "";
  const pu = d?.publiciteParUnite || {}, pubR = t("rpPubR_" + (pu.raison || "x")) !== "rpPubR_" + (pu.raison || "x") ? t("rpPubR_" + pu.raison) : String(pu.raison ?? "");
  const pliPub = sp && d ? pli("pub", t("rpSd_pub"), escapeHtml(typeof pu.valeur === "number" ? t("rpSd_pubV", rpM(pu.valeur, cur)) : t("rpSd_pubNon")),
    `<p class="rp-fnt">${escapeHtml(typeof pu.valeur === "number" ? t("rpL_pubTip", pu.du ?? "", pu.au ?? "") : pubR)}</p>`) : "";
  const plis = (sp ? pliPub : lc && typeof B.v === "number" ? pli("ben", t("rpD_benef", rpM(c.prix, cur)), escapeHtml(rpM(B.v, cur)), benCorps) : "")
    + pli("pl", t("rpD_calcPl"), typeof o.plancher === "number" ? escapeHtml(rpM(o.plancher, cur)) : "", `<p class="rp-fnt">${escapeHtml(t("rpD_calcPlD"))}</p>`
      + (regle ? `<p class="rp-fnt">${escapeHtml(regle)}</p>` : ""))
    + (d ? pli("co", t("rpCo_pli"), escapeHtml(rpCoResume(d.concurrents)), rpCoHtml(r, d)) : "")
    + (d ? pli("test", t("rpSimTest"), "", rpPanneau(r, d, rp.ix[k] ?? 0, { ...opts, sansTete: true, sansEnvoi: !!envoi })) : "");
  if (re) {
    const geste = !rpEstSimu(r) ? (act ? `<div class="rp-rfact">${act}</div>` : "")
      : opts.verrou !== "ouvert" ? `<p class="rp-rfsimn rp-rfact" data-rp-rf-simn><b>${escapeHtml(t("rpRf_simnB"))}</b>${escapeHtml(t("rpRf_simn"))}</p>` : rpReGesteSimu(r, cur);
    return head + envoi + rpReFicheCorps(r, d, opts.verrou) + geste + rpReOutilsHtml(r, d, opts, regle);
  }
  if (sp) {
    const ref = o.concurrents || null, prop = c.etat === "propose";
    return head + envoi + (prop ? rpSpChgHtml(r) : "") + rpGradueeHtml(r, ref) + (prop ? rpSpRefLegHtml(ref, d, cur) : rpLegendeHtml(r)) + rpSpCauseHtml(r, d)
      + rpSpCtbHtml(r, d) + act + `<div class="rp-dplis">${plis}</div>`;
  }
  return head + envoi + rpGradueeHtml(r) + rpLegendeHtml(r) + (phrase ? `<p class="rp-cause">${escapeHtml(phrase)}</p>` : "") + act + `<div class="rp-dplis">${plis}</div>`;
}
function rpDPli(id, lbl, val, corps) {
  return `<details class="rp-pli rp-dpli" data-rp-pli="d_${id}"${rp.plis["d_" + id] ? " open" : ""}><summary><span>${escapeHtml(lbl)}</span>`
    + `<span class="rp-grow"></span>${val ? `<span class="rp-fnt">${val}</span>` : ""}</summary><div class="rp-dplc">${corps}</div></details>`;
}
function rpCoResume(L) {
  if (!Array.isArray(L)) return t("rpCo_indispo");
  if (!L.length) return t("rpCo_aucunCourt");
  return t("rpCo_nSurM", L.filter((c) => c.format?.comparable === true).length, L.length);
}
const RP_FRAICHEUR_PRIX_CONCURRENT_H = 2;
function rpCoPrix(c, now = Date.now()) {
  const q = c.prix, d = c.dernier;
  if (d && typeof d.prix !== "number") return `<small class="rp-att" data-rp-co-sansoffre>${escapeHtml(t("rpCo_sansOffre", rpAgeTxt(d.a, now)))}</small>`
    + (q && typeof q.prix === "number" ? `<small class="rp-fnt">${escapeHtml(t("rpCo_dernierConnu", rpM(q.prix, q.devise || "EUR"), rpAgeTxt(q.a, now)))}</small>` : "");
  if (!q || typeof q.prix !== "number") return `<span class="rp-unk">${escapeHtml(t("rpCo_sansPrix"))}</span>`;
  const n = c.format?.rapport, cur = q.devise || "EUR";
  const p = typeof n === "number" && n > 1
    ? `<b>${escapeHtml(t("rpCo_parUnite", rpM(Math.round((q.prix / n) * 100) / 100, cur)))}</b><small class="rp-fnt">${escapeHtml(t("rpCo_lotDe", n, rpM(q.prix, cur)))}</small>`
    : `<b>${escapeHtml(rpM(q.prix, cur))}</b>`;
  const x = Date.parse(q.a ?? "");
  const perime = !Number.isFinite(x) || now - x > RP_FRAICHEUR_PRIX_CONCURRENT_H * 3600e3;
  return p + `<small class="rp-fnt">${escapeHtml(t("rpCo_releveIlYa", rpAgeTxt(q.a, now)))}</small>`
    + (perime ? `<small class="rp-att" data-rp-co-perime>${escapeHtml(t("rpCo_perime", RP_FRAICHEUR_PRIX_CONCURRENT_H))}</small>` : "");
}
function rpCoHtml(r, d) {
  const L = d.concurrents, k = rpKey(r), busy = !!rp.coBusy;
  const msg = rp.coMsg && rp.coMsg.k === k ? `<p class="${rp.coMsg.ko ? "rp-ko" : "rp-mut"}" role="status">${escapeHtml(rp.coMsg.text)}</p>` : "";
  if (!Array.isArray(L)) return `<p class="rp-mut" data-rp-co-indispo>${escapeHtml(t("rpCo_indispoD"))}</p>`;
  const etat = `<p class="rp-fnt rp-small">${escapeHtml(t("rpCo_etat", L.length, 10))}</p>`;
  const lignes = L.map((c) => {
    const id = `${c.mp}|${c.asin}`, cmp = c.format?.comparable === true, decl = typeof c.format?.comparable === "boolean", ouvert = rp.coMenu === `${k}|${id}`;
    const nom = c.titre ? `<b title="${escapeHtml(c.titre)}">${escapeHtml(c.titre)}</b>` : `<b>${escapeHtml(c.asin)}</b>`;
    const h = c.horaire?.photoLe ? `<small class="rp-fnt">${escapeHtml(t("rpCo_photo", rpAgeTxt(c.horaire.photoLe)))}</small>` : "";
    const menu = ouvert ? `<div class="rp-co-menu" data-rp-co-menu>`
      + `<label>${escapeHtml(t("rpCo_format"))} <input type="number" min="1" max="100" step="1" inputmode="numeric" data-rp-co-rap value="${typeof c.format?.rapport === "number" ? c.format.rapport : 1}"></label>`
      + `<button type="button" class="rp-fact" data-rp-co-fmt="${escapeHtml(c.asin)}"${busy ? " disabled" : ""}>${escapeHtml(t("rpCo_fmtOk"))}</button>`
      + `<button type="button" class="rp-fact rp-ko" data-rp-co-ret="${escapeHtml(c.asin)}"${busy ? " disabled" : ""}>${escapeHtml(t("rpCo_retirer"))}</button></div>` : "";
    return `<li class="rp-co-l${decl && !cmp ? " hors" : ""}" data-rp-co="${escapeHtml(c.asin)}">`
      + `<span class="rp-co-n">${nom}<small class="rp-fnt">${escapeHtml(c.asin)}</small></span>`
      + `<span class="rp-co-p">${rpCoPrix(c)}${h}</span>`
      + `<label class="rp-co-c"><input type="checkbox" role="switch" data-rp-co-cmp="${escapeHtml(c.asin)}"${cmp ? " checked" : ""}${busy ? " disabled" : ""}>`
      + `<span>${escapeHtml(t(!decl ? "rpCo_aDeclarer" : cmp ? (c.format.rapport > 1 ? "rpCo_cmpLot" : "rpCo_cmp") : "rpCo_hors", c.format?.rapport))}</span></label>`
      + `<span class="rp-co-s rp-fnt">${escapeHtml(t(c.source === "manuel" ? "rpCo_srcManuel" : "rpCo_srcVeille"))}</span>`
      + `<button type="button" class="rp-co-plus" data-rp-co-menu-btn="${escapeHtml(c.asin)}" aria-expanded="${ouvert}" aria-label="${escapeHtml(t("rpCo_actions"))}">⋯</button>${menu}</li>`;
  }).join("");
  const liste = L.length ? `<ul class="rp-co">${lignes}</ul>` : `<p class="rp-mut" data-rp-co-vide>${escapeHtml(t("rpCo_aucun"))}</p>`;
  const ajout = `<div class="rp-co-add"><label for="rpCoIn">${escapeHtml(t("rpCo_ajouter"))}</label>`
    + `<input id="rpCoIn" type="text" autocomplete="off" spellcheck="false" data-rp-co-in placeholder="${escapeHtml(t("rpCo_ph"))}">`
    + `<button type="button" class="rp-go" data-rp-co-add${busy ? " disabled" : ""}>${escapeHtml(t("rpCo_ajouterBtn"))}</button>`
    + `<a class="rp-fact" href="#veille/conc">${escapeHtml(t("rpCo_veille"))}${rpChev()}</a></div>`;
  return etat + liste + msg + ajout + `<p class="rp-fnt rp-small">${escapeHtml(t("rpCo_note"))}</p>`;
}
function rpCoAsin(v) {
  const s = String(v || "").trim();
  const m = /^[A-Z0-9]{10}$/i.exec(s) ? [null, s] : /\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})(?:[/?#]|$)/i.exec(s);
  return m ? m[1].toUpperCase() : null;
}
async function rpCoAction(body, okTxt) {
  const r = rpRowSel(), k = r ? rpKey(r) : null, d = k ? rp.det[k] : null;
  if (!r || !d?.asin || rp.coBusy) return;
  rp.coBusy = k; rp.coMsg = null; rpPaint();
  let res;
  try { await api("/demo-hors-ligne/veille/etat", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, produit: d.asin, mp: r.marketplace }) }); res = { ok: true }; }
  catch (e) { res = { ok: false, max: /au plus/.test(String(e?.message || "")), nonSuivi: /non suivi/.test(String(e?.message || "")) }; }
  rp.coBusy = null;
  rp.coMsg = { k, ko: !res.ok, text: res.ok ? t(okTxt) : t(res.max ? "rpCo_errMax" : res.nonSuivi ? "rpCo_errNonSuivi" : "rpCo_err") };
  if (res.ok) { rp.coMenu = null; if (typeof vl === "object" && vl) vl.d = null; }
  if (res.ok || res.nonSuivi) { delete rp.det[k]; delete rp.detSt[k]; return rpDetLoad(r); }
  rpPaint();
}
function rpCoClic(e) {
  const mb = e.target.closest("[data-rp-co-menu-btn]");
  if (mb) { const r = rpRowSel(); const id = `${rpKey(r)}|${r.marketplace}|${mb.dataset.rpCoMenuBtn}`; rp.coMenu = rp.coMenu === id ? null : id; rpPaint(); return true; }
  const ad = e.target.closest("[data-rp-co-add]");
  if (ad && !ad.disabled) {
    const asin = rpCoAsin(document.querySelector("#t1Repricer [data-rp-co-in]")?.value);
    if (!asin) { const r = rpRowSel(); rp.coMsg = { k: rpKey(r), ko: true, text: t("rpCo_errAsin") }; rpPaint(); return true; }
    rpCoAction({ action: "ajout", asin, depuis: "repricer" }, "rpCo_okAjout"); return true;
  }
  const fm = e.target.closest("[data-rp-co-fmt]");
  if (fm && !fm.disabled) {
    const n = Number(fm.parentElement.querySelector("[data-rp-co-rap]")?.value);
    if (!(Number.isInteger(n) && n >= 1 && n <= 100)) { rp.coMsg = { k: rp.sel, ko: true, text: t("rpCo_errFmt") }; rpPaint(); return true; }
    rpCoAction({ action: "format", asin: fm.dataset.rpCoFmt, rapport: n > 1 ? n : null }, "rpCo_okFmt"); return true;
  }
  const rt = e.target.closest("[data-rp-co-ret]");
  if (rt && !rt.disabled) { rpCoAction({ action: "retrait", asin: rt.dataset.rpCoRet }, "rpCo_okRet"); return true; }
  return false;
}
function rpCoChange(e) {
  const cb = e.target.closest?.("[data-rp-co-cmp]");
  if (!cb) return false;
  const c = (rp.det[rp.sel]?.concurrents || []).find((x) => x.asin === cb.dataset.rpCoCmp);
  rpCoAction({ action: "format", asin: cb.dataset.rpCoCmp, comparable: cb.checked, rapport: c?.format?.rapport ?? null }, cb.checked ? "rpCo_okCmp" : "rpCo_okHors");
  return true;
}
function rpIgnMsg(k) { return rp.iMsg && rp.iMsg.k === k ? `<p class="${rp.iMsg.ko ? "rp-ko" : "rp-mut"}" role="status">${escapeHtml(rp.iMsg.text)}</p>` : ""; }
function rpIgnPermis(r, d) {
  if (!r || r.ignorable !== true || typeof r.ombre?.empreinteIgnore !== "string" || rpFileDe([r]).classe[rpCleF(r)] !== "a_valider" || !d) return false;
  const o = r.ombre, k = rpKey(r);
  const ct = (x) => (typeof x === "number" && Number.isFinite(x) ? Math.round(x * 100) : null), L = [ct(d.plancher), ct(o.plancher), ct(d.plafond), ct(o.plafond)];
  if (L.some((x) => x === null) || L[0] !== L[1] || L[2] !== L[3]) return false;
  return !(rp.sitChg[k] !== undefined && rp.sitChg[k] === (o.decideLe ?? ""));
}
function rpIgnHtml(r, d, opts = {}) {
  const k = rpKey(r);
  if (rp.d?.ignores?.etat !== "ok") return `<p class="rp-fnt rp-small" data-rp-ign-ill>${escapeHtml(t("rpD_ignIll"))}</p>`;
  if (!rpIgnPermis(r, d)) return "";
  return `<div class="rp-dign"><button type="button" class="rp-fact" data-rp-ignorer${opts.busy ? " disabled" : ""}>${escapeHtml(t(opts.busy ? "rpD_ignBusy" : "rpD_ignorer"))}</button>${rpIgnMsg(k)}</div>`;
}
function rpConseilHtml(r) {
  const c = r.conseil || { etat: "aucun" }, e = c.etat;
  const att = c.aValider ? ` <span class="rp-pill wa rp-sm">${escapeHtml(t("rpC_aValider"))}</span>` : "";
  const tip = c.raison ? ` title="${escapeHtml(c.raison)}"` : "";
  if (e === "propose") return `<b class="rp-pos">${escapeHtml(rpM(c.prix, r.devise) ?? "—")}</b>${att}`;
  if (e === "simulation" && Number.isFinite(c.prix)) return `<b data-rp-simu>${escapeHtml(rpM(c.prix, r.devise))}</b> <span class="rp-pill ne rp-sm">${escapeHtml(t("rpC_simulation"))}</span>${att}`;
  if (e === "pause_promo") return `<span class="rp-pill ne">${escapeHtml(t("rpC_pause_promo"))}</span>${att}`;
  if (e === "cout_inconnu" || e === "frais_inconnus" || e === "sans_prix") return `<span class="rp-unk"${tip}>${escapeHtml(t("rpC_" + e))}</span>${att}`;
  if (e === "bornes_en_conflit" || e === "bloque") return `<span class="rp-err"${tip}>${escapeHtml(t("rpC_" + e))}</span>${att}`;
  if (e === "garder" || e === "desactive") return `<span class="rp-mut"${tip}>${escapeHtml(t("rpC_" + e))}</span>${att}`;
  if (e === "non_achetable") return `<span class="rp-att"${tip}>${escapeHtml(t("rpC_non_achetable"))}</span>${att}`;
  return `<span class="rp-fnt">${escapeHtml(t("rpC_aucun"))}</span>${att}`;
}
function rpDate(d) {
  const x = new Date(`${d}T00:00:00Z`);
  return Number.isNaN(x.getTime()) ? String(d) : new Intl.DateTimeFormat(LOCALE(), { day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(x);
}
function rpSousTitre(r) {
  const n = Number.isInteger(r.offres) ? r.offres : null;
  if (r.situation === "perdue") return r.perdueDepuis && n != null ? t("rpP_perdue", rpDate(r.perdueDepuis), n) : t("rpP_perdueX");
  if (r.situation === "detenue" && n != null) return t("rpP_detenue", n);
  if (r.situation === "seul_vendeur") return t("rpP_seul");
  return t(r.situation === "sans_offre" ? "rpP_sans_offre" : "rpP_inconnue");
}
function rpIxDepart(lignes, r) {
  const at = (p) => (typeof p === "number" ? lignes.findIndex((x) => rpCents(x.prix) === rpCents(p)) : -1);
  const a = r?.conseil?.etat === "propose" ? at(r.conseil.prix) : -1, b = at(r?.prixActuel);
  return a >= 0 ? a : b >= 0 ? b : 0;
}
function rpPanneau(r, d, ix, opts = {}) {
  const cur = r.devise || d?.devise || null, mp = r.marketplace;
  const titre = rpTitre(r, rp.d?.titres);
  const head = opts.sansTete ? "" : `<div class="rp-ih"><div><h3${titre ? ` title="${escapeHtml(titre)}"` : ""}>${escapeHtml(rpNom(r))} · ${rpDrapeau(mp)}</h3>`
    + `<div class="rp-sub">${escapeHtml(rpSousTitre(r))}</div></div>`
    + `<button type="button" class="rp-x" data-rp-close aria-label="${escapeHtml(t("rpP_close"))}">×</button></div>`;
  const BLOCS = ["cout_inconnu", "bornes_en_conflit", "frais_inconnus", "sans_prix", "bloque"], e = r.conseil?.etat;
  const cause = !opts.sansTete && BLOCS.includes(e)
    ? `<p class="rp-cause" data-rp-pcause>${escapeHtml(e === "cout_inconnu" ? t("rpD_coutPl") : rpRaisonTxt(r.conseil.raison) ?? t("rpFc_" + e))}</p>` : "";
  if (!d) return head + cause + `<p class="rp-mut">${escapeHtml(t(opts.err ? "rpDetErr" : "loading"))}</p>`;
  const L = d.lignes || [], l = L[ix] || null;
  const neg = (v) => (typeof v === "number" ? escapeHtml(rpM(v === 0 ? 0 : -v, cur)) : rpUnk());
  const val = (v) => (typeof v === "number" ? escapeHtml(rpM(v, cur)) : rpUnk());
  let sim;
  if (!l) {
    const pl = typeof d.plancher === "number" ? d.plancher : r.ombre?.plancher, pf = typeof d.plafond === "number" ? d.plafond : r.ombre?.plafond;
    sim = `<p class="rp-mut">${escapeHtml(t("rpGrilleVide"))}</p>`
      + `<div class="rp-lims" data-rp-limv><span>${escapeHtml(t("rpSimPlancher"))} ${typeof pl === "number" ? escapeHtml(rpM(pl, cur)) : rpUnk()}</span>`
      + `<span>${escapeHtml(t("rpSimPlafond"))} ${typeof pf === "number" ? escapeHtml(rpM(pf, cur)) : rpUnk()}</span></div>`;
  }
  else {
    const n = L.length, pos = (i) => (n > 1 ? (i / (n - 1)) * 100 : 50);
    const ip = d.plancher != null ? L.findIndex((x) => rpCents(x.prix) === rpCents(d.plancher)) : -1;
    const iq = d.plafond != null ? L.findIndex((x) => rpCents(x.prix) === rpCents(d.plafond)) : -1;
    const bande = ip >= 0 && iq >= ip ? `<i class="rp-band" style="left:${pos(ip)}%;width:${pos(iq) - pos(ip)}%"></i>` : "";
    const attendu = r.offres === 1 ? t("rpSimAttSeul") : t("rpSimAttNon");
    const cout = d.coutAchat || {}, prov = cout.provisoire || cout.tauxProvisoire ? ` <span class="rp-prov">${escapeHtml(t("rpL_coutProv"))}</span>` : "";
    const tva = typeof d.tauxTva === "number" ? t("rpL_tva", fmtPct(d.tauxTva)) : t("rpL_tvaX");
    const pu = d.publiciteParUnite || {}, B = rpBenDe(d, l), ben = B.v;
    const pubTxt = typeof pu.valeur === "number" ? `<span title="${escapeHtml(t("rpL_pubTip", pu.du ?? "", pu.au ?? ""))}">${neg(pu.valeur)}</span>`
      : `<span class="rp-unk" title="${escapeHtml(t("rpPubR_" + (pu.raison || "x")) !== "rpPubR_" + (pu.raison || "x") ? t("rpPubR_" + pu.raison) : String(pu.raison ?? ""))}">${escapeHtml(t("rpL_pubNon"))}</span>`;
    const E = d.encheres || {}, eq = l.encherEquilibre;
    const au = Array.isArray(E.valeurs) && typeof eq === "number" ? E.valeurs.filter((b) => rpCents(b) > rpCents(eq)).length : null;
    const enchL = au === null ? `<div class="rp-kv"><span>${escapeHtml(t("rpL_enchAu"))}</span><span>${rpUnk("rpL_nonReleve")}</span></div>`
      : au > 0 ? `<div class="rp-warnt">▲ ${escapeHtml(t("rpL_enchN", au, rpM(eq, cur)))}</div>`
      : `<div class="rp-fnt rp-small">${escapeHtml(t("rpL_ench0", rpM(eq, cur)))}</div>`;
    sim = `<div class="rp-sim"><div class="rp-simh"><span class="rp-simtag">${escapeHtml(t("rpSimTest"))}</span><span class="rp-grow"></span>`
      + `<span class="rp-fnt rp-small">${escapeHtml(t("rpSimPrix"))}</span><output class="rp-field" data-rp-dyn="val">${escapeHtml(rpM(l.prix, cur))}</output></div>`
      + `<div class="rp-track">${bande}<i class="rp-tick" data-rp-dyn="tick" style="left:${pos(ix)}%"></i>`
      + `<input type="range" class="rp-range" min="0" max="${n - 1}" step="1" value="${ix}" data-rp-range aria-label="${escapeHtml(t("rpSimPrix"))}" aria-valuetext="${escapeHtml(rpM(l.prix, cur))}"></div>`
      + `<div class="rp-lims"><span>${escapeHtml(t("rpSimPlancher"))} ${d.plancher != null ? escapeHtml(rpM(d.plancher, cur)) : rpUnk()}</span>`
      + `<span>${escapeHtml(t("rpSimAttendu"))} <span class="${r.offres === 1 ? "rp-fnt" : "rp-unk"}">${escapeHtml(attendu)}</span></span>`
      + `<span>${escapeHtml(t("rpSimPlafond"))} ${d.plafond != null ? escapeHtml(rpM(d.plafond, cur)) : rpUnk()}</span></div>`
      + `<div class="rp-kv" data-rp-dyn="kv1"><span>${escapeHtml(t("rpL_ttc"))}</span><span>${val(l.prix)}</span>`
      + `<span>${escapeHtml(tva)}</span><span>${neg(l.tva)}</span>`
      + `<span>${escapeHtml(t("rpL_frais"))}</span><span>${neg(l.frais)}</span>`
      + `<span>${escapeHtml(t("rpL_cout"))}${prov}</span><span>${neg(cout.valeur)}</span>`
      + `<span>${escapeHtml(t("rpL_pub"))}</span><span>${pubTxt}</span><span class="rp-sep"></span>`
      + `<span class="rp-tot">${escapeHtml(t("rpL_ben"))}${B.apresPub ? "" : ` <small>${escapeHtml(t("rpL_benAv"))}</small>`}</span>`
      + `<span class="rp-tot ${typeof ben === "number" ? (ben >= 0 ? "rp-pos" : "rp-neg") : ""}">${val(ben)}</span></div>`
      + `<div class="rp-kv2" data-rp-dyn="kv2"><div class="rp-kv"><span>${escapeHtml(t("rpL_acos"))}</span><span>${typeof l.acosEquilibre === "number" ? escapeHtml(fmtPct(l.acosEquilibre)) : rpUnk()}</span>`
      + `<span>${escapeHtml(t("rpL_ench"))}</span><span>${val(l.encherEquilibre)}</span></div>${enchL}</div></div>`;
  }
  const av = d.avant || {}, vj = d.ventesParJour || {};
  const bAv = rpBenDe(d, { beneficeAvantPub: av.beneficeAvantPub });
  const avant = av.prix != null ? `${escapeHtml(rpM(av.prix, cur))} · ${typeof bAv.v === "number" ? escapeHtml(rpM(bAv.v, cur)) : rpUnk()} ${escapeHtml(t("rpL_parU"))}` : rpUnk();
  const vjDe = (v) => typeof v.valeur === "number" ? `<span${v.commandesSansArticle > 0 ? ` title="${escapeHtml(t("rpV_sansArt", fmtInt(v.commandesSansArticle)))}"` : ""}>${v.commandesSansArticle > 0 ? "≥ " : ""}${escapeHtml(new Intl.NumberFormat(LOCALE(), { maximumFractionDigits: 1 }).format(v.valeur))} · ${escapeHtml(t("rpL_moy14"))}</span>` : rpUnk();
  const vjTxt = vjDe(vj), vjCumul = d.ventesParJourCumul ? `<span>${escapeHtml(t("rpL_vjCumul"))}</span><span>${vjDe(d.ventesParJourCumul)}</span>` : "";
  const etat = r.conseil?.aValider ? `<span class="rp-pill wa">${escapeHtml(t("rpE_attente"))}</span>`
    : r.conseil?.etat === "propose" ? `<span class="rp-pill ne">${escapeHtml(t("rpE_conseil", rpM(r.conseil.prix, cur) ?? "—"))}</span>` : "";
  const gele = opts.verrou === "ferme";
  const memePrix = !l || rpCents(l.prix) === rpCents(r.prixActuel);
  const envoiNonConfirme = ["PENDING", "CONFIRMED", "SENDING", "UNKNOWN"].includes(r.dernierPrix?.status);
  const off = !r.sku || !l || memePrix || gele || r.desactive || opts.busy || opts.sansEnvoi || envoiNonConfirme || (r.multiSku && r.prixActuel == null) || !!r.identite;
  const btn = opts.sansProposer ? "" : `<button type="button" class="rp-go" data-rp-propose${off ? " disabled" : ""}>${escapeHtml(t(opts.busy ? "rpPropBusy" : "rpProposer"))}</button>`;
  const msg = opts.msg ? `<p class="${opts.msg.ko ? "rp-ko" : "rp-mut"}" role="status">${escapeHtml(opts.msg.text)}</p>` : gele ? `<p class="rp-mut">${escapeHtml(t("rpPropGele"))}</p>`
    : envoiNonConfirme && !opts.sansEnvoi ? `<p class="rp-mut" data-rp-envbloque>${escapeHtml(t("rpP_envBloque"))}</p>` : "";
  return head + cause + sim + `<div class="rp-kv"><span>${escapeHtml(t("rpL_avant"))}</span><span>${avant}</span>`
    + `<span>${escapeHtml(t(r.situation === "perdue" ? "rpL_vjPerte" : "rpL_vj"))}</span><span>${vjTxt}</span>${vjCumul}</div>`
    + `<div class="rp-acts" data-rp-dyn="acts">${etat}<span class="rp-grow"></span>${btn}</div><div data-rp-dyn="msg">${msg}</div>`
    + `<div class="rp-acts"><button type="button" class="rp-lnk" data-rb-prod="${escapeHtml(r.asin)}">${escapeHtml(t("rpPp_ouvrir"))} ›</button></div>`;
}
function rpBarInfo(x) {
  const o = x?.object || {}, k = `${o.marketplace}|${o.sku}`;
  const p = rp.prop[x?.change_id];
  if (p) return p;
  const r = (rp.d?.rows || []).find((y) => rpKey(y) === k);
  if (!r) return null;
  const d = rp.det[k], L = d?.lignes || [], at = (v) => rpBenDe(d, L.find((l) => rpCents(l.prix) === rpCents(v))).v;
  return { nom: rpNom(r) || null, mp: r.marketplace, devise: r.devise || null, benAvant: at(x?.before?.price), benApres: d ? rpBenDe(d, rpPointAuPrix(r, d, x?.after?.price)).v : null,
    apresPub: typeof d?.publiciteParUnite?.valeur === "number", perdue: r.situation === "perdue" };
}
const RP_J_ST = { APPLIED: "rp-pill ok", PENDING: "rp-pill wa", CONFIRMED: "rp-pill wa", SENDING: "rp-pill wa", REFUSED: "rp-err", NOT_APPLIED: "rp-err",
  CANCELLED: "rp-mut", EXPIRED: "rp-mut", UNKNOWN: "rp-unk" };
function rpQuand(iso) {
  const x = new Date(iso);
  return Number.isNaN(x.getTime()) ? String(iso ?? "") : new Intl.DateTimeFormat(LOCALE(), { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(x);
}
const rpJKey = (e) => `${e.type}|${e.at}|${e.marketplace}|${e.sku}|${e.asin ?? ""}`;
const rpJPct = (v, signe) => {
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  const s = v !== 0 && Math.abs(v) < 0.05 ? new Intl.NumberFormat(LOCALE(), { style: "percent", maximumSignificantDigits: 1 }).format(v / 100) : fmtPct(v / 100);
  return (signe && v > 0 ? "+" : "") + s;
};
function rpJournalHtml(entrees, rowsAll, f = {}) {
  const parK = new Map(rowsAll.map((r) => [rpKey(r), r]));
  const n0 = f.j?.relevesSansChangement;
  const cpt = typeof n0 === "number" && n0 > 0 ? `<p class="rp-fnt rp-jcpt">${escapeHtml(t("rpJ_cpt", fmtInt(n0)))}</p>` : "";
  const suivies = rpLignesFile(rowsAll), pert = (e) => e.type === "proposition" || suivies.has(rpKey(e));
  const vis0 = entrees.filter((e) => { const r = parK.get(rpKey(e));
    return (!f.pays || e.marketplace === f.pays) && (!f.sit || (!!r && (r.situation || "inconnue") === f.sit)); });
  const vis = f.jTout ? vis0 : vis0.filter(pert), nCach = vis0.length - vis.length;
  const fil = f.jTout ? `<p class="rp-fnt rp-jcpt">${escapeHtml(t("rpJ_filT"))} · <button type="button" class="rp-lnk" data-rp-jtout="0">${escapeHtml(t("rpJ_voirSuiv"))}</button></p>`
    : nCach > 0 ? `<p class="rp-fnt rp-jcpt">${escapeHtml(t("rpJ_filS", fmtInt(nCach), nCach))} · <button type="button" class="rp-lnk" data-rp-jtout="1">${escapeHtml(t("rpJ_voirTout"))}</button></p>` : "";
  if (!vis.length) return cpt + fil + `<p class="rp-empty">${escapeHtml(t(entrees.length ? "rpNoneFiltre" : "rpJ_vide"))}</p>`;
  const ouv = f.jOuv || {};
  const body = vis.map((e, i) => {
    const r = parK.get(rpKey(e)), cur = e.devise || r?.devise || null, k = rpJKey(e), o = !!ouv[k];
    const m = (v) => (typeof v === "number" ? escapeHtml(rpM(v, cur)) : rpUnk("rpL_nonReleve"));
    const u = (v) => (typeof v === "number" ? escapeHtml(rpM(v, cur)) : rpUnk());
    const pc = (v) => { const x = rpJPct(v); return x === null ? rpUnk() : escapeHtml(x); };
    const ec = rpJPct(e.ecartPct, true), ecart = ec === null ? "" : ` <small class="rp-mut">(${escapeHtml(ec)})</small>`;
    const regle = e.regle ? (e.regle.source === "nommee" ? t("rpD_regle", rpRegleNomDec(e.regle)) : rpRegleNomDec(e.regle)) : t("rpJ_regleNonFigee");
    let evt, prix;
    if (e.type === "proposition") {
      const st = String(e.statut || "UNKNOWN"), lbl = t("rpJ_St_" + st) !== "rpJ_St_" + st ? t("rpJ_St_" + st) : st;
      evt = escapeHtml(t("rpJ_prop")) + (e.via ? ` <small class="rp-fnt">${escapeHtml(t("rpJ_via_" + e.via))}</small>` : "");
      prix = `${m(e.avant)} → <b>${m(e.apres)}</b>${ecart} <span class="${RP_J_ST[st] || "rp-unk"}"${e.raison ? ` title="${escapeHtml(e.raison)}"` : ""}>${escapeHtml(lbl)}</span>`;
    } else {
      evt = escapeHtml(t("rpJ_ombre"));
      prix = (e.conseil?.etat === "propose" && typeof e.prixActuel === "number" ? `<span class="rp-mut">${m(e.prixActuel)}</span> → ` : "") + rpConseilHtml({ conseil: e.conseil, devise: cur })
        + (e.conseil?.etat === "propose" ? ecart : "");
    }
    const es = (v) => (e.fraisEstimes === true && typeof v === "number" ? ` <small class="rp-fnt">${escapeHtml(t("rpJ_estime"))}</small>` : "");
    const pa = e.type === "ombre" && e.conseil?.etat !== "propose" ? (e.auPrixActuel ?? null) : undefined;
    const paV = (v, fmt) => (pa === null ? `<span class="rp-unk">${escapeHtml(t("rpJ_nonEnr"))}</span>`
      : typeof v === "number" ? fmt(v) + (pa.estime ? ` <small class="rp-fnt">${escapeHtml(t("rpJ_estime"))}</small>` : "")
      : `<span class="rp-unk">${escapeHtml(t("rpJ_indispo0"))}</span>`);
    const causes = !pa ? [] : [...new Set([pa.raison, typeof e.prixActuel !== "number" ? "prix_inconnu" : null,
      typeof e.prixActuel === "number" && typeof pa.frais !== "number" ? "frais_absents" : null,
      typeof e.prixActuel === "number" && typeof e.coutAchat !== "number" ? "cout_achat_absent" : null].filter(Boolean))]
      .map((c) => (t("rpJA_" + c) !== "rpJA_" + c ? t("rpJA_" + c) : c));
    const consq = !pa ? [] : [["frais", "rpL_frais"], ["contribution", "rpJ_contrib"], ["margePct", "rpJ_marge"], ["roiPct", "rpJ_roi"]].filter(([c]) => typeof pa[c] !== "number").map(([, k]) => t(k));
    const paM = (v) => `<span class="${v < 0 ? "rp-neg" : "rp-pos"}">${escapeHtml(rpM(v, cur))}</span>`;
    const ben = typeof e.margeProposee === "number" ? `<span class="${e.margeProposee < 0 ? "rp-neg" : "rp-pos"}">${escapeHtml(rpM(e.margeProposee, cur))}</span>${es(e.margeProposee)}`
      : typeof pa?.contribution === "number" ? paV(pa.contribution, paM) + ` <small class="rp-fnt">${escapeHtml(t("rpJ_auPaC"))}</small>` : rpUnk();
    const ligne = `<tr class="rp-jl${o ? " on" : ""}" data-rp-jr="${escapeHtml(k)}"><td class="rp-fnt"><button type="button" class="rp-jx" data-rp-jx="${escapeHtml(k)}" aria-expanded="${o}"`
      + ` aria-controls="rpjd-${i}" title="${escapeHtml(t("rpJ_voir"))}"><span class="rp-jchev" aria-hidden="true">›</span>${escapeHtml(rpQuand(e.at))}</button></td>`
      + `<td class="rp-jn"><span class="rp-n">${escapeHtml(r?.nom || e.sku || e.asin || "—")}<small>${escapeHtml(e.sku || "—")}</small></span></td>`
      + `<td>${e.marketplace ? rpDrapeau(e.marketplace) : ""}</td><td class="rp-je">${evt}<small class="rp-fnt rp-jr">${escapeHtml(regle)}</small></td><td class="rp-jp">${prix}</td>`
      + `<td class="num" data-l="${escapeHtml(t("rpL_ben"))}">${ben}</td></tr>`;
    if (!o) return ligne;
    const it = (lbl, val) => `<div><dt>${escapeHtml(lbl)}</dt><dd>${val}</dd></div>`;
    const eco = e.type === "proposition" && !e.figeLe ? "" : pa !== undefined ? it(t("rpJ_cout"), u(e.coutAchat))
      : it(t("rpL_frais"), u(e.fraisPropose) + es(e.fraisPropose)) + it(t("rpJ_cout"), u(e.coutAchat))
      + it(t("rpJ_roi"), pc(e.roiPct) + es(e.roiPct)) + it(t("rpJ_marge"), pc(e.margePct) + es(e.margePct));
    let d = eco;
    if (pa !== undefined) {
      const pcV = (v) => escapeHtml(rpJPct(v));
      d += `<div class="rp-jlarge"><dt>${escapeHtml(t("rpJ_auPa", typeof e.prixActuel === "number" ? rpM(e.prixActuel, cur) : t("rpL_nonReleve")))}</dt></div>`
        + it(t("rpL_frais"), paV(pa?.frais, (v) => escapeHtml(rpM(v, cur)))) + it(t("rpJ_contrib"), paV(pa?.contribution, paM))
        + it(t("rpJ_marge"), paV(pa?.margePct, pcV)) + it(t("rpJ_roi"), paV(pa?.roiPct, pcV));
      if (causes.length) d += it(t("rpJ_causes"), escapeHtml(causes.join(" · ")));
      if (causes.length && consq.length) d += it(t("rpJ_consq"), escapeHtml(t("rpJ_consqV", consq.join(" · "))));
    }
    if (e.type === "ombre") {
      const bb = e.buyBoxOwned === true ? escapeHtml(t("rpJ_bbOui")) : e.buyBoxOwned === false ? escapeHtml(t("rpJ_bbNon")) : rpUnk();
      const rz = rpRaisonTxt(e.conseil?.raison);
      d += it(t("rpJ_bb"), bb) + it(t("rpJ_bornes"), `${m(e.plancher)} / ${m(e.plafond)}`) + it(t("rpJ_bas"), `${m(e.prixBasPrime)} / ${m(e.prixBasNonPrime)}`)
        + (rz ? it(t("rpJ_raison"), escapeHtml(rz)) : "");
    } else {
      d += e.figeLe ? it(t("rpJ_fige"), escapeHtml(rpQuand(e.figeLe))) : `<div class="rp-jlarge"><dd class="rp-fnt">${escapeHtml(t("rpJ_nonFige"))}</dd></div>`;
      if (e.raison) d += it(t("rpJ_raison"), escapeHtml(rpMotifTxt(e.raison)));
    }
    return ligne + `<tr class="rp-jd" id="rpjd-${i}"><td colspan="6"><dl class="rp-jdl">${d}</dl></td></tr>`;
  }).join("");
  return cpt + fil + `<div class="rp-tw"><table class="rp-t rp-jt"><thead><tr><th>${escapeHtml(t("rpJ_th_date"))}</th><th>${escapeHtml(t("rpTh_prod"))}</th>`
    + `<th>${escapeHtml(t("rpTh_pays"))}</th><th>${escapeHtml(t("rpJ_th_evt"))}</th><th>${escapeHtml(t("rpTh_prix"))}</th>`
    + `<th class="num">${escapeHtml(t("rpL_ben"))} <small>${escapeHtml(t("rpL_benAv"))}</small></th></tr></thead><tbody>${body}</tbody></table></div>`;
}
const RP_RF = ["margeMin", "roiMin", "profitMin", "margeMax", "profitMax", "roiMax"];
const RP_CRIT = [["profit", "profitMin", "profitMax"], ["marge", "margeMin", "margeMax"], ["roi", "roiMin", "roiMax"]];
const rpNum = (v) => (typeof v === "number" && Number.isFinite(v) ? new Intl.NumberFormat(LOCALE(), { maximumFractionDigits: 2, useGrouping: false }).format(v) : "");
const rpN = (s) => String(s ?? "").trim().replace(",", ".");
function rpRegleChamps(g) {
  g = g || {};
  const pc = (v) => (typeof v === "number" ? rpNum(Math.round(v * 10000) / 100) : "");
  return { margeMin: pc(g.margeMin), roiMin: pc(g.roiMin), profitMin: rpNum(g.profitMin), margeMax: pc(g.margeMax), profitMax: rpNum(g.profitMax), roiMax: pc(g.roiMax),
    mode: g.mode || "tous", modeMax: g.modeMax || "tous", facon: RP_FACONS.includes(g.facon) ? g.facon : "" };
}
const RP_FACONS = ["concurrents", "vendeurs_fiche"];
const RP_CIBLES = ["moins_cher", "mediane", "choisi"];
const RP_EC_CHOIX = ["m5", "0", "p5", "autre"];
const RP_EC_CHAMPS = ["cible", "cibleAsin", "ecartChoix", "ecartVal", "ecartUnite", "ecartSens", "ecLu"];
function rpEcartChamps(c) {
  const ok = !!c && typeof c === "object" && RP_CIBLES.includes(c.cible) && ["pct", "eur"].includes(c.unite) && typeof c.ecart === "number" && Number.isFinite(c.ecart);
  if (!ok) return { cible: "moins_cher", cibleAsin: "", ecartChoix: "", ecartVal: "", ecartUnite: "pct", ecartSens: "moins", ecLu: "" };
  const e = c.ecart, pct = c.unite === "pct", choix = pct && e === -5 ? "m5" : pct && e === 0 ? "0" : pct && e === 5 ? "p5" : "autre";
  const asin = c.cible === "choisi" ? String(c.asin || "") : null;
  return { cible: c.cible, cibleAsin: asin || "", ecartChoix: choix, ecartVal: choix === "autre" ? rpNum(Math.abs(e)) : "", ecartUnite: c.unite, ecartSens: e > 0 ? "plus" : "moins",
    ecLu: JSON.stringify({ cible: c.cible, asin, ecart: e, unite: c.unite }) };
}
function rpCibleDe(ch) {
  const choix = ch.ecartChoix || "";
  if (!RP_EC_CHOIX.includes(choix) || !RP_CIBLES.includes(ch.cible)) return { vide: true };
  let ecart, unite = "pct";
  if (choix !== "autre") ecart = choix === "m5" ? -5 : choix === "p5" ? 5 : 0;
  else {
    const s = rpN(ch.ecartVal);
    if (s === "") return { vide: true };
    const n = Number(s);
    unite = ch.ecartUnite === "eur" ? "eur" : "pct";
    if (!/^\d+(\.\d{1,2})?$/.test(s) || !Number.isFinite(n) || (unite === "pct" ? n >= 100 : n >= 10000)) return { erreur: "ecart" };
    ecart = n === 0 ? 0 : ch.ecartSens === "plus" ? n : -n;
  }
  let asin = null;
  if (ch.cible === "choisi") {
    asin = String(ch.cibleAsin || "").trim().toUpperCase();
    if (!asin) return { vide: true };
    if (!/^[A-Z0-9]{10}$/.test(asin)) return { erreur: "asin" };
  }
  return { valeur: { cible: ch.cible, asin, ecart, unite } };
}
const rpCibleCle = (ch) => { const c = rpCibleDe(ch || {}); return c.valeur ? JSON.stringify(c.valeur) : ""; };
const RP_VF_CHOIX = ["0", "m001", "autre"];
const RP_VF_CHAMPS = ["vfChoix", "vfVal", "vfUnite", "vfSens", "vfExp", "vfLu", "vfHausse"];
const rpVfForme = (b) => (b && typeof b === "object" && b.reference === "offre_vedette" && ["pct", "eur"].includes(b.unite) && typeof b.ecart === "number" && Number.isFinite(b.ecart)
  ? JSON.stringify({ reference: b.reference, ecart: b.ecart, unite: b.unite, ...(b.expedition === "amazon" ? { expedition: "amazon" } : {}) }) : "");
function rpVfChamps(b) {
  const lu = rpVfForme(b), hausse = b && typeof b === "object" && b.hausse && typeof b.hausse === "object" ? JSON.stringify(b.hausse) : "";
  if (!lu) return { vfChoix: "", vfVal: "", vfUnite: "eur", vfSens: "moins", vfExp: "tous", vfLu: "", vfHausse: hausse };
  const e = b.ecart, eur = b.unite === "eur", choix = eur && e === 0 ? "0" : eur && e === -0.01 ? "m001" : "autre";
  return { vfChoix: choix, vfVal: choix === "autre" ? rpNum(Math.abs(e)) : "", vfUnite: b.unite, vfSens: e > 0 ? "plus" : "moins", vfExp: b.expedition === "amazon" ? "amazon" : "tous", vfLu: lu, vfHausse: hausse };
}
function rpVfDe(ch) {
  const choix = ch.vfChoix || "";
  if (!RP_VF_CHOIX.includes(choix)) return { vide: true };
  let ecart, unite = "eur";
  if (choix !== "autre") ecart = choix === "m001" ? -0.01 : 0;
  else {
    const s = rpN(ch.vfVal);
    if (s === "") return { vide: true };
    if (!/^\d+(\.\d{1,2})?$/.test(s)) return { erreur: "vf" };
    const n = Number(s);
    unite = ch.vfUnite === "pct" ? "pct" : "eur";
    ecart = n === 0 ? 0 : ch.vfSens === "plus" ? n : -n;
  }
  return { valeur: { reference: "offre_vedette", ecart, unite, ...(ch.vfExp === "amazon" ? { expedition: "amazon" } : {}) } };
}
const rpVfCle = (ch) => { const c = rpVfDe(ch || {}); return c.valeur ? JSON.stringify(c.valeur) : ""; };
function rpEdManque(ch) {
  if (!RP_FACONS.includes(ch.facon)) return rp.porte === "smartprice" ? "facon" : null;
  return ch.facon === "concurrents" && rpCibleDe(ch).vide ? "ecartManque" : null;
}
function rpRegleDe(ch) {
  const out = { mode: ch.mode === "au_moins_un" ? "au_moins_un" : "tous" };
  for (const f of RP_RF) {
    const s = rpN(ch[f]);
    if (s === "") { if (f !== "profitMax" && f !== "roiMax") out[f] = null; continue; }
    const n = Number(s);
    if (!Number.isFinite(n) || n <= 0) return { erreur: "champ" };
    if ((f === "profitMin" && n >= 100) || (f === "profitMax" && n >= 1e6)) return { erreur: "grand" };
    out[f] = f.startsWith("profit") ? Math.round(n * 100) / 100 : Math.round(n * 100) / 10000;
  }
  if (ch.modeMax === "au_moins_un") out.modeMax = "au_moins_un";
  if (RP_FACONS.includes(ch.facon)) out.facon = ch.facon;
  if (out.margeMin === null && out.roiMin === null && out.profitMin === null) return { erreur: "vide" };
  if (RP_CRIT.some(([, a, b]) => out[b] != null && out[a] != null && out[b] <= out[a])) return { erreur: "maxi" };
  if (ch.facon === "concurrents") {
    const c = rpCibleDe(ch);
    if (c.erreur) return { erreur: c.erreur, regle: out };
    if (c.valeur && JSON.stringify(c.valeur) !== (ch.ecLu || "")) out.concurrents = c.valeur;
  }
  if (ch.facon === "vendeurs_fiche") {
    const c = rpVfDe(ch);
    if (c.erreur) return { erreur: c.erreur, regle: out };
    if (c.valeur && JSON.stringify(c.valeur) !== (ch.vfLu || "")) {
      let h = null;
      try { h = ch.vfHausse ? JSON.parse(ch.vfHausse) : null; } catch (e) { void e; h = null; }
      out.vendeursFiche = h ? { ...c.valeur, hausse: h } : c.valeur;
    }
  }
  return { regle: out };
}
function rpBornes(g) {
  g = g || {};
  const mins = RP_CRIT.filter((x) => g[x[1]] != null).map((x) => x[0]), maxs = RP_CRIT.filter((x) => g[x[2]] != null).map((x) => x[0]);
  const conflits = RP_CRIT.filter(([, a, b]) => g[a] != null && g[b] != null && g[b] <= g[a]).map((x) => x[0]);
  const S = g.mode === "au_moins_un" ? mins.map((c) => [c]) : [mins], T = !maxs.length ? [[]] : g.modeMax === "au_moins_un" ? maxs.map((c) => [c]) : [maxs];
  return { conflits, vide: conflits.length > 0 && S.every((s) => T.every((u) => s.some((c) => u.includes(c) && conflits.includes(c)))) };
}
function rpPermis(l, cout, g) {
  const b = l?.beneficeAvantPub, ht = l?.prixHt, ok = typeof b === "number";
  const v = { profit: ok ? b : null, marge: ok && ht ? b / ht : null, roi: ok && cout > 0 ? b / cout : null };
  const comb = (x, m) => (m === "au_moins_un" ? (x.includes(true) ? true : x.includes(null) ? null : false) : (x.includes(false) ? false : x.includes(null) ? null : true));
  const tm = RP_CRIT.filter((c) => g[c[1]] != null).map(([c, a]) => (v[c] === null ? null : v[c] >= g[a]));
  if (!tm.length) return null;
  const okMin = comb(tm, g.mode);
  if (okMin !== true) return okMin;
  const tx = RP_CRIT.filter((c) => g[c[2]] != null).map(([c, , a]) => (v[c] === null ? null : v[c] <= g[a]));
  return tx.length ? comb(tx, g.modeMax) : true;
}
function rpSym(cur) {
  if (!cur) return "";
  if (typeof PRICE_DOLLAR_PREFIX !== "undefined" && PRICE_DOLLAR_PREFIX[cur]) return PRICE_DOLLAR_PREFIX[cur];
  try { return new Intl.NumberFormat(LOCALE(), { style: "currency", currency: cur, currencyDisplay: "narrowSymbol" }).formatToParts(0).find((p) => p.type === "currency")?.value || cur; }
  catch { return cur; }
}
const RP_ICS = { info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>', copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 00-1-1H5a1 1 0 00-1 1v10a1 1 0 001 1h3"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', apply: '<path d="M4 12h12M12 6l6 6-6 6"/>', lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>',
  retry: '<path d="M20 12a8 8 0 11-2.3-5.6M20 4v5h-5"/>', more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  sel: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>', back: '<path d="M15 6l-6 6 6 6"/>', shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8" r="1.3"/>', clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  swords: '<path d="M4 4l9 9M20 4l-9 9M7 17l-3 3M17 17l3 3M10 16l-2-2M14 16l2-2"/>', target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  bolt: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>', wave: '<path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/>', check: '<path d="M5 12l5 5 9-10"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>' };
const rpIc = (n) => `<svg class="rb-ic" viewBox="0 0 24 24" aria-hidden="true">${RP_ICS[n] || ""}</svg>`;
function rpPaysNom(mp) {
  try { return new Intl.DisplayNames([LOCALE()], { type: "region" }).of(mp === "UK" ? "GB" : mp) || mp; }
  catch (e) { void e; return mp; }
}
const rpOngletActif = (s) => (s?.prod ? "tous" : s?.tab);
const rpDrapeau = (mp, deco = false) => `<span class="rb-drap"${deco ? ' aria-hidden="true"' : ` role="img" aria-label="${escapeHtml(rpPaysNom(mp))}"`} title="${escapeHtml(rpPaysNom(mp))}">${flagSvg(mp)}</span>`;
function rpPaysHtml(pays) {
  if (!Array.isArray(pays)) return `<span class="rb-flags">${rpIc("globe")}<span>${escapeHtml(t("rpLb_tousPays"))}</span></span>`;
  return `<span class="rb-flags">${pays.map((c) => rpDrapeau(c)).join("")}</span>`;
}
function rpJm(iso) {
  const x = new Date(iso ?? "");
  return Number.isNaN(x.getTime()) ? "" : new Intl.DateTimeFormat(LOCALE(), { day: "2-digit", month: "2-digit" }).format(x);
}
function rpBarsHtml(g, cur) {
  if (!g) return `<span class="rp-fnt">—</span>`;
  const val = (c, v) => escapeHtml(c === "profit" ? rpM(v, cur) : fmtPct(v));
  const part = (i, mode, sens) => RP_CRIT.filter((x) => g[x[i]] != null).map((x) => `<span class="rb-cr">${escapeHtml(t("rpLb_c_" + x[0]))} ${sens} <b>${val(x[0], g[x[i]])}</b></span>`)
    .join(` <span class="rb-op">${escapeHtml(t(mode === "au_moins_un" ? "rpLb_ou" : "rpLb_et"))}</span> `);
  const mx = part(2, g.modeMax, "≤");
  return `<div class="rb-bars"><div class="rb-bl"><span class="rb-bk">${escapeHtml(t("rpLb_mini"))}</span>${part(1, g.mode, "≥")}</div>`
    + `<div class="rb-bl"><span class="rb-bk">${escapeHtml(t("rpLb_maxi"))}</span>${mx || `<span class="rp-fnt">${escapeHtml(t("rpLb_sansPlafond"))}</span>`}</div></div>`;
}
const RP_STYLES = ["personnalise", "prudent", "equilibre", "offensif", "destockage"];
const RP_MODELES = { prudent: { profitMin: 3, margeMin: 0.18, mode: "tous" }, equilibre: { profitMin: 1.5, margeMin: 0.12, margeMax: 0.6, mode: "tous" },
  offensif: { profitMin: 1, margeMin: 0.08, roiMin: 0.2, mode: "au_moins_un", profitMax: 12, roiMax: 2.5, modeMax: "au_moins_un" }, destockage: { profitMin: 0.5, margeMin: 0.03, mode: "tous" } };
function rpDevise(rows) { const s = new Set((rows || []).map((r) => r.devise).filter(Boolean)); return s.size === 1 ? [...s][0] : null; }
function rpApercuAppliquer(e, rows) {
  const couvre = (mp) => !Array.isArray(e.pays) || e.pays.includes(mp);
  const o = { lignes: [], total: 0, deja: 0, propres: 0, hors: [], sansSku: 0 };
  for (const r of rows) {
    if (!couvre(r.marketplace)) { if (!o.hors.includes(r.marketplace)) o.hors.push(r.marketplace); continue; }
    if (!r.sku) { o.sansSku++; continue; }
    o.total++;
    if (r.affectee?.id === e.id) { o.deja++; continue; }
    if (r.regle?.source === "produit") o.propres++;
    o.lignes.push({ marketplace: r.marketplace, sku: r.sku, id: e.id, versionLue: rpVAff(r) });
  }
  o.changent = o.lignes.length - o.propres;
  o.pays = new Set(rows.filter((r) => couvre(r.marketplace)).map((r) => r.marketplace)).size;
  return o;
}
function rpEcartRegleHtml(g, devise) {
  const fa = g?.facon ?? null;
  if (fa !== "vendeurs_fiche" && fa !== "concurrents") return `<span class="rp-fnt" title="${escapeHtml(t("rpLb_ecClasserT"))}">–</span>`;
  const b = fa === "vendeurs_fiche" ? g.vendeursFiche : g.concurrents;
  if (!b || typeof b.ecart !== "number" || !Number.isFinite(b.ecart) || !["pct", "eur"].includes(b.unite)) return `<span class="rp-fnt" title="${escapeHtml(t("rpLb_ecNonT"))}">${escapeHtml(t("rpLb_ecNon"))}</span>`;
  const ref = fa === "vendeurs_fiche" ? t("rpEd_vfRef") : t("rpEd_ecC_" + (["moins_cher", "mediane", "choisi"].includes(b.cible) ? b.cible : "choisi"));
  const v = Math.abs(b.ecart), val = b.unite === "pct" ? `${rpNum(v)} %` : rpM(v, devise);
  return `<span title="${escapeHtml(t("rpLb_ecT"))}">${escapeHtml(b.ecart === 0 ? `= ${ref}` : `${b.ecart < 0 ? "−" : "+"}${val} · ${ref}`)}</span>`;
}
function rpRegleLigneHtml(e, o) {
  const off = o.off ? ` disabled title="${escapeHtml(t("rpLb_offT"))}"` : o.busy ? " disabled" : "";
  const nom = escapeHtml(rpNomR(e)), id = escapeHtml(e.id);
  const btn = (attr, ic, lbl, cls = "line") => `<button type="button" class="rb-btn ${cls}" ${attr}="${id}"${off}>${rpIc(ic)}<span>${escapeHtml(lbl)}</span></button>`;
  const ico = (attr, ic, lbl, cls = "line") => `<button type="button" class="rb-btn ${cls} ico" ${attr}="${id}" title="${escapeHtml(lbl)}" aria-label="${escapeHtml(`${lbl} · ${rpNomR(e)}`)}"${off}>${rpIc(ic)}</button>`;
  const menu = o.menu === e.id ? `<div class="rb-pmenu" role="menu">${["apply:rpLb_appliquer:data-rb-apply", "copy:rpLb_dupliquer:data-rb-dup", "trash:rpLb_supprimer:data-rb-del"]
    .map((s) => { const [ic, k, a] = s.split(":"); return `<button type="button" role="menuitem" ${a}="${id}" class="${ic === "trash" ? "dng" : ""}"${off}>${rpIc(ic)}${escapeHtml(t(k))}</button>`; }).join("")}</div>` : "";
  const dont = e.effectifs !== e.affectes ? `<small>${escapeHtml(t("rpLb_dontApp", e.effectifs))}</small>` : "";
  return `<div class="rb-rl${o.sel ? " sel" : ""}" data-rb-id="${id}"><div class="rb-rn"><span class="rb-t">${nom}<span class="rb-tag${e.modele === "destockage" ? " dst" : ""}">${escapeHtml(t("rpLb_s_" + e.modele))}</span></span>`
    + `<small>${escapeHtml(t("rpLb_version", e.version, rpJm(e.modifieLe), e.par && !/^(session:|cle$)/.test(e.par) ? e.par : ""))}</small></div>`
    + rpBarsHtml(e.regle, o.devise) + `<span class="rb-ecart">${rpEcartRegleHtml(e.regle, o.devise)}</span>`
    + `<span class="rb-cnt">${escapeHtml(fmtInt(e.affectes))}<small>${escapeHtml(t("rpLb_pxp"))}</small>${dont}</span>${rpPaysHtml(e.pays)}`
    + `<div class="rb-acts rb-desk">${btn("data-rb-apply", "apply", t("rpLb_appliquer"))}${btn("data-rb-edit", "edit", t("rpLb_modifier"))}`
    + `${ico("data-rb-dup", "copy", t("rpLb_dupliquer"))}${ico("data-rb-del", "trash", t("rpLb_supprT"), "dng")}</div>`
    + `<div class="rb-acts rb-tel">${btn("data-rb-edit", "edit", t("rpLb_modifier"), "pri")}<button type="button" class="rb-btn line ico2" data-rb-menu="${id}" aria-haspopup="menu" aria-expanded="${o.menu === e.id}" aria-label="${escapeHtml(t("rpLb_autres", rpNomR(e)))}">${rpIc("more")}</button>${menu}</div>`
    + (o.apres || "") + `</div>`;
}
function rpCompteLigneHtml(g, n, devise, version) {
  return `<div class="rb-rl rb-cpt"><div class="rb-rn"><span class="rb-t">${escapeHtml(t("rpLb_compte"))}<span class="rb-tag def">${escapeHtml(t("rpLb_tagDef"))}</span></span>`
    + `<small>${escapeHtml(g ? t("rpLb_compteD") + (version ? ` · v${version}` : "") : t("rpLb_compteAbs"))}</small></div>`
    + rpBarsHtml(g, devise) + `<span class="rb-ecart"><span class="rp-fnt">–</span></span>`
    + `<span class="rb-cnt">${escapeHtml(fmtInt(n))}<small>${escapeHtml(t("rpLb_pxp"))}</small></span>${rpPaysHtml("tous")}`
    + `<div class="rb-acts rb-where">${rpIc("lock")}<span>${escapeHtml(t("rpLb_compteLock"))}</span></div></div>`;
}
function rpRegleMsgHtml(e, o) {
  const p = o.pend, res = o.res || {};
  let h = "";
  if (p && p.type === "appliquer" && p.id === e.id) {
    const a = p.apercu;
    h += `<div class="rb-prev" role="region" aria-label="${escapeHtml(t("rpLb_apT", rpNomR(e), e.version))}"><div><h4>${rpIc("apply")}${escapeHtml(t("rpLb_apT", rpNomR(e), e.version))}</h4>`
      + `<div class="rb-big">${escapeHtml(fmtInt(a.changent))}<small>${escapeHtml(t("rpLb_apBig"))}</small></div><div class="rb-note">${escapeHtml(t("rpLb_apNote", a.total, a.pays))}</div></div>`
      + `<div class="rb-brk"><span class="n">${escapeHtml(fmtInt(a.changent))}</span><span class="d">${escapeHtml(t("rpLb_apChg"))}</span>`
      + `<span class="n">${escapeHtml(fmtInt(a.deja))}</span><span class="d">${escapeHtml(t("rpLb_apDeja", rpNomR(e)))}</span>`
      + `<span class="n">${escapeHtml(fmtInt(a.propres))}</span><span class="d">${escapeHtml(t("rpLb_apProp"))}</span>`
      + (a.hors.length ? `<span class="n">–</span><span class="d">${escapeHtml(t("rpLb_apHors", a.hors.map(rpPaysNom).join(", ")))}</span>` : "")
      + (a.sansSku ? `<span class="n">${escapeHtml(fmtInt(a.sansSku))}</span><span class="d">${escapeHtml(t("rpLb_apSans"))}</span>` : "") + `</div></div>`;
  }
  const r = res[e.id];
  if (r?.type === "affecte") {
    const ko = r.refusees || [];
    h += ko.length ? `<div class="rb-msg wa" role="status"><span class="rb-tri" aria-hidden="true">▲</span><div class="rp-grow"><b>${escapeHtml(t("rpLb_resPart", r.ok, r.tot, ko.length))}</b> — ${escapeHtml(t("rpLb_resPartD"))}`
      + `<ul>${ko.slice(0, 8).map((x) => `<li>${escapeHtml(`${x.nom || x.sku} · ${x.marketplace}`)} : ${escapeHtml(t("rpLb_r_" + x.raison) !== "rpLb_r_" + x.raison ? t("rpLb_r_" + x.raison) : x.raison)}</li>`).join("")}</ul></div>`
      + `<button type="button" class="rb-btn line" data-rb-retry="${escapeHtml(e.id)}">${rpIc("retry")}<span>${escapeHtml(t("rpLb_reessayerN", ko.length))}</span></button></div>`
      : `<div class="rb-msg ok" role="status">${rpIc("check")}<span>${escapeHtml(t("rpLb_resOk", r.ok))}</span></div>`;
  }
  if (r?.type === "refusSupp") {
    const qui = (o.rows || []).filter((x) => x.affectee?.id === e.id), vu = !!o.voir?.[e.id];
    h += `<div class="rb-msg er" role="alert"><span class="rp-err" aria-hidden="true"></span><div class="rp-grow">${escapeHtml(t("rpLb_suppRefus", r.n, rpNomR(e)))}`
      + (vu ? `<ul>${qui.slice(0, 20).map((x) => `<li>${escapeHtml(`${rpNom(x)} · ${x.marketplace}`)}</li>`).join("")}${qui.length > 20 ? `<li>…</li>` : ""}${qui.length < r.n ? `<li class="rp-fnt">${escapeHtml(t("rpLb_horsListe", r.n - qui.length))}</li>` : ""}</ul>` : "")
      + `</div><button type="button" class="rp-lnk" data-rb-voir="${escapeHtml(e.id)}" aria-expanded="${vu}">${escapeHtml(t("rpLb_voirN", r.n))}</button></div>`;
  }
  if (r?.type === "ko") h += `<div class="rb-msg er" role="alert"><span class="rp-err" aria-hidden="true"></span><div class="rp-grow">${escapeHtml(r.text)}</div></div>`;
  return h;
}
function rpBibHtml(d, o = {}) {
  const ban = `<div class="rb-simban" role="note">${rpIc("info")}<span><b>${escapeHtml(t("rpLb_simT"))}</b> ${escapeHtml(t("rpLb_simD"))}</span><span class="rp-grow"></span>`
    + `<span class="rb-ord">${escapeHtml(t("rpLb_ordre"))} <b>${escapeHtml(t("rpLb_o1"))}</b> › <b>${escapeHtml(t("rpLb_o2"))}</b> › <b>${escapeHtml(t("rpLb_o3"))}</b></span></div>`;
  const err = d?.reglesErreur ?? null, off = !!err;
  const offA = off ? ` disabled title="${escapeHtml(t("rpLb_offT"))}"` : o.busy ? " disabled" : "";
  const head = (sub) => `<div class="rb-ch"><h2 id="rbTitre">${escapeHtml(t("rpLb_titre"))}</h2><span class="rb-sub">${escapeHtml(sub)}</span><span class="rp-grow"></span>`
    + `<button type="button" class="rb-btn line" data-rb-defs aria-expanded="${!!o.defs}">${rpIc("info")}<span>${escapeHtml(t("rpLb_defs"))}</span></button>`
    + `<button type="button" class="rb-btn line" data-rb-aff${offA}>${rpIc("sel")}<span>${escapeHtml(t("rpLb_affecter"))}</span></button>`
    + `<button type="button" class="rb-btn pri" data-rb-new${offA}>${rpIc("plus")}<span>${escapeHtml(t("rpLb_nouvelle"))}</span></button></div>`;
  const defs = o.defs ? `<div class="rb-help" role="note"><div class="rb-hh">${rpIc("info")}${escapeHtml(t("rpEd_defH"))}</div><dl>`
    + `<dt>${escapeHtml(t("rpLb_c_profit"))}</dt><dd><span class="rb-fx">${escapeHtml(t("rpEd_dBen"))}</span></dd><dt>${escapeHtml(t("rpLb_c_marge"))}</dt><dd><span class="rb-fx">${escapeHtml(t("rpEd_dMarge"))}</span></dd>`
    + `<dt>${escapeHtml(t("rpLb_c_roi"))}</dt><dd><span class="rb-fx">${escapeHtml(t("rpEd_dRoi"))}</span></dd></dl></div>` : "";
  const cols = `<div class="rb-rl rb-hd" aria-hidden="true"><span>${escapeHtml(t("rpLb_thRegle"))}</span><span>${escapeHtml(t("rpLb_thBar"))}</span><span class="rb-ecart">${escapeHtml(t("rpLb_thEcart"))}</span>`
    + `<span>${escapeHtml(t("rpLb_thAff"))}</span><span>${escapeHtml(t("rpLb_thPays"))}</span><span class="rb-r">${escapeHtml(t("rpLb_thActs"))}</span></div>`;
  if (!d) {
    const sk = (w) => `<span class="rb-sk" style="width:${w}"></span>`;
    const row = `<div class="rb-rl rb-skel"><div>${sk("60%")}${sk("35%")}</div><div>${sk("85%")}${sk("40%")}</div><span class="rb-ecart">${sk("50%")}</span><div>${sk("40%")}${sk("70%")}</div><div>${sk("75%")}</div><div>${sk("100%")}</div></div>`;
    return ban + `<div class="rb-card" aria-busy="true">${head(t("rpLb_lecture"))}${cols}${row}${row}${row}<p class="rb-wait" role="status">${escapeHtml(t("rpLb_lecture"))}</p></div>`;
  }
  if (err) {
    const dis = (ic, k) => `<button type="button" class="rb-btn line" disabled title="${escapeHtml(t("rpLb_offT"))}">${rpIc(ic)}<span>${escapeHtml(t(k))}</span></button>`;
    return ban + `<div class="rb-card">${head("")}<div class="rb-full rb-one"><div class="rb-errbox"><span class="rb-eic" aria-hidden="true">×</span><div>`
      + `<h3>${escapeHtml(t("rpLb_errT"))}</h3><p>${escapeHtml(t("rpLb_errD"))}</p><p>${escapeHtml(t("rpLb_errD2", d.freshness?.lastSuccessAt ? rpQuand(d.freshness.lastSuccessAt) : t("rpLb_dateInc")))}</p>`
      + `<div class="rb-acts rb-left"><button type="button" class="rb-btn pri" data-rb-reload>${rpIc("retry")}<span>${escapeHtml(t("rpLb_reessayer"))}</span></button>`
      + `<button type="button" class="rb-btn line" data-rb-journal>${escapeHtml(t("rpLb_voirJournal"))}</button></div>`
      + `<div class="rb-lockw"><div class="rb-lt">${rpIc("lock")}<span><b>${escapeHtml(t("rpLb_lockT"))}</b> ${escapeHtml(t("rpLb_lockD"))}</span></div>`
      + `<div class="rb-acts rb-left rb-wrap">${dis("plus", "rpLb_nouvelle")}${dis("edit", "rpLb_modifier")}${dis("copy", "rpLb_dupliquer")}${dis("apply", "rpLb_appliquer")}${dis("sel", "rpLb_affecter")}</div></div>`
      + `<div class="rb-tech">${escapeHtml(t("rpLb_detail"))} <code>${escapeHtml(err)}</code></div></div></div></div></div>`;
  }
  const rows = d.rows || [], devise = rpDevise(rows), lib = d.bibliotheque || [];
  const actives = lib.filter((e) => !e.archiveeLe), archivees = lib.filter((e) => e.archiveeLe);
  const nCompte = rows.filter((r) => r.regle?.source === "defaut").length;
  const compte = rpCompteLigneHtml(d.regleDefaut ?? null, nCompte, devise, d.regleDefautVersion ?? null);
  let corps;
  if (!actives.length) {
    const tpl = (m) => `<div class="rb-tpl"><span class="rb-t">${escapeHtml(t("rpLb_n_" + m))}<span class="rb-tag${m === "destockage" ? " dst" : ""}">${escapeHtml(t("rpLb_s_" + m))}</span></span>`
      + `${rpBarsHtml(RP_MODELES[m], devise)}<button type="button" class="rb-btn line" data-rb-tpl="${m}"${offA}>${rpIc("plus")}<span>${escapeHtml(t("rpLb_partir"))}</span></button></div>`;
    const np = new Set(rows.map((r) => r.marketplace)).size;
    corps = `<div class="rb-full"><div><h3>${escapeHtml(t("rpLb_videT"))}</h3><p>${escapeHtml(d.regleDefaut ? t("rpLb_videD", rows.length, np) : t("rpLb_compteAbs"))}</p><p>${escapeHtml(t("rpLb_videD2"))}</p>`
      + `<div class="rb-acts rb-left"><button type="button" class="rb-btn pri" data-rb-new${offA}>${rpIc("plus")}<span>${escapeHtml(t("rpLb_nouvelle"))}</span></button></div></div>`
      + `<div class="rb-tpls">${["prudent", "equilibre", "offensif", "destockage"].map(tpl).join("")}</div></div>`;
  } else {
    corps = actives.map((e) => rpRegleLigneHtml(e, { devise, menu: o.menu, busy: o.busy, sel: o.pend?.id === e.id, apres: rpRegleMsgHtml(e, { ...o, rows }) })).join("");
  }
  const arch = archivees.length ? `<details class="rb-arch"${o.arch ? " open" : ""}><summary>${escapeHtml(t("rpLb_arch", archivees.length))} · <b>${escapeHtml(archivees.map((e) => rpNomR(e)).join(", "))}</b> · ${escapeHtml(t("rpLb_archD"))}</summary>`
    + archivees.map((e) => `<div class="rb-archl"><span><b>${escapeHtml(rpNomR(e))}</b> <span class="rp-fnt">v${escapeHtml(String(e.version))} · ${escapeHtml(rpJm(e.archiveeLe))}</span></span>${rpBarsHtml(e.regle, devise)}`
      + `<button type="button" class="rb-btn line" data-rb-rest="${escapeHtml(e.id)}"${offA}>${rpIc("retry")}<span>${escapeHtml(t("rpLb_restaurer"))}</span></button></div>`).join("") + `</details>` : "";
  return ban + `<section class="rb-card" aria-labelledby="rbTitre">${head(t("rpLb_sous"))}${defs}${cols}${compte}${corps}${arch}</section>`;
}
function rpVBarHtml(p, o = {}) {
  if (!p) return "";
  const msg = o.msg ? `<span class="${o.msg.ko ? "rp-ko" : "rp-mut"}" role="status">${escapeHtml(o.msg.text)}</span>` : "";
  return `<div class="rb-vbar" role="region" aria-label="${escapeHtml(t("rpLb_vbT"))}"><div class="rb-vbt">${escapeHtml(t("rpLb_vbT"))}</div><div class="rb-vbr">`
    + `<span class="rb-vbb"><button type="button" class="rp-btn2" data-rb-vcancel${o.busy ? " disabled" : ""}>${escapeHtml(t("rpLb_annuler"))}</button>`
    + `<button type="button" class="rp-go" data-rb-vok${o.busy ? " disabled" : ""}>${escapeHtml(t(o.busy ? "rpLb_enCours" : "rpLb_valider"))}</button></span>`
    + `<span class="rb-vbd"><b>${escapeHtml(p.titre)}</b>${p.detail ? `<br><span class="rp-fnt">${escapeHtml(p.detail)}</span>` : ""}<br><span class="rp-fnt">${escapeHtml(t("rpLb_vbSim"))}</span></span>${msg}</div></div>`;
}
function rpChampTxt(k, ch) {
  if (k === "pays") return ch.paysTous ? t("rpLb_tousPays") : (ch.pays || []).join(", ") || "—";
  if (k === "modele") return t("rpLb_s_" + ch.modele);
  if (k === "facon") return t(ch.facon ? "rpEd_fc_" + ch.facon : "rpLb_fClasser");
  if (k === "ecart") return rpEcartTxt(ch);
  if (k === "vf") return rpVfTxt(ch);
  if (k === "mode" || k === "modeMax") return t(ch[k] === "au_moins_un" ? "rpLb_ou" : "rpLb_et");
  if (k === "nom") return ch.nom || "—";
  const v = rpN(ch[k]);
  return v === "" ? "—" : `${ch[k]}${k.startsWith("profit") ? "" : " %"}`;
}
const RP_ED_CHAMPS = ["nom", "modele", "profitMin", "margeMin", "roiMin", "profitMax", "margeMax", "roiMax", "mode", "modeMax", "pays", "facon", "ecart", "vf"];
const rpChampEgal = (k, a, b) => (k === "ecart" ? rpCibleCle(a) === rpCibleCle(b) : k === "vf" ? rpVfCle(a) === rpVfCle(b) : k === "pays" ? (a.paysTous ? "tous" : [...(a.pays || [])].sort().join(",")) === (b.paysTous ? "tous" : [...(b.pays || [])].sort().join(","))
  : k === "nom" || k === "modele" || k === "facon" || k.startsWith("mode") ? String(a[k] ?? "").trim() === String(b[k] ?? "").trim() : rpN(a[k]) === rpN(b[k]));
function rpFusion(lu, saisie, trouve) {
  const ch = { ...saisie, pays: [...(saisie.pays || [])] }, lignes = [];
  for (const k of RP_ED_CHAMPS) {
    const s = !rpChampEgal(k, lu, saisie), tr = !rpChampEgal(k, lu, trouve);
    let origine = "idem";
    if (s && tr && !rpChampEgal(k, saisie, trouve)) origine = "deux";
    else if (s) origine = "saisie";
    else if (tr) { origine = "reprise"; if (k === "pays") { ch.paysTous = trouve.paysTous; ch.pays = [...(trouve.pays || [])]; } else if (k === "ecart") { for (const f of RP_EC_CHAMPS) ch[f] = trouve[f]; } else if (k === "vf") { for (const f of RP_VF_CHAMPS) ch[f] = trouve[f]; } else ch[k] = trouve[k]; }
    if (origine !== "idem") lignes.push({ k, lu: rpChampTxt(k, lu), saisie: rpChampTxt(k, saisie), trouve: rpChampTxt(k, trouve), res: rpChampTxt(k, ch), origine });
  }
  return { ch, lignes };
}
function rpEdChamps(e) {
  const pays = Array.isArray(e?.pays) ? e.pays : null;
  return { ...rpRegleChamps(e?.regle), ...rpEcartChamps(e?.regle?.concurrents), ...rpVfChamps(e?.regle?.vendeursFiche), nom: e ? rpNomR(e) : "", modele: e?.modele ?? "personnalise", paysTous: !pays, pays: pays ? [...pays] : [] };
}
function rpExemple(g, ex) {
  if (!ex || !g) return null;
  const L = [...(ex.d.lignes || [])].sort((a, b) => a.prix - b.prix), cout = ex.d.coutAchat?.valeur;
  if (!L.length || !(cout > 0)) return null;
  const ok = L.filter((l) => rpPermis(l, cout, g) === true);
  return { nom: ex.nom, mp: ex.mp, cout, devise: ex.d.devise || null, des: ok.length ? ok[0].prix : null, jusqua: ok.length && L.some((l) => l.prix > ok[ok.length - 1].prix && rpPermis(l, cout, g) === false) ? ok[ok.length - 1].prix : null, aucun: !ok.length };
}
function rpEdExHtml(v, ex) {
  const nomC = (c) => t("rpEd_f_" + c);
  if (v.erreur === "maxi") {
    const g = {};
    for (const f of RP_RF) { const s = rpN(v.ch[f]); g[f] = s === "" || !Number.isFinite(Number(s)) ? null : Number(s); }
    g.mode = v.ch.mode; g.modeMax = v.ch.modeMax;
    const B = rpBornes(g), txt = B.conflits.map((c) => { const x = RP_CRIT.find((y) => y[0] === c); return `${nomC(x[1])} ${v.ch[x[1]]}${c === "profit" ? "" : " %"} · ${nomC(x[2])} ${v.ch[x[2]]}${c === "profit" ? "" : " %"}`; }).join(" ; ");
    return `<div class="rb-ex bad" role="alert" data-rb-dyn="ex"><span class="rp-simtag">${escapeHtml(t("rpSim"))}</span><span class="rp-err" aria-hidden="true"></span><div class="rp-grow">`
      + `<b>${escapeHtml(t(B.vide ? "rpEd_vide" : "rpEd_contra"))}</b> ${escapeHtml(t(B.vide ? "rpEd_videD" : "rpEd_contraD", txt))}</div></div>`;
  }
  if (v.erreur && !(["facon", "ecartManque", "ecart", "asin", "vf"].includes(v.erreur) && v.regle)) return `<div class="rb-ex" data-rb-dyn="ex"><span class="rp-simtag">${escapeHtml(t("rpSim"))}</span><span class="rp-mut">${escapeHtml(t("rpEd_e_" + v.erreur))}</span></div>`;
  const x = rpExemple(v.regle, ex);
  if (!x) return `<div class="rb-ex" data-rb-dyn="ex"><span class="rp-simtag">${escapeHtml(t("rpSim"))}</span><span class="rp-mut">${escapeHtml(t("rpEd_exNone"))}</span><span class="rp-grow"></span><span class="rb-okb">${rpIc("check")}${escapeHtml(t("rpEd_ok"))}</span></div>`;
  const tete = `<span class="rp-simtag">${escapeHtml(t("rpSim"))}</span><span>${escapeHtml(x.nom)} · ${rpDrapeau(x.mp)} · ${escapeHtml(t("rpEd_exCout"))} ${escapeHtml(rpM(x.cout, x.devise))}</span><span class="rp-grow"></span>`;
  if (x.aucun) return `<div class="rb-ex warn" data-rb-dyn="ex">${tete}<span class="rp-unk">${escapeHtml(t("rpEd_exAucun"))}</span></div>`;
  return `<div class="rb-ex" data-rb-dyn="ex">${tete}<span class="rp-fnt">${escapeHtml(t("rpEd_exDes"))}</span><span class="rb-v">${escapeHtml(rpM(x.des, x.devise))}</span>`
    + `<span class="rp-fnt">${escapeHtml(x.jusqua != null ? t("rpEd_exJusq", rpM(x.jusqua, x.devise)) : t("rpEd_exSans"))}</span><span class="rb-okb">${rpIc("check")}${escapeHtml(t("rpEd_ok"))}</span></div>`;
}
function rpEdValider(ed) {
  const ch = ed.ch, v = rpRegleDe(ch);
  if (ed.cfl && ed.cfl.lignes.some((l) => l.origine === "deux" && !ed.cfl.choix?.[l.k])) return { erreur: "choix", ch, regle: v.regle };
  if (v.erreur) return { erreur: v.erreur, ch, regle: v.regle };
  if (ed.mode !== "propre") {
    if (!String(ch.nom || "").trim() || String(ch.nom).trim().length > 80) return { erreur: "nom", ch, regle: v.regle };
    if (!ch.paysTous && !(ch.pays || []).length) return { erreur: "pays", ch, regle: v.regle };
  }
  const mq = rpEdManque(ch);
  if (mq) return { erreur: mq, ch, regle: v.regle };
  return { regle: v.regle, ch };
}
function rpEdPiedHtml(ed, v, aere = false) {
  const bloque = v.erreur === "maxi", inerte = bloque || !!v.erreur || ed.busy, mq = bloque ? null : rpEdManque(ed.ch);
  const lbl = ed.busy ? t("rpEd_busy") : aere ? t("rpEd_enr") : ed.mode === "propre" ? t("rpEd_saveProp") : ed.id ? t("rpEd_saveV", (ed.cfl ? ed.cfl.actuelle.version : ed.versionLue) + 1) : t("rpEd_saveNew");
  const note = bloque ? `<span class="rb-note bad">${escapeHtml(t("rpEd_saveImp"))}</span>`
    : mq ? `<span class="rb-note" id="rbSaveWhy">${escapeHtml(t(mq === "facon" ? "rpEd_mq_facon" : "rpEd_mq_ecart"))}</span>`
    : v.erreur && v.erreur !== "maxi" && (ed.tente || v.erreur === "choix") ? `<span class="rb-note bad" role="alert">${escapeHtml(t("rpEd_e_" + v.erreur))}</span>`
    : ed.ko ? `<span class="rb-note bad" role="alert">${escapeHtml(ed.ko)}</span>` : `<span class="rb-note">${escapeHtml(t("rpEd_note"))}</span>`;
  const save = bloque ? `<button type="button" class="rb-btn dis" data-rb-save aria-disabled="true" title="${escapeHtml(t("rpEd_saveImpT"))}">${rpIc("lock")}<span>${escapeHtml(lbl)}</span></button>`
    : mq ? `<button type="button" class="rb-btn dis rb-mq" data-rb-save aria-disabled="true" aria-describedby="rbSaveWhy">${escapeHtml(lbl)}</button>`
    : `<button type="button" class="rb-btn pri" data-rb-save${inerte && ed.busy ? " disabled" : ""}>${escapeHtml(lbl)}</button>`;
  if (aere) return `<div class="rb-resp" data-rb-dyn="pied"><div class="rb-resac">${save}<button type="button" class="rb-btn line" data-rb-close>${escapeHtml(t("rpEd_annuler"))}</button></div>${note}</div>`;
  return `<div class="rb-df" data-rb-dyn="pied">${note}<span class="rp-grow"></span><button type="button" class="rb-btn line" data-rb-close>${escapeHtml(t("rpEd_annuler"))}</button>${save}</div>`;
}
function rpEcartTxt(ch) {
  const c = rpCibleDe(ch || {});
  if (!c.valeur) return "—";
  const e = c.valeur.ecart, choix = ch.ecartChoix;
  const ec = choix !== "autre" ? t("rpEd_ec_" + choix) : `${rpNum(Math.abs(e))} ${c.valeur.unite === "pct" ? "%" : t("rpEd_devPays")} ${t(e > 0 ? "rpEd_ecS_plus" : "rpEd_ecS_moins")}`;
  return `${ec} · ${c.valeur.cible === "choisi" ? t("rpEd_ecR_choisi", c.valeur.asin) : t("rpEd_ecC_" + c.valeur.cible)}`;
}
function rpEcartPhrase(c, devise) {
  if (!c) return t("rpEd_ecPh_aucun");
  const ref = c.cible === "choisi" ? t("rpEd_ecR_choisi", c.asin) : t("rpEd_ecR_" + c.cible), a = Math.abs(c.ecart);
  const v = c.unite === "pct" ? `${rpNum(a)} %` : devise ? rpM(a, devise) : `${rpNum(a)} ${t("rpEd_devPays")}`;
  return c.ecart < 0 ? t("rpEd_ecPh_moins", v, ref) : c.ecart > 0 ? t("rpEd_ecPh_plus", v, ref) : t("rpEd_ecPh_egal", ref);
}
function rpBenInterp(lignes, p) {
  const L = (lignes || []).filter((l) => typeof l.prix === "number" && typeof l.beneficeAvantPub === "number").sort((a, b) => a.prix - b.prix);
  for (let i = 0; i < L.length; i++) {
    if (L[i].prix === p) return L[i].beneficeAvantPub;
    if (i > 0 && L[i - 1].prix < p && p < L[i].prix) { const a = L[i - 1], b = L[i]; return Math.round((a.beneficeAvantPub + ((p - a.prix) / (b.prix - a.prix)) * (b.beneficeAvantPub - a.beneficeAvantPub)) * 100) / 100; }
  }
  return null;
}
function rpEcExemple(c, ex, g, now = Date.now()) {
  if (!c || !ex?.d || !g) return null;
  const comp = (Array.isArray(ex.d.concurrents) ? ex.d.concurrents : []).filter((x) => x && x.format?.comparable === true);
  const L = comp.map((x) => {
    const q = x.prix, n = x.format?.rapport, at = Date.parse(q?.a ?? "");
    const frais = typeof q?.prix === "number" && Number.isFinite(at) && now - at <= RP_FRAICHEUR_PRIX_CONCURRENT_H * 3600e3 && !(x.dernier && typeof x.dernier.prix !== "number");
    return frais ? { asin: x.asin, nom: x.titre ? rpNomCourt(x.titre, 32) : x.asin, prix: typeof n === "number" && n > 1 ? Math.round((q.prix / n) * 100) / 100 : q.prix } : null;
  }).filter(Boolean);
  let ref;
  if (c.cible === "moins_cher") { if (!L.length) return null; ref = { ...L.reduce((a, b) => (b.prix < a.prix ? b : a)), n: L.length }; }
  else if (c.cible === "mediane") {
    if (L.length < 2 || L.length * 2 < comp.length) return null;
    const s = L.map((x) => x.prix).sort((a, b) => a - b), m = s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
    ref = { nom: null, prix: Math.round(m * 100) / 100, n: L.length };
  } else { ref = L.find((x) => x.asin === c.asin); if (!ref) return null; }
  const brut = c.unite === "pct" ? ref.prix * (1 + c.ecart / 100) : ref.prix + c.ecart;
  const cts = c.ecart < 0 ? Math.floor(brut * 100 + 1e-6) : c.ecart > 0 ? Math.ceil(brut * 100 - 1e-6) : Math.round(brut * 100);
  const x = rpExemple(g, ex);
  if (!x || x.aucun || x.des == null) return null;
  let p = cts / 100;
  if (p < x.des) p = x.des;
  if (x.jusqua != null && p > x.jusqua) p = x.jusqua;
  return { nom: ex.nom, mp: ex.mp, devise: ex.d.devise || null, ref, conseille: p, plancher: x.des, ctb: rpBenInterp(ex.d.lignes, p) };
}
function rpEcartApercuHtml(ch, ctx) {
  const c = rpCibleDe(ch), g = rpRegleDe({ ...ch, facon: "" }).regle;
  const v = c.valeur || null, x = v ? rpEcExemple(v, ctx.ecEx, g) : null;
  const plD = g && g.profitMin != null && g.margeMin == null && g.roiMin == null && x ? t("rpEd_ecExPlC", rpM(g.profitMin, x.devise)) : t("rpEd_ecExPlD");
  const m = (n) => escapeHtml(rpM(n, x.devise));
  const refK = v && v.cible === "mediane" ? t("rpEd_ecExMed") : x ? escapeHtml(x.ref.nom || "") : "";
  const refD = !x ? "" : v.cible === "moins_cher" ? t("rpEd_ecExMoins", x.ref.n) : v.cible === "mediane" ? t("rpEd_ecExMedD", x.ref.n) : t("rpEd_ecExChoisi");
  const ex = !v ? "" : !x ? `<p class="rb-hint">${escapeHtml(t("rpEd_ecExNone"))}</p>`
    : `<div class="rb-ecex"><p class="rb-ecext">${escapeHtml(t("rpEd_ecEx", x.nom))} ${rpDrapeau(x.mp)}</p><dl class="rb-ecdl">`
      + `<dt>${v.cible === "mediane" ? escapeHtml(refK) : refK}<small>${escapeHtml(refD)}</small></dt><dd>${m(x.ref.prix)}</dd>`
      + `<dt>${escapeHtml(t("rpEd_ecExCons"))}</dt><dd class="rb-ecv">${m(x.conseille)}</dd>`
      + (x.ctb != null ? `<dt>${escapeHtml(t("rpEd_ecExCtb"))}<small>${escapeHtml(t("rpEd_ecExCtbD"))}</small></dt><dd>≈ ${m(x.ctb)}</dd>` : "")
      + `<dt>${escapeHtml(t("rpEd_ecExPl"))}<small>${escapeHtml(plD)}</small></dt><dd>${m(x.plancher)}</dd></dl></div>`;
  return `<div data-rb-dyn="ecx"><p class="rb-ecph">${escapeHtml(rpEcartPhrase(v, ctx.devise || null))}</p>${ex}</div>`;
}
function rpEcartHtml(ch, ctx, cur) {
  const ok = `<svg class="rb-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
  const sg = (x) => `<label class="rb-sg${ch.ecartChoix === x ? " on" : ""}"><input type="radio" name="ecartChoix" value="${x}" data-rb-f="ecartChoix"${ch.ecartChoix === x ? " checked" : ""}><span>${escapeHtml(t("rpEd_ec_" + x))}</span>${ok}</label>`;
  const o = (v, lbl, cur0) => `<option value="${v}"${v === cur0 ? " selected" : ""}>${escapeHtml(lbl)}</option>`;
  const c = rpCibleDe(ch), bad = (k) => (c.erreur === k ? " bad" : "");
  const autre = ch.ecartChoix === "autre" ? `<div class="rb-ecx"><div class="rb-inp${bad("ecart")}"><input id="rbF_ecartVal" type="text" inputmode="decimal" autocomplete="off" data-rb-f="ecartVal" value="${escapeHtml(ch.ecartVal || "")}" aria-label="${escapeHtml(t("rpEd_ecVal"))}"${c.erreur === "ecart" ? ' aria-invalid="true"' : ""}></div>`
    + `<select class="rb-sel" data-rb-f="ecartUnite" aria-label="${escapeHtml(t("rpEd_ecU"))}">${o("pct", "%", ch.ecartUnite)}${o("eur", cur, ch.ecartUnite)}</select>`
    + `<select class="rb-sel" data-rb-f="ecartSens" aria-label="${escapeHtml(t("rpEd_ecS"))}">${o("moins", t("rpEd_ecS_moins"), ch.ecartSens)}${o("plus", t("rpEd_ecS_plus"), ch.ecartSens)}</select></div>` : "";
  const co = Array.isArray(ctx.coChoix) && ctx.coChoix.length ? ctx.coChoix : null;
  const asinSel = co ? `<select id="rbF_cibleAsin" class="rb-sel" data-rb-f="cibleAsin">${o("", t("rpEd_ecCoChoisir"), ch.cibleAsin || "")}`
    + `${co.map((x) => o(x.asin, `${x.nom} · ${x.asin}`, ch.cibleAsin || "")).join("")}${ch.cibleAsin && !co.some((x) => x.asin === ch.cibleAsin) ? o(ch.cibleAsin, t("rpEd_ecCoHors", ch.cibleAsin), ch.cibleAsin) : ""}</select>` : "";
  const asin = ch.cible === "choisi" ? `<div class="rb-ecx"><label class="rb-lbl" for="rbF_cibleAsin">${escapeHtml(t("rpEd_ecAsin"))}</label>${asinSel || `<div class="rb-inp${bad("asin")}"><input id="rbF_cibleAsin" type="text" maxlength="10" autocomplete="off" spellcheck="false" data-rb-f="cibleAsin" value="${escapeHtml(ch.cibleAsin || "")}"${c.erreur === "asin" ? ' aria-invalid="true"' : ""}></div>`}</div>` : "";
  const err = `<div data-rb-dyn="ecerr">${c.erreur ? `<p class="rb-note bad" role="alert">${escapeHtml(t("rpEd_e_" + c.erreur))}</p>` : ""}</div>`;
  return `<section class="rb-q rb-ecq" id="rbS_ecart" aria-labelledby="rbS_ecart-h"><h3 id="rbS_ecart-h">${escapeHtml(t("rpEd_ec"))}</h3>`
    + `<div class="rb-ecl"><div class="rb-seg" role="radiogroup" aria-labelledby="rbS_ecart-h">${RP_EC_CHOIX.map(sg).join("")}</div><span class="rb-que" aria-hidden="true">${escapeHtml(t("rpEd_ecQue"))}</span>`
    + `<select id="rbF_cible" class="rb-sel rb-cib" data-rb-f="cible" aria-label="${escapeHtml(t("rpEd_ecRef"))}">${RP_CIBLES.map((x) => o(x, t("rpEd_ecC_" + x), ch.cible)).join("")}</select></div>`
    + autre + asin + err + `<p class="rb-hint rb-ech">${escapeHtml(t("rpEd_ecH"))}</p></section>`;
}
function rpVfTxt(ch) {
  const c = rpVfDe(ch || {});
  if (!c.valeur) return "—";
  const e = c.valeur.ecart, ec = ch.vfChoix === "0" ? t("rpEd_ec_0") : ch.vfChoix === "m001" ? t("rpEd_vf_m001", t("rpEd_devPays"))
    : `${rpNum(Math.abs(e))} ${c.valeur.unite === "pct" ? "%" : t("rpEd_devPays")} ${t(e > 0 ? "rpEd_ecS_plus" : "rpEd_ecS_moins")}`;
  return `${ec} · ${t("rpEd_vfRef")} · ${t("rpEd_vfExp_" + (c.valeur.expedition === "amazon" ? "amazon" : "tous"))}`;
}
function rpVfHtml(ch, cur) {
  const ok = `<svg class="rb-ok" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;
  const lbl = (x) => (x === "0" ? t("rpEd_ec_0") : x === "m001" ? t("rpEd_vf_m001", cur) : t("rpEd_ec_autre"));
  const sg = (x) => `<label class="rb-sg${ch.vfChoix === x ? " on" : ""}"><input type="radio" name="vfChoix" value="${x}" data-rb-f="vfChoix"${ch.vfChoix === x ? " checked" : ""}><span>${escapeHtml(lbl(x))}</span>${ok}</label>`;
  const o = (v, l, cur0) => `<option value="${v}"${v === cur0 ? " selected" : ""}>${escapeHtml(l)}</option>`;
  const c = rpVfDe(ch);
  const autre = ch.vfChoix === "autre" ? `<div class="rb-ecx"><div class="rb-inp${c.erreur ? " bad" : ""}"><input id="rbF_vfVal" type="text" inputmode="decimal" autocomplete="off" data-rb-f="vfVal" value="${escapeHtml(ch.vfVal || "")}" aria-label="${escapeHtml(t("rpEd_ecVal"))}"${c.erreur ? ' aria-invalid="true"' : ""}></div>`
    + `<select class="rb-sel" data-rb-f="vfUnite" aria-label="${escapeHtml(t("rpEd_ecU"))}">${o("eur", cur, ch.vfUnite)}${o("pct", "%", ch.vfUnite)}</select>`
    + `<select class="rb-sel" data-rb-f="vfSens" aria-label="${escapeHtml(t("rpEd_ecS"))}">${o("moins", t("rpEd_ecS_moins"), ch.vfSens)}${o("plus", t("rpEd_ecS_plus"), ch.vfSens)}</select></div>` : "";
  const err = `<div data-rb-dyn="vferr">${c.erreur ? `<p class="rb-note bad" role="alert">${escapeHtml(t("rpEd_e_vf"))}</p>` : ""}</div>`;
  return `<section class="rb-q rb-ecq" id="rbS_vf" aria-labelledby="rbS_vf-h"><h3 id="rbS_vf-h">${escapeHtml(t("rpEd_ec"))}</h3>`
    + `<div class="rb-ecl"><div class="rb-seg" role="radiogroup" aria-labelledby="rbS_vf-h">${RP_VF_CHOIX.map(sg).join("")}</div><span class="rb-que" aria-hidden="true">${escapeHtml(t("rpEd_ecQue"))}</span>`
    + `<select id="rbF_vfRef" class="rb-sel rb-cib" aria-label="${escapeHtml(t("rpEd_ecRef"))}">${o("offre_vedette", t("rpEd_vfRef"), "offre_vedette")}`
    + ["foep", "bas"].map((x) => `<option value="" disabled>${escapeHtml(`${t("rpEd_vfRef_" + x)} · ${t("rpRf_mBientot")}`)}</option>`).join("") + `</select></div>`
    + autre + err + `<p class="rb-hint rb-ech">${escapeHtml(t("rpEd_vfH"))}</p></section>`;
}
function rpVfVendeursHtml(ch, radio) {
  const a = ch.vfExp === "amazon";
  return `<fieldset class="rb-fs"><legend class="rb-sr">${escapeHtml(t("rpEd_vfPl"))}</legend><div class="rb-mode rb-mb">${radio("vfExp", "tous", !a, t("rpEd_vfExp_tous"), t("rpEd_vfExpD_tous"))}`
    + `${radio("vfExp", "amazon", a, t("rpEd_vfExp_amazon"), t("rpEd_vfExpD_amazon"))}</div></fieldset><p class="rb-hint">${escapeHtml(t("rpEd_vfExpH"))}</p>`;
}
function rpVfApercuHtml(ch, ctx) {
  const c = rpVfDe(ch), v = c.valeur || null;
  let ph = t("rpEd_vfPh_aucun");
  if (v) {
    const a = Math.abs(v.ecart), ref = t("rpEd_vfRef");
    const m = v.unite === "pct" ? `${rpNum(a)} %` : ctx.devise ? rpM(a, ctx.devise) : `${rpNum(a)} ${t("rpEd_devPays")}`;
    ph = v.ecart < 0 ? t("rpEd_ecPh_moins", m, ref) : v.ecart > 0 ? t("rpEd_ecPh_plus", m, ref) : t("rpEd_ecPh_egal", ref);
  }
  let ex = "";
  if (v) {
    const VED = 33.5, PL = 31.2, brut = Math.round((v.unite === "pct" ? VED * (1 + v.ecart / 100) : VED + v.ecart) * 100) / 100, garde = brut < PL;
    ex = `<div class="rb-ecex"><p class="rb-ecext">${escapeHtml(t("rpEd_exT"))}</p><dl class="rb-ecdl">`
      + `<dt>${escapeHtml(t("rpEd_exVed"))}</dt><dd>${escapeHtml(rpM(VED, "EUR"))}</dd>`
      + `<dt>${escapeHtml(t("rpEd_ecExCons"))}${garde ? `<small>${escapeHtml(t("rpEd_exGarde"))}</small>` : ""}</dt><dd class="rb-ecv">${escapeHtml(rpM(garde ? PL : brut, "EUR"))}</dd>`
      + `<dt>${escapeHtml(t("rpEd_exPl"))}</dt><dd>${escapeHtml(rpM(PL, "EUR"))}</dd></dl></div>`;
  }
  return `<div data-rb-dyn="ecx"><p class="rb-ecph">${escapeHtml(ph)}</p>${ex}</div>`;
}
function rpLimResume(ch, devise) {
  const m = (k, pct) => { const s = rpN(ch[k]); if (s === "") return null; const n = Number(s); return pct ? `${ch[k]} %` : Number.isFinite(n) && devise ? rpM(n, devise) : `${ch[k]} ${devise ? rpSym(devise) : t("rpEd_devPays")}`; };
  const out = RP_CRIT.map(([c, a, b]) => { const lo = m(a, c !== "profit"), hi = m(b, c !== "profit");
    return lo || hi ? `${t("rpEd_plv_" + c)} ${[lo ? t("rpEd_plv_mini", lo) : null, hi ? t("rpEd_plv_maxi", hi) : null].filter(Boolean).join(" · ")}` : null; }).filter(Boolean);
  return out.join(" · ") || t("rpEd_plv_aucune");
}
function rpFcIndice(ch, fcLu) {
  if (!ch.facon) return "rpEd_fcAClasser";
  if (ch.facon === "concurrents") return fcLu ? "rpEd_fcSpOk" : "rpEd_fcSpNonEnr";
  if (rpVfDe(ch).valeur) return fcLu ? "rpEd_fcRfOk" : "rpEd_fcRfNonEnr";
  return fcLu ? "rpEd_fcInactif" : "rpEd_fcNonEnr";
}
function rpPliHtml(ed, id, lbl, resume, corps, force) {
  if (force) ed.plis = { ...ed.plis, [id]: true };
  const o = !!ed.plis?.[id];
  return `<div class="rb-pli${o ? " on" : ""}"><button type="button" class="rb-pl" data-rb-pli="${id}" aria-expanded="${o}" aria-controls="rbP_${id}"><span class="rb-plk">${escapeHtml(lbl)}</span>`
    + `<span class="rb-plv" data-rb-dyn="plv_${id}">${escapeHtml(resume)}</span>${rpChev()}</button><div class="rb-plc" id="rbP_${id}"${o ? "" : " hidden"}>${corps}</div></div>`;
}
function rpEditeurAereHtml(ed, ctx, { v, cfl, cur, help, barCorps, facon, aClasser, radio }) {
  const ch = ed.ch, propre = ed.mode === "propre", cflK = new Set((ed.cfl?.lignes || []).map((l) => l.k));
  const vf = ch.facon === "vendeurs_fiche";
  const vLue = ed.cfl ? ed.cfl.actuelle.version : ed.versionLue;
  const meta = propre ? (ed.versionLue ? t("rpEd_metaProp", ed.versionLue) : t("rpEd_metaNew")) : ed.id ? t("rpEd_metaMod", ctx.nomLu || ch.nom, ed.versionLue, rpJm(ctx.modifieLe)) : t("rpEd_metaNew");
  const info = propre ? meta : ed.id ? `${meta} · ${t("rpEd_affN", ctx.affectes ?? 0)}. ${t("rpEd_hintMod", vLue + 1, ctx.affectes ?? 0)}` : t("rpEd_hintNew");
  const nomBad = v.erreur === "nom" && ed.tente;
  const nom = propre ? `<p class="rb-hint rb-qi" id="rbDlgM">${escapeHtml(info)}</p>`
    : `<div class="rb-q"><label class="rb-lbl rb-qn" for="rbF_nom">${escapeHtml(t("rpEd_nom"))}</label><div class="rb-inp rb-inpg${nomBad ? " bad" : ""}"><input id="rbF_nom" type="text" maxlength="80" autocomplete="off" required data-rb-f="nom" value="${escapeHtml(ch.nom)}"${nomBad ? ' aria-invalid="true"' : ""}></div>`
      + `<p class="rb-hint rb-qi" id="rbDlgM">${escapeHtml(info)}</p></div>`;
  const styles = propre ? "" : `<fieldset class="rb-fs rb-mt"><legend class="rb-lbl">${escapeHtml(t("rpEd_style"))}</legend><div class="rb-styles" role="radiogroup" aria-label="${escapeHtml(t("rpEd_style"))}">`
    + RP_STYLES.map((s) => `<label class="rb-sty${ch.modele === s ? " on" : ""}"><input type="radio" name="modele" value="${s}" data-rb-f="modele"${ch.modele === s ? " checked" : ""}>`
      + `${s === "prudent" ? `<span class="rb-rec">${escapeHtml(t("rpEd_rec"))}</span>` : ""}<b>${escapeHtml(t("rpLb_s_" + s))}</b><small>${escapeHtml(t("rpEd_sd_" + s))}</small></label>`).join("")
    + `</div><p class="rb-hint">${escapeHtml(t("rpEd_styleH"))}</p></fieldset>`;
  const errLim = ["champ", "grand", "vide", "maxi"].includes(v.erreur) || [...RP_RF, "mode", "modeMax", "modele"].some((k) => cflK.has(k));
  const pl = ctx.paysListe || [];
  const ck = (c) => { const on = ch.paysTous || ch.pays.includes(c);
    return `<label class="rb-ck${on ? " on" : ""}${ch.paysTous ? " dim" : ""}"><input type="checkbox" value="${escapeHtml(c)}" aria-label="${escapeHtml(rpPaysNom(c))}" data-rb-pays${on ? " checked" : ""}${ch.paysTous ? " disabled" : ""}><i aria-hidden="true"></i>${rpDrapeau(c, true)}</label>`; };
  const paysCorps = `<fieldset class="rb-fs"><legend class="rb-sr">${escapeHtml(t("rpEd_pays"))}</legend><div class="rb-mode rb-mb">${radio("paysTous", "1", ch.paysTous, t("rpEd_tousPays"), t("rpEd_tousPaysD"))}${radio("paysTous", "0", !ch.paysTous, t("rpEd_certains"), t("rpEd_certainsD"))}</div></fieldset>`
    + `<div class="rb-cks" role="group" aria-label="${escapeHtml(t("rpEd_certains"))}">${pl.map(ck).join("")}</div><p class="rb-hint">${escapeHtml(t("rpEd_paysH"))}</p>`;
  const paysRes = propre ? rpPaysNom(String(ed.k || "").split("|")[0]) : ch.paysTous ? t("rpLb_tousPays") : (ch.pays || []).map(rpPaysNom).join(", ") || "—";
  const plis = `<div class="rb-plis">`
    + (vf ? rpPliHtml(ed, "vendeurs", t("rpEd_vfPl"), t("rpEd_vfExp_" + (ch.vfExp === "amazon" ? "amazon" : "tous")), rpVfVendeursHtml(ch, radio), cflK.has("vf")) : "")
    + rpPliHtml(ed, "limites", t("rpEd_pl_lim"), rpLimResume(ch, ctx.devise || null), styles + barCorps, errLim)
    + rpPliHtml(ed, "contribution", t("rpEd_pl_ctb"), t("rpEd_plv_ctb"), help, false)
    + (propre ? "" : rpPliHtml(ed, "pays", t("rpEd_pl_pays"), paysRes, paysCorps, v.erreur === "pays" || cflK.has("pays")))
    + (aClasser ? "" : rpPliHtml(ed, "mode", t("rpEd_pl_mode"), `${t("rpEd_fc_" + ch.facon)} · ${t("rpEd_plv_mode_" + ch.facon)}`, facon, cflK.has("facon")))
    + `</div>`;
  const res = aClasser ? `<p class="rb-ecph">${escapeHtml(t("rpEd_clsRes"))}</p><p class="rb-ecext">${escapeHtml(t("rpEd_clsN", propre ? 1 : ctx.affectes ?? 0))}</p>` : vf ? rpVfApercuHtml(ch, ctx) : rpEcartApercuHtml(ch, ctx);
  const titre = propre ? t("rpEd_titreProp", ctx.qui || "") : ctx.nomLu || ch.nom || t("rpEd_titreNew");
  return `<section class="rb-dlg rb-page rb-aere" aria-labelledby="rbDlgT" aria-describedby="rbDlgM"><div class="rb-ah"><button type="button" class="rb-back" data-rb-close>‹ ${escapeHtml(t("rpTabRegles"))}</button>`
    + `<h2 id="rbDlgT">${escapeHtml(titre)}</h2></div>${cfl}<div class="rb-ed"><div class="rb-edm" data-rb-db>${nom}${aClasser ? facon : vf ? rpVfHtml(ch, cur) : rpEcartHtml(ch, ctx, cur)}${plis}</div>`
    + `<aside class="rb-res" aria-label="${escapeHtml(t("rpEd_resAria"))}">${res}${rpEdPiedHtml(ed, v, true)}</aside></div></section>`;
}
function rpEditeurHtml(ed, ctx = {}) {
  const ch = ed.ch, v = { ...rpEdValider(ed), ch }, propre = ed.mode === "propre";
  const inp = (f, u, lbl) => { const bad = v.erreur === "maxi" && RP_CRIT.some((x) => (x[1] === f || x[2] === f) && rpBornes(Object.fromEntries(RP_RF.map((k) => [k, rpN(ch[k]) === "" ? null : Number(rpN(ch[k]))]))).conflits.includes(x[0]));
    const orig = ed.cfl?.lignes.find((l) => l.k === f);
    return `<div><label class="rb-lbl" for="rbF_${f}">${escapeHtml(lbl)}${orig ? ` <span class="rb-orig ${orig.origine === "reprise" ? "theirs" : "mine"}">${escapeHtml(rpOrigTxt(orig.origine, ed))}</span>` : ""}</label>`
      + `<div class="rb-inp${bad ? " bad" : ""}${orig ? (orig.origine === "reprise" ? " v4" : " ch") : ""}"><input id="rbF_${f}" type="text" inputmode="decimal" autocomplete="off" data-rb-f="${f}" value="${escapeHtml(ch[f])}" placeholder="${escapeHtml(t("rpEd_aucun"))}"><span class="rb-u">${escapeHtml(u)}</span></div></div>`; };
  const radio = (name, val, on, b, s) => `<label class="rb-opt${on ? " on" : ""}"><input type="radio" name="${name}" value="${val}" data-rb-f="${name}"${on ? " checked" : ""}><i aria-hidden="true"></i><span><b>${escapeHtml(b)}</b><small>${escapeHtml(s)}</small></span></label>`;
  const cur = ctx.devise ? rpSym(ctx.devise) : t("rpEd_devPays");
  const sec = (id, ic, titre, corps, extra = "") => `<section class="rb-sec" id="${id}" aria-labelledby="${id}-h"><div class="rb-sh">${rpIc(ic)}<h3 id="${id}-h">${escapeHtml(titre)}</h3>${extra}</div>${corps}</section>`;
  const inchanges = ed.cfl ? RP_ED_CHAMPS.filter((k) => !ed.cfl.lignes.some((l) => l.k === k)) : [];
  const cfl = ed.cfl ? `<div class="rb-cfl" role="alert" tabindex="-1"><div class="rb-ct"><span class="rp-err" aria-hidden="true"></span><div><b>${escapeHtml(t("rpEd_cflT"))}</b>`
    + `<p>${escapeHtml(t("rpEd_cflD", ed.versionLue, ed.cfl.actuelle.version, rpJm(ed.cfl.actuelle.modifieLe)))}</p></div></div>`
    + `<div class="rb-tw"><table class="rb-ct2"><thead><tr><th>${escapeHtml(t("rpEd_cChamp"))}</th><th>${escapeHtml(t("rpEd_cLu", ed.versionLue))}</th><th>${escapeHtml(t("rpEd_cSaisie"))}</th>`
    + `<th>${escapeHtml(t("rpEd_cTrouve", ed.cfl.actuelle.version))}</th><th>${escapeHtml(t("rpEd_cRes", ed.cfl.actuelle.version + 1))}</th><th>${escapeHtml(t("rpEd_cOrig"))}</th></tr></thead><tbody>`
    + (ed.cfl.lignes.length ? ed.cfl.lignes.map((l) => `<tr><td>${escapeHtml(rpChampNom(l.k))}</td><td>${escapeHtml(l.lu)}</td><td class="${l.origine !== "reprise" ? "mine" : ""}">${escapeHtml(l.saisie)}</td>`
      + `<td class="${l.origine === "reprise" ? "theirs" : ""}">${escapeHtml(l.trouve)}</td><td>${l.origine === "deux" ? rpChoixHtml(l, ed) : `<b>${escapeHtml(l.res)}</b>`}</td>`
      + `<td><span class="rb-orig ${l.origine === "reprise" || (l.origine === "deux" && ed.cfl.choix?.[l.k] === "trouve") ? "theirs" : "mine"}">${escapeHtml(rpOrigTxt(l.origine, ed, l.k))}</span></td></tr>`).join("")
      : "") + (inchanges.length ? `<tr class="rb-inchr"><td colspan="5"><span class="rp-mut">${escapeHtml(inchanges.map(rpChampNom).join(", "))}</span> · ${escapeHtml(t("rpEd_inchanges"))}</td><td><span class="rp-fnt">${escapeHtml(t("rpEd_oIdentiques"))}</span></td></tr>` : "")
    + `</tbody></table></div>`
    + `<p class="rb-hint">${escapeHtml(t(ed.cfl.lignes.some((l) => l.origine === "deux") ? "rpEd_cflDeux" : "rpEd_cflAucunDeux"))}</p><div class="rb-acts rb-left"><button type="button" class="rb-btn line" data-rb-abandon>${escapeHtml(t("rpEd_abandon", ed.cfl.actuelle.version))}</button></div></div>` : "";
  const help = `<div class="rb-help" role="note"><div class="rb-hh">${rpIc("info")}${escapeHtml(t("rpEd_defH"))}</div><dl><dt>${escapeHtml(t("rpLb_c_profit"))}</dt><dd><span class="rb-fx">${escapeHtml(t("rpEd_dBen"))}</span></dd>`
    + `<dt>${escapeHtml(t("rpLb_c_marge"))}</dt><dd><span class="rb-fx">${escapeHtml(t("rpEd_dMarge"))}</span></dd><dt>${escapeHtml(t("rpLb_c_roi"))}</dt><dd><span class="rb-fx">${escapeHtml(t("rpEd_dRoi"))}</span></dd></dl></div>`;
  const nMax = ["margeMax", "profitMax", "roiMax"].filter((f) => rpN(ch[f]) !== "").length;
  const barCorps = `<div class="rb-g2 rb-mt"><div><div class="rb-colh">${escapeHtml(t("rpEd_mins"))}</div><div class="rb-col">${inp("profitMin", cur, t("rpEd_f_profitMin"))}${inp("margeMin", "%", t("rpEd_f_margeMin"))}${inp("roiMin", "%", t("rpEd_f_roiMin"))}</div></div>`
    + `<div><div class="rb-colh">${escapeHtml(t("rpEd_maxs"))}</div><div class="rb-col">${inp("profitMax", cur, t("rpEd_f_profitMax"))}${inp("margeMax", "%", t("rpEd_f_margeMax"))}${inp("roiMax", "%", t("rpEd_f_roiMax"))}</div></div></div>`
    + `<div class="rb-g2 rb-mt"><fieldset class="rb-fs"><legend class="rb-lbl">${escapeHtml(t("rpEd_modeMin"))}</legend><div class="rb-mode">${radio("mode", "tous", ch.mode !== "au_moins_un", t("rpLb_et"), t("rpEd_tousMin"))}${radio("mode", "au_moins_un", ch.mode === "au_moins_un", t("rpLb_ou"), t("rpEd_auMoins"))}</div></fieldset>`
    + `<fieldset class="rb-fs"><legend class="rb-lbl">${escapeHtml(t("rpEd_modeMax"))}</legend><div class="rb-mode">${radio("modeMax", "tous", ch.modeMax !== "au_moins_un", t("rpLb_et"), t("rpEd_tousMax"))}${radio("modeMax", "au_moins_un", ch.modeMax === "au_moins_un", t("rpLb_ou"), t("rpEd_auMoins"))}</div>`
    + `<p class="rb-hint">${escapeHtml(t(nMax ? "rpEd_maxH1" : "rpEd_maxH0"))} ${escapeHtml(t("rpEd_maxH2"))}</p></fieldset></div>` + rpEdExHtml(v, ctx.ex);
  const barrieres = sec("rbS_bar", "shield", t("rpEd_bar"), help + barCorps);
  const fc = (x) => `<label class="rb-opt rb-fc${ch.facon === x ? " on" : ""}"><input type="radio" name="facon" value="${x}" data-rb-f="facon"${ch.facon === x ? " checked" : ""}><i aria-hidden="true"></i>`
    + `<span><b>${escapeHtml(t("rpEd_fc_" + x))}<span class="rb-fcq"> · ${escapeHtml(t("rpEd_fcq_" + x))}</span></b><small>${escapeHtml(t("rpEd_fcd_" + x))}</small></span></label>`;
  const fcLu = !!ch.facon && ch.facon === (ed.base?.facon || "");
  const aClasser = !ch.facon && rp.porte === "smartprice" && (!!ed.id || (propre && ed.versionLue > 0));
  const facon = aClasser ? `<section class="rb-sec" id="rbS_facon" aria-labelledby="rbS_facon-h"><div class="rb-cls"><h3 id="rbS_facon-h">${escapeHtml(t("rpEd_clsT"))}</h3>`
      + `<p>${escapeHtml(t("rpEd_clsD", propre ? 1 : ctx.affectes ?? 0))}</p><div class="rb-clsch" role="group" aria-labelledby="rbS_facon-h">`
      + RP_FACONS.map((x) => `<div><button type="button" class="rb-btn line grand" data-rb-facon="${x}">${escapeHtml(t("rpEd_passer_" + x))}</button><small>${escapeHtml(t("rpEd_fcd_" + x))}</small></div>`).join("")
      + `</div></div></section>`
    : `<section class="rb-sec" id="rbS_facon" aria-labelledby="rbS_facon-h"><div class="rb-sh"><h3 id="rbS_facon-h">${escapeHtml(t("rpEd_facon"))}</h3></div>`
    + `<div class="rb-fcs" role="radiogroup" aria-labelledby="rbS_facon-h">${RP_FACONS.map(fc).join("")}</div>`
    + `<p class="rb-hint">${escapeHtml(t(rpFcIndice(ch, fcLu)))}${fcLu && ctx.faconLe ? ` ${escapeHtml(t("rpEd_fcLe", rpJm(ctx.faconLe)))}` : ""}`
    + `${ch.facon === "concurrents" && rpCibleDe(ch).vide ? ` ${escapeHtml(t("rpEd_fcSpSans"))}` : ""}</p></section>`;
  if (ch.facon === "concurrents" || ch.facon === "vendeurs_fiche" || aClasser) return rpEditeurAereHtml(ed, ctx, { v, cfl, cur, help, barCorps, facon, aClasser, radio });
  let corps;
  if (propre) corps = cfl + facon + barrieres;
  else {
    const vInfo = ed.id ? t("rpEd_vInfo", ed.cfl ? ed.cfl.actuelle.version : ed.versionLue, (ed.cfl ? ed.cfl.actuelle.version : ed.versionLue) + 1) : t("rpEd_vNew");
    const nomBad = v.erreur === "nom" && ed.tente;
    const styles = RP_STYLES.map((s) => `<label class="rb-sty${ch.modele === s ? " on" : ""}"><input type="radio" name="modele" value="${s}" data-rb-f="modele"${ch.modele === s ? " checked" : ""}>`
      + `${s === "prudent" ? `<span class="rb-rec">${escapeHtml(t("rpEd_rec"))}</span>` : ""}<b>${escapeHtml(t("rpLb_s_" + s))}</b><small>${escapeHtml(t("rpEd_sd_" + s))}</small></label>`).join("");
    const pl = ctx.paysListe || [];
    const ck = (c) => { const on = ch.paysTous || ch.pays.includes(c), o = ed.cfl?.lignes.find((l) => l.k === "pays");
      return `<label class="rb-ck${on ? " on" : ""}${ch.paysTous ? " dim" : ""}"><input type="checkbox" value="${escapeHtml(c)}" aria-label="${escapeHtml(rpPaysNom(c))}" data-rb-pays${on ? " checked" : ""}${ch.paysTous ? " disabled" : ""}>`
        + `<i aria-hidden="true"></i>${rpDrapeau(c, true)}${o && o.origine === "reprise" ? "" : ""}</label>`; };
    const paysOrig = ed.cfl?.lignes.find((l) => l.k === "pays");
    corps = cfl + sec("rbS_nom", "tag", t("rpEd_ident"), `<div class="rb-g2 rb-g2n"><div><label class="rb-lbl" for="rbF_nom">${escapeHtml(t("rpEd_nom"))} <span class="rb-req" aria-hidden="true">*</span></label>`
      + `<div class="rb-inp${nomBad ? " bad" : ""}"><input id="rbF_nom" type="text" maxlength="80" autocomplete="off" required data-rb-f="nom" value="${escapeHtml(ch.nom)}"${nomBad ? ' aria-invalid="true"' : ""}></div></div>`
      + `<div><span class="rb-lbl">${escapeHtml(t("rpEd_affA"))}</span><div class="rb-inp ro">${escapeHtml(ed.id ? t("rpEd_affN", ctx.affectes ?? 0) : t("rpEd_aucunProd"))}<span class="rb-u">${escapeHtml(vInfo)}</span></div></div></div>`
      + `<p class="rb-hint">${escapeHtml(ed.id ? t("rpEd_hintMod", (ed.cfl ? ed.cfl.actuelle.version : ed.versionLue) + 1, ctx.affectes ?? 0) : t("rpEd_hintNew"))}</p>`)
      + facon
      + sec("rbS_style", "tag", t("rpEd_style"), `<div class="rb-styles" role="radiogroup" aria-label="${escapeHtml(t("rpEd_style"))}">${styles}</div><p class="rb-hint">${escapeHtml(t("rpEd_styleH"))}</p>`)
      + barrieres
      + sec("rbS_pays", "globe", t("rpEd_pays"), `<fieldset class="rb-fs"><legend class="rb-sr">${escapeHtml(t("rpEd_pays"))}</legend><div class="rb-mode rb-mb">${radio("paysTous", "1", ch.paysTous, t("rpEd_tousPays"), t("rpEd_tousPaysD"))}${radio("paysTous", "0", !ch.paysTous, t("rpEd_certains"), t("rpEd_certainsD"))}</div></fieldset>`
        + `<div class="rb-cks" role="group" aria-label="${escapeHtml(t("rpEd_certains"))}">${pl.map(ck).join("")}</div><p class="rb-hint">${escapeHtml(t("rpEd_paysH"))}</p>`,
        paysOrig ? `<span class="rp-grow"></span><span class="rb-orig ${paysOrig.origine === "reprise" ? "theirs" : "mine"}">${escapeHtml(rpOrigTxt(paysOrig.origine, ed))}</span>` : "");
  }
  const titre = propre ? t("rpEd_titreProp", ctx.qui || "") : ed.id ? t("rpEd_titreMod") : t("rpEd_titreNew");
  const meta = propre ? (ed.versionLue ? t("rpEd_metaProp", ed.versionLue) : t("rpEd_metaNew")) : ed.id ? t("rpEd_metaMod", ctx.nomLu || ch.nom, ed.versionLue, rpJm(ctx.modifieLe)) : t("rpEd_metaNew");
  return `<section class="rb-dlg rb-page" aria-labelledby="rbDlgT" aria-describedby="rbDlgM"><div class="rb-dh"><button type="button" class="rb-back" data-rb-close>‹ ${escapeHtml(t("rpLb_titre"))}</button><h2 id="rbDlgT">${escapeHtml(titre)}</h2>`
    + `<span class="rb-meta" id="rbDlgM">${escapeHtml(meta)}</span></div>`
    + `<div class="rb-db" data-rb-db>${corps}</div>${rpEdPiedHtml(ed, v)}</section>`;
}
const rpChampNom = (k) => (k === "ecart" || k === "vf" ? t("rpEd_ec") : k === "nom" ? t("rpEd_nom") : k === "modele" ? t("rpEd_style") : k === "pays" ? t("rpEd_pays") : k === "mode" ? t("rpEd_modeMin") : k === "modeMax" ? t("rpEd_modeMax") : k === "facon" ? t("rpEd_facon") : t("rpEd_f_" + k));
const rpOrigTxt = (o, ed, k) => (o === "reprise" || (o === "deux" && ed.cfl?.choix?.[k] === "trouve") ? t("rpEd_oReprise", ed.cfl?.actuelle.version ?? "")
  : o === "deux" ? (ed.cfl?.choix?.[k] ? t("rpEd_oSaisie") : t("rpEd_aChoisir")) : t("rpEd_oSaisie"));
function rpChoixHtml(l, ed) {
  const c = ed.cfl.choix?.[l.k] || "", n = ed.cfl.actuelle.version;
  const r = (v, lbl) => `<label class="rb-choix"><input type="radio" name="rbC_${l.k}" value="${v}" data-rb-choix="${l.k}"${c === v ? " checked" : ""}> ${escapeHtml(lbl)}</label>`;
  return `<span class="rb-choixg" role="radiogroup" aria-label="${escapeHtml(`${t("rpEd_aChoisir")} · ${rpChampNom(l.k)}`)}">${r("saisie", l.saisie)}${r("trouve", `${l.trouve} (v${n})`)}</span>`;
}
function rpPropreCorps(r, regle) {
  const versionLue = rpVPropre(r);
  return { lignes: [{ marketplace: r.marketplace, sku: r.sku, regle, versionLue }] };
}
function rpRegleNomDec(dec) {
  if (!dec || !dec.source) return t("rpPp_nonNotee");
  return `${dec.source === "produit" ? t("rpPp_propre") : dec.source === "nommee" ? rpNomR(dec) || "—" : t("rpLb_compte")} v${dec.version ?? "?"}`;
}
function rpMemeRegle(dec, g) {
  return !!(dec && g && dec.source && dec.source === g.source && (dec.source !== "nommee" || dec.id === g.id) && dec.version === (g.versionRegle ?? g.version));
}
function rpAgeTxt(iso, now = Date.now()) {
  const x = Date.parse(iso ?? "");
  if (!Number.isFinite(x)) return t("rpLb_dateInc");
  const min = Math.max(0, (now - x) / 60e3);
  if (Math.round(min) < 60) return t("rpPp_ageMin", Math.round(min));
  const m = Math.ceil(min);
  return m < 180 ? t("rpPp_ageHM", Math.floor(m / 60), m % 60) : t("rpPp_ageH", Math.floor(m / 60));
}
const rpPct0 = (v) => new Intl.NumberFormat(LOCALE(), { style: "percent", maximumFractionDigits: 0 }).format(v);
const rpVPropre = (r) => r?.versionsLues?.propre ?? (r?.regle?.source === "produit" ? r.regle.version : 0);
const rpVAff = (r) => r?.versionsLues?.affectation ?? r?.affectee?.affVersion ?? 0;
function rpAgeH(iso, now = Date.now()) { const x = Date.parse(iso ?? ""); return Number.isFinite(x) ? Math.max(0, Math.round((now - x) / 3600e3)) : null; }
function rpEcoPays(r, d) {
  if (!d) return null;
  const L = [...(d.lignes || [])].sort((a, b) => a.prix - b.prix), cout = d.coutAchat?.valeur ?? null;
  const l = r.prixActuel != null ? L.find((x) => rpCents(x.prix) === rpCents(r.prixActuel)) : null;
  const ben = l && typeof l.beneficeAvantPub === "number" ? l.beneficeAvantPub : null, ht = l?.prixHt ?? null;
  const eq = L.find((x) => typeof x.beneficeAvantPub === "number" && x.beneficeAvantPub >= 0);
  return { cout, ttc: l?.prix ?? null, tva: l?.tva ?? null, ht, frais: l?.frais ?? null, ben, marge: ben !== null && ht ? ben / ht : null, roi: ben !== null && cout > 0 ? ben / cout : null,
    equilibre: cout != null && eq ? eq.prix : null, mini: d.plancher ?? null, horsGrille: r.prixActuel != null && !l && L.length > 0, devise: d.devise || r.devise || null };
}
function rpAffCellHtml(r, lib, o = {}) {
  const a = r.affectee, k = rpKey(r), off = o.off || !r.sku;
  const opts = `<option value="">${escapeHtml(t("rpPp_selAucune"))}</option>` + lib.filter((e) => !e.archiveeLe || e.id === a?.id).map((e) => {
    const couvre = !Array.isArray(e.pays) || e.pays.includes(r.marketplace);
    return `<option value="${escapeHtml(e.id)}"${a?.id === e.id ? " selected" : ""}${!couvre || e.archiveeLe ? " disabled" : ""}>${escapeHtml(rpNomR(e))}${!couvre && a?.id !== e.id ? ` ${t("rpPp_selNonCouv")}` : ""}</option>`;
  }).join("") + (a && !lib.some((e) => e.id === a.id) ? `<option value="${escapeHtml(a.id)}" selected disabled>${escapeHtml(t("rpPp_introuvable"))}</option>` : "");
  const sel = `<select class="rb-rsel${a && ["archivee", "introuvable"].includes(a.etat) ? " strike" : ""}" data-rb-affsel="${escapeHtml(k)}" aria-label="${escapeHtml(t("rpPp_choisir", r.marketplace))}"${off ? " disabled" : ""}>${opts}</select>`;
  const etat = !a ? (r.regle?.source === "produit" ? t("rpPp_propreSeule") : "")
    : a.etat === "remplacee" ? t("rpPp_rempl", a.version) : a.etat === "effective" ? `v${a.version}` : null;
  const pill = a && etat === null ? `<span class="rp-pill wa rp-sm">${escapeHtml(t("rpPp_et_" + a.etat))}</span>` : escapeHtml(etat || "");
  return `${sel}<small>${pill}</small>`;
}
function rpAppCellHtml(r, o = {}) {
  const g = r.regle;
  const lien = r.sku && !o.off ? `<button type="button" class="rp-lnk rb-plien" data-rb-propre="${escapeHtml(rpKey(r))}">${escapeHtml(t(g?.source === "produit" ? "rpPp_modPropre" : "rpPp_creerPropre"))}</button>` : "";
  if (!g) return `<span class="rp-err">${escapeHtml(t("rpPp_aucuneApp"))}</span><small>${escapeHtml(t(r.affectee ? "rpPp_compteAbs" : "rpPp_sansRegle"))}</small>${lien}`;
  const nom = g.source === "produit" ? t("rpPp_propre") : g.source === "nommee" ? rpNomR(g) || "—" : t("rpLb_compte");
  return `<b>${escapeHtml(nom)}</b> <span class="rp-fnt">v${escapeHtml(String(g.versionRegle ?? g.version ?? "?"))}</span><small><span class="rb-src">${escapeHtml(t("rpPp_src_" + g.source))}</span>`
    + `${g.motif ? ` · ${escapeHtml(t("rpPp_motif_" + g.motif))}` : ""}</small>${lien}`;
}
function rpFixPays(r, eco) {
  const a = r.affectee, nomP = rpPaysNom(r.marketplace), k = escapeHtml(rpKey(r));
  const b = (attr, lbl, val = k) => `<button type="button" class="rb-btn line" ${attr}="${val}">${escapeHtml(lbl)}</button>`;
  const age = rpAgeH(r.releveAt);
  if (!r.regle && a) return { cls: "er", html: `<b>${escapeHtml(t("rpPp_fxT_aucune"))}</b> ${escapeHtml(t("rpPp_fxD_aucune"))}`, btns: b("data-rb-focus", t("rpPp_autreRegle")) };
  if (a?.etat === "remplacee") return { cls: "wa", html: `<b>${escapeHtml(t("rpPp_fxT_remplacee"))}</b> ${escapeHtml(t("rpPp_fxD_remplacee", rpNomR(a), a.version, nomP))}`,
    btns: b("data-rb-retirer", t("rpPp_retirerPropre")) + b("data-rb-propre", t("rpPp_modPropre")) };
  if (a?.etat === "pays_non_couvert") return { cls: "wa", html: `<b>${escapeHtml(t("rpPp_fxT_pays"))}</b> ${escapeHtml(t("rpPp_fxD_pays", rpNomR(a), nomP))}`,
    btns: b("data-rb-ajpays", t("rpPp_ajouterPays", r.marketplace), `${escapeHtml(a.id)}|${escapeHtml(r.marketplace)}`) + b("data-rb-focus", t("rpPp_autreRegle")) };
  if (a?.etat === "archivee") return { cls: "wa", html: `<b>${escapeHtml(t("rpPp_fxT_archivee"))}</b> ${escapeHtml(t("rpPp_fxD_archivee", rpNomR(a)))}`,
    btns: b("data-rb-focus", t("rpPp_reaffecter")) + b("data-rb-rest", t("rpLb_restaurer"), escapeHtml(a.id)) };
  if (a?.etat === "introuvable") return { cls: "wa", html: `<b>${escapeHtml(t("rpPp_fxT_introuvable"))}</b> ${escapeHtml(t("rpPp_fxD_introuvable"))}`, btns: b("data-rb-focus", t("rpPp_reaffecter")) };
  if (r.conseil?.etat === "bornes_en_conflit") {
    const dec = r.ombre?.regle?.source ? r.ombre.regle : null, src = dec ? dec.source : r.regle?.source, id = dec ? dec.id : r.regle?.id;
    const avec = dec ? t("rpPp_fxD_conflitAvec", rpRegleNomDec(dec)) + (rpMemeRegle(dec, r.regle) ? "" : ` ${t("rpPp_recalcul")}`) : t("rpPp_fxD_conflit");
    return { cls: "er", html: `<b>${escapeHtml(t("rpPp_fxT_conflit"))}</b> ${escapeHtml(avec)}`,
      btns: src === "produit" ? b("data-rb-propre", t("rpPp_modPropre")) : src === "nommee" && id ? b("data-rb-edit", t("rpPp_modRegle"), escapeHtml(id))
        : src === "defaut" ? `<span class="rp-fnt rb-nw">${escapeHtml(t("rpPp_compteNonModif"))}</span>` : "" };
  }
  if (age !== null && age > 36) return { cls: "er", html: `<b>${escapeHtml(t("rpPp_fxT_perime", age))}</b> ${escapeHtml(t("rpPp_fxD_perime"))}`, btns: "" };
  return null;
}
function rpPaysVueHtml(rows, o = {}) {
  const r0 = rows[0];
  if (!r0) return `<p class="rp-empty">${escapeHtml(t("rpNone"))}</p>`;
  const lib = o.lib || [], det = o.det || {}, st = o.detSt || {}, ouverts = o.ouverts || {};
  const ecos = rows.map((r) => rpEcoPays(r, det[rpKey(r)]));
  const coutInc = ecos.every((e, i) => (e && e.cout == null) || st[rpKey(rows[i])] === "err") && ecos.some((e) => e && e.cout == null);
  const cout0 = ecos.find((e) => e && e.cout != null);
  const m = (v, cur) => (typeof v === "number" ? escapeHtml(rpM(v, cur)) : null);
  const L = rows.map((r, i) => {
    const e = ecos[i], k = rpKey(r), cur = r.devise, charge = !e && st[k] !== "err";
    const inc = (txt) => (charge ? `<span class="rb-wait">${escapeHtml(t("rpPp_charge"))}</span>` : rpUnk(txt));
    const age = rpAgeH(r.releveAt);
    const rel = age == null ? t("rpL_nonReleve") : t("rpPp_releve", age);
    const relH = `<span class="${age != null && age > 36 ? "rp-att " : ""}rb-nw">${escapeHtml(rel)}</span>`;
    let cons;
    if (r.enVente === false || r.situation === "sans_offre") cons = `<span class="rp-fnt">–</span><small>${escapeHtml(t("rpPp_inactif"))}</small>`;
    else if (!r.regle) cons = `<span class="rp-err">${escapeHtml(t("rpPp_indispo"))}</span><small>${escapeHtml(t("rpPp_sansApp"))} · ${relH}</small>`;
    else if (age != null && age > 36) cons = `<span class="rp-err">${escapeHtml(t("rpPp_indispo"))}</span><small>${relH}</small>`;
    else if (r.conseil?.etat === "garder") cons = `<b>${m(r.prixActuel, cur) ?? "—"}</b> <span class="rp-mut">${escapeHtml(t("rpPp_garder"))}</span> <span class="rb-tri" title="${escapeHtml(t("rpPp_foepT"))}" aria-label="${escapeHtml(t("rpPp_foepT"))}">▲</span><small>${escapeHtml(t("rpPp_g_" + (r.conseil.raison || "x")) !== "rpPp_g_" + (r.conseil.raison || "x") ? t("rpPp_g_" + r.conseil.raison) : t("rpPp_dansBornes"))} · ${relH}</small>`;
    else cons = `${rpConseilHtml(r)}<small>${relH}</small>`;
    if (r.ombre && r.regle && r.enVente !== false && r.situation !== "sans_offre") {
      const dec = r.ombre.regle, nd = rpRegleNomDec(dec), ag = rpAgeTxt(r.ombre.decideLe);
      cons += rpMemeRegle(dec, r.regle) ? `<small class="rp-fnt">${escapeHtml(t("rpPp_calcAvec", nd, ag))}</small>`
        : `<small class="rb-stale" role="note"><span aria-hidden="true">▲ </span>${escapeHtml(t("rpPp_stale", nd, ag))}</small>`;
    }
    const cIndispo = e && e.cout == null;
    const v = (x, f) => (e && typeof x === "number" ? escapeHtml(f(x)) : e && (cIndispo || e.horsGrille) ? rpUnk(cIndispo ? "rpL_inconnu" : "rpPp_horsGrille") : r.prixActuel == null ? `<span class="rp-fnt">–</span>` : inc("rpL_inconnu"));
    const cells = {
      pays: rpDrapeau(r.marketplace),
      etat: `<span class="rp-pill ${r.enVente === false || r.situation === "sans_offre" ? "wa" : "ne"}">${escapeHtml(t(r.enVente === false || r.situation === "sans_offre" ? "rpPp_inactive" : "rpPp_active"))}</span>`
        + `<small>${r.buyBox === "nous" ? `<span class="rp-pill ok rp-sm">${escapeHtml(t("rpPp_bbNous"))}</span>` : rpUnk("rpPp_bbInc")}</small>`,
      prix: r.prixActuel != null ? escapeHtml(rpM(r.prixActuel, cur)) : rpPrixAbs(r), cons,
      ben: v(e?.ben, (x) => rpM(x, cur)), marge: v(e?.marge, fmtPct), roi: v(e?.roi, rpPct0),
      eq: e && e.equilibre != null ? escapeHtml(rpM(e.equilibre, cur)) : e && e.cout == null ? rpUnk() : e ? `<span class="rp-fnt">–</span>` : inc(),
      mini: r.conseil?.etat === "bornes_en_conflit" ? `<span class="rp-err">${escapeHtml(t("rpPp_enConflit"))}</span>` : e && e.mini != null ? escapeHtml(rpM(e.mini, cur)) : e && e.cout == null ? rpUnk() : e ? `<span class="rp-fnt">–</span>` : inc(),
      aff: rpAffCellHtml(r, lib, { off: o.off }), app: rpAppCellHtml(r, { off: o.off }),
    };
    const calc = e && e.ttc != null && e.ben !== null && e.ht != null && e.frais != null && e.cout != null ? `<div class="rb-calc"><span class="rb-ck2">${escapeHtml(t("rpPp_calcT", rpPaysNom(r.marketplace)))}</span>`
      + `<span><b>${escapeHtml(rpM(e.ttc, cur))}</b> ${escapeHtml(t("rpPp_ttc"))}</span><span class="rb-o">−</span><span>${escapeHtml(t("rpPp_tva"))} <b>${escapeHtml(rpM(e.tva ?? 0, cur))}</b></span>`
      + `<span class="rb-o">=</span><span><b>${escapeHtml(rpM(e.ht, cur))}</b> ${escapeHtml(t("rpPp_ht"))}</span><span class="rb-o">−</span><span>${escapeHtml(t("rpPp_frais"))} <b>${escapeHtml(rpM(e.frais, cur))}</b></span>`
      + `<span class="rb-o">−</span><span>${escapeHtml(t("rpPp_coutA"))} <b>${escapeHtml(rpM(e.cout, cur))}</b></span><span class="rb-o">=</span><span>${escapeHtml(t("rpPp_benef"))} <b>${escapeHtml(rpM(e.ben, cur))}</b></span>`
      + `<span class="rb-sepc"></span><span>${escapeHtml(t("rpPp_marge"))} <b>${escapeHtml(rpM(e.ben, cur))} ÷ ${escapeHtml(rpM(e.ht, cur))} = ${escapeHtml(fmtPct(e.marge))}</b></span>`
      + (e.roi !== null ? `<span>${escapeHtml(t("rpPp_roi"))} <b>${escapeHtml(rpM(e.ben, cur))} ÷ ${escapeHtml(rpM(e.cout, cur))} = ${escapeHtml(rpPct0(e.roi))}</b></span>` : "") + `</div>` : "";
    return { r, k, cells, calc, fix: rpFixPays(r, e), ouvert: !!ouverts[k] };
  });
  const ordre = ["pays", "etat", "prix", "cons", "ben", "marge", "roi", "eq", "mini", "aff", "app"], num = new Set(["prix", "ben", "marge", "roi", "eq", "mini"]);
  const th = `<tr>${ordre.map((c) => `<th${num.has(c) ? ' class="num"' : ""}>${escapeHtml(t("rpPp_th_" + c))}</th>`).join("")}</tr>`;
  const fixH = (f) => (f ? `<div class="rb-subm ${f.cls}"><span class="${f.cls === "wa" ? "rb-tri" : "rp-err"}" aria-hidden="true">${f.cls === "wa" ? "▲" : ""}</span><span class="rp-grow">${f.html}</span>${f.btns}</div>` : "");
  const body = L.map((l, i) => { const z = i % 2 ? " z" : "";
    const tog = l.calc ? `<button type="button" class="rb-tog${l.ouvert ? " on" : ""}" data-rb-tog="${escapeHtml(l.k)}" aria-expanded="${l.ouvert}" aria-label="${escapeHtml(t("rpPp_calcT", rpPaysNom(l.r.marketplace)))}">›</button>` : `<span class="rb-tog0"></span>`;
    return `<tr class="r${z}">${ordre.map((c) => `<td class="${num.has(c) ? "num" : ""}">${c === "pays" ? tog : ""}${l.cells[c]}</td>`).join("")}</tr>`
      + (l.ouvert && l.calc ? `<tr class="sub${z}"><td colspan="11">${l.calc}</td></tr>` : "") + (l.fix ? `<tr class="sub${z}"><td colspan="11">${fixH(l.fix)}</td></tr>` : ""); }).join("");
  const kv = (a, b) => `<span>${escapeHtml(a)}</span><span>${b}</span>`;
  const cards = L.map((l) => `<div class="rb-pcard"><div class="rb-top2">${flagSvg(l.r.marketplace)} <b>${escapeHtml(rpPaysNom(l.r.marketplace))}</b><span class="rp-grow"></span>${l.cells.etat.replace("<small>", " ").replace("</small>", "")}</div>`
    + `<div class="rb-kv">${kv(t("rpPp_th_prix"), l.cells.prix)}${kv(t("rpPp_conseil"), l.cells.cons)}${kv(t("rpPp_th_aff"), l.cells.aff)}${kv(t("rpPp_th_app"), l.cells.app)}</div>${fixH(l.fix)}`
    + `<details${l.ouvert ? " open" : ""} data-rb-det="${escapeHtml(l.k)}"><summary>${escapeHtml(t("rpPp_plus"))}</summary><div class="rb-kv">${kv(t("rpPp_th_ben"), l.cells.ben)}${kv(t("rpPp_th_marge"), l.cells.marge)}`
    + `${kv(t("rpPp_roi2"), l.cells.roi)}${kv(t("rpPp_th_eq"), l.cells.eq)}${kv(t("rpPp_mini2"), l.cells.mini)}</div>${l.calc}</details></div>`).join("");
  const foot = `<div class="rb-tfoot"><span><span class="rb-tri" aria-hidden="true">▲</span> <b>${escapeHtml(t("rpPp_f1T"))}</b>${escapeHtml(t("rpPp_f1D"))}</span>`
    + `<span><b>${escapeHtml(t("rpPp_f2T"))}</b>${escapeHtml(t("rpPp_f2D"))}</span><span><b>${escapeHtml(t("rpPp_f3T"))}</b>${escapeHtml(t("rpPp_f3D"))}</span></div>`;
  const titre = rpTitre(r0, o.titres);
  const meta = `<span>${escapeHtml(r0.sku || r0.asin || "")}</span><span>${escapeHtml(t("rpPp_cout"))} ${cout0 ? `<b>${escapeHtml(rpM(cout0.cout, cout0.devise))}</b> · ${escapeHtml(t("rpPp_coutMoy"))}` : coutInc ? rpUnk() : `<span class="rb-wait">${escapeHtml(t("rpPp_charge"))}</span>`}</span>`;
  const coutFix = coutInc ? `<div class="rb-subm wa"><span class="rp-unk" aria-hidden="true"></span><span class="rp-grow"><b>${escapeHtml(t("rpPp_coutT"))}</b>${escapeHtml(t("rpPp_coutD", rows.length))}</span>`
    + `<a class="rb-btn pri" href="#stock/cogs">${rpIc("edit")}<span>${escapeHtml(t("rpPp_saisirCout"))}</span></a></div>` : "";
  return `<div class="rb-pd"><button type="button" class="rb-back" data-rb-retour>${rpIc("back")}${escapeHtml(t("rpPp_retour"))}</button></div>`
    + `<div class="rb-pd">${rpThumb(r0)}<div><h2 id="rbProdT"${titre ? ` title="${escapeHtml(titre)}"` : ""}>${escapeHtml(rpNom(r0))}</h2><div class="rb-m">${meta}</div></div><span class="rp-grow"></span>`
    + `<div class="rb-acts"><button type="button" class="rb-btn line" data-rb-affprod="${escapeHtml(r0.asin)}"${o.off ? ` disabled title="${escapeHtml(t("rpLb_offT"))}"` : ""}>${rpIc("sel")}<span>${escapeHtml(t("rpLb_affecter"))}</span></button></div></div>`
    + `<div class="rb-simban" role="note">${rpIc("info")}<span><b>${escapeHtml(t("rpLb_simT"))}</b> ${escapeHtml(t("rpLb_simD"))}</span></div>${coutFix}`
    + `<section class="rb-card rb-ct2wrap" aria-labelledby="rbProdT"><div class="rb-tw"><table class="rb-ct2"><thead>${th}</thead><tbody>${body}</tbody></table></div>${foot}</section>`
    + `<div class="rb-pcards">${cards}${foot}</div>`;
}
function rpAffApercu(s, rows, lib) {
  const e = lib.find((x) => x.id === s.id) || null, sel = new Set(s.sel || []), pays = new Set(s.pays || []);
  const out = { lignes: [], vendus: 0, total: sel.size * pays.size, changent: 0, deja: 0, propres: 0, nonCouverts: 0, noms: { changent: [], deja: [], propres: [] } };
  if (!e) return out;
  for (const r of rows) {
    if (!sel.has(r.asin) || !pays.has(r.marketplace) || !r.sku) continue;
    out.vendus++;
    if (Array.isArray(e.pays) && !e.pays.includes(r.marketplace)) { out.nonCouverts++; continue; }
    const qui = `${rpNom(r)} ${r.marketplace}`;
    if (r.affectee?.id === e.id) { out.deja++; out.noms.deja.push(qui); continue; }
    out.lignes.push({ marketplace: r.marketplace, sku: r.sku, id: e.id, versionLue: rpVAff(r) });
    if (r.regle?.source === "produit") { out.propres++; out.noms.propres.push(qui); } else { out.changent++; out.noms.changent.push(qui); }
  }
  out.sansOffre = out.total - out.vendus;
  return out;
}
function rpAffHtml(s, rows, lib, o = {}) {
  const prods = [], vus = new Map();
  for (const r of rows) { if (!vus.has(r.asin)) { vus.set(r.asin, []); prods.push(r); } vus.get(r.asin).push(r); }
  const sel = new Set(s.sel || []), actives = lib.filter((e) => !e.archiveeLe), e = actives.find((x) => x.id === s.id) || null;
  const regles = (ls) => { const c = new Map(); for (const r of ls) { const n = !r.regle ? t("rpPp_aucuneApp") : r.regle.source === "produit" ? t("rpPp_propre") : r.regle.source === "nommee" ? rpNomR(r.regle) : t("rpLb_compte"); c.set(n, (c.get(n) || 0) + 1); }
    return [...c].map(([n, k]) => (k > 1 ? `${n} ×${k}` : n)).join(" · "); };
  const cb = (asin, on) => `<input type="checkbox" class="rb-cbx" data-rb-pick="${escapeHtml(asin)}"${on ? " checked" : ""} aria-label="${escapeHtml(rpNom(vus.get(asin)[0]))}">`;
  const nm = (r) => `<div class="rp-nm">${rpThumb(r)}<span class="rp-n">${escapeHtml(rpNom(r))}<small>${escapeHtml(r.sku || r.asin)}</small></span></div>`;
  const lignes = prods.map((p) => { const on = sel.has(p.asin), ls = vus.get(p.asin);
    return `<tr class="${on ? "chk" : ""}"><td>${cb(p.asin, on)}</td><td>${nm(p)}</td><td>${rpPaysHtml(ls.map((r) => r.marketplace))}</td><td class="rp-fnt">${escapeHtml(regles(ls))}</td></tr>`; }).join("");
  const cards = prods.map((p) => { const on = sel.has(p.asin), ls = vus.get(p.asin);
    return `<label class="rb-pcard rb-psel${on ? " chk" : ""}"><span class="rb-top2">${cb(p.asin, on)}${nm(p)}</span>${rpPaysHtml(ls.map((r) => r.marketplace))}<small class="rp-fnt">${escapeHtml(regles(ls))}</small></label>`; }).join("");
  const paysL = [...new Set(rows.map((r) => r.marketplace))].sort();
  const A = rpAffApercu(s, rows, lib);
  const ck = (c) => { const on = (s.pays || []).includes(c), couvre = !e || !Array.isArray(e.pays) || e.pays.includes(c);
    return `<label class="rb-ck${on ? " on" : ""}${couvre ? "" : " dim"}"><input type="checkbox" value="${escapeHtml(c)}" aria-label="${escapeHtml(rpPaysNom(c))}" data-rb-affpays${on ? " checked" : ""}${couvre ? "" : " disabled"}><i aria-hidden="true"></i>${rpDrapeau(c, true)}${couvre ? "" : `<small>${escapeHtml(t("rpAf_nonCouv"))}</small>`}</label>`; };
  const nb = (n, k, noms) => `<span class="n">${escapeHtml(fmtInt(n))}</span><span class="d">${escapeHtml(t(k))}${noms && noms.length ? ` <span class="rp-fnt">(${escapeHtml(noms.slice(0, 4).join(" · "))}${noms.length > 4 ? " …" : ""})</span>` : ""}</span>`;
  const apercu = !sel.size ? `<p class="rp-mut">${escapeHtml(t("rpAf_aucunSel"))}</p>` : !e ? `<p class="rp-mut">${escapeHtml(t("rpAf_choisir"))}</p>`
    : `<div class="rb-prev1"><span class="rp-simtag">${escapeHtml(t("rpAf_apercu"))}</span><div class="rb-big">${escapeHtml(fmtInt(A.changent))}<small>${escapeHtml(t("rpLb_apBig"))}</small></div>`
      + `<div class="rb-brk"><span class="n">${escapeHtml(fmtInt(A.vendus))}</span><span class="d">${escapeHtml(t("rpAf_vendus", A.total, A.sansOffre))}</span>`
      + `${nb(A.changent, "rpAf_chg", A.noms.changent)}${nb(A.deja, "rpAf_deja", A.noms.deja)}${nb(A.propres, "rpAf_prop", A.noms.propres)}</div>`
      + `<p class="rb-hint">${escapeHtml(t("rpAf_hint"))}</p></div>`;
  const panel = `<aside class="rb-aff" aria-labelledby="rbAffT"><h3 id="rbAffT">${rpIc("sel")}${escapeHtml(t("rpAf_titre", sel.size))}<span class="rp-grow"></span><button type="button" class="rb-x" data-rb-affclose aria-label="${escapeHtml(t("rpEd_fermer"))}">${rpIc("x")}</button></h3>`
    + `<div><label class="rb-lbl" for="rbAffR">${escapeHtml(t("rpAf_regle"))}</label><select id="rbAffR" class="rb-sel" data-rb-affregle><option value="">${escapeHtml(t("rpAf_choisir"))}</option>`
    + actives.map((x) => `<option value="${escapeHtml(x.id)}"${x.id === s.id ? " selected" : ""}>${escapeHtml(`${rpNomR(x)} · v${x.version} · ${Array.isArray(x.pays) ? x.pays.join(", ") : t("rpLb_tousPays")}`)}</option>`).join("") + `</select></div>`
    + `<div><span class="rb-lbl">${escapeHtml(t("rpAf_pays"))}</span><div class="rb-cks rb-affcks" role="group" aria-label="${escapeHtml(t("rpAf_pays"))}">${paysL.map(ck).join("")}</div></div>${apercu}</aside>`;
  return `<div class="rb-simban" role="note">${rpIc("info")}<span><b>${escapeHtml(t("rpLb_simT"))}</b> ${escapeHtml(t("rpLb_simD"))}</span></div>`
    + `<div class="rb-selbar"><b>${escapeHtml(t("rpAf_sel", sel.size))}</b><span class="rp-fnt">${escapeHtml(t("rpAf_sur", prods.length))}</span>`
    + `<button type="button" class="rp-lnk" data-rb-picktout="${sel.size ? "0" : "1"}">${escapeHtml(t(sel.size ? "rpAf_desel" : "rpAf_tout"))}</button><span class="rp-grow"></span></div>`
    + `<div class="rb-affb"><div class="rb-col1"><section class="rb-card rb-ct2wrap"><div class="rb-tw"><table class="rb-ct2 rb-selt"><thead><tr><th><span class="rb-sr">${escapeHtml(t("rpAf_cocher"))}</span></th><th>${escapeHtml(t("rpAf_th_prod"))}</th>`
    + `<th>${escapeHtml(t("rpAf_th_pays"))}</th><th>${escapeHtml(t("rpAf_th_regles"))}</th></tr></thead><tbody>${lignes}</tbody></table></div></section><div class="rb-pcards">${cards}</div></div>${panel}</div>`;
}
async function rpLoad(force) {
  if (rp.st === "load" || (rp.d && !force)) return rpPaint();
  rp.st = "load"; rpPaint();
  try { rp.d = await api("/api/repricer"); rp.st = "ok"; } catch { rp.st = "err"; }
  rpPaint();
}
async function rpDetLoad(r) {
  const k = rpKey(r);
  if (!r.sku && !r.asin) { rp.detSt[k] = "err"; return; }
  if (rp.det[k] || rp.detSt[k] === "load" || rp.detSt[k] === "err") return;
  rp.detSt[k] = "load";
  try {
    const id = r.sku ? `sku=${encodeURIComponent(r.sku)}` : `asin=${encodeURIComponent(r.asin)}`;
    const d = await api(`/api/repricer/detail?marketplace=${encodeURIComponent(r.marketplace)}&${id}`);
    rp.det[k] = d; rp.detSt[k] = "ok";
    if (rp.ix[k] == null) rp.ix[k] = rpIxDepart(d.lignes || [], r);
  } catch { rp.detSt[k] = "err"; }
  rpPaint();
}
async function rpVdrLoad(r) {
  const k = rpKey(r);
  if (!r.sku || rp.vdrSt[k]) return;
  rp.vdrSt[k] = "load";
  try { rp.vdr[k] = await api(`/api/repricer/vendeurs?marketplace=${encodeURIComponent(r.marketplace)}&sku=${encodeURIComponent(r.sku)}`); rp.vdrSt[k] = "ok"; }
  catch { rp.vdrSt[k] = "err"; }
  rpPaint();
}
const rpOpts = (k) => ({ err: rp.detSt[k] === "err", verrou: rp.d?.verrouPrix, busy: rp.busy, msg: rp.msg });
async function rpJLoad(force) {
  if (rp.jSt === "load" || (rp.j && !force)) return rpPaint();
  rp.jSt = "load"; rpPaint();
  try { rp.j = await api("/api/repricer/journal"); rp.jSt = "ok"; } catch { rp.jSt = "err"; }
  rpPaint();
}
function rpEnter() {
  const p = rpPorteDe(location.hash);
  if (p !== rp.porte) { rp.porte = p; rp.sel = undefined; rp.prod = null; }
  rpBind(); rpLoad(false); rpJLoad(false);
}
function rpRowSel() { return rp.sel ? (rp.d?.rows || []).find((r) => rpKey(r) === rp.sel) || null : null; }
function rpPaint() {
  const sec = document.getElementById("t1Repricer");
  if (!sec || !document.body.classList.contains("a1-view-repricer")) return;
  const fk = rpFocusCle(), dbY = document.querySelector("#t1Repricer .rb-db")?.scrollTop ?? null;
  queueMicrotask(() => { rpFocusRendre(fk); const db = document.querySelector("#t1Repricer .rb-db"); if (!db) return;
    if (rp.bib.ed?.enHaut) { db.scrollTop = 0; delete rp.bib.ed.enHaut; db.querySelector(".rb-cfl")?.focus?.(); } else if (dbY !== null) db.scrollTop = dbY; });
  const porte = rp.porte === "smartprice" ? "smartprice" : "repricer";
  sec.setAttribute?.("data-rp-porte", porte);
  const Z = zoneMpsAffichee(), rowsAll = (rp.d?.rows || []).filter((r) => !Z || Z.has(r.marketplace)).filter((r) => rpPorteLigne(r) === porte), niv0 = rpNiveau(rp.d?.verrouPrix);
  const niv = porte === "repricer" && niv0 === "propose" && !rowsAll.some((r) => r.conseil?.etat === "propose") ? "ombre" : niv0;
  if (rp.pays && !rowsAll.some((r) => r.marketplace === rp.pays)) { rp.pays = ""; rp.sel = undefined; }
  if (rp.sel && !rowsAll.some((r) => rpKey(r) === rp.sel)) rp.sel = undefined;
  const lvl = rpNiveauHtml(niv);
  const opt = (v, lbl, cur) => `<option value="${escapeHtml(v)}"${v === cur ? " selected" : ""}>${escapeHtml(lbl)}</option>`;
  const paysL = [...new Set(rowsAll.map((r) => r.marketplace))].sort(), sitL = RP_SIT_ORDRE.filter((s) => rowsAll.some((r) => rpSitCle(r) === s));
  const FIL = `<svg class="rp-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16l-6 7.5V19l-4-2v-4.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  const titre = t(porte === "smartprice" ? "t1pSmart" : "rpTitle");
  const spVide = porte === "smartprice" && !!rp.d && !rpPorteLignes(rp.d.rows || [], "smartprice").length;
  const prodR = porte === "smartprice" && rp.prod ? (rp.d?.rows || []).find((r) => r.asin === rp.prod) || null : null;
  const crumb = `${escapeHtml(t("rpCrumb"))} ›${prodR ? ` ${escapeHtml(titre)} ›` : ""}`;
  const spTous = porte === "smartprice" && rp.tab === "tous" && !rp.prod;
  const rowsEt = porte === "smartprice" ? rpFiltre(rowsAll, spTous ? { pays: rp.pays } : rp) : null;
  const nEtat = porte === "smartprice" && rp.d ? (spTous ? rpRanger(rowsEt).actifs.length : rpIndicDe(rowsEt, rpFileDe(rowsEt)).offres) : rowsAll.length;
  const reAct = porte === "repricer" && rp.tab === "conseils" && !rp.prod;
  const reVideH = reAct && !!rp.d && !rpPorteLignes(rp.d.rows || [], "repricer").length;
  const reDec = reAct && rp.d ? rpDecompte(rowsAll, rp.d.annonces?.lu !== false) : null;
  const reHead = () => {
    const h = rpHeure(rp.d?.freshness?.lastSuccessAt), PT = (c = "") => `<span class="rp-rept${c}" aria-hidden="true"></span>`;
    const etat = !rp.d ? "" : reVideH ? `<span class="rp-reetat"><span>${escapeHtml(t("rpEtatN", fmtInt(0), 0))}</span></span>`
      : `<span class="rp-reetat">${rpReNivHtml(niv)}`
        + (reDec && reDec.expl !== nEtat ? `${PT()}<span class="rp-redecw"><span class="rp-redesk">${escapeHtml(t("rpEtatN", fmtInt(nEtat), nEtat))} : </span><button type="button" class="rp-lnk rp-redec" data-rp-tab="tous" title="${escapeHtml(t("rpRe_decTip"))}">${escapeHtml(rpDecompteTxt(reDec))}</button></span>`
          : `${PT(" rp-redesk")}<span class="rp-redesk">${escapeHtml(t("rpEtatN", fmtInt(nEtat), nEtat))}</span>`) + `${h ? `${PT()}<span>${escapeHtml(t("rpEtatCalc", h))}</span>` : ""}</span>`;
    const RT = rp.reTri || { c: "pays", d: 1 }, CH = `<svg class="rp-rechev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const trier = reVideH ? "" : `<label class="rp-fbtn rp-refbtn rp-retri"><span class="rp-dsk">${escapeHtml(t("rpRe_trierP"))}</span><span class="rp-tel">${escapeHtml(t("rpRe_trier"))}</span> <select data-rp-retri>`
      + RP_RE_TRIS.flatMap((c) => [1, -1].map((d) => opt(`${c}:${d}`, `${t("rpRe_tri_" + c)} ${d === 1 ? "↑" : "↓"}`, `${RT.c}:${RT.d}`))).join("") + `</select>${CH}</label>`;
    const pays = reVideH ? "" : `<label class="rp-fbtn rp-refbtn rp-repays">${escapeHtml(t("rpRe_pays"))} <select data-rp-pays>${opt("", t("rpFAll"), rp.pays)}${paysL.map((p) => opt(p, p, rp.pays)).join("")}</select>`
      + `<svg class="rp-rechev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></label>`;
    return `<div class="rp-ph rp-reph"><span class="rp-crumb">${crumb}</span><h2>${escapeHtml(titre)}</h2>${etat}<span class="rp-grow"></span>${trier}${pays}</div>`;
  };
  const head = reAct ? reHead() : spVide ? `<div class="rp-ph"><span class="rp-crumb">${crumb}</span><h2>${escapeHtml(titre)}</h2>${rpEtatHtml(0, null)}</div>`
    : `<div class="rp-ph"><span class="rp-crumb">${crumb}</span><h2>${escapeHtml(prodR ? rpNom(prodR) : titre)}</h2>`
    + (porte === "repricer" ? rpReNivHtml(niv) : `<span class="rp-seg rp-lvl" role="group" aria-label="${escapeHtml(t("rpLvlAria"))}" title="${escapeHtml(t(niv ? "rpLvlTip" : "rpLvlUnk"))}">${lvl}</span>`) + `${rp.d ? rpEtatHtml(nEtat, rp.d.freshness?.lastSuccessAt) : ""}<span class="rp-grow"></span>`
    + (spTous ? "" : `<label class="rp-fbtn">${FIL}${escapeHtml(t("rpFPays"))} <select data-rp-pays>${opt("", t("rpFAll"), rp.pays)}${paysL.map((p) => opt(p, p, rp.pays)).join("")}</select></label>`
    + `<label class="rp-fbtn">${FIL}${escapeHtml(t("rpFSit"))} <select data-rp-sit>${opt("", t("rpFAllF"), rp.sit)}${sitL.map((s) => opt(s, t("rpSit_" + s), rp.sit)).join("")}</select></label>`) + `</div>`;
  const c = rpComptes(rowsAll);
  const porteK = new Map((rp.d?.rows || []).map((r) => [rpKey(r), rpPorteLigne(r)]));
  const jZone = (rp.j?.entrees || []).filter((e) => !Z || Z.has(e.marketplace))
    .filter((e) => (porteK.get(rpKey(e)) || "repricer") === porte);
  const actif = rpOngletActif(rp);
  const tab = (id, lbl, small, dis) => `<button type="button" role="tab" class="${actif === id && !dis ? "on" : ""}"${dis ? ` disabled title="${escapeHtml(t("rpSoon"))}"` : ` data-rp-tab="${id}"`} aria-selected="${actif === id && !dis}">${escapeHtml(lbl)}${small != null ? ` <small>${escapeHtml(small)}</small>` : ""}</button>`;
  const tabs = `<div class="rp-tabs" data-rp-porte="${porte}" role="tablist">${tab("conseils", t("rpTabConseils"), rp.d ? fmtInt(c.decisions) : null)}${tab("tous", t("rpTabTous"), rp.d ? t("rpTabsCount", c.produits, c.pays) : null)}`
    + `${tab("regles", t("rpTabRegles"), rp.d && !rp.d.reglesErreur ? t("rpLb_nNommees", rpLib().filter((e) => !e.archiveeLe).length) : null)}${tab("journal", t("rpTabJournal"), rp.j && rp.d ? fmtInt(jZone.length) : null)}</div>`;
  if (rp.st === "load" && !rp.d) { sec.innerHTML = head + tabs + (rp.tab === "regles" ? rpBibVue([]) : `<p class="rp-empty">${escapeHtml(t("loading"))}</p>`); return; }
  if (rp.st === "err" && !rp.d) { sec.innerHTML = head + tabs + `<p class="rp-empty">${escapeHtml(t("rpErr"))}</p>`; return; }
  if (spVide && !rp.prod && (rp.tab === "conseils" || rp.tab === "tous")) { sec.innerHTML = head + tabs + rpSpVideHtml(); return rpTabVisible(sec); }
  if (rp.prod) { sec.innerHTML = head + tabs + rpBibVue(rowsAll); return rpTabVisible(sec); }
  if (rp.tab === "journal") {
    const jb = rp.j ? rpJournalHtml(jZone, rowsAll, rp) : `<p class="rp-empty">${escapeHtml(t(rp.jSt === "err" ? "rpJErr" : "loading"))}</p>`;
    sec.innerHTML = head + tabs + `<div class="rp-card">${jb}</div>`; return rpTabVisible(sec);
  }
  if (rp.tab === "regles") {
    sec.innerHTML = head + tabs + rpBibVue(rowsAll);
    return rpTabVisible(sec);
  }
  if (rp.tab === "conseils") {
    const rowsF = rpFiltre(rowsAll, reAct ? { pays: rp.pays } : rp), F = rpFileDe(rowsF);
    if (rp.sel && !F.classe[rp.sel]) rp.sel = undefined;
    const selR = rp.sel ? rpLignesFile(rowsF).get(rp.sel) || null : null, k = selR ? rpKey(selR) : null;
    if (selR) rpDetLoad(selR);
    if (selR && porte === "repricer" && selR.ombre?.sousType === "vendeurs_fiche") rpVdrLoad(selR);
    const reVide = porte === "repricer" && !!rp.d && !rpPorteLignes(rp.d.rows || [], "repricer").length;
    const corps = reVide ? rpReVideHtml() : rowsF.length ? rpFileHtml(rowsF, F, { verrou: rp.d?.verrouPrix, derniere: rpDerniereModif(jZone, rowsAll, rp.pays, Z), porte, calculeLe: rp.d?.freshness?.lastSuccessAt })
      : `<p class="rp-empty">${escapeHtml(t(rowsAll.length ? "rpNoneFiltre" : "rpNone"))}</p>`;
    const insp = selR ? `<aside class="rp-insp rp-det${porte === "repricer" ? " rp-rf" : ""}"${porte === "smartprice" ? ' data-rp-porte="smartprice"' : ""} aria-label="${escapeHtml(rpNom(selR))}">${rpDetailHtml(selR, rp.det[k], F.classe[rp.sel], porte === "smartprice" || porte === "repricer" ? { ...rpOpts(k), porte } : rpOpts(k))}</aside>` : "";
    sec.innerHTML = head + tabs + `<div class="rp-body rp-fb${selR ? " rp-open" : ""}">${corps}${insp}</div>`;
    return rpTabVisible(sec);
  }
  const R = rpRanger(rpFiltre(rowsAll, spTous ? { pays: rp.pays } : rp)), rows = R.actifs, tous = [...R.actifs, ...R.inactifs, ...R.masques, ...R.desactives];
  if (rp.sel === undefined && tous.length && !spTous) rp.sel = rpKey(rows[0] || tous[0]);
  const selR = rpRowSel();
  if (selR) rpDetLoad(selR);
  const tbl = spTous ? (ls) => rpSpOffresHtml(ls, rp.spTri) : rpOffresHtml;
  const spCle = [porte, rp.tab, rp.pays, rp.sit].join("|");
  if (rp.spCle !== spCle) { rp.spCle = spCle; rp.spN = 0; }
  const spN = Math.max(RP_SP_PAGE, rp.spN || 0), spVus = spTous ? rpSpTri(rows, rp.spTri).slice(0, spN) : rows;
  const spBarre = spTous ? rpSpBarreHtml(rpPorteLignes((rp.d?.rows || []).filter((r) => !Z || Z.has(r.marketplace)), "repricer").length, paysL, rp.pays, rp.spTri) : "";
  const pli = (id, ls) => (ls.length ? `<details class="rp-pli" data-rp-pli="${id}"${rp.plis[id] ? " open" : ""}><summary>${escapeHtml(t("rpPli_" + id, ls.length))}</summary>`
    + `<p class="rp-hint">${escapeHtml(t("rpPli_" + id + "D"))}</p>${tbl(ls)}</details>` : "");
  const table = spBarre + (rows.length ? tbl(spVus) + (spTous ? rpSpPiedHtml(spVus, rows.length) : "") : `<p class="rp-empty">${escapeHtml(t(tous.length ? "rpNoneActif" : rowsAll.length ? "rpNoneFiltre" : "rpNone"))}</p>`)
    + pli("inactifs", R.inactifs) + pli("masques", R.masques) + pli("desactives", R.desactives);
  const k = selR ? rpKey(selR) : null;
  const insp = selR ? `<aside class="rp-insp" aria-label="${escapeHtml(rpNom(selR))}">${rpPanneau(selR, rp.det[k], rp.ix[k] ?? 0, rpOpts(k))}</aside>` : "";
  sec.innerHTML = head + tabs + `<div class="rp-body"><div class="rp-card">${table}</div>${insp}</div>`;
  rpTabVisible(sec);
}
function rpTabVisible(sec) {
  const tb = sec.querySelector(".rp-tabs"), on = tb?.querySelector("button.on");
  if (!on || tb.scrollWidth <= tb.clientWidth) return;
  const d = on.getBoundingClientRect().right - tb.getBoundingClientRect().right;
  if (d > 0) tb.scrollLeft += d + 12;
}
function rpBind() {
  const sec = document.getElementById("t1Repricer");
  if (!sec || sec.dataset.rpBound) return;
  sec.dataset.rpBound = "1";
  const choisir = (tr) => {
    if (rp.sel === tr.dataset.rpK) return rpPaint();
    rp.sel = tr.dataset.rpK; rp.msg = null; if (rp.detSt[rp.sel] === "err") delete rp.detSt[rp.sel];
    rpPaint();
    if (typeof matchMedia === "function" && matchMedia("(max-width: 599px)").matches) sec.querySelector(".rp-insp")?.scrollIntoView({ block: "start", behavior: "smooth" });
  };
  sec.addEventListener("click", (e) => {
    if (e.target.closest("[data-rp-sp-creer]")) {
      rp.tab = "regles"; rp.sel = undefined; rp.prod = null; rp.bib.pend = null; rp.bib.aff = null; rp.bib.flash = null;
      return rpEdOuvrir({ ch: { ...rpEdChamps({ modele: "prudent", regle: RP_MODELES.prudent }), nom: "", facon: "concurrents" } });
    }
    const st = e.target.closest("[data-rp-sptri]");
    if (st) { const c = st.dataset.rpSptri, o = rpSpTriDe(rp.spTri); rp.spTri = { c, d: o.c === c ? -o.d : 1 }; rpPaint(); sec.querySelector(`[data-rp-sptri="${c}"]`)?.focus(); return; }
    if (e.target.closest("[data-rp-spplus]")) { rp.spN = Math.max(RP_SP_PAGE, rp.spN || 0) + RP_SP_PAGE; return rpPaint(); }
    if (rpCoClic(e)) return;
    if (rpBibClic(e)) return;
    const jr = rp.tab === "journal" ? e.target.closest("tr[data-rp-jr]") : null;
    if (jr) { const k = jr.dataset.rpJr; rp.jOuv[k] = !rp.jOuv[k]; rpPaint(); sec.querySelector(`[data-rp-jx="${CSS.escape(k)}"]`)?.focus(); return; }
    const jt = rp.tab === "journal" ? e.target.closest("[data-rp-jtout]") : null;
    if (jt) { rp.jTout = jt.dataset.rpJtout === "1"; rpPaint(); sec.querySelector("[data-rp-jtout]")?.focus(); return; }
    const rt = e.target.closest("[data-rp-rf-test]");
    if (rt && !rt.disabled) { rp.plis.d_test = !rp.plis.d_test; rpPaint(); sec.querySelector(".rp-det [data-rp-rf-test]")?.focus(); return; }
    const tb = e.target.closest("[data-rp-tab]");
    if (tb) { rp.tab = tb.dataset.rpTab; rp.sel = undefined; rp.recap = null; rp.rMsg = null; rp.prod = null; rp.bib.pend = null; rp.bib.flash = null; rp.bib.aff = null; if (rp.tab === "journal") return rpJLoad(true); return rpPaint(); }
    if (e.target.closest("[data-rp-close]")) {
      const k0 = rp.sel; rp.sel = null; rp.recap = null; rp.msg = null; rp.vMsg = null; rp.iMsg = null; rpPaint();
      if (k0 && rp.tab === "conseils") sec.querySelector(`[data-rp-fk="${CSS.escape(k0)}"]`)?.focus();
      return;
    }
    const sm = e.target.closest(".rp-pli > summary");
    if (sm) { rp.plis[sm.parentElement.dataset.rpPli] = !sm.parentElement.open; return; }
    const go = e.target.closest("[data-rp-propose]");
    if (go && !go.disabled) return rpPropose();
    const va = e.target.closest("[data-rp-valider]");
    if (va && !va.disabled) return rpValiderConseil();
    const ro = e.target.closest("[data-rp-recap-ouvrir], [data-rp-recap-retour]");
    if (ro && !ro.disabled) {
      const ouvrir = ro.hasAttribute("data-rp-recap-ouvrir");
      rp.recap = ouvrir ? rp.sel : null; rp.vMsg = null; rpPaint();
      sec.querySelector(ouvrir ? ".rp-det [data-rp-recap] h4" : ".rp-det [data-rp-recap-ouvrir]")?.focus();
      return;
    }
    const ig = e.target.closest("[data-rp-ignorer], [data-rp-retirer]");
    if (ig && !ig.disabled) return rpIgnorer(ig.hasAttribute("data-rp-ignorer") ? "ignorer" : "retirer");
    const fk = e.target.closest("[data-rp-fk]");
    if (fk) return rpOuvrir(fk.dataset.rpFk);
    const tr = e.target.closest("tr[data-rp-k], button[data-rp-k]");
    if (tr) choisir(tr);
  });
  sec.addEventListener("keydown", (e) => { if (rpBibKey(e)) return; const tr = e.target.closest?.("tr[data-rp-k]"); if (tr && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); choisir(tr); } });
  sec.addEventListener("change", (e) => {
    if (rpCoChange(e)) return;
    if (rpBibChange(e)) return;
    if (e.target.matches("[data-rp-pays]")) { rp.pays = e.target.value; rp.sel = undefined; rpPaint(); }
    if (e.target.matches("[data-rp-retri]")) { const [c, d] = e.target.value.split(":"); rp.reTri = { c, d: Number(d) === -1 ? -1 : 1 }; rpPaint(); document.querySelector("#t1Repricer [data-rp-retri]")?.focus(); }
    if (e.target.matches("[data-rp-sit]")) { rp.sit = e.target.value; rp.sel = undefined; rpPaint(); }
    if (e.target.matches("[data-rp-sptri-sel]")) { const [c, d] = e.target.value.split(":"); rp.spTri = rpSpTriDe({ c, d: Number(d) }); rpPaint(); }
  });
  sec.addEventListener("input", (e) => {
    if (rpBibInput(e)) return;
    const r = rpRowSel(), aside = sec.querySelector(".rp-insp");
    if (!e.target.matches("[data-rp-range]") || !r || !aside) return;
    rp.ix[rp.sel] = Number(e.target.value); rp.msg = null;
    const tpl = document.createElement("template");
    tpl.innerHTML = rpPanneau(r, rp.det[rp.sel], rp.ix[rp.sel], rpOpts(rp.sel));
    for (const n of tpl.content.querySelectorAll("[data-rp-dyn]")) aside.querySelector(`[data-rp-dyn="${n.dataset.rpDyn}"]`)?.replaceWith(n);
    e.target.setAttribute("aria-valuetext", aside.querySelector('[data-rp-dyn="val"]')?.textContent ?? "");
  });
}
function rpOuvrir(k) {
  const sec = document.getElementById("t1Repricer");
  if (rp.sel !== k) { rp.sel = k; rp.recap = null; rp.msg = null; rp.vMsg = null; rp.iMsg = null; if (rp.detSt[k] === "err") delete rp.detSt[k]; }
  rpPaint();
  const tel = typeof matchMedia === "function" && matchMedia("(max-width: 599px)").matches;
  if (tel) sec?.scrollIntoView({ block: "start" });
  sec?.querySelector(tel ? ".rp-det .rp-back" : ".rp-det .rp-x")?.focus({ preventScroll: true });
}
async function rpValiderConseil() {
  const r = rpRowSel(), k = r ? rpKey(r) : null, d = k ? rp.det[k] : null, c = r?.conseil;
  if (rp.busy || !rpPeutValider(r, d, rp.d?.verrouPrix).ok) return;
  rp.busy = true; rp.vMsg = null; rpPaint();
  try {
    const res = await apiTexte("/demo-hors-ligne/changes/propose", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "listing_set_price", args: { marketplace: r.marketplace, sku: r.sku, price: c.prix, attendu: r.ombre.prixActuel,
        ...(Number.isSafeInteger(r.ombre?.id) && r.ombre.id > 0 ? { conseilId: r.ombre.id } : {}) } }) });
    let j = null; try { j = JSON.parse(res.texte); } catch {   }
    if (res.status === 409 && j?.code === "SITUATION_CHANGEE") {
      rp.sitChg[k] = r.ombre?.decideLe ?? "";
      rp.vMsg = { k, ko: true, text: t("rpD_sitPrix", typeof j.relu === "number" ? rpM(j.relu, r.devise) : "—") };
    } else if (!res.ok || !j?.change_id) rp.vMsg = { k, ko: true, text: t("rpPropErr", (typeof wgMargeMotif === "function" ? wgMargeMotif(String(j?.code ?? ""), j?.marge) : null) || j?.error || j?.code || "HTTP " + res.status) };
    else {
      const lc = rpPointAuPrix(r, d, c.prix);
      rp.prop[j.change_id] = { nom: rpNom(r) || null, mp: r.marketplace, devise: r.devise || null, benAvant: d ? rpBenDe(d, { beneficeAvantPub: d.avant?.beneficeAvantPub }).v : null,
        benApres: d && lc ? rpBenDe(d, lc).v : null, apresPub: typeof d?.publiciteParUnite?.valeur === "number", perdue: r.situation === "perdue" };
      if (j.refus_initial) rp.vMsg = { k, ko: true, text: t("rpPropSousMarge") };
      if (typeof wgPoll === "function") wgPoll();
      rp.recap = null;
      rp.busy = false; await rpLoad(true);
    }
  } catch (e) { rp.vMsg = { k, ko: true, text: t("rpPropErr", String((e && e.message) || e)) }; }
  finally { rp.busy = false; rpPaint(); }
}
async function rpIgnorer(op) {
  const r = rpRowSel(), k = r ? rpKey(r) : null;
  if (rp.busy || !r || !r.sku || rp.d?.ignores?.etat !== "ok") return;
  if (op === "ignorer" && !rpIgnPermis(r, rp.det[k])) return;
  if (op === "retirer" && r.ignore?.actif !== true) return;
  const h = rpHeure(r.ombre?.decideLe) || "—";
  rp.busy = true; rp.iMsg = null; rpPaint();
  try {
    const x = await rpPut("/demo-hors-ligne/repricer/ignores", op === "ignorer" ? { op, marketplace: r.marketplace, sku: r.sku, empreinteLue: r.ombre.empreinteIgnore } : { op, marketplace: r.marketplace, sku: r.sku });
    if (!x.ok) rp.iMsg = { k, ko: true, text: t("rpD_ignErr", x.j?.error || x.j?.code || "HTTP " + x.status) };
    else {
      await rpLoad(true);
      const r2 = rpLignesFile(rp.d?.rows).get(k) || null, actif = r2?.ignore?.actif === true;
      rp.iMsg = rp.st === "err" ? { k, ko: true, text: t("rpD_ignRelErr") }
        : op === "ignorer" ? { k, ko: false, text: actif ? t("rpD_ignOk", h) : t("rpD_ignNouveau") }
        : { k, ko: actif, text: actif ? t("rpD_ignRetEncore") : t("rpD_ignRetOk") };
    }
  } catch (e) { rp.iMsg = { k, ko: true, text: t("rpD_ignErr", String((e && e.message) || e)) }; }
  finally { rp.busy = false; rpPaint(); }
}
async function rpPropose() {
  const r = rpRowSel(), k = r ? rpKey(r) : null, d = k ? rp.det[k] : null, l = d?.lignes?.[rp.ix[k] ?? 0];
  if (rp.busy || !r || !r.sku || !l) return;
  rp.busy = true; rp.msg = null; rpPaint();
  try {
    const res = await apiTexte("/demo-hors-ligne/changes/propose", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "listing_set_price", args: { marketplace: r.marketplace, sku: r.sku, price: l.prix } }) });
    let j = null; try { j = JSON.parse(res.texte); } catch {   }
    if (!res.ok || !j?.change_id) rp.msg = { ko: true, text: t("rpPropErr", (typeof wgMargeMotif === "function" ? wgMargeMotif(String(j?.code ?? ""), j?.marge) : null) || j?.error || j?.code || "HTTP " + res.status) };
    else {
      rp.prop[j.change_id] = { nom: rpNom(r) || null, mp: r.marketplace, devise: r.devise || null, benAvant: rpBenDe(d, { beneficeAvantPub: d.avant?.beneficeAvantPub }).v,
        benApres: rpBenDe(d, l).v, apresPub: typeof d.publiciteParUnite?.valeur === "number", perdue: r.situation === "perdue" };
      const relu = j.before?.price;
      rp.msg = typeof relu === "number" && rpCents(relu) !== rpCents(r.prixActuel) ? { ko: false, text: t("rpPropRelu", rpM(relu, r.devise)) } : null;
      if (j.refus_initial) rp.msg = { ko: true, text: t("rpPropSousMarge") + (rp.msg ? " " + rp.msg.text : "") };
      if (typeof wgPoll === "function") wgPoll();
      rp.busy = false; await rpLoad(true);
    }
  } catch (e) { rp.msg = { ko: true, text: t("rpPropErr", String((e && e.message) || e)) }; }
  finally { rp.busy = false; rpPaint(); }
}
const rpLib = () => rp.d?.bibliotheque || [];
const rpRow = (k) => (rp.d?.rows || []).find((r) => rpKey(r) === k) || null;
function rpAffPaysDefaut(s) {
  const asins = new Set(s.sel), x = s.id ? rpLib().find((y) => y.id === s.id) : null;
  return [...new Set((rp.d?.rows || []).filter((r) => asins.has(r.asin)).map((r) => r.marketplace))].filter((c) => !(x && Array.isArray(x.pays)) || x.pays.includes(c)).sort();
}
function rpPaysListe(extra = []) { return [...new Set([...(rp.d?.rows || []).map((r) => r.marketplace), ...extra])].sort(); }
function rpExCtx() {
  const rows = rp.d?.rows || [], ok = (r) => r && rp.det[rpKey(r)]?.lignes?.length && rp.det[rpKey(r)].coutAchat?.valeur > 0;
  const r = [rpRowSel(), ...rows].find(ok);
  if (r) return { nom: rpNom(r), mp: r.marketplace, d: rp.det[rpKey(r)] };
  const c = rows.find((x) => x.sku && x.enVente !== false && rp.detSt[rpKey(x)] !== "err" && rp.detSt[rpKey(x)] !== "load");
  if (c) rpDetLoad(c);
  return null;
}
function rpCoComparables(r) {
  const d = rp.det[rpKey(r)];
  if (!d) { if (r.sku && rp.detSt[rpKey(r)] !== "err") rpDetLoad(r); return null; }
  return (Array.isArray(d.concurrents) ? d.concurrents : []).filter((c) => c?.format?.comparable === true && c.asin).map((c) => ({ asin: c.asin, nom: c.titre ? rpNomCourt(c.titre, 32) : c.asin }));
}
function rpEcExCtx(rPropre = null) {
  const rows = rp.d?.rows || [], sp = (r) => rpFcDe(r) === "concurrents";
  const ok = (r) => { const d = r && rp.det[rpKey(r)]; return !!d && !!d.lignes?.length && d.coutAchat?.valeur > 0 && (d.concurrents || []).some((c) => c?.format?.comparable === true); };
  const ordre = [rPropre, rpRowSel(), ...rows.filter(sp), ...rows.filter((r) => !sp(r))].filter(Boolean);
  const r = ordre.find(ok);
  if (r) return { nom: rpNom(r), mp: r.marketplace, d: rp.det[rpKey(r)] };
  const c = ordre.slice(0, 6).find((x) => x.sku && x.enVente !== false && !rp.det[rpKey(x)] && rp.detSt[rpKey(x)] !== "err" && rp.detSt[rpKey(x)] !== "load");
  if (c) rpDetLoad(c);
  return null;
}
function rpEdCtx(ed) {
  const e = ed.id ? rpLib().find((x) => x.id === ed.id) : null, r = ed.k ? rpRow(ed.k) : null;
  return { paysListe: rpPaysListe(ed.ch.pays), affectes: e?.affectes ?? 0, ex: rpExCtx(), nomLu: ed.base ? rpNomR(ed.base) : undefined, modifieLe: e?.modifieLe,
    devise: r ? r.devise : rpDevise(rp.d?.rows), qui: r ? `${rpNom(r)} · ${r.marketplace}` : "",
    faconLe: e ? e.faconLe ?? null : r?.regle?.source === "produit" ? r.regle.faconLe ?? null : null, ecEx: ed.ch.facon === "concurrents" ? rpEcExCtx(r) : null,
    coChoix: ed.ch.facon === "concurrents" && r ? rpCoComparables(r) : null };
}
function rpEdOuvrir({ mode = "nommee", e = null, ch, k = null }) {
  const o = document.activeElement?.closest?.("[data-rb-edit],[data-rb-new],[data-rb-tpl],[data-rb-dup],[data-rb-propre],[data-rb-ajpays],[data-rb-menu]") || null;
  const a = o ? o.getAttributeNames().find((n) => /^data-rb-(edit|new|tpl|dup|propre|ajpays|menu)$/.test(n)) : null;
  rp.bib.retour = a ? `[${a}${o.getAttribute(a) ? `="${CSS.escape(o.getAttribute(a))}"` : ""}]` : null;
  const base = ch || rpEdChamps(e);
  rp.bib.ed = { mode, id: e?.id ?? null, versionLue: mode === "propre" ? rpVPropre(rpRow(k)) : e?.version ?? 0,
    base: e ? rpEdChamps(e) : mode === "propre" ? base : { ...base, facon: "" }, k, busy: false, ko: null, cfl: null, tente: false,
    ch: { ...base, pays: [...(base.pays || [])], ...(!e && mode !== "propre" ? { ecLu: "", vfLu: "" } : {}) } };
  rp.bib.menu = null;
  rpPaint();
  setTimeout(() => { const d = document.querySelector(".rb-dlg"); d?.scrollIntoView?.({ block: "start" }); d?.querySelector("input:not([disabled])")?.focus({ preventScroll: true }); }, 0);
}
function rpEdFermer() {
  if (rp.bib.ed?.busy) return;
  rp.bib.ed = null; rpPaint();
  const r = rp.bib.retour; rp.bib.retour = null;
  if (r) [...document.querySelectorAll(`#t1Repricer ${r}`)].find((x) => x.offsetParent !== null)?.focus();
}
function rpEdMaj() {
  const ed = rp.bib.ed, dlg = document.querySelector(".rb-dlg");
  if (!ed || !dlg) return;
  const tpl = document.createElement("template");
  tpl.innerHTML = rpEditeurHtml(ed, rpEdCtx(ed));
  for (const n of tpl.content.querySelectorAll("[data-rb-dyn]")) dlg.querySelector(`[data-rb-dyn="${n.dataset.rbDyn}"]`)?.replaceWith(n);
  for (const n of tpl.content.querySelectorAll(".rb-inp")) { const f = n.querySelector("[data-rb-f]")?.dataset.rbF, cible = f && dlg.querySelector(`.rb-inp [data-rb-f="${f}"]`)?.parentElement; if (cible) cible.className = n.className; }
}
async function rpPut(chemin, corps) {
  const res = await apiTexte(chemin, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corps) });
  let j = null;
  try { j = JSON.parse(res.texte); } catch (e) { void e;   }
  return { ok: res.ok, status: res.status, j };
}
async function rpEdSave() {
  const ed = rp.bib.ed;
  if (!ed || ed.busy) return;
  ed.tente = true;
  const v = rpEdValider(ed);
  if (v.erreur) { rpPaint(); return; }
  ed.busy = true; ed.ko = null; rpPaint();
  try {
    let w;
    if (ed.mode === "propre") {
      const r = rpRow(ed.k);
      if (!r || !r.sku) { ed.ko = t("rpEd_ko", t("rpR_sansSku")); return; }
      w = await rpPut("/demo-hors-ligne/repricer/regles", rpPropreCorps(r, v.regle));
      if (w.status === 409) { ed.ko = t("rpEd_cflProp"); return; }
    } else {
      const ch = ed.ch, versionLue = ed.cfl ? ed.cfl.actuelle.version : ed.versionLue;
      w = await rpPut("/demo-hors-ligne/repricer/bibliotheque", { op: ed.id ? "modifier" : "creer", ...(ed.id ? { id: ed.id, versionLue } : {}), nom: rpNomEnvoi(ed.id ? rpLib().find((x) => x.id === ed.id) : null, String(ch.nom).trim()), modele: ch.modele,
        regle: v.regle, pays: ch.paysTous ? "tous" : ch.pays });
      if (w.status === 409 && w.j?.code === "CONFLIT" && w.j.actuelle) {
        if (ed.cfl) { ed.base = rpEdChamps(ed.cfl.actuelle); ed.versionLue = ed.cfl.actuelle.version; }
        const f = rpFusion(ed.base, ed.ch, rpEdChamps(w.j.actuelle));
        ed.cfl = { actuelle: w.j.actuelle, lignes: f.lignes, saisie: { ...ed.ch, pays: [...(ed.ch.pays || [])] }, trouve: rpEdChamps(w.j.actuelle), choix: {} };
        ed.ch = f.ch; ed.enHaut = true; return;
      }
    }
    if (!w.ok) { ed.ko = t("rpEd_ko", w.j?.error || "HTTP " + w.status); return; }
    rp.bib.ed = null; rp.bib.flash = { ko: false, text: t("rpLb_okMsg") }; rp.bib.res = {};
    rp.det = {}; rp.detSt = {}; rp.ix = {};
    ed.busy = false; await rpLoad(true);
  } catch (e) { ed.ko = t("rpEd_ko", String((e && e.message) || e)); }
  finally { ed.busy = false; rpPaint(); }
}
async function rpValider() {
  const p = rp.bib.pend;
  if (!p || rp.bib.busy) return;
  rp.bib.busy = true; rp.bib.msg = null; rpPaint();
  try {
    let w;
    if (p.type === "appliquer" || p.type === "affecter") {
      w = await rpPut("/demo-hors-ligne/repricer/affectations", { lignes: p.lignes });
      if (w.ok) {
        const refusees = (w.j.refusees || []).map((x) => ({ ...x, nom: rpNom(rpRow(`${x.marketplace}|${x.sku}`) || {}) }));
        const r = { type: "affecte", ok: (w.j.ecrites || []).length, tot: p.lignes.length, refusees };
        if (p.id) rp.bib.res = { ...rp.bib.res, [p.id]: r };
        else rp.bib.flash = refusees.length ? { ko: true, text: t("rpLb_resPart", r.ok, r.tot, refusees.length) + " — " + refusees.map((x) => `${x.nom || x.sku} · ${x.marketplace} : ${t("rpLb_r_" + x.raison)}`).join(" ; ") }
          : { ko: false, text: t("rpLb_resOk", r.ok) };
      }
    } else if (p.type === "archiver") {
      w = await rpPut("/demo-hors-ligne/repricer/bibliotheque", { op: "archiver", id: p.id, versionLue: p.versionLue });
      if (w.status === 409 && w.j?.code === "UTILISEE") { rp.bib.res = { ...rp.bib.res, [p.id]: { type: "refusSupp", n: w.j.n } }; rp.bib.pend = null; return; }
      if (w.ok) rp.bib.flash = { ko: false, text: t("rpLb_archOk", p.nom) };
    } else if (p.type === "restaurer") {
      w = await rpPut("/demo-hors-ligne/repricer/bibliotheque", { op: "restaurer", id: p.id });
      if (w.ok) rp.bib.flash = { ko: false, text: t("rpLb_restOk", p.nom) };
    } else if (p.type === "retirer") {
      const r = rpRow(p.k);
      w = await rpPut("/demo-hors-ligne/repricer/regles", rpPropreCorps(r, null));
      if (w.ok) rp.bib.flash = { ko: false, text: t("rpLb_retOk") };
    }
    if (!w || !w.ok) { rp.bib.msg = { ko: true, text: t("rpLb_ko", w?.j?.error || (w ? "HTTP " + w.status : "?")) }; return; }
    rp.bib.pend = null; rp.det = {}; rp.detSt = {}; rp.ix = {};
    rp.bib.busy = false; await rpLoad(true);
  } catch (e) { rp.bib.msg = { ko: true, text: t("rpLb_ko", String((e && e.message) || e)) }; }
  finally { rp.bib.busy = false; rpPaint(); }
}
function rpPend(p) { rp.bib.pend = p; rp.bib.msg = null; rp.bib.menu = null; rpPaint(); document.querySelector("[data-rb-vok]")?.focus(); }
function rpBibClic(e) {
  const at = (a) => e.target.closest(`[${a}]`), val = (a) => at(a)?.getAttribute(a);
  const lib = rpLib(), regle = (id) => lib.find((x) => x.id === id) || null;
  if (rpEdVisible()) {
    if (at("data-rb-close")) { rpEdFermer(); return true; }
    if (at("data-rb-save")) { if (at("data-rb-save").getAttribute("aria-disabled") !== "true") rpEdSave(); return true; }
    const pli = val("data-rb-pli");
    if (pli) { rp.bib.ed.plis = { ...rp.bib.ed.plis, [pli]: at("data-rb-pli").getAttribute("aria-expanded") !== "true" }; rpPaint(); return true; }
    const pf = val("data-rb-facon");
    if (pf && RP_FACONS.includes(pf)) { rp.bib.ed.ch.facon = pf; rp.bib.ed.plis = { ...rp.bib.ed.plis, mode: true }; rpPaint(); document.querySelector(`#t1Repricer [data-rb-f="facon"][value="${pf}"]`)?.focus(); return true; }
    if (at("data-rb-abandon")) { const a = rp.bib.ed.cfl.actuelle; Object.assign(rp.bib.ed, { base: rpEdChamps(a), ch: rpEdChamps(a), versionLue: a.version, cfl: null, ko: null }); rpPaint(); return true; }
    return !!e.target.closest(".rb-dlg");
  }
  if (at("data-rb-vcancel")) { if (!rp.bib.busy) { rp.bib.pend = null; rp.bib.msg = null; rpPaint(); } return true; }
  if (at("data-rb-vok")) { rpValider(); return true; }
  if (at("data-rb-defs")) { rp.bib.defs = !rp.bib.defs; rpPaint(); return true; }
  if (at("data-rb-journal")) { rp.tab = "journal"; rp.prod = null; rpJLoad(true); return true; }
  const vo = val("data-rb-voir");
  if (vo) { rp.bib.voir[vo] = !rp.bib.voir[vo]; rpPaint(); return true; }
  if (at("data-rb-reload")) { rpLoad(true); return true; }
  if (at("data-rb-menu")) { const id = val("data-rb-menu"); rp.bib.menu = rp.bib.menu === id ? null : id; rpPaint(); document.querySelector(".rb-pmenu [role=menuitem]")?.focus(); return true; }
  const nouveau = at("data-rb-new"), tpl = val("data-rb-tpl");
  if (nouveau && !nouveau.disabled) { rpEdOuvrir({ ch: { ...rpEdChamps({ modele: "prudent", regle: RP_MODELES.prudent }), nom: "" } }); return true; }
  if (tpl && !at("data-rb-tpl").disabled) { rpEdOuvrir({ ch: rpEdChamps({ nom: t("rpLb_n_" + tpl), modele: tpl, regle: RP_MODELES[tpl] }) }); return true; }
  const ed = val("data-rb-edit");
  if (ed && !at("data-rb-edit").disabled) { const x = regle(ed); if (x) rpEdOuvrir({ e: x }); return true; }
  const dup = val("data-rb-dup");
  if (dup && !at("data-rb-dup").disabled) { const x = regle(dup); if (x) rpEdOuvrir({ ch: { ...rpEdChamps(x), nom: t("rpLb_copie", rpNomR(x)).slice(0, 80) } }); return true; }
  const del = val("data-rb-del");
  if (del && !at("data-rb-del").disabled) {
    const x = regle(del); if (!x) return true;
    if (x.affectes > 0) { rp.bib.res = { ...rp.bib.res, [x.id]: { type: "refusSupp", n: x.affectes } }; rp.bib.menu = null; rpPaint(); return true; }
    rpPend({ type: "archiver", id: x.id, versionLue: x.version, nom: rpNomR(x), titre: t("rpLb_vb_archiver", rpNomR(x)), detail: t("rpLb_vb_archiverD") }); return true;
  }
  const ap = val("data-rb-apply");
  if (ap && !at("data-rb-apply").disabled) {
    const x = regle(ap); if (!x) return true;
    const a = rpApercuAppliquer(x, rp.d?.rows || []);
    if (!a.lignes.length) { rp.bib.flash = { ko: false, text: t("rpLb_rien", rpNomR(x)) }; rpPaint(); return true; }
    rpPend({ type: "appliquer", id: x.id, apercu: a, lignes: a.lignes, titre: t("rpLb_vb_affect", rpNomR(x), x.version, a.lignes.length, a.propres), detail: t("rpLb_vb_affectD") }); return true;
  }
  const rt = val("data-rb-retry");
  if (rt) {
    const x = regle(rt), ko = rp.bib.res[rt]?.refusees || [];
    const lignes = ko.map((y) => rpRow(`${y.marketplace}|${y.sku}`)).filter(Boolean).map((r) => ({ marketplace: r.marketplace, sku: r.sku, id: rt, versionLue: rpVAff(r) }));
    if (x && lignes.length) rpPend({ type: "appliquer", id: rt, apercu: { ...rpApercuAppliquer(x, (rp.d?.rows || []).filter((r) => lignes.some((l) => l.sku === r.sku && l.marketplace === r.marketplace))) }, lignes, titre: t("rpLb_vb_affect", rpNomR(x), x.version, lignes.length, 0), detail: t("rpLb_vb_affectD") });
    return true;
  }
  const rest = val("data-rb-rest");
  if (rest && !at("data-rb-rest").disabled) { const x = regle(rest); rpPend({ type: "restaurer", id: rest, nom: (x ? rpNomR(x) : rest), titre: t("rpLb_vb_restaurer", (x ? rpNomR(x) : rest)), detail: "" }); return true; }
  if (at("data-rb-aff") && !at("data-rb-aff").disabled) { rp.bib.aff = { sel: [], id: "", pays: [] }; rp.bib.pend = null; rpPaint(); return true; }
  const ap2 = val("data-rb-affprod");
  if (ap2 && !at("data-rb-affprod").disabled) {
    rp.tab = "regles"; rp.prod = null;
    rp.bib.aff = { sel: [ap2], id: "", pays: [...new Set((rp.d?.rows || []).filter((r) => r.asin === ap2).map((r) => r.marketplace))] }; rp.bib.pend = null; rpPaint(); return true;
  }
  if (at("data-rb-affclose")) { rp.bib.aff = null; if (rp.bib.pend?.type === "affecter" && !rp.bib.pend.k) rp.bib.pend = null; rpPaint(); return true; }
  const pt = val("data-rb-picktout");
  if (pt !== null && pt !== undefined) { rp.bib.aff.sel = pt === "1" ? [...new Set((rp.d?.rows || []).map((r) => r.asin))] : []; if (!rp.bib.aff.paysMain) rp.bib.aff.pays = rpAffPaysDefaut(rp.bib.aff); rpAffPend(); return true; }
  const pr = val("data-rb-prod");
  if (pr) { rp.prod = pr; rp.tab = "tous"; rp.bib.pend = null; rpPaint(); window.scrollTo?.(0, 0); return true; }
  if (at("data-rb-retour")) { rp.prod = null; if (rp.bib.pend?.k) rp.bib.pend = null; rpPaint(); return true; }
  const tg = val("data-rb-tog");
  if (tg) { rp.pOuv[tg] = !rp.pOuv[tg]; rpPaint(); document.querySelector(`[data-rb-tog="${CSS.escape(tg)}"]`)?.focus(); return true; }
  const ret = val("data-rb-retirer");
  if (ret) { const r = rpRow(ret); if (r) rpPend({ type: "retirer", k: ret, titre: t("rpLb_vb_retirer", `${rpNom(r)} · ${r.marketplace}`), detail: t("rpLb_vb_retirerD") }); return true; }
  const pp = val("data-rb-propre");
  if (pp) { const r = rpRow(pp); if (r) rpEdOuvrir({ mode: "propre", k: pp, ch: { ...rpRegleChamps(r.regle?.source === "produit" ? r.regle : r.regle || rp.d?.regleDefaut), ...(r.regle?.source === "produit" ? {} : { facon: "" }), ...rpEcartChamps(r.regle?.source === "produit" ? r.regle.concurrents : null), ...rpVfChamps(r.regle?.source === "produit" ? r.regle.vendeursFiche : null), nom: "", modele: "personnalise", paysTous: true, pays: [] } }); return true; }
  const aj = val("data-rb-ajpays");
  if (aj) { const [id, mp] = aj.split("|"), x = regle(id); if (x) { const ch = rpEdChamps(x); if (!ch.paysTous && !ch.pays.includes(mp)) ch.pays.push(mp); rpEdOuvrir({ e: x }); rp.bib.ed.ch = ch; rpPaint(); } return true; }
  const fo = val("data-rb-focus");
  if (fo) { document.querySelector(`[data-rb-affsel="${CSS.escape(fo)}"]`)?.focus(); return true; }
  if (rp.bib.menu && !e.target.closest(".rb-pmenu")) { rp.bib.menu = null; rpPaint(); return true; }
  return false;
}
function rpAffPend() {
  const s = rp.bib.aff, x = rpLib().find((y) => y.id === s.id);
  const A = rpAffApercu(s, rp.d?.rows || [], rpLib());
  rp.bib.pend = x && A.lignes.length ? { type: "affecter", id: null, lignes: A.lignes, titre: t("rpLb_vb_affect", rpNomR(x), x.version, A.lignes.length, A.propres), detail: t("rpLb_vb_affMulti", s.sel.length, s.pays.length) } : null;
  rpPaint();
}
function rpBibChange(e) {
  const el = e.target, ed = rp.bib.ed;
  if (ed && el.closest(".rb-dlg") && el.matches("[data-rb-choix]")) {
    const k = el.dataset.rbChoix, src = el.value === "trouve" ? ed.cfl.trouve : ed.cfl.saisie;
    ed.cfl.choix = { ...ed.cfl.choix, [k]: el.value };
    if (k === "pays") { ed.ch.paysTous = src.paysTous; ed.ch.pays = [...(src.pays || [])]; } else if (k === "ecart") { for (const f of RP_EC_CHAMPS) ed.ch[f] = src[f]; } else if (k === "vf") { for (const f of RP_VF_CHAMPS) ed.ch[f] = src[f]; } else ed.ch[k] = src[k];
    rpPaint(); return true;
  }
  if (ed && el.closest(".rb-dlg")) {
    if (el.matches("[data-rb-pays]")) { const c = el.value; ed.ch.pays = el.checked ? [...new Set([...ed.ch.pays, c])] : ed.ch.pays.filter((x) => x !== c); rpPaint(); return true; }
    const f = el.dataset.rbF;
    if (f === "paysTous") { ed.ch.paysTous = el.value === "1"; if (!ed.ch.paysTous && !ed.ch.pays.length) ed.ch.pays = rpPaysListe(); rpPaint(); return true; }
    if (f === "modele") {
      ed.ch.modele = el.value;
      if (RP_MODELES[el.value]) Object.assign(ed.ch, { ...rpRegleChamps(RP_MODELES[el.value]), facon: ed.ch.facon });
      rpPaint(); return true;
    }
    if (f === "mode" || f === "modeMax" || f === "facon") { ed.ch[f] = el.value; rpPaint(); return true; }
    if (f === "vfChoix" || f === "vfUnite" || f === "vfSens" || f === "vfExp") {
      ed.ch[f] = el.value; ed.ko = null; rpPaint();
      if (f === "vfChoix" && el.value === "autre") document.getElementById?.("rbF_vfVal")?.focus();
      return true;
    }
    if (f === "ecartChoix" || f === "cible" || f === "ecartUnite" || f === "ecartSens") {
      ed.ch[f] = el.value; ed.ko = null; rpPaint();
      const id = f === "ecartChoix" && el.value === "autre" ? "rbF_ecartVal" : f === "cible" && el.value === "choisi" ? "rbF_cibleAsin" : null;
      if (id) document.getElementById?.(id)?.focus();
      return true;
    }
    return true;
  }
  const as = el.dataset.rbAffsel;
  if (as !== undefined) {
    const r = rpRow(as), x = rpLib().find((y) => y.id === el.value) || null;
    if (!r) return true;
    rpPend({ type: "affecter", k: as, lignes: [{ marketplace: r.marketplace, sku: r.sku, id: x ? x.id : null, versionLue: rpVAff(r) }],
      titre: x ? t("rpLb_vb_affect", rpNomR(x), x.version, 1, r.regle?.source === "produit" ? 1 : 0) : t("rpLb_vb_aucune", `${rpNom(r)} · ${r.marketplace}`), detail: `${rpNom(r)} · ${r.marketplace}` });
    return true;
  }
  if (el.matches("[data-rb-pick]")) { const s = rp.bib.aff; s.sel = el.checked ? [...new Set([...s.sel, el.dataset.rbPick])] : s.sel.filter((a) => a !== el.dataset.rbPick); if (!s.paysMain) s.pays = rpAffPaysDefaut(s); rpAffPend(); return true; }
  if (el.matches("[data-rb-affregle]")) { const s = rp.bib.aff, x = rpLib().find((y) => y.id === el.value); s.id = el.value; if (x && Array.isArray(x.pays)) s.pays = s.pays.filter((c) => x.pays.includes(c)); rpAffPend(); return true; }
  if (el.matches("[data-rb-affpays]")) { const s = rp.bib.aff; s.paysMain = true; s.pays = el.checked ? [...new Set([...s.pays, el.value])] : s.pays.filter((c) => c !== el.value); rpAffPend(); return true; }
  return false;
}
function rpBibInput(e) {
  const ed = rp.bib.ed, f = e.target.dataset?.rbF;
  if (!ed || !f || !e.target.closest(".rb-dlg") || e.target.type === "radio") return false;
  ed.ch[f] = e.target.value; ed.ko = null;
  rpEdMaj(); return true;
}
function rpEdVisible() { return !!rp.bib.ed && (rp.tab === "regles" || !!rp.prod); }
function rpBibKey(e) {
  if (e.key === "Escape" && rpEdVisible()) { e.preventDefault(); rpEdFermer(); return true; }
  if (e.key === "Escape" && rp.bib.menu) { const id = rp.bib.menu; rp.bib.menu = null; rpPaint(); document.querySelector(`[data-rb-menu="${CSS.escape(id)}"]`)?.focus(); return true; }
  return false;
}
function rpBibVue(rowsAll) {
  const flash = rp.bib.flash ? `<p class="rb-flash ${rp.bib.flash.ko ? "ko" : "ok"}" role="status">${escapeHtml(rp.bib.flash.text)}</p>` : "";
  const off = !!rp.d?.reglesErreur;
  let h;
  if (rp.prod) {
    const v = (r) => rpVentesHv(r) ?? -1;
    const rows = (rp.d?.rows || []).filter((r) => r.asin === rp.prod).sort((a, b) => v(b) - v(a) || a.marketplace.localeCompare(b.marketplace));
    for (const r of rows) if (r.sku) rpDetLoad(r);
    h = flash + rpPaysVueHtml(rows, { lib: rpLib(), det: rp.det, detSt: rp.detSt, ouverts: rp.pOuv, off, titres: rp.d?.titres });
  } else if (rp.bib.aff && rp.d && !off) h = flash + rpAffHtml(rp.bib.aff, rp.d.rows || [], rpLib());
  else h = flash + rpBibHtml(rp.d, { pend: rp.bib.pend, res: rp.bib.res, menu: rp.bib.menu, defs: rp.bib.defs, busy: rp.bib.busy, voir: rp.bib.voir });
  if (rp.bib.ed) return rpEditeurHtml(rp.bib.ed, rpEdCtx(rp.bib.ed));
  return h + rpVBarHtml(rp.bib.pend, { busy: rp.bib.busy, msg: rp.bib.msg });
}
function rpFocusCle() {
  const a = document.activeElement;
  if (!a || !a.closest?.("#t1Repricer")) return null;
  if (a.id) return "#" + CSS.escape(a.id);
  for (const n of a.getAttributeNames()) if (n.startsWith("data-rb-") || n.startsWith("data-rp-")) {
    const v = a.getAttribute(n);
    return `[${n}${v ? `="${CSS.escape(v)}"` : ""}]${a.type === "radio" || a.type === "checkbox" ? `[value="${CSS.escape(a.value)}"]` : ""}`;
  }
  return null;
}
function rpFocusRendre(sel) {
  if (!sel) return;
  const a = document.activeElement;
  if (a && a !== document.body && a.closest?.("#t1Repricer")) return;
  document.querySelector("#t1Repricer " + sel)?.focus();
}
