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

Pull requests run the same gates in `.github/workflows/ci.yml`.

Cloudflare Workers Builds owns deployment: it builds every push, publishes a
preview URL per branch and commit, and deploys `main` to production. GitHub
Actions never deploys. Do not run a manual Wrangler deployment without an
explicit request; production changes should normally flow through `main`.

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

## Editorial Rules

These come from reviewer feedback on the live site (October 2026). Apply them
to new copy, graphics and tools, not only to the pages they were found on.

- Keep what goes to the tax office apart from what stays with the provider,
  and never word it so that readers think wallet addresses are reported. For
  own-wallet transfers, say that the report carries a sum without addresses.
  Do not write that DAC8 "links" ID, wallet addresses or transactions with
  tax data; the provider adds tax number and tax residence next to the
  records it already keeps under anti-money-laundering rules.
- Never write a bare "Adresse" or "address": readers cannot tell a home from
  a wallet. Use Anschrift or Wohnadresse (postal or home address) for where
  someone lives, and Wallet-Adresse (wallet address) for the blockchain.
- Do not end points or sections with "read more" cross-references. A section
  gets at most one link to the obvious next step; the navigation and footer
  carry the rest, including the sources.
- Use each picture once across the pages and the share kit, and never put two
  near-identical motifs side by side. A picture must fit the headline beside
  it at a glance; drop it rather than keep a decorative or ambiguous one.
- Keep the share kit to a few scenes that work on their own.
- Do not build calls to action that put load on crypto-asset providers, such
  as mass access requests. The campaign targets the law, and providers are
  potential supporters.
- Many readers are German customers of Austrian providers. Where a tool asks
  about residence or a text names authorities, cover Germany explicitly.

## Common Gotchas

No repository-specific traps have been recorded yet. Add one only after a real
incident, and remove it when the underlying sharp edge is fixed.
