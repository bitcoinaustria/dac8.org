# AGENTS.md — AI Agent Contributor Guide

This file contains the working agreements for agents changing the repository.
Read [README.md](README.md) for orientation and [VISION.md](VISION.md) before
making product or campaign judgments.

## Quality Gates

Before opening or updating a pull request, run:

```sh
pnpm format:check
pnpm build
```

Every push to `main` runs the same gates and deploys the site through
`.github/workflows/deploy.yml`. Do not run a manual Wrangler deployment without
an explicit request; production changes should normally flow through `main`.

Legal and regulatory claims must be supported by primary sources and match the
actual procedural status. The campaign's credibility depends on never implying
that it controls court referrals, timelines, or outcomes.

Keep README, vision, and agent instructions in English. The public website is
multilingual: keep each page internally consistent and do not treat German as a
permanent product boundary.

## Working Agreements

- Use one branch per task and keep each pull request to one coherent concern so
  parallel work remains reviewable and mergeable.
- Make small, self-contained commits that pass the relevant quality gates; the
  commit message should explain why the change exists.
- Check the current diff and active parallel work before editing shared files.
  Preserve unrelated changes rather than rewriting another contributor's work.

## Common Gotchas

No repository-specific traps have been recorded yet. Add one only after a real
incident, and remove it when the underlying sharp edge is fixed.
