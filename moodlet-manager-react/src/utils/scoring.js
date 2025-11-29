
// Placeholder indices based on bands; replace with your BCI SDK scoring logic.
// We map mood → index function → target value. Progress is closeness to target.

const indices = {
  focus: (s) => s.beta / Math.max(1, (s.alpha + s.theta) / 2),         // higher beta relative to alpha/theta
  calm: (s) => s.alpha / Math.max(1, (s.beta + s.theta) / 2),           // higher alpha relative to beta/theta
  gratitude: (s) => (s.alpha + s.theta) / Math.max(1, (s.beta + 20)),   // softer arousal proxy
};

const targets = {
  focus: 1.6,
  calm: 1.4,
  gratitude: 1.3
};

export function calculateMoodProgress(mood, before, after) {
  const f = indices[mood];
  if (!f) return { percentage: 0, message: 'Mood scoring unavailable.' };

  const b = f(before);
  const a = f(after);

  const pctBefore = Math.max(0, Math.min(100, (b / targets[mood]) * 100));
  const pctAfter = Math.max(0, Math.min(100, (a / targets[mood]) * 100));
  const improvement = Math.max(0, pctAfter - pctBefore);

  const message =
    improvement < 5
      ? 'Subtle shift—consider a longer session or a different exercise.'
      : improvement < 15
      ? 'Nice progress—keep building the habit.'
      : 'Strong shift—great job hitting your target!';

  return { percentage: Math.round(pctAfter), improvement: Math.round(improvement), message };
}
