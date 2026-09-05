# Changelog

All notable changes to this project are documented in this file.

## 0.1.1 - 2026-09-06

- Align the declared and CI Node.js runtime with the locked test toolchain.
- Keep plugin behavior and compatibility scope unchanged from v0.1.0.

## 0.1.0 - 2026-09-03

- Add first-strong-character direction detection for Persian and other RTL text.
- Ignore leading Mattermost mentions when selecting a message's base direction.
- Support message bodies, previews, channel labels, legacy textareas, and rich-text editors.
- Isolate mentions and code inside mixed-direction content.
- Restore plugin-owned DOM state on disable and release removed message nodes.
- Add unit, package-shape, documentation, and packaged lifecycle smoke tests.
- Refresh selector and plugin-API evidence against Mattermost
  `f6f2719165ffb132e351342add570f3b1b6fd07a`, Desktop
  `9e6b8b65a9bb80f190c78a4aa8803f0067f95fd9`, Mobile
  `bc84b6ee3aa78e9ddc7da73710e07c7d2088bfa5`, and Marketplace
  `67d3240e3c5c933c07a8d9d907395b14674b3124` on 2026-09-03.
- Add a machine-readable compatibility record, explicit Beta/live-test limits,
  private security reporting policy, and compatibility issue template.
- Add deterministic archive verification, release checksums, a source-bound
  release manifest, and tag-only CI release automation.
