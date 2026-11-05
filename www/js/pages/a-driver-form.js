(function () {
  const st = NL.S.get(), id = +NL.q('id'), d = id ? NL.drv(id) : null;
  const m = NL.page({ title: d ? 'Ubah driver' : 'Tambah driver', back: 'a-driver.html', tab: 'a-driver.html' });
  if (!m) return;
  m.innerHTML = '<section class="card"><label for="dn">Nama</label><input id="dn"><label for="dt">Tipe driver</label><select id="dt">' + Object.keys(NL.TYPES).map(k => '<option value="' + k + '">' + NL.TYPES[k] + '</option>').join('') + '</select>' +
    '<label for="dw">Nomor WhatsApp</label><input id="dw" inputmode="tel" placeholder="08xx xxxx xxxx"><p class="mute">Dipakai tombol Chat WhatsApp di sisi customer. Support Driver memakai chat aplikasi.</p><div class="err" id="err"></div><button class="btn" data-act="save">Simpan</button></section>';
  if (d) { NL.$('#dn').value = d.name; NL.$('#dt').value = d.type; NL.$('#dw').value = d.wa || ''; }
  NL.acts({
    save() {
      const n = NL.$('#dn').value.trim(), w = NL.$('#dw').value.trim();
      if (!n) { NL.$('#err').textContent = 'Isi nama driver.'; return; }
      if (w && NL.waNum(w).length < 10) { NL.$('#err').textContent = 'Nomor WhatsApp belum benar.'; return; }
      if (d) Object.assign(d, { name: n, type: NL.$('#dt').value, wa: w }); else st.drivers.push({ id: Math.max(0, ...st.drivers.map(x => x.id)) + 1, name: n, type: NL.$('#dt').value, wa: w, on: true });
      NL.S.save(); NL.go('a-driver.html');
    }
  });
})();
