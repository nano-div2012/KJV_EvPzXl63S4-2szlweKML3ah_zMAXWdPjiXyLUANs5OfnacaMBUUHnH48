(function () {
  const m = NL.page({ title: 'Profil' });
  if (!m) return;
  const c = NL.S.get().cust, a = c.addr || {};
  const w = x => (x && x.n) ? NL.esc(x.n) + ' (' + NL.esc(x.rel) + ')' : '-';
  m.innerHTML = '<section class="card center">' + (c.selfie ? '<img class="avatar" alt="Foto selfie" src="' + c.selfie + '">' : '') + '<h2>' + NL.esc(c.name) + '</h2></section>' +
    '<section class="card"><h2>Nomor WhatsApp</h2><dl class="kv"><dt>Utama</dt><dd>' + NL.esc(c.wa) + '</dd><dt>Kedua</dt><dd>' + w(c.wa2) + '</dd><dt>Ketiga</dt><dd>' + w(c.wa3) + '</dd></dl><a class="btn plain small" href="c-wa.html?edit=1">Ubah nomor</a><a class="btn plain small" href="c-selfie.html?edit=1">Ubah foto</a></section>' +
    '<section class="card"><h2>Alamat</h2>' + [['home', 'Rumah utama', 'c-rumah.html'], ['second', 'Rumah kedua', 'c-kedua.html'], ['office', 'Kantor', 'c-kantor.html']].map(x => (a[x[0]] ? NL.locHtml(x[1], a[x[0]]) : '<div class="loc"><b>' + x[1] + '</b><span>Belum diisi</span></div>') + '<a class="btn plain small" href="' + x[2] + '?edit=1">' + (a[x[0]] ? 'Ubah' : 'Isi') + '</a>').join('') + '</section>';
})();
