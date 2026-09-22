# CLAUDE.md

Always-on instructions for any agent working in this repository. Read
STANDARDS.md for the human version; this file restates it as rules an
agent follows without being asked.

## Read first

PROJECT.md, FEATURES.md, ARCHITECTURE.md, STANDARDS.md, TOOLS.md, STYLE.md.
Do not read /curiosity unless asked.

# Canonical agent instructions

1. Name things after the pool's domain: poolItems for the stored list, savePool, loadPool and renderPool for the three core functions, trackInput and sourceInput for the fields. Add new names in the same camelCase pattern.
2. Keep all behavior in app.js inside its IIFE, all styling in styles.css, and only markup in index.html. Do not add libraries, CDN scripts, or calls to Spotify or any other API; ADR-001 chose a hand-built page with no platform.
3. When a comment is needed, write why the pool behaves that way, such as why items are stored with the date they were added. Do not narrate the line. Delete every console.log before saying you are done.
4. Write commit messages about pool behavior, such as "Reject pool items with an empty source name." Never write "update files" or "fix bug."
5. Render every track and source name with textContent. Do not use innerHTML anywhere in app.js; nothing in this project needs it.
6. Never build SQL by concatenating strings. Use `prepare(...).bind(...)`.
7. Never write a credential, token, or key into any file in this repository.
8. Never add a dependency without adding a row to TOOLS.md.
9. Handle failed responses on the page. Never throw to the console.

Before calling any change finished, run it in Live Server and report what you actually saw. Do not invent test results or interview evidence. Leave STYLE, TOOLS, SKILLS, EVALS and AGENTS as previews.

Root CLAUDE.md imports this file for Claude Code. VS Code Copilot uses the separate .github/copilot-instructions.md adapter. A location under /context alone is not a guarantee of automatic discovery.
