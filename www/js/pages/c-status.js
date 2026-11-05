(function () {
  const id = NL.q('id'), o = NL.ord(id);
  const m = NL.page({ title: 'Status pesanan', back: 'c-pesanan.html', tab: 'c-pesanan.html' });
  if (!m) return;
  if (!o) { m.innerHTML = '<p class="mute">Pesanan tidak ditemukan.</p>'; return; }
  const d = o.driverId ? NL.drv(o.driverId) : null, steps = ['pending', 'taken', 'ongoing', 'done'], at = steps.indexOf(o.status);
  let h = '<section class="card center"><span class="badge s-' + o.status + '">' + NL.STAT[o.status] + '</span><h2 style="margin-top:8px">Pesanan ' + o.id + '</h2><p class="mute">' + NL.svc(o.type) + '</p>' +
    (o.status !== 'cancelled' ? '<ol class="steps">' + ['Dikirim', 'Diambil', 'Diantar', 'Selesai'].map((s, i) => '<li class="' + (i <= at ? 'on' : '') + '">' + s + '</li>').join('') + '</ol>' : '') + '</section>';
  if (o.status === 'pending') {
    h += '<section class="card"><h2>Belum ada driver yang mengambil</h2><p class="mute">Cara driver menghubungi berbeda tergantung tipe driver.</p><dl class="kv"><dt>Owner, Lead, Regular</dt><dd>chat WhatsApp</dd><dt>Support Driver</dt><dd>chat di aplikasi</dd></dl></section>' +
      '<section class="card"><h2>Hubungi driver lewat WhatsApp</h2>' + NL.waDrivers(o) + '</section>' +
      '<section class="card"><h2>Simulasi driver (khusus dummy)</h2><p class="mute">Pilih tipe driver yang mengambil pesanan ini.</p>' +
      Object.keys(NL.TYPES).map(k => '<button class="btn plain small" data-act="take" data-v="' + k + '">' + NL.TYPES[k] + '</button>').join('') + '</section>';
  } else if (d) {
    const wa = d.type !== 'support';
    h += '<section class="card"><h2>Diambil oleh ' + NL.TYPES[d.type] + ' ' + NL.esc(d.name) + '</h2>' +
      (wa ? '<p>Mohon standby di nomor WhatsApp ' + NL.esc(o.wa) + '. Driver akan menghubungi lewat chat WhatsApp.</p>' + (NL.waNum(d.wa) ? '<a class="btn" target="_blank" rel="noopener" href="' + NL.esc(NL.waLink(d.wa, NL.orderText(o))) + '">Chat driver via WhatsApp</a>' : '<div class="note">Nomor WhatsApp driver belum diisi admin.</div>')
        : '<p>Mohon standby di chat aplikasi untuk menjadi penerima.</p><a class="btn blue" href="c-chat.html?id=' + o.id + '">Buka chat aplikasi</a>') + '</section>';
    if (o.status === 'taken') h += '<button class="btn plain" data-act="go">Simulasi: driver mulai jalan</button>';
    if (o.status === 'ongoing') h += '<button class="btn plain" data-act="done">Simulasi: pesanan selesai</button>';
    if (o.status === 'done') h += o.rating ? '<section class="card center"><h2>Terima kasih atas penilaianmu</h2><p class="mute">Nilai: ' + o.rating.star + ' dari 5</p></section>' : '<a class="btn" href="c-rating.html?id=' + o.id + '">Beri penilaian</a>';
  }
  h += '<section class="card" style="margin-top:12px"><h2>Detail pesanan</h2><p>' + NL.esc(NL.brief(o)) + '</p>' + NL.orderLocs(o).map(x => NL.locHtml(x[0], x[1])).join('') + (o.total ? '<div class="sumrow b"><span>Total estimasi</span><span>' + NL.rp(o.total) + '</span></div>' : '') + '</section>';
  m.innerHTML = h;
  NL.acts({
    take(b) { const x = NL.S.get().drivers.find(y => y.type === b.dataset.v && y.on); if (x) { NL.takeOrder(o, x); location.reload(); } },
    go() { o.status = 'ongoing'; NL.S.save(); location.reload(); },
    done() { o.status = 'done'; NL.S.save(); location.reload(); }
  });
})();
