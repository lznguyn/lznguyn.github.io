export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

export function speakChinese(text) {
  if (!speechSupported) return;

  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'zh-CN';
  utterance.rate = 0.8;

  const voice = synth.getVoices().find(v => v.lang.replace('_', '-').toLowerCase().startsWith('zh'));
  if (voice) utterance.voice = voice;

  synth.speak(utterance);
}
