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
