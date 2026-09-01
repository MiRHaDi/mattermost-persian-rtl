# Scope and compatibility

## Supported mechanism

The plugin uses two documented Mattermost webapp capabilities:

1. the plugin `initialize` / `uninitialize` lifecycle; and
2. `registerRootComponent`, with React supplied by Mattermost as `window.React`.

The root component owns a small DOM compatibility controller. This is a
best-effort layer because the SDK has no global core-layout RTL switch. It watches
only the message/editor subtree, adds namespaced classes, and cleans up on
unmount or plugin disable.

## Targeted surfaces

The maintained selector set covers:

- `.post-message__text` and its principal Markdown block children;
- `.textbox-preview-area` and its principal Markdown block children;
- `.markdown__paragraph-inline`;
- the channel description, channel heading, and channel label;
- `post_textbox`, `reply_textbox`, `edit_textbox`, and `modal_textbox`;
- semantic rich editors matching `[contenteditable="true"][role="textbox"]`;
- Mattermost search and quick-switch inputs.

An explicit pre-existing `dir="ltr"` or `dir="rtl"` is preserved. `dir="auto"`
may be replaced with the detector's result and is restored when the plugin stops.

## Direction algorithm

Numbers, punctuation, and emoji are weak characters and do not select a base
direction. The first strong letter selects LTR or RTL. Before that scan, leading
Mattermost-style `@user`, `~channel`, and `#tag` references are removed from a
temporary probe. The original text and DOM content remain untouched. If no other
strong text exists, the detector falls back to the reference itself.

The RTL ranges include Hebrew, Arabic/Persian, Syriac, Thaana, NKo, Samaritan,
Mandaic, and Arabic/Hebrew presentation forms. Code and Mattermost mention nodes
are isolated as LTR within a directed message.

## Known boundaries

- Core components do not publish a stable selector contract. A Mattermost UI
  refactor can require an update even when the plugin API itself is unchanged.
- The plugin does not move buttons, swap sidebars, reverse flex/grid order, or
  alter modals and menus.
- Focalboard/Boards, Playbooks, Calls, and third-party plugins own separate DOM
  and are outside the initial selector contract.
- Mobile applications do not load webapp plugins.
- Automated fixture tests prove the controller behavior, build, and archive
  shape; they do not prove behavior on every Mattermost release or browser.

## Audit references

- Official plugin SDK:
  <https://developers.mattermost.com/integrate/reference/webapp/webapp-reference/>
- Official webapp plugin architecture:
  <https://developers.mattermost.com/integrate/plugins/components/webapp/>
- Open core BiDi issue:
  <https://github.com/mattermost/mattermost/issues/27911>
- Official starter template:
  <https://github.com/mattermost/mattermost-plugin-starter-template>
- Existing ecosystem project (audit only):
  <https://github.com/QueraTeam/mattermost-rtl>
