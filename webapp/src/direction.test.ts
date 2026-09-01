import {describe, expect, it} from 'vitest';

import {detectTextDirection, stripLeadingReferences} from './direction.ts';

describe('detectTextDirection', () => {
  it.each([
    ['سلام دنیا', 'rtl'],
    ['این متن Persian است', 'rtl'],
    ['مرحبا بالعالم', 'rtl'],
    ['שלום עולם', 'rtl'],
    ['Hello world', 'ltr'],
    ['Mattermost فارسی', 'ltr'],
    ['1234 — 🙂', 'auto'],
  ] as const)('detects %s as %s', (text, expected) => {
    expect(detectTextDirection(text)).toBe(expected);
  });

  it('ignores one or more leading Mattermost mentions', () => {
    expect(detectTextDirection('@everyone\nیک دو one two سه چهار')).toBe('rtl');
    expect(detectTextDirection('@alice @bob، سلام')).toBe('rtl');
    expect(detectTextDirection('@alice hello')).toBe('ltr');
  });

  it('falls back to the reference when it is the only strong text', () => {
    expect(detectTextDirection('@everyone')).toBe('ltr');
  });
});

describe('stripLeadingReferences', () => {
  it('does not alter a normal hashtag embedded in prose', () => {
    expect(stripLeadingReferences('Read #general today')).toBe('Read #general today');
  });

  it('supports user, channel, and hashtag references at the start', () => {
    expect(stripLeadingReferences(' @alice ~town-square #اعلان: متن')).toBe('متن');
  });
});
