(function () {
  const S = NL.S, st = S.get();
  const m = NL.page({ title: 'Verifikasi wajah', reg: true, back: 'c-wa.html' });
  if (!m) return;
  if (!st.cust) { location.replace('c-wa.html'); return; }
  const next = NL.next('c-rumah.html');
  m.innerHTML = '<section class="card center"><h2>Foto selfie</h2><p class="mute">Foto disimpan di HP ini dan dicek manual oleh admin.</p>' +
    '<div id="ph"></div><input type="file" id="file" accept="image/*" capture="user" hidden>' +
    '<button class="btn blue" data-act="take">Ambil selfie</button><div class="err" id="err"></div></section>' +
    '<button class="btn" data-act="go">Lanjut</button><a class="btn plain" href="' + next + '">Lewati dulu</a>';
  const show = () => { NL.$('#ph').innerHTML = st.cust.selfie ? '<img class="selfie" alt="Foto selfie" src="' + st.cust.selfie + '">' : '<div class="selfie ph">Belum ada foto</div>'; };
  show();
  NL.$('#file').addEventListener('change', e => {
    const f = e.target.files[0]; if (!f) return;
    NL.shrink(f, 360, d => { if (!d) { NL.$('#err').textContent = 'Foto tidak bisa dibaca. Coba lagi.'; return; } st.cust.selfie = d; S.save(); NL.$('#err').textContent = ''; show(); });
  });
  NL.acts({
    take() { NL.$('#file').click(); },
    go() { if (!st.cust.selfie) { NL.$('#err').textContent = 'Ambil selfie dulu, atau pilih Lewati dulu.'; return; } NL.go(next); }
  });
})();
