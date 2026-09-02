# Contributing

Contributions are welcome for reproducible RTL/BiDi rendering problems in the
Mattermost web app.

1. Keep changes limited to direction and layout behavior owned by this plugin.
2. Add a fixture and automated test for every selector or detection change.
3. Run `npm ci` and `npm run check` before opening a pull request. Release
   maintainers must run `npm run release:check` as documented in
   [`docs/RELEASING.md`](docs/RELEASING.md).
4. Do not add Mattermost core translation JSON files. Core Persian translation
   work belongs in Mattermost's official Weblate instance.
5. Do not copy code from a repository that lacks a compatible explicit license.

When reporting a compatibility issue, use the repository's **Compatibility
report** issue template and include the Mattermost server version/build, browser
or Desktop version, editor mode (plain text or rich text), and minimal sample
text. Remove confidential content before sharing a DOM fixture or screenshot.

Security vulnerabilities must not be reported in a public issue. Follow the
private route and data-handling rules in [`SECURITY.md`](SECURITY.md).
