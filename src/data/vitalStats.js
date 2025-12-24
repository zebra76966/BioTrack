export const vitalStats = {
  heart: {
    title: "Your Heart Statistic",
    unit: "BPM",
    image: "/images/heart.png",
    color: "#7c4dff",
    chartLabel: "Heart Rate",
    stats: { avg: 98, min: 48, max: 118 },
    chart: [72, 85, 65, 95, 78, 102],
    info: [
      { label: "Resting HR", value: 62, icon: "heart" },
      { label: "HRV", value: 48, unit: "ms", icon: "wave" },
      { label: "Intensity", value: "High", icon: "bolt" },
    ],
    trend: "up",
    trendValue: "+6%",
  },

  muscle: {
    title: "Your Muscle Statistic",
    unit: "%",
    image: "/images/muscle.png",
    color: "#56cc9d",
    chartLabel: "Muscle Load",
    stats: { avg: 72, min: 55, max: 89 },
    chart: [60, 70, 65, 80, 75, 85],
    info: [
      { label: "Recovery", value: "Good", icon: "check" },
      { label: "Fatigue", value: 32, unit: "%", icon: "fire" },
      { label: "Load", value: "Moderate", icon: "dumbbell" },
    ],
    trend: "down",
    trendValue: "-2%",
  },

  testosterone: {
    title: "Your Testosterone Statistic",
    unit: "ng/dL",
    image: "/images/trt.png",
    color: "#f2994a",
    chartLabel: "Hormone Level",
    stats: { avg: 620, min: 480, max: 820 },
    chart: [520, 610, 580, 700, 650, 740],
    info: [
      { label: "Baseline", value: 580, unit: "ng/dL", icon: "flask" },
      { label: "Trend", value: "Rising", icon: "arrow" },
      { label: "Stability", value: "Stable", icon: "shield" },
    ],
    trend: "up",
    trendValue: "+18%",
  },
};
