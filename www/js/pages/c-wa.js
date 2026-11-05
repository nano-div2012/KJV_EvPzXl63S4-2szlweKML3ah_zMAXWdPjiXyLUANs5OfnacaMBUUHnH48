(function () {
  const S = NL.S, st = S.get(), c = st.cust || {};
  const m = NL.page({ title: 'Daftar akun customer', reg: true, back: c.done ? 'c-profil.html' : 'index.html' });
  if (!m) return;
  const rel = id => '<select id="' + id + '">' + ['Pasangan', 'Orang tua', 'Saudara', 'Pacar', 'Teman'].map(r => '<option>' + r + '</option>').join('') + '</select>';
  m.innerHTML = '<section class="card"><h2>Masukkan nomor WhatsApp kamu</h2><p class="mute">Nomor ini jadi kontak utama yang dihubungi driver lewat WhatsApp.</p>' +
    '<label for="name">Nama</label><input id="name" placeholder="Nama kamu" autocomplete="name">' +
    '<label for="wa">Nomor WhatsApp utama (kamu)</label><input id="wa" inputmode="tel" placeholder="08xx xxxx xxxx atau +62 8xx xxxx xxxx"></section>' +
    '<section class="card"><h2>Opsi tambahan</h2><div class="note">Mau memesankan untuk pasangan, orang tua, saudara, atau pacar? Daftarkan nomor keduanya juga.</div>' +
    '<label for="wa2">Nomor WhatsApp kedua (opsional)</label><input id="wa2" inputmode="tel" placeholder="08xx xxxx xxxx"><div class="rel">' + rel('rel2') + '</div>' +
    '<label for="wa3">Nomor WhatsApp ketiga (opsional)</label><input id="wa3" inputmode="tel" placeholder="08xx xxxx xxxx"><div class="rel">' + rel('rel3') + '</div></section>' +
    '<div class="err" id="err"></div><button class="btn" data-act="save">Simpan dan lanjut</button>';
  const set = (id, v) => { if (v) NL.$('#' + id).value = v; };
  set('name', c.name); set('wa', c.wa); set('wa2', (c.wa2 || {}).n); set('rel2', (c.wa2 || {}).rel); set('wa3', (c.wa3 || {}).n); set('rel3', (c.wa3 || {}).rel);
  const val = id => NL.$('#' + id).value.trim();
  NL.acts({
    save() {
      const err = t => { NL.$('#err').textContent = t; };
      if (!val('name')) return err('Isi nama dulu.');
      if (NL.waNum(val('wa')).length < 10) return err('Nomor WhatsApp utama belum benar. Contoh: 0812 3456 7890');
      if (val('wa2') && NL.waNum(val('wa2')).length < 10) return err('Nomor kedua belum benar.');
      if (val('wa3') && NL.waNum(val('wa3')).length < 10) return err('Nomor ketiga belum benar.');
      st.cust = Object.assign(c, { name: val('name'), wa: val('wa'), wa2: { n: val('wa2'), rel: val('rel2') }, wa3: { n: val('wa3'), rel: val('rel3') }, addr: c.addr || {} });
      S.save(); NL.go(NL.next('c-selfie.html'));
    }
  });
})();
