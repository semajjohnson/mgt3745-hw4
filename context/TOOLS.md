# TOOLS.md

The ledger of Trust Boundary crossings. One row per external service this
repository depends on. Read by the agent on every task, so keep it short: a
service not in use does not belong here.

Never put a credential in this file. A key, token, or password anywhere in
the repository is graded as a security failure regardless of the rest.

Each crossing statement answers three questions in one first-person sentence:
what crosses, to whom, and who is accountable.

| Service | Trusted with | Credentials live | Crossing statement | Switching cost |
|---|---|---|---|---|
| Cloudflare Workers — runs the server that answers GET and POST for the pool | Every request my page makes, plus request metadata I did not choose to send: IP address, user agent, timing, and the paths called | Cloudflare OAuth token created by `wrangler login`, stored in the Codespace at `~/.config/.wrangler`, never in the repository. The D1 database id sits in `wrangler.toml` and is an identifier, not a secret | Every track and person's name a user types crosses from their browser to Cloudflare, a vendor I have a free personal account with and no contract or data-processing agreement; I am accountable for what gets sent, and Cloudflare is accountable only for running the code I deployed | Medium — rewrite `worker.js` for another runtime and repoint the `apiBase` in `app.js` |
| Cloudflare D1 — the SQL database holding pool entries | The full contents of the pool: track names, the names of the people they came from, dismissal flags, and timestamps | Reached through the `DB` binding in `wrangler.toml`; there is no connection string or password anywhere | The names of real people my users were recommended music by are stored in a table on Cloudflare's machines that I can read at any time; the people named never consented, and I am the only one accountable for that | Medium — export rows with `wrangler d1 execute` and import them elsewhere |
| GitHub and Codespaces — hosts the repository and the development environment | All source code and documents, my commit history, and everything typed in the Codespace terminal, which includes the `wrangler login` flow | GitHub account credentials held by GitHub; the Cloudflare token lives inside the running Codespace container, which GitHub operates | My coursework and the tokens I create while working cross to GitHub, a vendor Georgia Tech has a relationship with but I do not; I am accountable for what I commit, and a credential pasted into a file would be my failure, not theirs | Low — clone to any machine and run the same commands |
| GitHub Copilot — code suggestions inside the Codespace | The contents of open files and surrounding code sent as context for each suggestion, including `worker.js` and my context files | Authenticated through my GitHub account; no separate credential | The code and instruction files I have open cross to Copilot as prompt context whenever I type, and I am accountable for anything it suggests that I accept, including the concatenated SQL it offers roughly half the time | Low — disable the extension |
| wrangler (npm) — creates the D1 database and deploys the Worker | The contents of this project at deploy time, plus the Cloudflare token it reads from disk, and anonymous telemetry about my usage that it collects by default | Reads the same Cloudflare token as above; stores no credential of its own | My whole Worker and schema cross to Cloudflare through an npm package maintained by Cloudflare and its dependency tree, and I am accountable for a supply chain I have not read | Medium — deploy through the Cloudflare dashboard instead |

## Revisit triggers

- A second person uses the pool. Every row assumes one user; two writers on one D1 table is ADR-003 territory.
- The free tier stops covering it — D1 row limits or Worker request limits — since every row above assumes a free personal account with no contract behind it.
- Someone named in the pool asks to be removed. The D1 row records a person who never agreed to be recorded, and I have no process for that.
- Cloudflare changes terms, or wrangler's telemetry or dependencies change what gets sent.
- Any credential moves out of the Codespace, for example into a GitHub Action or onto a laptop.
