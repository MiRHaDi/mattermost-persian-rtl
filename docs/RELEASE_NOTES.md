# Release notes: v0.1.0 Beta

Mattermost Persian & RTL Support v0.1.0 is a webapp-only Beta plugin for safer
Persian and bidirectional text rendering. It detects the first meaningful
strong character, ignores leading Mattermost mentions when choosing a base
direction, supports legacy and Tiptap composers, isolates mentions and code,
and restores all plugin-owned DOM state when disabled.

## Release evidence

- 19 unit, DOM, and lifecycle tests pass.
- The packaged plugin registration, mount, direction change, cleanup, and
  uninitialize smoke test passes.
- The installable archive is deterministic across two independent package
  invocations and is accompanied by `SHA256SUMS` and
  `release-manifest.json`.
- Source/API compatibility was audited on 2026-09-03 against the exact commits
  in [`COMPATIBILITY.md`](COMPATIBILITY.md).
- The plugin has no server binary, performs no network requests, and stores no
  message content.

## Beta limits

This release does not mirror the complete Mattermost shell, replace official
Persian catalogs, or support native mobile clients. No authenticated live
Mattermost staging installation has yet been recorded. The declared minimum
server version, 9.5.0, is therefore a compatibility floor rather than proof of
live coverage for every later release.

Install the `.tar.gz` from a GitHub Release only after verifying its SHA-256.
Server administrators should first validate it on a staging server matching
their production Mattermost and browser/Desktop versions.
