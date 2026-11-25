window.OB_DIFF_UI = {
  fr: { oui: "Oui", non: "Non", releve: "Relevé des concurrents : 12/11/2026" },
  en: { oui: "Yes", non: "No", releve: "Competitors checked on 12 Nov 2026" },
  es: { oui: "Sí", non: "No", releve: "Competidores revisados el 12/11/2026" },
  de: { oui: "Ja", non: "Nein", releve: "Wettbewerber geprüft am 12.11.2026" },
  it: { oui: "Sì", non: "No", releve: "Concorrenti verificati il 12/11/2026" },
  zh: { oui: "是", non: "否", releve: "竞品核查日期：2026 年 11 月 12 日" },
};
(function () {
const OUI = ["GTINPilot"], NON = ["SellerToolKit", "Sellerboard"];
window.OB_DIFF = {
  fr: { niveau: { q: "Voir le prix que le Repricer aurait mis, et pourquoi, sans rien envoyer ?", oui: OUI, non: NON },
    s_fiche: { q: "Voir chaque décision et sa raison avant d'autoriser le moindre envoi ?", oui: OUI, non: NON } },
  en: { niveau: { q: "See the price the Repricer would have set, and why, without sending anything?", oui: OUI, non: NON },
    s_fiche: { q: "See every decision and its reason before allowing any change to be sent?", oui: OUI, non: NON } },
  es: { niveau: { q: "¿Ver el precio que el Repricer habría puesto, y por qué, sin enviar nada?", oui: OUI, non: NON },
    s_fiche: { q: "¿Ver cada decisión y su motivo antes de autorizar cualquier envío?", oui: OUI, non: NON } },
  de: { niveau: { q: "Den Preis sehen, den der Repricer gesetzt hätte, und warum – ohne etwas zu senden?", oui: OUI, non: NON },
    s_fiche: { q: "Jede Entscheidung und ihren Grund sehen, bevor irgendeine Übermittlung erlaubt wird?", oui: OUI, non: NON } },
  it: { niveau: { q: "Vedere il prezzo che il Repricer avrebbe applicato, e perché, senza inviare nulla?", oui: OUI, non: NON },
    s_fiche: { q: "Vedere ogni decisione e il suo motivo prima di autorizzare qualsiasi invio?", oui: OUI, non: NON } },
  zh: { niveau: { q: "在不发送任何内容的情况下，查看 Repricer 本会设置的价格及其原因？", oui: OUI, non: NON },
    s_fiche: { q: "在允许任何发送之前，查看每个决定及其原因？", oui: OUI, non: NON } },
};
})();
