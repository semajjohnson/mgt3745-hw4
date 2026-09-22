# Architecture

Status: ACTIVE in Module 3.

## Gate

**Feature under decision:** the pool — a list where every track carries the name of the person it came from, and the list survives a reload. Acceptance criterion A5 in [FEATURES.md](FEATURES.md).

### Hard constraints

An option failing either is rejected before scoring. All three options passed.

1. **No new spending.** Originally "zero budget." Reworded because Spotify's Web API now requires the app owner to hold an active Premium subscription. I already pay for Premium personally, so the marginal cost is zero — but that subscription becomes a dependency of the app, which is recorded as a consequence in ADR-001 rather than hidden here.
2. **Runs from a fresh Codespace with Live Server.** Every grader and reviewer sees the same environment.

Serving both Spotify and Apple Music users was considered as a hard constraint and deliberately demoted. As a constraint it would have rejected both Spotify-based options before scoring and left the comparison with nothing to compare. It is scored instead, through switching cost and fit to spec.

### Options

- **Hand-built option (Build):** hand-written HTML, CSS and JavaScript with `localStorage`. Tracks and source names are entered by hand. No platform dependency.
- **Existing-service option (Buy — Spotify Web API):** tracks are selected from Spotify's catalog, and the pool stores real Spotify track IDs with a source name attached. Apple MusicKit was tested as the alternative platform; see the switching cost note.
- **AI-assisted build (Delegate):** Copilot or a coding agent builds the Spotify integration, and I inspect the result.

### Anchors
| Criterion | Weight | 1 | 3 | 5 |
|---|---:|---|---|---|
| Cost to start | 3 | New spending required | No new spending, but accounts or setup | Nothing to sign up for |
| Cost to maintain | 2 | A third party can break it unilaterally | Occasional dependency updates | Nothing external to break |
| Time to working | 3 | Weeks, or gated on outside approval | Days | Hours |
| Inspectability | 4 | I can't read it | I can read it with real effort | I wrote it and can explain every line |
| Switching cost | 4 | Leaving means redesign | Portable with rework | Plain data, no lock-in |
| Fit to spec | 5 | Doesn't meet A5 | Meets A5 with gaps | Meets A5 and respects the spec's non-goals |
| Criterion | Weight | Hand-built option | Existing-service option | AI-assisted build |


### Weighted comparison

| Criterion | Weight | Hand-built option | Existing-service option | AI-assisted build |
|---|---:|---:|---:|---:|
| Cost to start | 3 | 5 (15) | 3 (9) | 3 (9) |
| Cost to maintain | 2 | 5 (10) | 1 (2) | 1 (2) |
| Time to working | 3 | 5 (15) | 2 (6) | 3 (9) |
| Inspectability | 4 | 4 (16) | 1 (4) | 1 (4) |
| Switching cost | 4 | 5 (20) | 1 (4) | 1 (4) |
| Fit to spec | 5 | 3 (15) | 4 (20) | 3 (15) |
| **Total** (max 105) | | **91** | **45** | **43** |

## ADR-001

Title and date: ADR-001 — Build the pool as a hand-written browser page instead of on a streaming platform's API. September 22, 2026.

Status: Accepted.

Door / concrete acquisition and execution choice: Build. Hand-written index.html, styles.css and app.js, saving to localStorage, run from a Codespace with Live Server.

Context: The pool must show a source name on every item (A5), and the spec says it holds playable tracks only. HW2 assumed Spotify, but one of my two interviewees uses Apple Music, and the two platforms store incompatible track IDs. Spotify's 2026 terms require Premium, cap apps at five users, and have removed endpoints twice this year. The budget is zero; I reworded it to "no new spending" because I already pay for Premium. I cannot yet comfortably read client or server code, and the deadline is one week. The gate scored Build 91, Spotify 45, and Delegate 43.

Decision: I will build the pool by hand as three static files saving to localStorage, with a source name required before any item is saved. This slice reads no listening data, so it needs no platform API; automatic capture (F1, F3) will need one later, and Spotify is the likely candidate, though it offers no public access to shared listening sessions.

Consequences and revisit trigger: This gives me a working page I can read and verify this week, works for users on any platform, and stores plain JSON that is easy to move later. It fails to guarantee playable tracks, since typed text accepts typos, which breaks a spec non-goal. It does not implement F1, automatic capture, the Must-be feature. Manual entry asks Profile A to do admin work they won't do, and data stays in one browser with no sync. Revisit when a streaming platform opens shared-listening data to small developers, or when Module 4 introduces a database. Here the gate and the required hand build agree; had the gate chosen Delegate, the hand build would still be required so I can inspect delegated code later.

Keep superseded ADRs. The pedagogical browser build can coexist with a different architecture recommendation; explain the distinction.
