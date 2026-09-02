# Compatibility matrix

Audit date: 2026-09-03 (Asia/Tehran)

This document separates source-level and automated evidence from live-server
evidence. The machine-readable record is [`compatibility.json`](../compatibility.json).

## Current upstream evidence

| Target | Snapshot | Evidence | Result |
|---|---|---|---|
| Mattermost core | `master@f6f2719165ffb132e351342add570f3b1b6fd07a` | `registerRootComponent` remains present; message, preview, channel, search, quick-switch, legacy editor, and Tiptap editor anchors used by the plugin remain present. | PASS, source audit |
| Mattermost release | `v11.10.1` (latest tag observed) | Release lineage is covered by the current-master source audit and representative DOM fixtures. | PASS, source/fixture only |
| Mattermost Desktop | `master@9e6b8b65a9bb80f190c78a4aa8803f0067f95fd9`, latest tag `v6.3.0` | Desktop consumes the Mattermost web application where webapp plugins run. | PASS, architecture audit only |
| Official plugin starter | `master@3296cf6fad808c2372c254cf7b64bcc8a2144e67` | Manifest layout, `initialize` lifecycle, and `registerRootComponent` contract. | PASS, source audit |
| Mattermost Mobile | `main@bc84b6ee3aa78e9ddc7da73710e07c7d2088bfa5`, latest tag `v2.43.1` | Native mobile clients do not load Mattermost webapp plugins. | OUT OF SCOPE |

The source audit inspected the exact current Mattermost files that define the
plugin registry and the selectors documented in [`SCOPE.md`](SCOPE.md). The six
commits between the prior localization snapshot and the current core head did
not remove or rename those anchors.

## Automated release evidence

| Gate | Result |
|---|---|
| TypeScript type-check | PASS |
| Unit and DOM lifecycle tests | PASS, 19 tests |
| Documentation link audit | PASS |
| Webapp bundle build | PASS |
| Mattermost archive shape | PASS |
| Packaged plugin registration, mount, direction change, cleanup, and uninitialize smoke | PASS |
| Two independent package builds produce the same SHA-256 | PASS |
| High-severity npm dependency audit | PASS at release preparation time |

## Live-server matrix

No row is recorded yet. A row may be added only after installation on an
authenticated staging server and must include:

- exact Mattermost build/version and deployment edition;
- browser and Mattermost Desktop version;
- plain-text and rich-text editor results;
- posts beginning with an ASCII mention, code, lists, edits, previews, search,
  channel labels, disable, re-enable, and uninstall results;
- screenshot/evidence location and tester/date.

The manifest currently declares `min_server_version: 9.5.0`. That is a
compatibility floor, not proof that every release from 9.5.0 onward has been
live-tested. Until the matrix has representative LTS and current-release rows,
the project must remain Beta and must not claim full Marketplace compatibility.

## Browser build targets

The generated bundle targets Chrome 109+, Firefox 115+, and Safari 16.4+.
These are compilation targets; a browser/version becomes live-verified only
when it appears in the live matrix above.
