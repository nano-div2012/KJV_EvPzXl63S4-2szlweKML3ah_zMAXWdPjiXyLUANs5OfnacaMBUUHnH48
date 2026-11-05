(function () {
  const m = NL.page({ title: 'Pesanan' });
  if (!m) return;
  const l = NL.S.get().orders;
  m.innerHTML = l.length ? l.map(o => NL.card(o, 'c-status.html?id=' + o.id)).join('') : '<section class="card center"><p class="mute">Belum ada pesanan. Pilih layanan di Home.</p></section>';
})();
