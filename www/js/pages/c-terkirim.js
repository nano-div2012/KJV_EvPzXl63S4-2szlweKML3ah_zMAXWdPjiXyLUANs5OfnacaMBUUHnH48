(function () {
  const id = NL.q('id'), o = NL.ord(id);
  const m = NL.page({ title: 'Pesanan masuk', tab: 'c-pesanan.html' });
  if (!m) return;
  if (!o) { m.innerHTML = '<p class="mute">Pesanan tidak ditemukan.</p>'; return; }
  m.innerHTML = '<section class="card center"><div class="okmark" role="img" aria-label="Berhasil"></div><h2>Pesanan ' + o.id + ' sudah masuk ke aplikasi driver</h2><p class="mute">Driver kami akan segera menghubungi kamu.</p></section>' +
    '<a class="btn" href="c-status.html?id=' + o.id + '">Cek status pesanan</a>' +
    '<section class="card" style="margin-top:12px"><h2>Mau langsung chat driver?</h2><p class="mute">Tombol di bawah membuka WhatsApp dengan detail pesanan yang sudah terisi.</p>' + NL.waDrivers(o) + '</section>';
})();
