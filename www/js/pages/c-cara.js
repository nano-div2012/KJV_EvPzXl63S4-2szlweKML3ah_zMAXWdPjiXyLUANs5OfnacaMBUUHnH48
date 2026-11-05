(function () {
  const t = NL.q('s') || 'jastip';
  const m = NL.page({ title: 'Pilih cara pesan', back: 'c-home.html', tab: 'c-home.html' });
  if (!m) return;
  m.innerHTML = '<section class="card center"><h2>' + NL.svc(t) + '</h2><p class="mute">Mau pesan gimana nih?</p></section>' +
    '<a class="way way-chat" href="' + NL.formUrl(t, 'chat') + '"><b>Langsung chat driver</b><span>Jelaskan pesanan, lalu hubungi driver lewat WhatsApp. Driver yang cek ongkos dan total.</span></a>' +
    '<a class="way way-cek" href="' + NL.formUrl(t, 'cek') + '"><b>Cek ongkos dan total dulu</b><span>Isi alamat dan deskripsi pesanan, lihat estimasi ongkos, fee, dan total sebelum dikirim.</span></a>' +
    '<a class="btn plain" href="c-home.html">Kembali ke menu utama</a>';
})();
