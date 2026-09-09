---
title: uiui — console design system
description: uiui (YOO-ee-YOO-ee) is a dense console design system in one CSS file, inspired by the Unifi console: app shell, filter sidebar, detail drawer, data tables, port grids, charts, light and dark. Plain HTML, no build, made for agents to copy from.
canonical: https://uiui.statico.io/
doc_version: 0.2.0
last_updated: 2026-09-09
---

# uiui

Pronounced YOO-ee-YOO-ee.


[![The uiui demo: a network console with filter sidebar, client table, throughput chart and detail drawer](docs/assets/demo.png)](https://uiui.statico.io)

A dense, dark, operations-console UI kit in plain HTML and one CSS file, inspired by the Unifi console. Pronounced YOO-ee-YOO-ee. Live at [uiui.statico.io](https://uiui.statico.io).
Like [smui.statico.io](https://smui.statico.io) or shadcn, but for network-console style interfaces: a style guide, a widget catalogue and full example pages that agents (and people) can copy from.

- `src/uiui.css` — the whole library. Tokens, shell, widgets, dark and light themes. No build step, no JS.
- `docs/index.html` — style guide with every widget and copyable HTML.
- `docs/examples/` — dashboard, clients, settings, policies, radios pages.
- `skill.md` — instructions for agents: widget list, recipes, composition rules.
- `registry/uiui-theme.json` — palette as a shadcn theme.
- `docs/llms.txt`, `docs/index.md` — agent-readable entry points; `/AGENTS.md` on the site serves `skill.md`.

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


---

# uiui — agent guide

Dense dark console UI as plain HTML + one CSS file. No build, no framework, no JS required.
Read this file, then copy the closest page in `docs/examples/` and edit it. Do not invent new visual styles.

## Install and setup

```html
<link rel="stylesheet" href="src/uiui.css">
<body class="ui"> … </body>
<!-- icons: lucide sprite -->
<svg class="ui-icon"><use href="docs/vendor/lucide-sprite.svg#wifi"/></svg>
```

All classes are prefixed `ui-`. Everything must sit inside an element with class `ui`.
State modifiers: `is-active`, `is-selected`, `is-muted`, `is-collapsed`, `is-sorted`. Size modifiers: `sm`, `lg`, `xl`.
Icons are lucide (ISC), used via the sprite. Sizes: `.ui-icon` 16px, `.sm` 14, `.lg` 20, `.xl` 24.

## Rules for content

- Never use real hostnames, IPs, MAC addresses, SSIDs or names. Use `192.168.0.x` / `192.168.1.x`, MACs like `3A:F1:9C:0B:7E:21`, devices like "Kitchen Display", "Loft AP", "Core Switch", SSID "Birchwood", site "Home Office".
- Numbers are tabular (`font-feature-settings` set globally). Right-align numeric columns with `.right`.
- Text: 13px base. Use `.ui-muted` (secondary), `.ui-dim` (tertiary), `.ui-bright` (headline), `.ui-sm`/`.ui-xs` for smaller, `.ui-strong` for weight. Semantic colours: `.ui-green .ui-red .ui-yellow .ui-orange .ui-purple .ui-accent .ui-lime`.
- Sentence case everywhere except filter/nav section titles, which are small caps-style uppercase labels (`.ui-filter-title`, `.ui-nav-label`).
- Do not mention the brand that inspired this library anywhere in generated UI.

## Usage: page recipes (start here)

| Want | Copy | Shell |
|---|---|---|
| Overview with stats, charts, tiles | `docs/examples/dashboard.html` | topbar + rail + wide main |
| Big filterable list with detail drawer | `docs/examples/clients.html` | topbar + rail + filter sidebar + table + drawer |
| Settings / forms | `docs/examples/settings.html` | topbar + rail + `.ui-settings` (nav + body) |
| Rules matrix, flow diagram, timeline | `docs/examples/policies.html` | topbar + rail + timeline rail + body |
| RF / capacity analytics | `docs/examples/radios.html` | topbar + rail + card grid |

Shell skeleton:

```html
<div class="ui-app">
  <header class="ui-topbar">…</header>
  <nav class="ui-rail">…</nav>
  <aside class="ui-sidebar">…</aside>        <!-- optional; omit and put style="grid-column: side / drawer" on main -->
  <main class="ui-main ui-page">…</main>
  <aside class="ui-drawer">…</aside>         <!-- optional -->
</div>
```

Grid areas: topbar 48px, rail 48px, sidebar 260px, drawer 360px. Main scrolls; sidebar/drawer scroll independently.

## Widget catalogue

Each entry: class → what it is → key children/modifiers. Live examples with copyable HTML: `docs/index.html`.

### Shell
- `.ui-app` app grid. `.ui-topbar` (`.ui-brand`, `.ui-topbar-tab.is-active`, `.ui-topbar-actions`). `.ui-rail` vertical icon nav (`.ui-rail-btn.is-active`). `.ui-sidebar` (`.ui-sidebar-body`, `.ui-sidebar-foot`). `.ui-main` scroll region; add `.ui-page` for padding. `.ui-drawer` (`.ui-drawer-head`, `-body`, `-foot`).
- `.ui-collapse` collapsible header row in a sidebar.

### Layout helpers
- `.ui-row` flex row gap 8, `.ui-between` space-between, `.ui-stack` column, `.ui-grow`, `.ui-divider` (horizontal), `.ui-vdivider`, `.ui-truncate`, `.ui-section-title`.
- `.ui-cards` responsive card grid (override `grid-template-columns` inline when needed).

### Buttons
- `.ui-btn` default (raised). Modifiers: `primary`, `outline`, `ghost`, `danger`, `icon`, `sm`, `block`, `link`, `link.muted`.
- `.ui-links` row of text links; `.stack` for vertical. Red destructive links: `<a class="ui-red">`.

### Forms
- `.ui-field` + `.ui-label` + control + `.ui-help` (`.error`). Controls: `.ui-input`, `.ui-select`, `.ui-textarea`.
- `.ui-input-wrap` for a leading icon and/or `.ui-addon` trailing unit/button. `.ui-search` search box. `.ui-stepper` numeric with `.ui-unit`/`.ui-arrows`.
- `.ui-check`, `.ui-radio` (label wrapping input + text, optional `.ui-count`). Groups: `.ui-check-group`, `.ui-radio-group` (`.column`).
- `.ui-switch` toggle (`.between` spreads label + toggle; `.ui-switch-label`). `.ui-toggle-row` full-width settings row with description + switch.
- `.ui-seg` segmented control (`button.is-active`); modifiers `solid`, `block`, `bare`, `sm`. `.ui-chips` selectable chip row.
- `.ui-slider` range with `.ui-ticks` (`.marks`) and `.ui-slider-head`. `.ui-info` small (i) glyph for tooltips.
- `.ui-form-row` two-column settings row: `.ui-form-label` (+ `.ui-sub`) then control. `.ui-actions` grid of `.ui-action` icon tiles (quick actions).

### Status & identity
- `.ui-chip` small label: `blue green red yellow outline`. `.ui-badge` tiny uppercase pill. `.ui-dot` status dot: default green, `off red yellow blue lg`.
- `.ui-meter[data-level=1-4]` signal strength dashes (`<i>` ×3-4); `.filter` variant. `.ui-avatar` (`.round`, `.lg`, colour via `--ui-c`). `.ui-device` icon + name inline.
- `.ui-up` / `.ui-down` direction arrows for throughput.

### Tables
- `.ui-table` dense 31px rows, sticky header. `th.sortable`, `th.is-sorted`, `tr.is-selected` (navy + blue edge), `tr.is-muted`, `td.right`, `.w-check`, `.w-dot`. Modifiers: `compact`, `card`, `striped`. `.ui-th-filter` filter icon in header. `.ui-table-wrap` horizontal scroll. `.ui-pager` + `.ui-pager-nav`.

### Filter sidebar
- `.ui-subtabs` icon tabs (labels appear only on active). `.ui-filter` section with `.ui-filter-title` (`.is-collapsed`) and `.ui-filter-list` (`.two` columns, `.scroll`). `.ui-selected` chip showing active filters.

### Cards & summaries
- `.ui-card` (`flat`, `outline`, `focus`). `.ui-card-title` h3 + right slot; `.chev` for expandable. `.ui-kv` key/value rows (`tight lined bright dim`). `.ui-stat` big number + label. `.ui-pills`/`.ui-pill` metric pills. `.ui-counts` inline count strip. `.ui-empty` empty state. `.ui-inline-stats` numbers in a row. `.ui-device-hero` device photo/icon header.

### Tiles
- `.ui-tiles` grid of `.ui-tile` (`.is-active`, `.round`, `.lg`) with `.ui-tile-box`, `.ui-tile-count`, `.ui-tile-label`. Use for AP/device/app pickers.

### Ports
- `.ui-ports` two-row switch port grid of `.ui-port` (`fe gbe tengbe off poe sm sfp`). `.ui-legend` colour legend (`<span><i style="--ui-c:…"></i> label</span>`).

### Matrix
- `.ui-matrix-wrap` (axis labels `.ui-matrix-dst`, `.ui-matrix-src`) around `table.ui-matrix`; cells `allow block return none`, `is-active`; `.ui-n` count badge; `th.all`.

### Charts (CSS + inline SVG, no library)
- `.ui-bar` progress bar (`thick`, `thin`; stacked by multiple `<i>` with `--ui-c`). `.ui-bar-head` label/value row. `.ui-bars` vertical bar list.
- `.ui-buckets` histogram of `red orange yellow green` buckets (`.muted`). `.ui-scale` gradient scale with `.ui-mark` markers. `.ui-channels` channel plan (`.ui-ch-row`, `.ui-ch-label`, `.ui-ch-head`, `.ui-ch` with `use dfs na w2 w4 w8`). `.ui-heat` (`.hot`) heat cell.
- `.ui-chart` wraps an SVG using classes `grid`, `axis`, `line.cyan|purple|blue|orange|green`, `area`, `threshold`, `band.blue|green|yellow|orange`. `.ui-chart-foot`, `.ui-chart-legend`. `.ui-spark` sparkline. `.ui-linkline` WAN link status line.

### Timeline
- `.ui-timeline` vertical time rail (`.ui-tl-head`, `.ui-tl-zoom`, `.ui-tl-axis`, `.ui-tl-tick`, `.ui-tl-live`).

### Settings navigation
- `.ui-settings` grid (210px nav + body): `.ui-settings-nav`, `.ui-settings-body`. `.ui-nav` list of `a.ui-nav-item` (`.is-active`), `.ui-nav-label` (`.strong`), `.ui-nav-sep`, `.ui-nav-icons` icon row, `.ui-nav-tree` dotted child tree, `.ui-nav-foot`.
- `.ui-options` / `.ui-option-list` / `.ui-option` (`.is-active`) selectable option rows; `.ui-flow` step flow. `.ui-focus-panel` highlighted sub-panel.

### Notices & overlays
- `.ui-notice` (`raised warn danger inline`). `.ui-hint` small helper line. `.ui-tooltip` (`.arrow-bottom`). `.ui-modal-backdrop` > `.ui-modal` (`-head`, `-body`, `-foot`). `.ui-toast` (`.error`).

### Diagram
- `.ui-diagram` container; `.ui-node` (`.dashed`, `.lg`, `.ui-node-sub`), `.ui-group` with `.ui-group-label`, `.ui-edge` (`.dotted`, `.plain`), `.ui-route-card`.

### Misc
- `.ui-mono`, `.ui-code`, `.ui-num`.

## Composition rules

1. One accent. Blue means selected/primary/link. Green/red/yellow only for status.
2. Surfaces stack: page bg → card → raised control. Never nest a card in a card; use `.ui-divider` or a `.ui-kv.lined` inside.
3. Tables are the default for lists of more than ~6 rows; tiles for pickers; kv for a single entity.
4. Detail lives in the right drawer, editing lives in the settings body, never in a modal unless destructive confirmation.
5. Headings: page title 16px 600; card title 13px 600; section labels muted uppercase 11px.
6. Keep row height 31px; do not add padding to `td`.
7. Use inline `style` only for data-driven values (widths, `--ui-c`, positions), not for design.

## Theming

Dark is the default. For light mode put `data-theme="light"` (or class `light`) on the `.ui` element; every token flips, no other changes needed. The example pages carry a sun/moon button (`data-theme-toggle`) that stores the choice in `localStorage.uiuiTheme`.

Tokens are CSS variables on `.ui` (`--ui-bg`, `--ui-surface`, `--ui-accent`, …). shadcn-style aliases (`--background`, `--primary`, `--border`, …) are also exposed; `registry/uiui-theme.json` carries the same palette for shadcn projects.


## Sitemap

- [/](https://uiui.statico.io/)
- [/index.md](https://uiui.statico.io/index.md)
- [/skill.md](https://uiui.statico.io/skill.md)
- [/llms.txt](https://uiui.statico.io/llms.txt)
- [/sitemap.md](https://uiui.statico.io/sitemap.md)
- [/examples/dashboard.html](https://uiui.statico.io/examples/dashboard.html)
- [/examples/clients.html](https://uiui.statico.io/examples/clients.html)
- [/examples/settings.html](https://uiui.statico.io/examples/settings.html)
- [/examples/policies.html](https://uiui.statico.io/examples/policies.html)
- [/examples/radios.html](https://uiui.statico.io/examples/radios.html)
