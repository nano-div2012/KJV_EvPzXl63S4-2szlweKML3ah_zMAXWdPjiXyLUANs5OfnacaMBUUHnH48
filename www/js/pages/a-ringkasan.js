(function () {
  const m = NL.page({ title: 'Admin' });
  if (!m) return;
  const st = NL.S.get(), n = s => st.orders.filter(o => o.status === s).length, noWa = st.drivers.filter(d => d.on && !NL.waNum(d.wa)).length;
  m.innerHTML = (noWa ? '<div class="note">' + noWa + ' driver belum punya nomor WhatsApp. Isi di menu Driver supaya tombol WhatsApp aktif.</div>' : '') +
    '<div class="grid2"><div class="card"><p class="mute">Total pesanan</p><p class="big">' + st.orders.length + '</p></div><div class="card"><p class="mute">Menunggu driver</p><p class="big">' + n('pending') + '</p></div>' +
    '<div class="card"><p class="mute">Berjalan</p><p class="big">' + (n('taken') + n('ongoing')) + '</p></div><div class="card"><p class="mute">Selesai</p><p class="big">' + n('done') + '</p></div></div>' +
    '<h2 class="sec">Pesanan terbaru</h2>' + (st.orders.slice(0, 3).map(o => NL.card(o)).join('') || '<p class="mute">Belum ada pesanan.</p>');
})();
