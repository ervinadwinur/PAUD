import { useEffect, useState } from "react";
import api from "../services/api";

export function useGuruList() {
  const [guruList, setGuruList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/guru")
      .then((res) => {
        if (active) setGuruList(res.data.data);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { guruList, loading, error };
}