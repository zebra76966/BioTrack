import { useEffect, useState } from "react";
import api from "../auth/api";

export function useActivityHistory(days) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get(`/trends/${days}`)
      .then((res) => {
        if (mounted) setData(res.data);
      })
      .catch(() => {
        if (mounted) setData([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, [days]);

  return { data, loading };
}
