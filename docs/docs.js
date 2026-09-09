// Turn each .dc-ex demo into demo + collapsible copyable source.
document.querySelectorAll('.dc-ex').forEach(ex => {
  const demo = ex.querySelector('.demo');
  if (!demo || ex.querySelector('details')) return;
  const src = demo.innerHTML.replace(/^\n+|\s+$/g, '');
  // dedent
  const lines = src.split('\n');
  const ind = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length));
  const code = lines.map(l => l.slice(ind)).join('\n');
  const d = document.createElement('details');
  d.innerHTML = '<summary>HTML <button class="cp" type="button">Copy</button></summary><pre></pre>';
  d.querySelector('pre').textContent = code;
  d.querySelector('.cp').addEventListener('click', e => { e.preventDefault(); navigator.clipboard.writeText(code); e.target.textContent = 'Copied'; setTimeout(() => e.target.textContent = 'Copy', 1200); });
  ex.appendChild(d);
});
// sliders: paint the filled track
document.querySelectorAll('.ui-slider input[type=range]').forEach(r => {
  const paint = () => r.style.setProperty('--ui-fill', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
  r.addEventListener('input', paint); paint();
});
// theme toggle: persisted in localStorage, applied to <body class="ui">
(() => {
  const apply = t => { document.body.dataset.theme = t; document.querySelectorAll('[data-theme-set]').forEach(b => b.classList.toggle('is-active', b.dataset.themeSet === t)); try { localStorage.uiuiTheme = t; } catch (e) {} };
  let t = ''; try { t = localStorage.uiuiTheme || ''; } catch (e) {}
  apply(t);
  document.querySelectorAll('[data-theme-set]').forEach(b => b.addEventListener('click', () => apply(b.dataset.themeSet)));
  document.querySelectorAll('[data-theme-toggle]').forEach(b => b.addEventListener('click', () => apply(document.body.dataset.theme === 'light' ? '' : 'light')));
})();
// home demo: slowly scrolling charts + stats that tick once a second (docs only, not part of the library)
(() => {
  const $ = k => document.querySelector(`.dc-hero [data-live="${k}"]`);
  if (!$('chart')) return;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const walk = (v, lo, hi, step) => Math.min(hi, Math.max(lo, v + rnd(-step, step)));
  // charts: fixed-step series that slide left; a new sample is appended every `period` ms
  const series = (svg, sel, x0, w, n, floor) => {
    const paths = sel.map(s => svg.querySelector(s));
    const src = paths[0].getAttribute('d').match(/[\d.]+ [\d.]+/g).map(p => +p.split(' ')[1]);
    // resample the hand-drawn path to n points so the scroll is smooth instead of a 25px stutter
    const d = Array.from({ length: n + 1 }, (_, i) => { const f = i / n * (src.length - 1), j = Math.min(src.length - 2, Math.floor(f)); return src[j] + (src[j + 1] - src[j]) * (f - j); });
    return { paths, d, x0, step: (w - x0) / (n - 1), floor, lo: Math.min(...src), hi: Math.max(...src) };
  };
  const draw = (s, t) => {
    const pts = s.d.map((y, i) => `${(s.x0 + (i - t) * s.step).toFixed(1)} ${y}`);
    const line = 'M ' + pts[0] + ' L ' + pts.slice(1).join(' ');
    s.paths.forEach((p, i) => p.setAttribute('d', i === 0 && s.floor != null ? `${line} V ${s.floor} H ${s.x0 - s.step} Z` : line));
  };
  const chart = $('chart').querySelector('svg');
  const S = [series(chart, ['.area.cyan', '.line.cyan'], 21, 330, 60, 128), series(chart, ['.line.purple'], 21, 330, 60, null),
             series($('spark'), ['path.fill', 'path.stroke'], 0, 300, 45, 34)];
  // keep the clip: the path starts one step left of the axis and is masked by the card overflow
  S.forEach(s => s.paths.forEach(p => p.style.clipPath = `inset(0 0 0 ${s.x0}px)`)); $('spark').style.overflow = 'hidden';
  const period = 700, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let t0 = performance.now();
  const frame = now => {
    let t = (now - t0) / period;
    if (t >= 1) { t0 = now; t = 0; S.forEach(s => { s.d.shift(); s.d.push(walk(s.d[s.d.length - 1] + (s.lo + s.hi - 2 * s.d[s.d.length - 1]) * .04, s.lo, s.hi, (s.hi - s.lo) / 9)); }); }
    S.forEach(s => draw(s, reduce ? 0 : t));
    if (!reduce) requestAnimationFrame(frame); else setTimeout(() => frame(performance.now()), period);
  };
  requestAnimationFrame(frame);
  // stats: tick once a second
  const st = { down: 940, up: 38, ms1: 11, ms2: 24, ms3: 19, wifi: 96, tx: 2402, rx: 1729, dl: 6.4, ul: 812, retry: 6, air: 18 };
  const fmt = (k, v) => { $(k).textContent = v; };
  setInterval(() => {
    st.down = walk(st.down, 700, 990, 40); st.up = walk(st.up, 20, 48, 3);
    st.ms1 = walk(st.ms1, 8, 16, 2); st.ms2 = walk(st.ms2, 18, 32, 3); st.ms3 = walk(st.ms3, 14, 26, 2);
    st.wifi = walk(st.wifi, 93, 98, 1); st.tx = walk(st.tx, 1729, 2402, 200); st.rx = walk(st.rx, 1200, 2402, 200);
    st.dl += rnd(0.001, 0.01); st.ul += rnd(0.05, 0.5); st.retry = walk(st.retry, 2, 12, 1); st.air = walk(st.air, 12, 30, 2);
    fmt('down', Math.round(st.down) + ' Mbps'); fmt('up', Math.round(st.up) + ' Mbps');
    ['ms1', 'ms2', 'ms3'].forEach(k => fmt(k, Math.round(st[k]))); fmt('wifi', Math.round(st.wifi) + '%');
    fmt('txrx', `${Math.round(st.tx)} / ${Math.round(st.rx)} Mbps`); fmt('dlb', st.dl.toFixed(2) + ' GB'); fmt('ulb', Math.round(st.ul) + ' MB');
    fmt('retry', Math.round(st.retry) + '%'); $('retrybar').style.width = Math.round(st.retry * 4) + '%';
    fmt('air', Math.round(st.air) + '%'); $('airbar').style.width = Math.round(st.air) + '%';
  }, 1000);
})();
