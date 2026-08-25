# TitanLab landing page — source split

```
titanlab-site/
├── index.html          # markup only (inline SVG icon sprite kept in <body>)
├── css/
│   ├── fonts.css       # @font-face for self-hosted fonts
│   └── style.css       # all page styles
├── js/
│   ├── config.js       # window.TITANLAB_CONFIG — EDIT THIS (links, phone, slots, media…)
│   └── main.js         # page logic (CTA wiring, slot meter, media slots, FAQ, reveal…)
└── assets/
    ├── img/
    │   ├── favicon.png            # 64×64
    │   ├── titanlab-logo.webp     # header + footer logo (560×76)
    │   └── titanlab-emblem.webp   # hero emblem + mobile recap image (720×720)
    └── fonts/                     # Be Vietnam Pro 400–800, Chakra Petch 500–700 (woff2, latin + vietnamese)
```

- Open `index.html` directly or serve the folder with any static host — no build step.
- Fonts are self-hosted (from Google Fonts / @fontsource, OFL license). To switch back to the Google Fonts CDN, see the comment in `index.html` `<head>`.
- Your own media (MEDIA / PROOF_VIDEOS in `js/config.js`) can be dropped into `assets/img/` and referenced as `assets/img/your-file.png`.
