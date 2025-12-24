export function normalize(value, min, max) {
  if (value <= min) return 0;
  if (value >= max) return 100;
  return ((value - min) / (max - min)) * 100;
}

export function scoreHormone({ testosterone, estradiol }) {
  const tScore = normalize(testosterone, 300, 900);
  const ePenalty = estradiol > 35 ? -5 : 0;
  return Math.min(100, tScore + ePenalty);
}

export function scoreLDL(ldl) {
  if (ldl < 100) return 90;
  if (ldl < 130) return 75;
  return 60;
}
