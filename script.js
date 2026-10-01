document.addEventListener('DOMContentLoaded', function () {
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
});
