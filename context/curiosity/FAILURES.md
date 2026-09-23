# FAILURES.md

The most honest file in any repository and the rarest. What went wrong,
what the agent got wrong, what you almost shipped. Copilot offering
string-concatenated SQL is a fine first entry. Optional.

## 2026-09-22 — A forwarded port with nothing behind it

**What broke:** the Codespace page returned `HTTP ERROR 401` no matter what I did. I assumed it was a permissions problem and switched port 5500 from Private to Public, which changed nothing.

**What I tried:** reopening from the Ports tab, checking I was signed into the right GitHub account, then making the port public.

**What I learned:** the Ports tab showed nothing under "Running Process." The port was a forwarding rule pointing at a server that was never started — Live Server had not installed. 

## 2026-09-23 — Deploy refused until I verified an email

**What broke:** `npx wrangler deploy` uploaded the Worker, registered the subdomain, then failed with `You need to verify your email address to use Workers [code: 10034]`.

**What I tried:** nothing, at first — I read the error.

**What I learned:** this one was worth recording precisely because it was not a code problem. The account I had created minutes earlier was not yet a usable account, and no amount of reading `worker.js` would have found that. It is also the first time a vendor's terms blocked my work directly, which is the kind of dependency TOOLS.md exists to make visible: my deploy pipeline runs on a free personal Cloudflare account I have no contract with.

## 2026-09-23 — A test that silently did not run

**What broke:** I loaded the page with `?apidown` to test the failed-response path, and the page loaded normally. I reported it as working.

**What I tried:** I read the terminal output, which showed `GET /?apidown` and a 404 for `favicon.ico`, and mistook the server log for the browser console.

**What I learned:** two mistakes stacked. The flag in `app.js` is `apiDown`, and `URLSearchParams.has()` is case-sensitive, so `?apidown` matched nothing and the page never entered the failure path. And the terminal running the static server is not the browser console; it reports which files were requested, not what my JavaScript did. A test that passes without running is worse than a test that fails, because it produces a verification row that looks like evidence. This is why the verification table records observed results rather than expected ones.