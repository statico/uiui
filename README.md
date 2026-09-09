# uiui

A dense, dark, operations-console UI kit in plain HTML and one CSS file, inspired by the Unifi console.
Like [smui.statico.io](https://smui.statico.io) or shadcn, but for network-console style interfaces: a style guide, a widget catalogue and full example pages that agents (and people) can copy from.

- `src/uiui.css` — the whole library. Tokens, shell, widgets, dark and light themes. No build step, no JS.
- `docs/index.html` — style guide with every widget and copyable HTML.
- `docs/examples/` — dashboard, clients, settings, policies, radios pages.
- `skill.md` — instructions for agents: widget list, recipes, composition rules.
- `registry/uiui-theme.json` — palette as a shadcn theme.

## Use

```html
<link rel="stylesheet" href="uiui.css">
<body class="ui">                 <!-- or class="ui light" / data-theme="light" -->
  <button class="ui-btn primary">Apply changes</button>
</body>
```

Icons are [lucide](https://lucide.dev) (ISC), vendored as an SVG sprite in `docs/vendor/`. Serve over http; `<use href>` to an external sprite does not work from `file://`.

## Preview

```
python3 -m http.server 8765
open http://127.0.0.1:8765/docs/
```

All names, addresses and identifiers in the examples are invented.

MIT.
