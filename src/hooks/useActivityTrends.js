import { useEffect, useState, useCallback } from "react";
import api from "../auth/api";

export function useActivityTrends(days = 7, enabled = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trends/${days}`);
      setData(res.data);
      setError(null);
    } catch (e) {
      setError("Failed to load activity data");
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    if (enabled) {
      fetchTrends();
    }
  }, [fetchTrends, enabled]);

  return { data, loading, error, refetch: fetchTrends };
}
