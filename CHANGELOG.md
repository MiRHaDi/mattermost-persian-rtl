# Changelog

All notable changes to this project are documented in this file.

## 0.1.0 - 2026-09-01

- Add first-strong-character direction detection for Persian and other RTL text.
- Ignore leading Mattermost mentions when selecting a message's base direction.
- Support message bodies, previews, channel labels, legacy textareas, and rich-text editors.
- Isolate mentions and code inside mixed-direction content.
- Restore plugin-owned DOM state on disable and release removed message nodes.
- Add unit, package-shape, documentation, and packaged lifecycle smoke tests.
