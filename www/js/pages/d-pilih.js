(function () {
  const st = NL.S.get();
  const m = NL.page({ title: 'Pilih akun driver', pick: true });
  if (!m) return;
  m.innerHTML = '<p class="mute">Pilih salah satu driver contoh. Tipe driver menentukan cara menghubungi customer.</p>' +
    st.drivers.filter(d => d.on).map(d => '<button class="btn plain drv" data-act="pick" data-v="' + d.id + '"><b>' + NL.esc(d.name) + '</b><span>' + NL.TYPES[d.type] + '</span></button>').join('');
  NL.acts({ pick(b) { st.did = +b.dataset.v; NL.S.save(); NL.go('d-masuk.html'); } });
})();
