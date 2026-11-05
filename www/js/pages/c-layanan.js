(function () {
  const t = NL.q('s') || 'khusus', mode = NL.q('m') || 'cek';
  const m = NL.page({ title: NL.svc(t), back: 'c-cara.html?s=' + t, tab: 'c-home.html' });
  if (!m) return;
  const hold = { ambil: 'Contoh: ambil paket di toko X atas nama Budi', risk: 'Contoh: beli emas 5 gram, atau ambil uang tunai di bank', khusus: 'Contoh: temani ke undangan, antar peliharaan ke dokter hewan' };
  m.innerHTML = '<section class="card"><h2>Jelaskan pesanan kamu</h2><textarea id="desc" placeholder="' + hold[t] + '"></textarea></section>' +
    (t === 'ambil' ? '<section class="card"><div id="from"></div></section>' : '') + '<section class="card"><div id="to"></div></section>' +
    '<section class="card"><h2>Biaya</h2><div id="kmbox" hidden><label for="km">Perkiraan jarak (km)</label><input id="km" inputmode="decimal" placeholder="Contoh: 4.5"></div><div id="sum"></div></section>' +
    '<div class="err" id="err"></div><button class="btn" data-act="send">Kirim ke driver</button>';
  const to = NL.placePicker(NL.$('#to'), { label: 'Dikirim ke mana?', onChange: sum }), from = t === 'ambil' ? NL.placePicker(NL.$('#from'), { label: 'Lokasi pengambilan', onChange: sum }) : null;
  function calc() { const f = from ? NL.fare(from.get(), to.get(), NL.$('#km').value) : { km: 0, auto: true, fare: 0 }, fee = NL.S.get().tariff.feeMin; return { f, fee, total: f.fare + fee }; }
  function sum() {
    const c = calc(); NL.$('#kmbox').hidden = !from || c.f.auto;
    if (mode === 'chat') { NL.$('#sum').innerHTML = '<p class="mute">Ongkos dan fee dicek langsung oleh driver.</p>'; return; }
    const r = (a, v, b) => '<div class="sumrow' + (b ? ' b' : '') + '"><span>' + a + '</span><span>' + NL.rp(v) + '</span></div>';
    NL.$('#sum').innerHTML = (c.f.fare ? r('Ongkos (' + c.f.km + ' km)', c.f.fare) : '') + r('Fee penanganan', c.fee) + r('Total estimasi', c.total, 1) + '<p class="mute">Harga barang atau jasa dikonfirmasi driver.</p>';
  }
  m.addEventListener('input', sum); sum();
  NL.acts({
    send() {
      const err = x => { NL.$('#err').textContent = x; }, d = NL.$('#desc').value.trim(), b = to.get(), a = from ? from.get() : null;
      if (!d) return err('Jelaskan pesanan kamu dulu.'); if (a && !NL.hasLoc(a)) return err('Isi lokasi pengambilan.'); if (!NL.hasLoc(b)) return err('Isi lokasi tujuan.');
      const c = calc(); NL.createOrder({ type: t, mode, desc: d, from: a, to: b, km: c.f.km, fare: c.f.fare, fee: c.fee, total: c.total });
    }
  });
})();
