# Mattermost Persian & RTL Support

[راهنمای فارسی](README.fa.md)

An independent, webapp-only Mattermost plugin that improves Persian and other
right-to-left text without pretending to mirror the whole Mattermost UI.

## What it fixes

- Chooses an explicit direction for message bodies and their main Markdown
  blocks, previews, channel descriptions, and channel labels.
- Handles the open BiDi edge case where an ASCII `@mention` at the start of a
  Persian message otherwise makes the whole message LTR.
- Supports both Mattermost's legacy textarea composer and the current
  ProseMirror/Tiptap rich-text editor.
- Isolates mentions and code inside mixed-direction content.
- Uses `MutationObserver` plus input/focus events, not a polling timer.
- Restores every plugin-owned class and `dir` attribute when disabled.

The detector does not modify message text or payloads. It only changes the
rendered DOM in the current browser.

## Honest scope

This is not a complete RTL shell for Mattermost. The official webapp plugin SDK
offers extension points and a root component, but it does not expose a stable
API to reverse every core layout, sidebar, modal, popover, or third-party
product. A plugin that globally rewrites those internals would be brittle across
Mattermost releases.

This release intentionally does **not**:

- set `dir="rtl"` on `<html>` or mirror navigation/layout chrome;
- replace Mattermost core UI translations;
- modify the server, database, messages, or API responses;
- cover the native mobile apps or every third-party plugin/product;
- claim a live-server compatibility test that was not run.

See [Scope and compatibility](docs/SCOPE.md) for the selector and API boundary,
and the [upstream audit](docs/AUDIT.md) for the evidence behind that decision.

## Persian translations

Mattermost already registers Persian (`fa`) in its core products, but translation
coverage and review status are dynamic and may be incomplete. Mattermost's
official workflow sends product-string changes through
[Mattermost Weblate](https://translate.mattermost.com/) rather than third-party
plugins or direct translation JSON pull requests. This plugin deliberately ships
no replacement core catalog. Translation contributors should follow the
[official webapp localization workflow](https://developers.mattermost.com/contribute/more-info/webapp/developer-workflow/).

## Build and test

Requirements: Node.js 20 or later and npm.

```sh
npm ci
npm run check
```

`npm run check` type-checks the source, runs the DOM fixture tests, builds the
webapp bundle, creates the Mattermost archive, and verifies its required files.
The installable artifact is written to:

```text
dist/ir.mirhadi.mattermost-persian-rtl-0.1.0.tar.gz
```

## Install

1. Build the archive with `npm run check`, or download a release artifact.
2. In Mattermost System Console, open **Plugins → Plugin Management**.
3. Upload the `.tar.gz` file and enable **Persian and RTL Support**.
4. Select Persian under **Settings → Display → Language** if Persian core UI
   strings are desired as well.

Plugin upload must be enabled by the server administrator. A production admin
should first validate the plugin on a staging server running the same Mattermost
version and test both plain-text and rich-text composers.

## Compatibility evidence

The selector and lifecycle audit was performed on 2026-09-01 against:

- `mattermost/mattermost` master at
  `679dcd7e1653320dbffa0a9a664f196f406362e3`;
- `mattermost/mattermost-plugin-starter-template` master at
  `3296cf6fad808c2372c254cf7b64bcc8a2144e67`;
- `QueraTeam/mattermost-rtl` main at
  `e64afd75f43a6fa660e046b7859863047b0700f3` (audit only; no code copied).

Automated tests use representative DOM fixtures. They are not a substitute for
a real Mattermost browser smoke test. The manifest's minimum server version is
9.5.0; future UI changes may require selector updates.

## Privacy and security

The plugin has no server executable, sends no network requests, and stores no
content. See [SECURITY.md](SECURITY.md).

## Publishing and upstream contribution

This repository is suitable for an independent community-plugin release. It is
not a patch that can honestly be presented as full core RTL support. Once a live
compatibility matrix exists, maintainers can publish releases and follow
Mattermost's [community plugin process](https://developers.mattermost.com/integrate/plugins/community/).

Core Persian translations should continue through Weblate. Core layout changes
need focused pull requests in `mattermost/mattermost`, with upstream tests and
maintainer review.

## License and provenance

MIT. See [NOTICE.md](NOTICE.md) for the clean-room and third-party audit record.
