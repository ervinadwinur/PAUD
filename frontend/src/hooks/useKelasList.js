import { useEffect, useState } from "react";
import api from "../services/api";

export function useKelasList() {
  const [kelasList, setKelasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/kelas")
      .then((res) => {
        if (active) setKelasList(res.data.data);
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

  return { kelasList, loading, error };
}