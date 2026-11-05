(function () {
  const mode = NL.q('m') || 'cek';
  const m = NL.page({ title: 'Ojek Panggilan', back: 'c-cara.html?s=ojek', tab: 'c-home.html' });
  if (!m) return;
  m.innerHTML = '<section class="card"><h2>Kak, jemput dimana dan antar kemana nih?</h2><div id="from"></div></section><section class="card"><div id="to"></div></section>' +
    '<section class="card"><h2>' + (mode === 'cek' ? 'Estimasi biaya' : 'Biaya') + '</h2><div id="kmbox" hidden><label for="km">Perkiraan jarak (km)</label><input id="km" inputmode="decimal" placeholder="Contoh: 4.5"><p class="mute">Jarak otomatis muncul kalau kedua lokasi punya titik peta. Isi manual kalau belum ada.</p></div><div id="sum"></div></section>' +
    '<div class="err" id="err"></div><button class="btn" data-act="send">Kirim ke driver</button>';
  const from = NL.placePicker(NL.$('#from'), { label: 'Lokasi jemput', onChange: sum }), to = NL.placePicker(NL.$('#to'), { label: 'Lokasi antar', onChange: sum });
  function calc() { const f = NL.fare(from.get(), to.get(), NL.$('#km').value), fee = NL.S.get().tariff.feeMin; return { f, fee, total: f.fare + fee }; }
  function sum() {
    const c = calc(); NL.$('#kmbox').hidden = c.f.auto;
    if (mode === 'chat') { NL.$('#sum').innerHTML = '<p class="mute">Ongkos dan fee dicek langsung oleh driver saat pesanan siap dikirim.</p>'; return; }
    const r = (a, v, b) => '<div class="sumrow' + (b ? ' b' : '') + '"><span>' + a + '</span><span>' + NL.rp(v) + '</span></div>';
    NL.$('#sum').innerHTML = c.f.km ? r('Ongkos (' + c.f.km + ' km' + (c.f.auto ? ', dari titik peta' : '') + ')', c.f.fare) + r('Fee penanganan', c.fee) + r('Total', c.total, 1) : '<p class="mute">Isi lokasi atau jarak untuk melihat estimasi.</p>';
  }
  m.addEventListener('input', sum); sum();
  NL.acts({
    send() {
      const a = from.get(), b = to.get(), err = t => { NL.$('#err').textContent = t; };
      if (!NL.hasLoc(a)) return err('Isi lokasi jemput.'); if (!NL.hasLoc(b)) return err('Isi lokasi antar.');
      const c = calc(); NL.createOrder({ type: 'ojek', mode, from: a, to: b, km: c.f.km, fare: c.f.fare, fee: c.fee, total: c.total });
    }
  });
})();
