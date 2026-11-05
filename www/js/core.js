/* Fungsi bersama semua halaman: shell, lokasi, WhatsApp, ongkos, chat. */
(function () {
  'use strict';
  const S = window.Store;
  const NL = { S };

  NL.TYPES = { owner: 'Owner Driver', lead: 'Lead Driver', regular: 'Regular Driver', support: 'Support Driver' };
  NL.SERV = [
    ['jastip', 'JASTIP (Jasa Titip)', 'Pesan makanan, minuman, obat, belanja ke pasar atau minimarket.'],
    ['ambil', 'Jasa Ambil Pesanan', 'Ambil pesanan di mana pun dan antar ke pembeli.'],
    ['ojek', 'Jasa Ojek Panggilan', 'Driver jemput kamu dan antar ke tujuan.'],
    ['risk', 'Jasa High Risk', 'Beli atau jual emas, ambil uang tunai, antar barang berharga. Ditangani driver khusus.'],
    ['khusus', 'Jasa Khusus', 'Antar jalan-jalan, temani ke undangan, atau pesanan privasi.']
  ];
  NL.LET = { jastip: 'J', ambil: 'A', ojek: 'O', risk: 'H', khusus: 'K' };
  NL.STAT = { pending: 'Menunggu driver', taken: 'Diambil driver', ongoing: 'Sedang diantar', done: 'Selesai', cancelled: 'Dibatalkan' };

  /* ---------- helper dasar ---------- */
  NL.esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  NL.rp = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  NL.q = k => new URLSearchParams(location.search).get(k);
  NL.go = u => { location.href = u; };
  NL.$ = (s, r) => (r || document).querySelector(s);
  NL.next = d => (NL.q('edit') ? 'c-profil.html' : d);
  NL.svc = t => (NL.SERV.find(s => s[0] === t) || [])[1] || t;
  NL.ord = id => S.get().orders.find(o => o.id === id);
  NL.drv = id => S.get().drivers.find(d => d.id === id);
  NL.formUrl = (t, m) => t === 'jastip' ? 'c-jastip.html?m=' + m : t === 'ojek' ? 'c-ojek.html?m=' + m : 'c-layanan.html?s=' + t + '&m=' + m;
  NL.acts = map => document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (b && !b.disabled && map[b.dataset.act]) map[b.dataset.act](b, e);
  });

  /* ---------- WhatsApp (buka aplikasi WhatsApp lewat wa.me) ---------- */
  NL.waNum = n => {
    let d = String(n || '').replace(/\D/g, '');
    if (!d) return '';
    if (d[0] === '0') d = '62' + d.slice(1); else if (d[0] === '8') d = '62' + d;
    return d;
  };
  NL.waLink = (n, text) => { const d = NL.waNum(n); return d ? 'https://wa.me/' + d + (text ? '?text=' + encodeURIComponent(text) : '') : ''; };

  /* ---------- lokasi (GPS asli + link Google Maps) ---------- */
  NL.locate = cb => {
    if (!navigator.geolocation) return cb(null, 'Perangkat ini tidak mendukung lokasi.');
    navigator.geolocation.getCurrentPosition(
      p => cb({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy }),
      e => cb(null, e.code === 1 ? 'Izin lokasi ditolak. Aktifkan izin lokasi, atau tempel link Google Maps.' : 'Lokasi belum bisa diambil. Coba lagi, atau tempel link Google Maps.'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
  };
  NL.mapUrl = l => 'https://www.google.com/maps?q=' + l.lat + ',' + l.lng;
  NL.parseMaps = u => {
    try { u = decodeURIComponent(String(u || '')); } catch (e) { u = String(u || ''); }
    const m = u.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || u.match(/[?&](?:q|ll|query|destination)=(-?\d+\.\d+),(-?\d+\.\d+)/) || u.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    return m ? { lat: +m[1], lng: +m[2] } : null;
  };
  NL.locUrl = l => (l ? (l.link || (l.lat != null ? NL.mapUrl(l) : '')) : '');
  NL.hasLoc = l => !!(l && (l.text || l.link || l.lat != null));
  NL.locName = l => (l ? (l.name || '') : '');
  NL.locLine = l => { if (!l) return '-'; const u = NL.locUrl(l); return (l.name || '') + (l.text ? ': ' + l.text : '') + (u ? ' (' + u + ')' : ''); };
  NL.km = (a, b) => {
    if (!a || !b || a.lat == null || b.lat == null) return null;
    const r = x => x * Math.PI / 180, dLa = r(b.lat - a.lat), dLo = r(b.lng - a.lng);
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLo / 2) ** 2;
    return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)) * 1.3 * 10) / 10; /* garis lurus x 1.3 sebagai perkiraan jalan */
  };
  NL.fare = (a, b, manual) => {
    const t = S.get().tariff; let km = NL.km(a, b); const auto = km != null;
    if (km == null) km = +String(manual || '').replace(',', '.') || 0;
    return { km, auto, fare: km > 0 ? t.base + Math.ceil(km) * t.km : 0 };
  };
  NL.fee = est => { const t = S.get().tariff; return est > 0 ? Math.max(t.feeMin, Math.round(est * t.feePct / 100 / 500) * 500) : t.feeMin; };

  NL.shrink = (file, max, cb) => {
    const r = new FileReader();
    r.onload = () => {
      const i = new Image();
      i.onload = () => {
        const k = Math.min(1, max / Math.max(i.width, i.height)), c = document.createElement('canvas');
        c.width = Math.round(i.width * k); c.height = Math.round(i.height * k);
        c.getContext('2d').drawImage(i, 0, 0, c.width, c.height); cb(c.toDataURL('image/jpeg', 0.7));
      };
      i.onerror = () => cb(null); i.src = r.result;
    };
    r.onerror = () => cb(null); r.readAsDataURL(file);
  };

  /* ---------- kerangka halaman ---------- */
  NL.page = o => {
    const st = S.get(), role = document.body.dataset.role || '';
    const need = { c: 'customer', d: 'driver', a: 'admin' }[role];
    if (need && st.role !== need) { location.replace('index.html'); return null; }
    if (role === 'c' && !o.reg && !(st.cust && st.cust.done)) { location.replace('c-wa.html'); return null; }
    if (role === 'd' && !o.pick && !NL.drv(st.did)) { location.replace('d-pilih.html'); return null; }
    const tabs = {
      c: [['c-home.html', 'Home'], ['c-pesanan.html', 'Pesanan'], ['c-chats.html', 'Chat'], ['c-profil.html', 'Profil']],
      d: [['d-masuk.html', 'Masuk'], ['d-saya.html', 'Pesanan saya']],
      a: [['a-ringkasan.html', 'Ringkasan'], ['a-pesanan.html', 'Pesanan'], ['a-driver.html', 'Driver'], ['a-customer.html', 'Customer'], ['a-tarif.html', 'Tarif']]
    }[role];
    const me = location.pathname.split('/').pop() || 'index.html';
    document.title = o.title;
    document.getElementById('root').innerHTML = '<div class="app"><header class="top">' +
      (o.back ? '<a class="back" href="' + o.back + '" aria-label="Kembali">&larr;</a>' : '') + '<h1>' + NL.esc(o.title) + '</h1>' +
      (st.role ? '<button class="ghost" id="sw">Ganti peran</button>' : '') + '</header>' +
      '<div class="demo">Versi dummy: data tersimpan di HP ini, tanpa server.</div><main id="main"></main>' +
      (tabs ? '<nav class="tabs">' + tabs.map(t => '<a href="' + t[0] + '" class="' + ((o.tab || me) === t[0] ? 'on' : '') + '">' + t[1] + '</a>').join('') + '</nav>' : '') + '</div>';
    const sw = document.getElementById('sw');
    if (sw) sw.onclick = () => { st.role = null; st.did = null; S.save(); location.href = 'index.html'; };
    return document.getElementById('main');
  };

  /* ---------- input lokasi ---------- */
  NL.locField = (el, o) => {
    o = o || {};
    const v = Object.assign({ lat: null, lng: null, link: '', text: '' }, o.value || {});
    el.innerHTML = '<button type="button" class="btn blue" data-lf="gps">Gunakan lokasi saya sekarang</button><div class="mute" data-lf="msg"></div>' +
      '<label>Link Google Maps (opsional)</label><div class="row"><input data-lf="link" placeholder="https://maps.app.goo.gl/..."><button type="button" class="btn plain small" data-lf="paste">Tempel</button></div>' +
      '<label>' + (o.label || 'Alamat dan patokan') + '</label><textarea data-lf="text" placeholder="' + (o.ph || 'Contoh: dekat warung Bu Siti, pagar hijau') + '"></textarea><div data-lf="prev"></div>';
    const f = n => el.querySelector('[data-lf=' + n + ']'), fire = () => { if (o.onChange) o.onChange(); };
    f('link').value = v.link || ''; f('text').value = v.text || '';
    function prev() {
      const u = NL.locUrl(v); let h = '';
      if (v.lat != null) { const d = 0.004; h += '<iframe class="osm" loading="lazy" title="Peta lokasi" src="https://www.openstreetmap.org/export/embed.html?bbox=' + [v.lng - d, v.lat - d, v.lng + d, v.lat + d].join(',') + '&layer=mapnik&marker=' + v.lat + ',' + v.lng + '"></iframe>'; }
      if (u) h += '<a class="btn plain small" target="_blank" rel="noopener" href="' + NL.esc(u) + '">Buka di Google Maps</a>';
      f('prev').innerHTML = h;
    }
    function syncLink() {
      v.link = f('link').value.trim(); const c = NL.parseMaps(v.link);
      if (c) { v.lat = c.lat; v.lng = c.lng; } else if (v.link || v.lat != null) { v.lat = null; v.lng = null; }
      prev(); fire();
    }
    f('gps').onclick = () => {
      f('msg').textContent = 'Mengambil lokasi...';
      NL.locate((p, e) => {
        if (!p) { f('msg').textContent = e; return; }
        v.lat = p.lat; v.lng = p.lng; v.link = NL.mapUrl(p); f('link').value = v.link;
        f('msg').textContent = 'Lokasi didapat (akurasi sekitar ' + Math.round(p.acc) + ' m).'; prev(); fire();
      });
    };
    f('paste').onclick = () => {
      if (!navigator.clipboard || !navigator.clipboard.readText) { f('msg').textContent = 'Tempel manual: tekan lama di kolom link.'; return; }
      navigator.clipboard.readText().then(t => { f('link').value = t; syncLink(); }, () => { f('msg').textContent = 'Akses clipboard ditolak. Tempel manual di kolom link.'; });
    };
    f('link').addEventListener('input', syncLink);
    f('text').addEventListener('input', fire);
    prev();
    return { get() { v.text = f('text').value.trim(); v.link = f('link').value.trim(); if (v.lat == null) { const c = NL.parseMaps(v.link); if (c) { v.lat = c.lat; v.lng = c.lng; } } return JSON.parse(JSON.stringify(v)); } };
  };

  NL.placePicker = (el, o) => {
    const a = S.get().cust.addr || {};
    const opts = [['home', 'Rumah utama'], ['second', 'Rumah kedua'], ['office', 'Kantor']].filter(x => a[x[0]]); opts.push(['other', 'Lokasi berbeda']);
    const id = 'pp' + Math.random().toString(36).slice(2, 7); let lf = null;
    el.innerHTML = '<label>' + o.label + '</label><div class="chips">' + opts.map((x, i) => '<label class="chip"><input type="radio" name="' + id + '" value="' + x[0] + '"' + (i === 0 ? ' checked' : '') + '><span>' + x[1] + '</span></label>').join('') + '</div><div class="ppbox" hidden></div>';
    const box = el.querySelector('.ppbox'), cur = () => el.querySelector('input:checked').value;
    el.addEventListener('change', () => {
      const v = cur(); box.hidden = v !== 'other';
      if (v === 'other' && !lf) lf = NL.locField(box, { onChange: o.onChange });
      if (o.onChange) o.onChange();
    });
    return {
      get() {
        const v = cur();
        if (v === 'other') { const l = lf ? lf.get() : {}; l.name = 'Lokasi berbeda'; return l; }
        const l = JSON.parse(JSON.stringify(a[v])); l.name = opts.find(x => x[0] === v)[1]; return l;
      }
    };
  };

  /* ---------- tampilan pesanan ---------- */
  NL.locName2 = l => (l && l.name === 'Lokasi berbeda' ? (l.text || 'lokasi berbeda') : NL.locName(l));
  NL.brief = o => {
    if (o.type === 'jastip') return [].concat(...(o.blocks || []).map(b => b.items.map(i => i.q + 'x ' + i.n))).join(', ');
    if (o.type === 'ojek') return NL.locName2(o.from) + ' ke ' + NL.locName2(o.to);
    return o.desc;
  };
  NL.card = (o, href, extra) => {
    const d = o.driverId ? NL.drv(o.driverId) : null, tag = href && !extra ? 'a' : 'div';
    return '<' + tag + (tag === 'a' ? ' href="' + href + '"' : '') + ' class="card oc"><div class="ocr"><b>' + NL.svc(o.type) + '</b><span class="badge s-' + o.status + '">' + NL.STAT[o.status] + '</span></div>' +
      '<div class="mute">' + o.id + (d ? ' - ' + NL.esc(d.name) : '') + '</div><p>' + NL.esc(NL.brief(o)) + '</p>' + (extra || '') + '</' + tag + '>';
  };
  NL.orderLocs = o => {
    if (o.type === 'jastip') return (o.blocks || []).map((b, i) => ['Beli di lokasi ' + (i + 1), b.loc]).concat([['Antar ke', o.to]]);
    if (o.type === 'ojek') return [['Jemput', o.from], ['Antar ke', o.to]];
    if (o.type === 'ambil') return [['Ambil di', o.from], ['Antar ke', o.to]];
    return [['Antar ke', o.to]];
  };
  NL.locHtml = (label, l) => {
    const u = NL.locUrl(l);
    return '<div class="loc"><b>' + NL.esc(label) + '</b><span>' + NL.esc([NL.locName(l), l && l.text].filter(Boolean).join(': ')) + '</span>' +
      (u ? '<a href="' + NL.esc(u) + '" target="_blank" rel="noopener">Buka di Google Maps</a>' : '') + '</div>';
  };
  NL.orderText = o => {
    const L = ['Halo, saya ' + o.cust + '. Pesanan ' + o.id + ' (' + NL.svc(o.type) + ')'];
    if (o.type === 'jastip') (o.blocks || []).forEach((b, i) => { L.push('Beli di lokasi ' + (i + 1) + ': ' + NL.locLine(b.loc)); b.items.forEach(it => L.push('- ' + it.q + 'x ' + it.n + (it.paid ? ' (sudah dibayar)' : it.p ? ' @' + NL.rp(it.p) : '') + (it.note ? ' (' + it.note + ')' : ''))); });
    else if (o.desc) L.push(o.desc);
    NL.orderLocs(o).filter(x => x[0].indexOf('Beli') !== 0).forEach(x => L.push(x[0] + ': ' + NL.locLine(x[1])));
    if (o.total) L.push('Estimasi total: ' + NL.rp(o.total));
    return L.join('\n');
  };
  NL.waDrivers = o => {
    const l = S.get().drivers.filter(d => d.on && d.type !== 'support' && NL.waNum(d.wa));
    if (!l.length) return '<div class="note">Belum ada driver yang punya nomor WhatsApp. Admin bisa mengisinya di menu Driver.</div>';
    return l.map(d => '<a class="btn small" target="_blank" rel="noopener" href="' + NL.esc(NL.waLink(d.wa, NL.orderText(o))) + '">Chat ' + NL.esc(d.name) + ' (' + NL.TYPES[d.type] + ')</a>').join('');
  };
  NL.takeOrder = (o, d) => {
    o.driverId = d.id; o.status = 'taken';
    if (d.type === 'support') {
      const c = S.get().chats; c[o.id] = c[o.id] || [];
      c[o.id].push({ from: 'd', text: 'Halo saya ' + d.name + ' Support Driver yang akan menghandle pesanan anda, boleh anda jelaskan apa yang bisa saya bantu?', t: Date.now() });
    }
    S.save();
  };
  NL.createOrder = f => {
    const s = S.get(), c = s.cust, d = new Date(), p = n => ('0' + n).slice(-2); s.seq++;
    const o = Object.assign({ id: p(d.getFullYear() % 100) + p(d.getMonth() + 1) + p(d.getDate()) + '.' + p(s.seq) + '.' + NL.LET[f.type], status: 'pending', driverId: null, rating: null, at: Date.now(), cust: c.name, wa: c.wa }, f);
    s.orders.unshift(o); s.chats[o.id] = []; S.save(); NL.go('c-terkirim.html?id=' + o.id);
  };

  /* ---------- halaman bersama: chat dan alamat ---------- */
  NL.chatPage = who => {
    const id = NL.q('id'), o = NL.ord(id), isC = who === 'c';
    const m = NL.page({ title: isC ? 'Chat driver' : 'Chat customer', back: isC ? 'c-status.html?id=' + id : 'd-detail.html?id=' + id, tab: isC ? 'c-chats.html' : 'd-saya.html' });
    if (!m) return;
    if (!o) { m.innerHTML = '<p class="mute">Pesanan tidak ditemukan.</p>'; return; }
    const draw = () => {
      const l = S.get().chats[id] || [], box = NL.$('#msgs');
      box.innerHTML = l.length ? l.map(x => '<div class="msg' + (x.from === who ? ' me' : '') + '">' + NL.esc(x.text) + '</div>').join('') : '<p class="mute">Belum ada pesan.</p>';
      box.scrollTop = box.scrollHeight;
    };
    m.innerHTML = '<div class="msgs" id="msgs"></div><div class="row sendrow"><input id="txt" placeholder="Ketik pesan..." autocomplete="off"><button class="btn small" data-act="send">Kirim</button></div><p class="mute">Chat dalam aplikasi ini tersimpan di HP (dummy). Balasan driver otomatis.</p>';
    draw();
    const REPLY = ['Siap kak, saya proses ya.', 'Baik, mohon ditunggu sebentar.', 'Saya OTW ke lokasi sekarang.', 'Sudah saya catat kak.'];
    NL.acts({
      send() {
        const t = NL.$('#txt').value.trim(); if (!t) return;
        const c = S.get().chats; c[id] = c[id] || []; c[id].push({ from: who, text: t, t: Date.now() }); S.save(); NL.$('#txt').value = ''; draw();
        if (isC) setTimeout(() => { c[id].push({ from: 'd', text: REPLY[Math.floor(Math.random() * REPLY.length)], t: Date.now() }); S.save(); draw(); }, 900);
      }
    });
    NL.$('#txt').addEventListener('keydown', e => { if (e.key === 'Enter') NL.$('[data-act=send]').click(); });
  };

  NL.addrPage = c => {
    const m = NL.page({ title: c.title, back: c.back, reg: true });
    if (!m) return;
    const st = S.get(); if (!st.cust) { location.replace('c-wa.html'); return; }
    st.cust.addr = st.cust.addr || {};
    const next = NL.next(c.next);
    m.innerHTML = '<section class="card"><div id="lf"></div></section><div class="note">' + c.tip + '</div>' +
      (c.key !== 'home' ? '<label class="chk"><input type="checkbox" id="asmain"> Jadikan alamat utama</label>' : '') +
      '<div class="err" id="err"></div><button class="btn" data-act="save">Simpan dan lanjut</button>' + (c.optional ? '<a class="btn blue" href="' + next + '">Lewati saja</a>' : '');
    const lf = NL.locField(NL.$('#lf'), { value: st.cust.addr[c.key], label: c.label });
    NL.acts({
      save() {
        const l = lf.get();
        if (!NL.hasLoc(l)) { NL.$('#err').textContent = 'Isi lokasi dulu: pakai lokasi saya, tempel link, atau tulis alamat.'; return; }
        if (c.key !== 'home' && NL.$('#asmain').checked) { if (st.cust.addr.home) st.cust.addr[c.key] = st.cust.addr.home; st.cust.addr.home = l; } else st.cust.addr[c.key] = l;
        S.save(); NL.go(next);
      }
    });
  };

  window.NL = NL;
})();
