(function () {
  const m = NL.page({ title: 'Chat' });
  if (!m) return;
  const l = NL.S.get().orders.filter(o => { const d = o.driverId && NL.drv(o.driverId); return d && d.type === 'support'; });
  m.innerHTML = l.length ? l.map(o => NL.card(o, 'c-chat.html?id=' + o.id)).join('') : '<section class="card center"><p class="mute">Chat dalam aplikasi muncul saat pesananmu diambil Support Driver. Driver lain menghubungi lewat WhatsApp.</p></section>';
})();
