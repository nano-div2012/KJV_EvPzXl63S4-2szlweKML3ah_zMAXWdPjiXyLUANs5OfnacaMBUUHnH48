(function () {
  const m = NL.page({ title: 'Tarif' });
  if (!m) return;
  const t = NL.S.get().tariff, f = (id, l, v) => '<label for="' + id + '">' + l + '</label><input id="' + id + '" inputmode="decimal" value="' + v + '">';
  m.innerHTML = '<section class="card"><p class="mute">Rumus contoh. Jarak dihitung dari titik lokasi (garis lurus dikali 1,3). Rumus asli menyesuaikan kebutuhan Next Level.</p>' +
    f('tb', 'Tarif dasar ojek (Rp)', t.base) + f('tk', 'Tarif per km (Rp)', t.km) + f('tf', 'Fee minimum (Rp)', t.feeMin) + f('tp', 'Fee jastip (persen dari harga produk)', t.feePct) +
    '<div class="err" id="err"></div><button class="btn" data-act="save">Simpan tarif</button></section>';
  NL.acts({
    save() {
      const v = ['tb', 'tk', 'tf', 'tp'].map(i => NL.$('#' + i).value.trim().replace(',', '.'));
      if (v.some(x => x === '' || isNaN(+x) || +x < 0)) { NL.$('#err').textContent = 'Isi semua tarif dengan angka.'; return; }
      NL.S.get().tariff = { base: +v[0], km: +v[1], feeMin: +v[2], feePct: +v[3] }; NL.S.save(); NL.$('#err').textContent = 'Tarif disimpan.';
    }
  });
})();
