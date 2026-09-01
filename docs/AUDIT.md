# Upstream and ecosystem audit

Audit date: 2026-09-01 (Asia/Tehran)

## Repositories

| Project | Audited branch/commit | Latest release observed | License finding |
|---|---|---|---|
| Mattermost | `master` / `679dcd7e1653320dbffa0a9a664f196f406362e3` | `v11.10.1` (2026-08-24) | Upstream repository terms apply; no upstream code is redistributed here. |
| Mattermost Desktop | `master` / `9e6b8b65a9bb80f190c78a4aa8803f0067f95fd9` | `v6.3.0` (2026-08-13) | Upstream repository terms apply; no upstream code is redistributed here. |
| Official plugin starter | `master` / `3296cf6fad808c2372c254cf7b64bcc8a2144e67` | `v0.5.0` (2025-03-20) | Apache-2.0. |
| QueraTeam RTL plugin | `main` / `e64afd75f43a6fa660e046b7859863047b0700f3` | `v1.0.4` (2025-03-29) | No `LICENSE`, `COPYING`, or `NOTICE` file; `webapp/package.json` has an empty `license` value. |

The branch heads were verified with Git and the release metadata with GitHub's
repository API. Because the QueraTeam repository has no explicit license, its
implementation was not reused. Public behavior and compatibility gaps were used
only to define test cases for an independent implementation.

## Current core state

At the audited Mattermost commit:

- Persian is registered as `فارسی (Alpha)` in
  `webapp/channels/src/i18n/i18n.ts`.
- Persian catalogs exist at `webapp/channels/src/i18n/fa.json` and
  `server/i18n/fa.json`.
- Mattermost Desktop also contains `i18n/fa.json` and registers `fa` as Farsi in
  its current public repository.
- A rendered post root already has `className='post-message__text'` and
  `dir='auto'`.
- The rich-text editor exposes `role='textbox'` and receives the stable editor
  IDs used by the legacy composer (`post_textbox`, `reply_textbox`, and related
  IDs).
- GitHub issue `mattermost/mattermost#27911` remains open and documents the
  leading-mention BiDi failure that plain `dir='auto'` does not solve.

The `Alpha` label and the official development workflow are important limits:
Mattermost says only `en.json` should generally be edited directly and that
other language files are updated through Weblate. Weblate's live statistics page
was protected by an interactive anti-bot challenge during this audit, so this
project does not publish an unverified completion percentage.

## Plugin architecture decision

Official documentation says a webapp plugin bundle is downloaded by the web and
desktop clients, registered through `window.registerPlugin`, and initialized with
a registry. `registerRootComponent` is the documented high-flexibility hook for
global browser behavior, while the component slots are designed for supported
extensions.

There is no documented registry method for changing the root direction or
mirroring all existing core components. Full UI RTL from a third-party plugin
would therefore require broad, version-sensitive DOM/CSS overrides. This project
uses a root component but deliberately limits its DOM compatibility controller
to text-bearing message/editor surfaces.

## Pull request path

- This clean-room code belongs in its own community-plugin repository and can be
  proposed for the Mattermost community plugin directory after live version
  testing and maintained releases.
- Persian product-string corrections belong in Mattermost Weblate, not in this
  plugin and generally not as direct edits to core `fa.json` files.
- Stable, universal RTL layout improvements should be small upstream changes in
  `mattermost/mattermost`, tied to an issue and covered by core tests. This
  independent plugin is not itself a truthful substitute for such a core PR.

## Primary sources

- <https://github.com/mattermost/mattermost>
- <https://github.com/mattermost/mattermost/releases/tag/v11.10.1>
- <https://github.com/mattermost/desktop>
- <https://github.com/mattermost/desktop/releases/tag/v6.3.0>
- <https://developers.mattermost.com/integrate/reference/webapp/webapp-reference/>
- <https://developers.mattermost.com/integrate/plugins/components/webapp/>
- <https://developers.mattermost.com/contribute/more-info/webapp/developer-workflow/>
- <https://github.com/mattermost/mattermost/issues/27911>
- <https://github.com/mattermost/mattermost-plugin-starter-template>
- <https://github.com/QueraTeam/mattermost-rtl>
