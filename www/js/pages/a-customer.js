(function () {
  const m = NL.page({ title: 'Customer' });
  if (!m) return;
  const c = NL.S.get().cust;
  if (!c || !c.done) { m.innerHTML = '<section class="card center"><p class="mute">Belum ada customer terdaftar. Daftar dulu dari sisi Customer.</p></section>'; return; }
  const a = c.addr || {}, w = x => (x && x.n) ? NL.esc(x.n) + ' (' + NL.esc(x.rel) + ')' : '-';
  m.innerHTML = '<section class="card center">' + (c.selfie ? '<img class="avatar" alt="Foto selfie untuk verifikasi manual" src="' + c.selfie + '"><p class="mute">Foto selfie untuk verifikasi manual</p>' : '<p class="mute">Customer belum mengambil selfie.</p>') + '<h2>' + NL.esc(c.name) + '</h2></section>' +
    '<section class="card"><dl class="kv"><dt>WhatsApp utama</dt><dd>' + NL.esc(c.wa) + '</dd><dt>Kedua</dt><dd>' + w(c.wa2) + '</dd><dt>Ketiga</dt><dd>' + w(c.wa3) + '</dd></dl>' +
    '<a class="btn blue" target="_blank" rel="noopener" href="' + NL.esc(NL.waLink(c.wa, 'Halo kak ' + c.name + ', ini admin Next Level.')) + '">Chat customer via WhatsApp</a></section>' +
    '<section class="card"><h2>Alamat</h2>' + [['home', 'Rumah utama'], ['second', 'Rumah kedua'], ['office', 'Kantor']].map(x => a[x[0]] ? NL.locHtml(x[1], a[x[0]]) : '').join('') + '</section>';
})();
