import { useEffect, useState } from "react";
import api from "../auth/api";

export function useActivitySessions(days) {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api.get(`/activity/sessions/${days}`).then((res) => {
      setSessions(res.data);
    });
  }, [days]);

  return sessions;
}
