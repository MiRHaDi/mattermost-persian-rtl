# Security policy

## Supported versions

Only the latest released version of this plugin receives security fixes. The
current prepared release is `0.1.0` Beta. Older releases are unsupported after
a successor is published.

## Private reporting

Use GitHub's private vulnerability-reporting form:

<https://github.com/MiRHaDi/mattermost-persian-rtl/security/advisories/new>

The repository owner must enable **Private vulnerability reporting** before the
first public release. If the link is unavailable, do not open a public issue
and do not include vulnerability details in a compatibility report. Wait for a
private contact route to be published in the repository Security tab.

Include the plugin version, Mattermost version/build, client and browser
version, minimal reproduction steps, impact, and a non-sensitive proof of
concept. Do not include production messages, access tokens, cookies, server
URLs, private screenshots, or other customer data.

Maintainers should acknowledge a valid private report within five business
days, provide a status update within ten business days, coordinate a fix and
advisory with the reporter, and avoid publishing exploit details before a fixed
release is available. These are response targets, not a service-level
guarantee.

## Scope and data handling

The plugin has no server executable, makes no network requests, stores no user
data, and does not alter message payloads. It only changes direction-related
attributes and plugin-owned CSS classes in the current browser DOM.

Relevant reports include DOM injection introduced by this plugin, unsafe
handling of message content, dependency or build-chain compromise, privilege
boundary violations, and incomplete cleanup that exposes content across views.
General Mattermost server vulnerabilities and issues reproducible without this
plugin should be reported through Mattermost's own security process.
