export const STYLE_ELEMENT_ID = 'mattermost-persian-rtl-styles';

export const STYLE_TEXT = `
.mm-prtl-target {
  unicode-bidi: isolate;
  text-align: start !important;
}

.mm-prtl-target[dir='rtl'] {
  direction: rtl !important;
}

.mm-prtl-target[dir='ltr'] {
  direction: ltr !important;
}

.mm-prtl-editor {
  unicode-bidi: isolate;
  text-align: start !important;
}

.mm-prtl-content[dir='rtl'] > :is(ul, ol),
.mm-prtl-content[dir='rtl'] :is(ul, ol).markdown__list {
  padding-inline-start: 1.5rem;
  padding-inline-end: 0;
}

.mm-prtl-target :is([data-mention], [data-channel-mention], .mention-link, .group-mention-link) {
  direction: ltr;
  unicode-bidi: isolate;
}

.mm-prtl-target :is(pre, code, .post-code) {
  direction: ltr;
  text-align: left;
  unicode-bidi: isolate;
}
`;
