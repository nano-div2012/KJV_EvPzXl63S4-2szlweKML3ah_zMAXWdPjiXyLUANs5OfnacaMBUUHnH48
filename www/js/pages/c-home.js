(function () {
  const m = NL.page({ title: 'Next Level' });
  if (!m) return;
  m.innerHTML = '<div class="hello"><h2>Halo, ' + NL.esc(NL.S.get().cust.name) + '</h2><p>Mau pesan apa kamu sekarang? Pilih menu jasa di bawah.</p></div>' +
    NL.SERV.map(s => '<a class="svc s-' + s[0] + '" href="c-cara.html?s=' + s[0] + '"><b>' + s[1] + '</b><span>' + s[2] + '</span></a>').join('');
})();
