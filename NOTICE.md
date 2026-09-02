# Provenance and legal note

This repository is an independent, clean-room implementation built against the
public Mattermost web app plugin interface. It contains no Mattermost server or
commercial-edition source code.

The public repository `QueraTeam/mattermost-rtl` was reviewed to understand the
existing ecosystem and its stated user-facing scope. At audit commit
`e64afd75f43a6fa660e046b7859863047b0700f3`, that repository did not contain a
license file and its package metadata had an empty license field. Therefore no
source code, stylesheet, build file, or other copyrightable implementation from
that repository was copied into this project.

The official `mattermost/mattermost-plugin-starter-template` repository was
reviewed at commit `3296cf6fad808c2372c254cf7b64bcc8a2144e67` as documentation
for the supported plugin lifecycle and bundle layout. Mattermost core was
re-audited at `f6f2719165ffb132e351342add570f3b1b6fd07a` on 2026-09-03 to
confirm the selector and plugin-API boundary. The starter is licensed under the
Apache License 2.0. This project's small build system and implementation were
written independently and are distributed under the MIT License.

Mattermost is a trademark of Mattermost, Inc. This independent project is not
endorsed by or affiliated with Mattermost, Inc. or QueraTeam.
