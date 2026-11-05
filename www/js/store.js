/* Penyimpanan lokal (localStorage) untuk semua halaman. Tanpa server atau database. */
(function () {
  'use strict';
  const KEY = 'nl_dummy_v2';
  let mem = null;

  function seed() {
    const list = [['Rizal', 'owner'], ['Dimas', 'lead'], ['Bagas', 'lead'], ['Fajar', 'regular'], ['Yoga', 'regular'],
      ['Hendra', 'regular'], ['Andi', 'support'], ['Rian', 'support'], ['Tono', 'support']];
    return {
      role: null, did: null, cust: null, seq: 0, orders: [], chats: {},
      tariff: { base: 5000, km: 2500, feeMin: 2000, feePct: 4 },
      drivers: list.map((d, i) => ({ id: i + 1, name: d[0], type: d[1], wa: '', on: true }))
    };
  }

  function get() {
    if (mem) return mem;
    try { const raw = localStorage.getItem(KEY); mem = raw ? JSON.parse(raw) : seed(); } catch (e) { mem = seed(); }
    return mem;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { /* data hanya di memori */ } }

  window.Store = { get, save, reset() { mem = seed(); save(); } };
})();
