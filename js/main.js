// CizzGara — site etkileşimleri
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Başlık animasyonu
  requestAnimationFrame(function () { document.documentElement.classList.add('ready'); });

  // Kaydırınca beliren öğeler
  var ups = document.querySelectorAll('.up');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    ups.forEach(function (el) { io.observe(el); });
  } else {
    ups.forEach(function (el) { el.classList.add('in'); });
  }

  // Logo kaydırdıkça hafifçe döner
  var logo = document.querySelector('.logo-big');
  if (logo && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 900);
        logo.style.transform = 'rotate(' + (y * 0.04) + 'deg) translateY(' + (y * -0.06) + 'px)';
        ticking = false;
      });
    }, { passive: true });
  }

  // Mobil menü
  var burger = document.querySelector('.burger');
  var mm = document.getElementById('mobile-menu');
  if (burger && mm) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Menüyü aç' : 'Menüyü kapat');
      mm.hidden = open;
    });
  }

  // Menü sayfası: kategori çubuğu aktif olanı gösterir
  var catLinks = document.querySelectorAll('.cats a');
  if (catLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    catLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          catLinks.forEach(function (a) { a.classList.remove('active'); });
          var a = map[e.target.id];
          if (a) {
            a.classList.add('active');
            a.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
          }
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.menu-cat').forEach(function (s) { spy.observe(s); });
  }

  // Sayfalar arası yumuşak geçiş
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href$=".html"]');
    if (!a || reduce || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(function () { window.location.href = a.getAttribute('href'); }, 220);
  });
  window.addEventListener('pageshow', function (e) { if (e.persisted) document.body.classList.remove('leaving'); });

  // Açık / kapalı durumu (Türkiye saatine göre)
  // Hafta içi 09.00–21.00, hafta sonu 09.00–03.00 (gece yarısını geçer)
  var st = document.getElementById('open-status');
  if (st) {
    var update = function () {
      var parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
      var day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(get('weekday'));
      var m = parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10);
      var weekend = day === 0 || day === 6;
      var open = (m >= 540 && (weekend || m < 1260)) || (m < 180 && (day === 0 || day === 1));
      st.classList.toggle('closed', !open);
      st.lastChild.textContent = open ? 'Şu an açık' : "Şu an kapalı · 09.00'da açılıyor";
    };
    update();
    setInterval(update, 60000);
  }

  // Yıl
  var yr = document.getElementById('yil');
  if (yr) yr.textContent = new Date().getFullYear();
})();
