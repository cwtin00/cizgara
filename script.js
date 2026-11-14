// LODOS — etkileşimler
(function () {
  // Vurgu rengi: buradan değiştirebilirsin
  // document.documentElement.style.setProperty('--accent', '#B8955A');

  // Menü sekmeleri
  var tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-tab');
      tabs.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      document.querySelectorAll('[data-panel]').forEach(function (p) {
        p.hidden = p.getAttribute('data-panel') !== key;
      });
    });
  });

  // Kişi sayısı
  var guests = '2';
  var labels = document.querySelectorAll('.guests-label');
  function setGuests(v) {
    guests = v;
    labels.forEach(function (l) { l.textContent = v + ' kişi'; });
  }
  var pills = document.querySelectorAll('[data-guests]');
  pills.forEach(function (p) {
    p.addEventListener('click', function () {
      pills.forEach(function (x) { x.setAttribute('aria-pressed', String(x === p)); });
      setGuests(p.getAttribute('data-guests'));
    });
  });

  // Rezervasyon formu (backend bağlanınca burada fetch ile gönder)
  var form = document.getElementById('rez-form');
  var confirmBox = document.getElementById('confirm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = Object.fromEntries(new FormData(form).entries());
    data.kisi = guests;
    console.log('Rezervasyon talebi:', data);
    form.hidden = true;
    confirmBox.hidden = false;
  });
  document.getElementById('rez-reset').addEventListener('click', function () {
    form.reset();
    form.hidden = false;
    confirmBox.hidden = true;
  });

  // Scroll animasyonu desteklenmeyen tarayıcılar (Safari, Firefox) için yedek
  var supportsSDT = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (!supportsSDT && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('no-sdt');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  }

  // Bugünden önceki tarihleri kapat
  var date = form.querySelector('input[type="date"]');
  if (date) date.min = new Date().toISOString().split('T')[0];
})();
