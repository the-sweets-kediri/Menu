(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll('.poster'));
  var N = pages.length, cur = 0, busy = false;
  var fb = document.getElementById('flipbook');

  function setHeight() { fb.style.height = pages[cur].offsetHeight + 'px'; }
  window.addEventListener('load', setHeight);
  window.addEventListener('resize', setHeight);

  function goNext() {
    if (busy || cur >= N - 1) return;
    busy = true;
    var p = pages[cur];
    p.classList.add('flipping');
    requestAnimationFrame(function () { p.classList.add('flipped'); });
    cur++; setHeight();
    setTimeout(function () { p.classList.remove('flipping'); busy = false; }, 860);
  }
  function goPrev() {
    if (busy || cur <= 0) return;
    busy = true;
    var p = pages[cur - 1];
    p.classList.add('flipping');
    requestAnimationFrame(function () { p.classList.remove('flipped'); });
    cur--; setHeight();
    setTimeout(function () { p.classList.remove('flipping'); busy = false; }, 860);
  }

  var startX = null, startY = null;
  function down(x, y) { startX = x; startY = y; }
  function up(x, y) {
    if (startX === null) return;
    var dx = x - startX, dy = y - startY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? goNext() : goPrev(); }
    startX = startY = null;
  }
  fb.addEventListener('touchstart', function (e) { var t = e.changedTouches[0]; down(t.clientX, t.clientY); }, { passive: true });
  fb.addEventListener('touchend', function (e) { var t = e.changedTouches[0]; up(t.clientX, t.clientY); }, { passive: true });
  fb.addEventListener('mousedown', function (e) { down(e.clientX, e.clientY); });
  window.addEventListener('mouseup', function (e) { if (startX !== null) up(e.clientX, e.clientY); });
  document.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') goNext(); else if (e.key === 'ArrowLeft') goPrev(); });

  setHeight();
})();
