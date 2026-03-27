import { useEffect, useState } from "react";
import api from "../auth/api";

export function useActivitySessions(days, refreshTrigger = 0) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get(`/activity/sessions/${days}`).then((res) => {
      console.log("sessionRes", res.data);
      setSessions(res.data);
    });
  }, [days, refreshTrigger]);

  return sessions;
}
