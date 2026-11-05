(function () {
  const id = NL.q('id'), o = NL.ord(id);
  const m = NL.page({ title: 'Penilaian pesanan', back: 'c-status.html?id=' + id, tab: 'c-pesanan.html' });
  if (!m) return;
  if (!o || o.status !== 'done') { m.innerHTML = '<p class="mute">Penilaian tersedia setelah pesanan selesai.</p>'; return; }
  const d = NL.drv(o.driverId);
  let star = 0;
  m.innerHTML = '<section class="card"><h2>Bagaimana pelayanan driver kami?</h2><p class="mute">Pesanan ID:' + o.id + ' telah selesai</p><div class="stars">' + [1, 2, 3, 4, 5].map(n => '<button data-act="star" data-v="' + n + '" aria-label="' + n + ' bintang">' + n + '</button>').join('') + '</div>' +
    '<p class="mute">1 = sangat buruk, 3 = cukup, 5 = sangat baik</p><label for="r1">Kritik dan saran untuk driver ' + NL.esc(d ? d.name : '') + '</label><textarea id="r1" placeholder="Tulis pengalamanmu dengan driver..."></textarea>' +
    '<label for="r2">Kritik dan saran untuk jasa Next Level</label><textarea id="r2" placeholder="Tulis saran untuk layanan Next Level..."></textarea><div class="err" id="err"></div><button class="btn" data-act="send">Kirim penilaian</button></section>';
  NL.acts({
    star(b) { star = +b.dataset.v; document.querySelectorAll('.stars button').forEach(x => x.classList.toggle('on', +x.dataset.v <= star)); },
    send() { if (!star) { NL.$('#err').textContent = 'Pilih bintang dulu.'; return; } o.rating = { star, driver: NL.$('#r1').value.trim(), app: NL.$('#r2').value.trim() }; NL.S.save(); NL.go('c-status.html?id=' + id); }
  });
})();
