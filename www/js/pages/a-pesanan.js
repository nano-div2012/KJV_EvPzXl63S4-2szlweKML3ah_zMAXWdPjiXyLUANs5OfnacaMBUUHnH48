(function () {
  const m = NL.page({ title: 'Semua pesanan' });
  if (!m) return;
  const l = NL.S.get().orders;
  m.innerHTML = l.length ? l.map(o => NL.card(o, null, '<p class="mute">Pemesan: ' + NL.esc(o.cust) + ' - ' + NL.rp(o.total) + '</p>' + (o.status === 'pending' || o.status === 'taken' ? '<button class="btn red small" data-act="cancel" data-id="' + o.id + '">Batalkan</button>' : ''))).join('') : '<section class="card center"><p class="mute">Belum ada pesanan.</p></section>';
  NL.acts({ cancel(b) { const o = NL.ord(b.dataset.id); if (o && confirm('Batalkan pesanan ' + o.id + '?')) { o.status = 'cancelled'; NL.S.save(); location.reload(); } } });
})();
