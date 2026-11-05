(function () {
  const d = NL.drv(NL.S.get().did);
  const m = NL.page({ title: d ? d.name + ' - ' + NL.TYPES[d.type] : 'Driver' });
  if (!m) return;
  const l = NL.S.get().orders.filter(o => o.status === 'pending');
  m.innerHTML = l.length ? l.map(o => NL.card(o, 'd-detail.html?id=' + o.id)).join('') : '<section class="card center"><p class="mute">Belum ada pesanan masuk. Buat pesanan dari sisi Customer.</p></section>';
})();
