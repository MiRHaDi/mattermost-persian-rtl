export type TextDirection = 'auto' | 'ltr' | 'rtl';

const LTR_LETTER = /\p{Letter}/u;

const RTL_RANGES: ReadonlyArray<readonly [number, number]> = [
  [0x0590, 0x05ff], // Hebrew
  [0x0600, 0x06ff], // Arabic and Persian
  [0x0700, 0x074f], // Syriac
  [0x0750, 0x077f], // Arabic Supplement
  [0x0780, 0x07bf], // Thaana
  [0x07c0, 0x07ff], // NKo
  [0x0800, 0x083f], // Samaritan
  [0x0840, 0x085f], // Mandaic
  [0x08a0, 0x08ff], // Arabic Extended-A/B
  [0xfb1d, 0xfdff], // Hebrew and Arabic presentation forms
  [0xfe70, 0xfeff], // Arabic presentation forms-B
  [0x1ee00, 0x1eeff], // Arabic mathematical alphabetic symbols
];

function isRtlLetter(character: string): boolean {
  const codePoint = character.codePointAt(0);
  return codePoint !== undefined && RTL_RANGES.some(([start, end]) => codePoint >= start && codePoint <= end);
}

function findFirstStrongDirection(value: string): Exclude<TextDirection, 'auto'> | undefined {
  for (const character of value) {
    if (isRtlLetter(character)) {
      return 'rtl';
    }
    if (LTR_LETTER.test(character)) {
      return 'ltr';
    }
  }
  return undefined;
}

/**
 * Removes only leading Mattermost-style references from the direction probe.
 * This prevents an ASCII username such as `@everyone` from forcing an
 * otherwise Persian message to LTR. The original text is never modified.
 */
export function stripLeadingReferences(value: string): string {
  let remainder = value.trimStart();

  while (remainder.length > 0) {
    const reference = remainder.match(/^[@~#][\p{Letter}\p{Number}][\p{Letter}\p{Number}._:+-]*/u);
    if (!reference) {
      break;
    }

    const following = remainder.slice(reference[0].length);
    if (following.length > 0 && !/^[\s,،;؛:]/u.test(following)) {
      break;
    }
    remainder = following.replace(/^[\s,،;؛:]+/u, '');
  }

  return remainder;
}

export function detectTextDirection(value: string): TextDirection {
  const withoutLeadingReferences = stripLeadingReferences(value);
  return (
    findFirstStrongDirection(withoutLeadingReferences) ??
    findFirstStrongDirection(value) ??
    'auto'
  );
}
