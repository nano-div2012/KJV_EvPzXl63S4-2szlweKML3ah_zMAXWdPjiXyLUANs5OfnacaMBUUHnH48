(function () {
  const id = NL.q('id'), o = NL.ord(id), me = NL.drv(NL.S.get().did);
  const m = NL.page({ title: 'Detail pesanan', back: 'd-masuk.html', tab: 'd-masuk.html' });
  if (!m) return;
  if (!o) { m.innerHTML = '<p class="mute">Pesanan tidak ditemukan.</p>'; return; }
  const mine = o.driverId === me.id, lock = o.type === 'risk' && (me.type === 'regular' || me.type === 'support');
  let h = '<section class="card"><div class="ocr" style="display:flex;justify-content:space-between"><b>' + NL.svc(o.type) + '</b><span class="badge s-' + o.status + '">' + NL.STAT[o.status] + '</span></div><p class="mute">' + o.id + '</p><p>' + NL.esc(NL.brief(o)) + '</p>' +
    NL.orderLocs(o).map(x => NL.locHtml(x[0], x[1])).join('') + (o.total ? '<div class="sumrow b"><span>Total estimasi</span><span>' + NL.rp(o.total) + '</span></div>' : '') + '</section>' +
    '<section class="card"><h2>Pemesan</h2><dl class="kv"><dt>Nama</dt><dd>' + NL.esc(o.cust) + '</dd><dt>WhatsApp</dt><dd>' + NL.esc(o.wa) + '</dd></dl></section>';
  if (o.status === 'pending') h += lock ? '<div class="note">Pesanan High Risk hanya bisa diambil Owner dan Lead Driver.</div>' : '<button class="btn" data-act="take">Ambil pesanan</button>';
  if (mine && o.status !== 'cancelled') {
    h += me.type === 'support' ? '<a class="btn blue" href="d-chat.html?id=' + o.id + '">Chat aplikasi dengan customer</a>'
      : '<a class="btn blue" target="_blank" rel="noopener" href="' + NL.esc(NL.waLink(o.wa, 'Halo kak ' + o.cust + ', saya ' + me.name + ' (' + NL.TYPES[me.type] + ') yang menangani pesanan ' + o.id + '.')) + '">Hubungi customer via WhatsApp</a>';
    if (o.status === 'taken') h += '<button class="btn yellow" data-act="go">Mulai jalan</button>';
    if (o.status === 'ongoing') h += '<button class="btn" data-act="done">Selesaikan pesanan</button>';
  }
  m.innerHTML = h;
  const upd = s => { o.status = s; NL.S.save(); location.reload(); };
  NL.acts({ take() { if (o.status === 'pending') { NL.takeOrder(o, me); location.reload(); } }, go() { upd('ongoing'); }, done() { upd('done'); } });
})();
