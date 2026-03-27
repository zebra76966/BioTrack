import { FaWalking, FaDumbbell, FaRunning, FaBiking, FaQuestionCircle } from "react-icons/fa";

export const getActivityConfig = (type) => {
  const map = {
    Walking: { icon: <FaWalking />, color: "#27ae60", type: "walk" },
    Running: { icon: <FaRunning />, color: "#3b82f6", type: "workout" },
    Cycling: { icon: <FaBiking />, color: "#f59e0b", type: "workout" },
    FunctionalStrengthTraining: { icon: <FaDumbbell />, color: "#7c3aed", type: "workout" },
    "Strength Training": { icon: <FaDumbbell />, color: "#7c3aed", type: "workout" },
  };
  return map[type] || { icon: <FaQuestionCircle />, color: "#94a3b8", type: "walk" };
};
