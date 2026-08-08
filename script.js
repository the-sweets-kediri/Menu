(function () {
  var pages = Array.prototype.slice.call(document.querySelectorAll('.poster'));
  var N = pages.length, cur = 0, busy = false;
  var prevBtn = document.getElementById('prev');
  var nextBtn = document.getElementById('next');
  var dots = Array.prototype.slice.call(document.querySelectorAll('.pd'));
  var fb = document.getElementById('flipbook');
function setHeight() { fb.style.height = pages[cur].offsetHeight + 'px'; }
window.addEventListener('load', setHeight);
window.addEventListener('resize', setHeight);


  function sync() {
    prevBtn.disabled = (cur === 0);
    nextBtn.disabled = (cur === N - 1);
    dots.forEach(function (d, i) { d.classList.toggle('active', i === cur); });
  }
  function goNext() {
    if (busy || cur >= N - 1) return;
    busy = true;
    var p = pages[cur];
    p.classList.add('flipping');
    requestAnimationFrame(function () { p.classList.add('flipped'); });
    cur++;
    setTimeout(function () { p.classList.remove('flipping'); busy = false; }, 860);
    sync();
  }
  function goPrev() {
    if (busy || cur <= 0) return;
    busy = true;
    var p = pages[cur - 1];
    p.classList.add('flipping');
    requestAnimationFrame(function () { p.classList.remove('flipped'); });
    cur--;
    setTimeout(function () { p.classList.remove('flipping'); busy = false; }, 860);
    sync();
  }
  function goTo(i) {
    while (cur < i && cur < N - 1) { pages[cur].classList.add('flipped'); cur++; }
    while (cur > i && cur > 0) { pages[cur - 1].classList.remove('flipped'); cur--; }
    sync();
  }

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', goPrev);
  dots.forEach(function (d) { d.addEventListener('click', function () { goTo(parseInt(d.dataset.p, 10)); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') goNext();
    else if (e.key === 'ArrowLeft') goPrev();
  });

  var startX = null, startY = null;
  var fb = document.getElementById('flipbook');
  function down(x, y) { startX = x; startY = y; }
  function up(x, y) {
    if (startX === null) return;
    var dx = x - startX, dy = y - startY;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) goNext(); else goPrev(); }
    startX = startY = null;
  }
  fb.addEventListener('touchstart', function (e) { var t = e.changedTouches[0]; down(t.clientX, t.clientY); }, { passive: true });
  fb.addEventListener('touchend', function (e) { var t = e.changedTouches[0]; up(t.clientX, t.clientY); }, { passive: true });
  fb.addEventListener('mousedown', function (e) { down(e.clientX, e.clientY); });
  window.addEventListener('mouseup', function (e) { if (startX !== null) up(e.clientX, e.clientY); });

  sync();
})();
