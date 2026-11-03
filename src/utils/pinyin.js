import { escapeHtml } from './html.js';

const TONE_MARKS = {
  1: 'āēīōūǖ',
  2: 'áéíóúǘ',
  3: 'ǎěǐǒǔǚ',
  4: 'àèìòùǜ',
};

const VOWELS = 'aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ';

// One syllable: optional initial, vowel group, optional final n/ng/r that is not the start of the next syllable.
const SYLLABLE = new RegExp(
  `(?:zh|ch|sh|[bpmfdtnlgkhjqxzcsryw])?[${VOWELS}]+(?:ng|n|r)?(?![${VOWELS}])`,
  'gi'
);

export function getTone(syllable) {
  for (const [tone, marks] of Object.entries(TONE_MARKS)) {
    if ([...syllable.toLowerCase()].some(ch => marks.includes(ch))) return Number(tone);
  }
  return 5;
}

// "xuéxí" -> <span class="tone-2">xué</span><span class="tone-2">xí</span>
export function colorizePinyin(pinyin) {
  const text = String(pinyin ?? '');
  let html = '';
  let last = 0;

  for (const match of text.matchAll(SYLLABLE)) {
    html += escapeHtml(text.slice(last, match.index));
    html += `<span class="tone-${getTone(match[0])}">${escapeHtml(match[0])}</span>`;
    last = match.index + match[0].length;
  }

  return html + escapeHtml(text.slice(last));
}
