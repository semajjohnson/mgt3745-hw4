---
color-primary: "#123552"
color-accent: "#B16D00"
color-background: "#F7F9FB"
color-text: "#172B40"
color-error: "#922020"
color-success: "#1D4D2B"
font-body: "Arial, Helvetica, sans-serif"
font-size-min: 14px
space-unit: 8px
radius: 4px
measure-max: 44rem
target-min: 44px
---

# STYLE.md

Tokens above, rationale below. The frontmatter is what a machine reads; this body is what a human reads.

## Rationale

- **color-primary**: a deep navy used only on the button that adds to the pool, so the single action this page exists for is the only saturated thing on screen.
- **color-accent**: a warm ochre reserved entirely for focus outlines, deliberately unlike every other color here so a keyboard user always knows where they are.
- **color-background**: a near-white with a cool cast, so white form inputs read as separate surfaces without needing a border on everything.
- **color-text**: dark enough on the background to clear WCAG AA at body size, because the pool is read on a phone more than a laptop.
- **color-error / color-success**: paired at similar darkness so a rejection and a confirmation carry equal weight; being told why an entry was refused is information, not an alarm.
- **font-body**: a system stack with no web font, so the page renders identically from a Codespace, a phone, and a grader's browser with no network dependency for type.
- **font-size-min**: nothing drops below 14px, because the source name — the whole point of an item — is the smallest text on the page.
- **space-unit**: all padding and margins are multiples of 8px so nothing is eyeballed.
- **measure-max**: content caps near 75 characters per line, since the pool is a reading list before it is a tool.
- **target-min**: the smallest tappable height, because Dismiss sits beside text and a mis-tap permanently removes something a friend recommended.

## Refusals

Things this interface will never do. Taken from Apple Music, which one of my interviewees uses and dismissed outright.

1. **No algorithmic suggestions mixed into the pool.** Apple Music blends editorial and generated picks into the same shelves as saved music, so you cannot tell what you chose from what was chosen for you. Breaks the **Law of Common Region**: items grouped inside one boundary are read as one kind of thing. It is also feature F6 in FEATURES.md, classified Reverse.
2. **No icon-only destructive buttons.** Dismiss says "Dismiss." Apple Music hides removal behind an ellipsis and a sheet of unrelated options, so the destructive action looks identical to the harmless ones until you have tapped it. Breaks **Jakob's Law** in reverse — familiarity is used to hide consequence — and **Fitts's Law**, by shrinking a high-stakes target.
3. **No color-only signaling.** Every error and confirmation carries text. A red border alone leaves the rule invisible to anyone who cannot distinguish it, and telling you why an entry was refused is this page's core behavior.
4. **No inline styles, web fonts, or stylesheets from another origin.** Presentation stays in `styles.css`. Every extra origin becomes a row in TOOLS.md, and a typeface is not worth a crossing.

## Sources

- **Admired: Bandcamp.** One accent color, system-ish type, generous line length, and no interface between you and the thing you came for. The restraint above is borrowed from it: one saturated color for one action, everything else quiet.
- **Resented: Apple Music.** The interface my Profile B interviewee abandoned for discovery, which is what the refusals above are reacting to.