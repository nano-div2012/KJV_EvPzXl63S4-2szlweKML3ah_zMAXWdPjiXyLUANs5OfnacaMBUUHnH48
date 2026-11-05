(function () {
  const S = NL.S, st = S.get();
  const m = NL.page({ title: 'Next Level' });
  m.innerHTML = '<section class="card hero"><h2>Pilih peran untuk dicoba</h2><p class="mute">Satu HP bisa mencoba ketiga sisi. Pesanan dari customer langsung muncul di driver dan admin. Lokasi dan WhatsApp memakai fitur asli HP.</p></section>' +
    '<button class="btn" data-act="role" data-v="customer">Masuk sebagai Customer</button>' +
    '<button class="btn blue" data-act="role" data-v="driver">Masuk sebagai Driver</button>' +
    '<button class="btn red" data-act="role" data-v="admin">Masuk sebagai Admin</button>' +
    '<button class="btn plain" data-act="reset">Reset semua data dummy</button>';
  NL.acts({
    role(b) {
      st.role = b.dataset.v; S.save();
      NL.go(st.role === 'customer' ? (st.cust && st.cust.done ? 'c-home.html' : 'c-wa.html') : st.role === 'driver' ? 'd-pilih.html' : 'a-ringkasan.html');
    },
    reset() { if (confirm('Hapus semua data dummy di HP ini?')) { S.reset(); location.reload(); } }
  });
})();
