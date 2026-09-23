# PROJECT.md

## Problem statement

I care about music as both a producer and a curator, and as recommendation algorithms have become more powerful and more central to how music reaches people, I feel less in control of my own listening. The problem is easy to state and hard to evaluate: what counts as a good solution depends on taste, on art, and on what being "in control" even means, so answers here are good or bad rather than true or false. The algorithm causing the problem is also a real solution for people who lack time to work through discographies and genre catalogs, which means any fix has to coexist with the thing it corrects. It may also be a symptom of something larger — feeling out of control of your taste may have less to do with a music app than with the whole media ecosystem shaping it. Of three framings I considered, I committed to the goal shift: **music lovers want to feel more confident and connected in their music listening choices.** It targets the emotional root instead of jumping to a change in app behavior, which keeps the solution space open. What it makes invisible is the app's own design and the business incentives of streaming companies.

Two interviews revised my original adequacy bar. I had assumed transparency was the answer — that apps should explain *why* something was suggested. Neither interviewee ever asked why, and neither could be prompted into caring. What they trusted was *who* it came from. The bar moved from **why** to **who**, which is why explanation is classified Indifferent in FEATURES.md and why every item in this system carries the name of a person.

## Who it is for

Primary: the Casual Listener, who listens while doing something else, picks up music socially when it happens to cross their path, and prunes unwanted algorithmic suggestions aggressively. Secondary: the Deliberate Digger, a musician or serious enthusiast for whom listening is study, who discovers through friends and community forums and whose friction is organization and retrieval rather than suggestion quality. Both trust people over systems. Full profiles, with every claim marked known or assumed, are in [USERS.md](USERS.md).

## Scope

**In:** a pool of tracks where every item carries the name of the person it came from and cannot exist without one; merging a track recommended by more than one person into a single entry; dismissing an item so that pair never returns; persistence on a server so the pool survives a cleared cache and appears in any browser.

**Out:** generating recommendations of its own or ranking the pool by predicted preference; capturing artist names, genres, scenes, or links rather than tracks; capturing from forums, threads, or articles; attributing an item to anything other than a named person.

**Deferred:** automatic capture from shared listening sessions and from designated people's playback — features F1 and F3, one of them classified Must-be — because no platform exposes shared-session data to a small developer. See ADR-001 in [ARCHITECTURE.md](ARCHITECTURE.md). Multi-user behavior is deferred by ADR-002; the pool is single-user by design.

## Constraints

**Time and people:** one person, one semester, with a weekly deadline. This is my first programming course, so I cannot yet comfortably audit code I did not write, which weighs against delegating anything I would have to approve unread.

**Platform:** HW2 assumed Spotify. Testing that against Apple MusicKit showed the two store incompatible track identifiers and neither exposes shared-session events, and one of my two interviewees is on Apple Music — so the build depends on no streaming platform at all.

**Data and policy:** entries now live in a Cloudflare D1 database behind a Worker I deployed on a free personal account with no contract or data-processing agreement behind it. Every crossing, including the one that stores the names of real people who never consented to being recorded, is in [TOOLS.md](TOOLS.md). No credential appears anywhere in this repository.
