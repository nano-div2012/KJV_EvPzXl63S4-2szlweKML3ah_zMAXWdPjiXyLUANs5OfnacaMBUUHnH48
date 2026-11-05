(function () {
  const st = NL.S.get();
  const m = NL.page({ title: 'Pendaftaran selesai', reg: true });
  if (!m) return;
  if (!st.cust || !(st.cust.addr || {}).home) { location.replace('c-wa.html'); return; }
  st.cust.done = true; NL.S.save();
  m.innerHTML = '<section class="card center"><div class="okmark" role="img" aria-label="Berhasil"></div><h2>Hore! Pendaftaran berhasil</h2><p class="mute">Akunmu siap dipakai untuk semua layanan Next Level, termasuk chat langsung ke driver lewat WhatsApp.</p></section><a class="btn" href="c-home.html">Masuk ke akun</a>';
})();
