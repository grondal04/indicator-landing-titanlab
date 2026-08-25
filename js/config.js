window.TITANLAB_CONFIG = {
  // "Contact Now" destination (e.g. "https://t.me/titanlab")
  TELEGRAM_URL: "https://t.me/YOUR_TELEGRAM",
  TELEGRAM_HANDLE: "@TitanLab",
  // Header phone number (wireframe: Logo -> Phone -> CTA). Replace the placeholder
  // below with your real number, or leave it empty ("") to show the Telegram handle instead.
  PHONE: "333-333-3333",
  // Partner broker ref link (the required action)
  REF_URL: "https://YOUR-REF-LINK.com",
  // Broker name (e.g. "Exness"). Leave empty for "our partner broker".
  BROKER_NAME: "",
  // SOCIAL PROOF #2 — the trust band directly under the hero (trust reinforcement).
  //   MODE "logos"  → a "Trusted by" row. Paste logo image URLs into LOGOS;
  //                   empty entries stay as labelled placeholder boxes.
  //   MODE "rating" → a star line, e.g.  ★★★★★  4.9/5  from 1,200+ traders
  SOCIAL_PROOF_2: {
    MODE: "logos",
    LABEL: "Trusted by traders on",
    LOGOS: ["", "", "", "", ""],
    STARS: 5,
    SCORE: "4.9/5",
    SCORE_TEXT: "from 1,200+ traders"
  },
  // SOCIAL PROOF #1 — stars + trader count, above the hero headline.
  // STARS supports halves (4.5, 4.9). Swap TEXT for your own number.
  SOCIAL_PROOF_1: { STARS: 4.9, TEXT: "Trusted by 2,500+ traders" },
  // CTA labels — one main action across the whole page.
  CTA_LABEL: "Show Me How",
  HEADER_CTA_LABEL: "Contact Now",
  // Free spots
  TOTAL_SLOTS: 100,
  TAKEN_SLOTS: 16,
  // Original price (USD)
  ORIGINAL_PRICE: 499,
  // "Contact Now" behaviour: "telegram" = open Telegram | "form" = scroll to the form
  CTA_MODE: "telegram",
  // Optional form endpoint (Formspree / Google Apps Script / webhook). Leave empty = no data is stored.
  FORM_ENDPOINT: "",
  // MEDIA SLOTS — paste an image URL (.jpg/.png/.webp/.gif), a video URL (.mp4/.webm) or a YouTube link.
  // Leave empty to keep the placeholder. Local files work too, e.g. "images/chart.png".
  // "Real results" rail — 6 VERTICAL (9:16) videos, horizontal scroll.
  // Paste .mp4/.webm URLs, YouTube / YouTube Shorts links, or images. Empty = placeholder.
  PROOF_VIDEOS: ["", "", "", "", "", ""],
  MEDIA: {
    pain:     "",   // Pain-point section — optional image or video
    benefit1: "",   // Value prop #1 — image or video
    benefit2: "",   // Value prop #2 — image or video
    benefit3: "",   // Value prop #3 — image or video
    proof2:   "",   // Social proof #2 — wide box
    recap:    ""    // Final recap image (mobile) — defaults to the TitanLab emblem
  }
};
