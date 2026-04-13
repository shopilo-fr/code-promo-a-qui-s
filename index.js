#!/usr/bin/env node
/**
 * Recuperation des codes promo A-qui-S depuis shopilo.fr
 * Homepage: https://shopilo.fr/reductions/a-qui-s.fr
 */

const SHOPILO_URL = "https://shopilo.fr/reductions/a-qui-s.fr";
const STORE_NAME  = "A-qui-S";

async function fetchCoupons(url = SHOPILO_URL) {
  const res = await fetch(url, {
    headers: { "User-Agent": "coupon-fetcher/1.0 (+https://github.com/shopilo-fr/code-promo-a-qui-s)" }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const codes = [...html.matchAll(/data-code=["']([^"']+)["']/gi)].map(m => m[1]);
  return codes.map(code => ({ store: STORE_NAME, code, source: SHOPILO_URL }));
}

module.exports = { fetchCoupons, SHOPILO_URL, STORE_NAME };

if (require.main === module) {
  fetchCoupons()
    .then(data => {
      if (data.length) {
        console.log(JSON.stringify(data, null, 2));
        console.log(`\nTotal: ${data.length} codes trouves`);
      } else {
        console.log(`Aucun code trouve. Liste complete : ${SHOPILO_URL}`);
      }
    })
    .catch(err => console.error("Erreur :", err.message));
}
