// src/data/healthInsights.js
import { scoreHormone, scoreLDL } from "../utils/scoreUtils";

const labs = {
  testosterone: 720,
  estradiol: 42,
  ldl: 128,
};

export const normalizedScores = {
  hormones: scoreHormone(labs),
  ldl: scoreLDL(labs.ldl),
};

export const BASE_SCORE = 80;

export const impacts = [
  {
    key: "e2",
    title: "Estradiol Elevated",
    description: "Estradiol levels are above the optimal range, which can negatively affect recovery and mood balance.",
    points: -5,
    type: "negative",
    category: "labs",
  },
  {
    key: "ldl",
    title: "LDL Borderline",
    description: "LDL cholesterol is slightly elevated, increasing cardiovascular strain over time.",
    points: -3,
    type: "negative",
    category: "lifestyle",
  },
  {
    key: "testosterone",
    title: "Testosterone Optimal",
    description: "Testosterone levels are within the optimal range, supporting strength, energy, and recovery.",
    points: +4,
    type: "positive",
    category: "labs",
  },
  {
    key: "recovery",
    title: "Recovery Improving",
    description: "Recent recovery metrics indicate improved muscular and nervous system recovery.",
    points: +2,
    type: "positive",
    category: "labs",
  },
];

export const FINAL_SCORE = BASE_SCORE + impacts.reduce((sum, i) => sum + i.points, 0);

export const actions = [
  {
    title: "Review Estradiol Management",
    reason: "Elevated estradiol is the largest negative contributor.",
  },
  {
    title: "Improve Lipid Profile",
    reason: "Borderline LDL may benefit from dietary adjustments.",
  },
  {
    title: "Maintain Recovery Protocol",
    reason: "Current recovery metrics are positively impacting health.",
  },
];

export const confidence = {
  value: 0.86, // 86%
  label: "High confidence",
  reason: "Based on recent labs, activity, and recovery data",
};

export const notes = [
  {
    author: "Dr. James Carter",
    role: "Medical Advisor",
    note: "Estradiol appears elevated relative to testosterone. Consider reviewing aromatization control if symptoms are present.",
  },
  {
    author: "Coach Alex Morgan",
    role: "Performance Coach",
    note: "Recovery metrics are trending positively. Maintain current training intensity and prioritize sleep consistency.",
  },
];
