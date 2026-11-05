(function () {
  const mode = NL.q('m') || 'cek';
  const m = NL.page({ title: 'JASTIP', back: 'c-cara.html?s=jastip', tab: 'c-home.html' });
  if (!m) return;
  const blocks = [];
  m.innerHTML = '<div id="blocks"></div><button class="btn yellow" data-act="addblock">+ Tambah lokasi pembelian</button><section class="card" style="margin-top:12px"><div id="to"></div></section>' +
    '<section class="card"><h2>Biaya</h2><div id="sum"></div></section><div class="err" id="err"></div><button class="btn" data-act="send">Kirim ke driver</button>';
  const to = NL.placePicker(NL.$('#to'), { label: 'Dikirim ke mana?', onChange: sum });

  function addProd(b) {
    const d = document.createElement('div'); d.className = 'prod';
    d.innerHTML = '<input class="pn" placeholder="Nama produk, contoh: Bakso Wonogiri"><div class="row"><input class="pq" inputmode="numeric" value="1" aria-label="Jumlah"><input class="pp" inputmode="numeric" placeholder="Estimasi harga satuan" aria-label="Harga satuan"></div>' +
      '<label class="chk"><input type="checkbox" class="pd"> Sudah dibayar (harga tidak dihitung)</label><input class="pt" placeholder="Catatan, contoh: sambal dipisah">';
    b.el.querySelector('.items').appendChild(d);
  }
  function addBlock() {
    const el = document.createElement('section'); el.className = 'card';
    el.innerHTML = '<h2>Lokasi pembelian ke-' + (blocks.length + 1) + '</h2><div class="lf"></div><h3>Detail produk</h3><div class="items"></div><button class="btn blue small" data-act="addprod">+ Tambah produk</button>';
    NL.$('#blocks').appendChild(el);
    const b = { el, lf: NL.locField(el.querySelector('.lf'), { label: 'Lokasi manual (toko, kedai, pasar, warung)', ph: 'Contoh: Indomaret dekat Masjid Al-Ikhlas, parkiran sebelah ATM BCA', onChange: sum }) };
    blocks.push(b); addProd(b);
  }
  function read() {
    return blocks.map(b => ({
      loc: Object.assign(b.lf.get(), { name: 'Lokasi pembelian' }),
      items: [...b.el.querySelectorAll('.prod')].map(p => ({ n: p.querySelector('.pn').value.trim(), q: +p.querySelector('.pq').value || 1, p: +p.querySelector('.pp').value || 0, paid: p.querySelector('.pd').checked, note: p.querySelector('.pt').value.trim() })).filter(i => i.n)
    }));
  }
  function est(bl) { let e = 0; bl.forEach(b => b.items.forEach(i => { if (!i.paid) e += i.q * i.p; })); return e; }
  function sum() {
    const box = NL.$('#sum'); if (mode === 'chat') { box.innerHTML = '<p class="mute">Ongkos dan fee dicek langsung oleh driver saat pesanan siap dikirim.</p>'; return; }
    const e = est(read()), f = NL.fee(e), r = (a, v, b) => '<div class="sumrow' + (b ? ' b' : '') + '"><span>' + a + '</span><span>' + NL.rp(v) + '</span></div>';
    box.innerHTML = r('Estimasi harga produk', e) + r('Fee penanganan (otomatis)', f) + r('Total estimasi', e + f, 1) + '<p class="mute">Ongkos antar dihitung driver sesuai jarak.</p>';
  }
  m.addEventListener('input', sum); m.addEventListener('change', sum);
  addBlock(); sum();
  NL.acts({
    addblock() { addBlock(); sum(); },
    addprod(b) { addProd(blocks.find(x => x.el.contains(b))); },
    send() {
      const err = t => { NL.$('#err').textContent = t; }, bl = read();
      for (let i = 0; i < bl.length; i++) { if (!NL.hasLoc(bl[i].loc)) return err('Isi lokasi pembelian ke-' + (i + 1) + '.'); if (!bl[i].items.length) return err('Isi minimal satu produk di lokasi ke-' + (i + 1) + '.'); }
      const t = to.get(); if (!NL.hasLoc(t)) return err('Isi lokasi tujuan pengiriman.');
      const e = est(bl), f = NL.fee(e);
      NL.createOrder({ type: 'jastip', mode, blocks: bl, to: t, est: e, fee: f, total: e + f });
    }
  });
})();
