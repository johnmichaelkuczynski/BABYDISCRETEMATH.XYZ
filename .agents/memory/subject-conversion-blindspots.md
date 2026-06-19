---
name: Subject conversion blind spots
description: Non-obvious places that still carry the old course subject after a rebrand
---

When converting the course to a new subject (e.g. Evolutionary → Criminal Psychology), the obvious copy is in `artifacts/*/src/.../video_scenes/SceneN.tsx`. The easily-missed spots that strand old branding:

- `artifacts/<video-artifact>/index.html` — `<title>` plus `og:title`/`og:description` and `twitter:title`/`twitter:description` meta still name the old subject.
- `artifacts/<video-artifact>/YOUTUBE_DESCRIPTION.md` — a full per-artifact description (title options, topic list, hashtags, chapters) themed to the old subject.

**Why:** these files don't render in the app preview and don't show up in a `SceneN.tsx` text grep, so a scene-only conversion passes visual checks while metadata/docs keep the old subject.

**How to apply:** after editing scenes, run a repo-wide sweep for old-subject terms across the whole artifact dir (not just scenes), and check `index.html` + any `*DESCRIPTION*.md`. Keep one canonical YouTube description (repo-root `youtube-description.md`) and treat artifact-local copies as synced mirrors.

Two more easily-missed spots:

- **ALL sibling video/demo artifacts, not just the headline promo.** A subject rebrand must cover every `video`-kind artifact (e.g. `course-promo`, `qr-course-demo`, `diagnostics-demo`) plus their `.replit-artifact/artifact.toml` `title` (canvas/preview labels read from there). Update toml titles via `verifyAndReplaceArtifactToml` (temp `artifact.edit.toml` → validate), never edit the toml in place.
- **Demo videos are intentionally partial screencasts.** The `qr-course-demo` only ever shows a subset of topics (e.g. lectures 1.1–1.5 with a "6 Lectures" label) — that is original format, not a conversion bug. Per the user's "convert in place, keep format/length intact" preference, do NOT expand demo scenes to list every course topic; only re-theme the existing copy. A code review may flag this as "missing topics 1.6–1.8" — that's over-applying the main-app's topic count to a demo and should be declined.

- **`artifact.toml` titles hide from ripgrep because `.replit-artifact/` is a hidden dir.** `rg` skips dot-directories by default, so a repo-wide old-subject grep can return "CLEAN" while all four `artifacts/*/.replit-artifact/artifact.toml` `title` fields still carry the old subject. Always run the branding sweep with `rg --hidden` (and `--glob '!.git/**'`), or explicitly check each `artifact.toml`.

- **Backend LLM-failure FALLBACK prompts evade subject grep.** Generator routes (e.g. `practice.ts`) have a `catch {}` branch with a hardcoded fallback prompt/answer. These use generic scenario wording (a friend, a real case) rather than subject nouns, so a grep for old-subject terms misses them — yet they're user-facing when the AI provider fails. After a subject conversion, audit every generator's catch/fallback branch for an on-subject concrete scenario, not just the main prompt.

- **OpenAPI spec example/description strings carry old-subject copy.** `lib/api-spec/openapi.yaml` field `description`/example text (e.g. a `NextProblemInput.request` example "give me harder beta reduction problems") names the old subject but isn't a SceneN/route prompt, so subject-only greps over `artifacts/` miss it. Sweep `lib/api-spec/openapi.yaml` too, and re-run `pnpm --filter @workspace/api-spec run codegen` after editing it.

- **`.agents/agent_assets_metadata.toml` + exported `*.mp4` filenames keep old branding.** The asset-metadata toml has `title` fields ("README — <old subject>", "YouTube Description — <old subject>") and repo-root exported video files are named after the old subject (e.g. `OLD-SUBJECT-Jun-18-....mp4`). Both live in dot-dirs / are untracked, so a default `rg` misses them. Run the final branding sweep as `rg -i "<oldterm>" --hidden --glob '!**/node_modules/**' --glob '!**/.git/**'` and rename stale exported media with `mv`.
