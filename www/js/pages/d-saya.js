(function () {
  const id = NL.S.get().did, d = NL.drv(id);
  const m = NL.page({ title: d ? d.name + ' - ' + NL.TYPES[d.type] : 'Driver' });
  if (!m) return;
  const l = NL.S.get().orders.filter(o => o.driverId === id);
  m.innerHTML = l.length ? l.map(o => NL.card(o, 'd-detail.html?id=' + o.id)).join('') : '<section class="card center"><p class="mute">Belum ada pesanan yang kamu ambil.</p></section>';
})();
