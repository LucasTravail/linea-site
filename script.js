document.addEventListener('DOMContentLoaded', function () {
  var currentLang = 'fr';

  // i18n : détection langue navigateur + sélecteur manuel mémorisé
  (function () {
    var SUPPORTED = Object.keys(LINEA_I18N);
    var STORAGE_KEY = 'linea-lang';
    var select = document.getElementById('lang-switcher');

    function detectLang() {
      var saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
      if (saved && SUPPORTED.indexOf(saved) !== -1) return saved;

      var browserLangs = navigator.languages || [navigator.language || 'fr'];
      for (var i = 0; i < browserLangs.length; i++) {
        var code = (browserLangs[i] || '').slice(0, 2).toLowerCase();
        if (SUPPORTED.indexOf(code) !== -1) return code;
      }
      return 'en';
    }

    function applyLang(lang) {
      var dict = LINEA_I18N[lang] || LINEA_I18N.en;
      document.documentElement.setAttribute('lang', lang);
      document.title = dict.title;
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', dict.metaDescription);

      document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
      });

      document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (dict[key]) el.setAttribute('placeholder', dict[key]);
      });

      currentLang = lang;
      if (select) select.value = lang;
    }

    var lang = detectLang();
    applyLang(lang);

    if (select) {
      select.addEventListener('change', function () {
        var chosen = select.value;
        try { localStorage.setItem(STORAGE_KEY, chosen); } catch (e) {}
        applyLang(chosen);
      });
    }
  })();

  // simule une mesure "live" sur l'écran rond du hero : défilement continu + anneau synchro
  var reading = document.getElementById('device-reading');
  var arc = document.getElementById('device-ring-arc');
  if (reading && arc && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var RANGE_MIN = 0;
    var RANGE_MAX = 150;
    var radius = 44;
    var circumference = 2 * Math.PI * radius;
    arc.style.strokeDasharray = circumference.toFixed(2);

    var value = 14.33;
    var direction = 1;
    var speed = 0.12; // mm par tick

    function render() {
      reading.textContent = value.toFixed(2);
      var percent = (value - RANGE_MIN) / (RANGE_MAX - RANGE_MIN);
      arc.style.strokeDashoffset = (circumference * (1 - percent)).toFixed(2);
    }

    render();

    setInterval(function () {
      // inverse la course près des bornes, ou occasionnellement pour simuler l'utilisateur
      if (value <= RANGE_MIN + 1) direction = 1;
      else if (value >= RANGE_MAX - 1) direction = -1;
      else if (Math.random() < 0.01) direction *= -1;

      value += direction * speed * (0.6 + Math.random() * 0.8);
      value = Math.min(RANGE_MAX, Math.max(RANGE_MIN, value));
      render();
    }, 45);
  }

  // confirmation visuelle à l'envoi (la vraie soumission part vers Brevo, target="_blank")
  var form = document.getElementById('newsletter-form');
  var status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', function () {
      var dict = LINEA_I18N[currentLang] || LINEA_I18N.en;
      status.textContent = dict.formStatusSuccess;
      status.className = 'form-status success';
    });
  }
});
