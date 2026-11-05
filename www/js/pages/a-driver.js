(function () {
  const m = NL.page({ title: 'Driver' });
  if (!m) return;
  const st = NL.S.get();
  m.innerHTML = '<a class="btn blue" href="a-driver-form.html">+ Tambah driver</a><div style="height:12px"></div>' + st.drivers.map(d =>
    '<div class="card' + (d.on ? '' : ' off') + '"><div class="ocr" style="display:flex;justify-content:space-between"><b>' + NL.esc(d.name) + '</b><span class="badge">' + NL.TYPES[d.type] + '</span></div>' +
    '<p class="mute">WhatsApp: ' + (d.wa ? NL.esc(d.wa) : 'belum diisi') + '</p><a class="btn plain small" href="a-driver-form.html?id=' + d.id + '">Ubah</a><button class="btn plain small" data-act="tog" data-v="' + d.id + '">' + (d.on ? 'Nonaktifkan' : 'Aktifkan') + '</button></div>').join('');
  NL.acts({ tog(b) { const d = NL.drv(+b.dataset.v); d.on = !d.on; NL.S.save(); location.reload(); } });
})();
