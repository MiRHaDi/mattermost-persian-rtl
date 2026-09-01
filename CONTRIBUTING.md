# Contributing

Contributions are welcome for reproducible RTL/BiDi rendering problems in the
Mattermost web app.

1. Keep changes limited to direction and layout behavior owned by this plugin.
2. Add a fixture and automated test for every selector or detection change.
3. Run `npm ci` and `npm run check` before opening a pull request.
4. Do not add Mattermost core translation JSON files. Core Persian translation
   work belongs in Mattermost's official Weblate instance.
5. Do not copy code from a repository that lacks a compatible explicit license.

When reporting a compatibility issue, include the Mattermost server version,
browser version, editor mode (plain text or rich text), and minimal sample text.
Remove confidential content before sharing a DOM fixture or screenshot.
