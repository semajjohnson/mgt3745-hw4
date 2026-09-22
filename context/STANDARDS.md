# Standards

Status: ACTIVE in Module 3. Adapt these rules to your feature and follow them.

1. Name JavaScript identifiers in descriptive camelCase that says what they hold or do, such as poolItems, savePool, and renderPool. Short conventional names like event, index, and item are fine when their role is obvious.
2. Keep structure in index.html, presentation in styles.css, and behavior in app.js. Keep application code inside the IIFE in app.js so nothing becomes an accidental global.
3. Comments explain why code exists, not what it does. Remove console.log and other debug output before submitting.
4. Commit messages name the behavior that changed and why, such as "Require a source name before saving a pool item," not "update app.js."
5. Forbidden: inserting user text with innerHTML. Track and source names are always rendered with textContent.
6. Every form control has a label, and success and error messages appear in announced elements. When savePool fails, the user's typed track and source stay in the inputs.
7. Every pool item shows the name of the person it came from. An item without a source name is never saved or displayed.
8. User values reach SQL through `bind()`, never string concatenation.
9. No credential in the repository. Database ids are addresses and may appear in `wrangler.toml`.
10. A failed request is shown to the user on the page and is never thrown in the console.


If this file and context/CLAUDE.md disagree, STANDARDS.md is the source of truth, and CLAUDE.md is repaired to match.

## Split Test

Rule 2 (separate files, no libraries or API calls). This applies to every task, since any change could add a script or an API call. It stays the same until ADR-001 is superseded. If it were missing, an agent could pull in the Spotify SDK and that pattern would be copied forward into later tasks, which is poisoning. Verdict: belongs in CLAUDE.md.

Rule 6 (labels, messages, and keeping input when savePool fails). This applies only to tasks that touch the form or saving, not to styling or documentation. It will change when Module 4 replaces localStorage with a database. Keeping it in CLAUDE.md risks confusion, where an agent adds save-error handling to an unrelated task. Verdict: belongs in the prompt for the task that needs it.

Prompt snippet: "This task touches the form or savePool. Keep every field labeled and put messages in #form-error and #save-status. Reject an empty track or source before calling savePool. A failed save means the storage write itself failed; when that happens, leave the typed track and source in their inputs and do not change the list. Test it with ?failSave in the URL."

Rule 7 (every pool item shows a source name). This applies only to tasks that save, load, or render pool items. It will change whenever acceptance criterion A5 in FEATURES.md changes. Keeping a copy in CLAUDE.md risks clash, because the file and FEATURES.md would give two versions of the same requirement once A5 is revised. Verdict: belongs in the prompt for the task that needs it.

Prompt snippet: "This task touches pool items. Never save, load, or display an item whose source name is empty. Check it at submit and again in loadPool.

## Colleague Test

Reader: Prince.

What they understood: the page stores a list of tracks with source names, renders them with textContent, keeps code in app.js inside the IIFE, and uses no external libraries.

What they asked about: what counts as a "failed save." Rule 3's example mentioned it, but the failure rules had moved out of CLAUDE.md in the split test, so nothing said whether it meant empty fields or storage errors.

Revision: I changed rule 3's comment example so it no longer refers to save behavior, and added a definition of a failed save to the rule 6 prompt snippet. Invalid input is rejected before savePool runs; a failed save means the storage write itself failed.
