import { useEffect, useState } from "react";
import api from "../services/api";

export function useSiswaList() {
  const [siswaList, setSiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/siswa")
      .then((res) => {
        if (active) setSiswaList(res.data.data);
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

  return { siswaList, loading, error };
}