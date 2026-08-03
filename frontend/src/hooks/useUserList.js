import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export function useUserList() {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    return api
      .get("/pengguna")
      .then((res) => {
        setUserList(res.data.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);
    api
      .get("/pengguna")
      .then((res) => {
        if (active) setUserList(res.data.data);
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

  return { userList, setUserList, loading, error, refetch: fetchUsers };
}