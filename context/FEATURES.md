# FEATURES.md

**Name: Semaj Johnosn**
**Date:09/10/2026**
**Assignment:** HW2, MGT 3745 O

---

## Kano-Classified Feature List
`15 pts`

**Classification date: 09/10/2026**
| # | Feature | Kano class | Reason from research |
|---|---------|-----------|----------------------|
| 1 | Auto-capture of tracks played in a shared listening session | Must-be | Both interviewees' most recent additions came from friends; the Jam save was the single highest-value moment observed. Without capture there is no pool. |
| 2 | Every captured track carries the name of the person it came from | Must-be | Trust in a recommendation tracked entirely to the human attached to it. An unattributed track is indistinguishable from an algorithmic one. |
| 3 | Pull from a designated person's active listening, not just live sessions | Attractive | Nobody asked for this. It closes the gap neither named: friend recommendations have the best hit rate but can't be summoned on demand. |
| 4 | Filter and arrange the pool by mood or occasion | Performance | One interviewee builds mood playlists by hand from known artists. More control over the arrangement yields proportionally more satisfaction. |
| 5 | Explanation of why a track surfaced | Indifferent | My HW1 adequacy sketch assumed this mattered. Neither interviewee ever asked why a friend's track appeared. When a person is attached, the "why" question does not arise. |
| 6 | Algorithmic suggestions blended into the pool | Reverse | One interviewee auditions unwanted recommendations for ~30 seconds, then permanently suppresses them. Machine picks inside a human-sourced pool would actively degrade it. |


---

## 1. Context
`part of Specification Quality, 30 pts total`


*People acquire the music they trust most from other people, but that material has nowhere to live. A track played in a friend's shared session disappears when the session ends unless it is saved in the moment. The system gives algorithmic recommendations a permanent home and gives human ones none. This is a collection point for music that arrived through a person, with the personal element still attached to it.*

---

## 2. Users

*Both profiles in USERS.md. Profile A (the Incidental Listener) is served on the capture side: high-trust material is retained without requiring presence of mind in the moment. Profile B (the Deliberate Digger) is served on the organization side, since their stated friction is retrieval rather than suggestion quality.*

---

## 3. Scope

**This does:**
- Capture tracks played in shared listening sessions the user participates in
- Capture tracks from a small set of people the user explicitly designates
- Store each captured track with the name of the person it came from
- Let the user arrange the captured pool and promote items into playlists

**This deliberately does not do:**
- Generate recommendations of its own, or rank the pool by predicted preference
- Capture artist names, genres, scenes, or links — playable tracks only
- Attribute to anything other than a named person

---

## 4. Behavior

*A user designates between one and ten people as sources. Designation requires the designated person to accept; either side can end it at any time, which stops all future capture from that pairing.

When the user joins a shared listening session with a designated person, every track played for at least 30 continuous seconds is captured to the pool. Tracks the user already has in their library are not captured. Capture happens silently; the user is not interrupted mid-session.

Each pool item stores the track, the name of the person it came from, and the date. When the same track arrives from more than one person, it appears once and lists every source name.

The user reviews the pool on demand. Each item can be promoted to a playlist, dismissed, or left. Dismissed items do not return from the same source.*

---

## 5. Constraints

*Requires a streaming platform API exposing both shared-session events and per-user playback history. Spotify is the assumed platform.
Designation is mutual and revocable. No capture from anyone who has not accepted.
Stores only captured tracks and their source names — never a designated person's full listening history.*

---

## 6. Acceptance
>WHEN a track plays for 30 continuous seconds in a shared session with a designated person, THE SYSTEM SHALL add it to the pool with that person's name within 5 seconds of the session ending.
>IF a captured track already exists in the user's library, THEN THE SYSTEM SHALL discard the capture and record nothing.
>WHILE a designation is active, THE SYSTEM SHALL capture any track that person plays 3 or more times in a rolling 7-day window.
>THE SYSTEM SHALL display a source name on every pool item and SHALL NOT display any item without one.
>IF the same track is captured from multiple people, THEN THE SYSTEM SHALL show one entry listing all source names.
>WHEN a user dismisses a pool item, THE SYSTEM SHALL not re-capture that track from the same source.


## Handoff Test
`10 pts`

*A stranger would have to ask three things. First, whether "shared listening session" means only a live Spotify Jam or also a collaborative playlist edited by two people — the capture rule is still not completely clear*

---

## AI Use Note

> Used Claude to pressure-test my interview synthesis, draft and revise job statements and user profiles, and structure this specification. The interviews, the framing, and the decisions about scope and thresholds are mine.

Keep your dated Kano hypotheses and selected feature. Use IDs to connect evidence, jobs, and criteria. Clearly distinguish the one-feature HW3 implementation from the larger product scope.

## Verification

| Criterion | Steps and input | Expected result | Observed result | Status | Evidence / commit |
|---|---|---|---|---|---|
| A5 (normal action) | Enter a track and a source name, then submit. | The item appears with "from [name]" and the date added. | The item appeared with its source name and date. | PASS | Commit 8eafa45 |
| A5 (invalid input) | Enter a track, leave "Who it came from" empty, then submit. | An error appears and nothing is added. | An error appeared and nothing was added. | PASS | Commit 8eafa45 |
| A5 (persistence) | Add two items, then reload the page. | Both items reappear with their source names. | Both items came back after reload. | PASS | Commit 8eafa45 |
| A5 (save failure) | Add `?failSave` to the URL, then submit a valid entry. | A save error appears, the typed text stays, and the list does not change. | The save error appeared and the typed text stayed in the inputs. | PASS | Commit 8eafa45 |
| A6 | Add a track from one person, then the same track from a second person. | One entry listing both names. | The items merged into one entry listing both names. | PASS | Commit 8eafa45 |
| A1, A2, A3, A4 | Not triggerable in this build. | — | No streaming-platform capture exists. | DEFERRED | ADR-001 |
| A7 | Not triggerable in this build. | — | Dismissal only matters against re-capture, and nothing captures. The Remove button deletes a local row; it does not implement A7. | CANNOT TEST YET | ADR-001 |

| Statement | HW3 verdict | HW4 verdict | Reason |
|---|---|---|---|
| Survive cleared cache | CANNOT TEST YET | | now testable |
| Server unreachable | | | how would you simulate an outage? |
| Server returns 500 | | | |
| Server returns 400 | | | |
| Second client writes to the same table | | | DEFERRED if ADR-002 says so |
