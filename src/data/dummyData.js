export const stats = [
  { title: "Muscle Recovery", value: "72%", sub: "+5.3%", icon: "muscle" },
  { title: "Steps", value: "1,524", sub: "+50% Today", icon: "steps" },
  { title: "Calories Burned", value: "129", sub: "+50% Today", icon: "calories" },
];

export const heartStats = {
  avg: 98,
  min: 48,
  max: 118,
};

export const heartRateData = {
  labels: ["9:10", "9:11", "9:12", "9:13", "9:14", "9:15"],
  datasets: [
    {
      label: "Heart Rate",
      data: [72, 85, 65, 95, 78, 102],
      borderRadius: 10,
      backgroundColor: "#7c4dff",
    },
  ],
};

export const activities = [
  { type: "Running", date: "20 Apr 2024", duration: "120 min", calories: 140 },
  { type: "Cycling", date: "18 Apr 2024", duration: "90 min", calories: 120 },
  { type: "Swimming", date: "16 Apr 2024", duration: "60 min", calories: 100 },
  { type: "Yoga", date: "10 Apr 2024", duration: "45 min", calories: 80 },
];
