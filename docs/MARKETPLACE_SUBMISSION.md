# Mattermost Marketplace submission draft

Official destination:
<https://github.com/mattermost/mattermost-marketplace/issues/new?template=add_plugin.md>

Do not submit this draft until every checked statement is true in the public
repository. The intended source repository is
<https://github.com/MiRHaDi/mattermost-persian-rtl> and the intended review tag
is `v0.1.0`.

Suggested title: `Add mattermost-persian-rtl to Marketplace`

## Issue body

### Summary

Mattermost Persian & RTL Support is an independent, webapp-only plugin that
improves Persian and mixed RTL/LTR text in rendered messages, previews, channel
labels, search fields, and both legacy and Tiptap composers. It deliberately
does not claim to mirror the complete Mattermost shell. The first submission is
requested as **Beta**.

Screenshot: **BLOCKED — add a non-confidential screenshot from an authenticated
staging installation before submission.**

### Review commit

Source repository: <https://github.com/MiRHaDi/mattermost-persian-rtl>

Release: <https://github.com/MiRHaDi/mattermost-persian-rtl/releases/tag/v0.1.0>

Review commit: **replace with the final public 40-character commit SHA; do not
use a moving branch name.**

### Checklist status

Product requirements:

- [x] MIT license is included.
- [ ] Public source repository exists and matches the review commit.
- [ ] Public issue tracker and manifest links have been verified after publish.
- [ ] Public `v0.1.0` release and changelog link have been verified.
- [ ] Out of Beta and at least v1.0.0. This submission intentionally requests
  Beta status instead.
- [x] No configuration is required; the plugin has no settings.
- [x] Plugin ID `ir.mirhadi.mattermost-persian-rtl` had no collision in the
  Marketplace snapshot recorded in `compatibility.json`.

Technical requirements:

- [ ] 60k/High Availability review. The plugin is client-only, but the official
  review remains authoritative.
- [x] There are no server events to log; initialization and DOM behavior are
  covered by automated lifecycle tests.

Security requirements:

- [ ] Mattermost security review completed.
- [ ] Provide a real email address or Mattermost Community username privately
  or in the issue, as required by the official template. Do not invent one.
- [ ] Confirm GitHub private vulnerability reporting is enabled at
  <https://github.com/MiRHaDi/mattermost-persian-rtl/security/advisories/new>.

Functional requirements:

- [x] `min_server_version` is set to `9.5.0`.
- [ ] Live-test representative supported Mattermost versions, including the
  declared minimum and current release, and record exact evidence in the
  compatibility matrix.

Documentation requirements:

- [x] README includes requirements, installation, scope, usage, troubleshooting
  guidance, development commands, support URL, privacy, and limitations.
- [ ] Add at least one non-confidential screenshot from a live installation.

### Prepared evidence

- [`COMPATIBILITY.md`](COMPATIBILITY.md)
- [`AUDIT.md`](AUDIT.md)
- [`RELEASING.md`](RELEASING.md)
- [`RELEASE_NOTES.md`](RELEASE_NOTES.md)
- [`../SECURITY.md`](../SECURITY.md)
