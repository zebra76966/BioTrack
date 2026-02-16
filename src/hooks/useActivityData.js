import { useEffect, useState } from "react";
import api from "../auth/api";

export function useActivityData(days = 7) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api
      .get(`/trends/${days}`)
      .then((res) => {
        if (mounted) setData(res.data);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => (mounted = false);
  }, [days]);

  return { data, loading };
}
