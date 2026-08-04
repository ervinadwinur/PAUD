// src/hooks/useOrangTuaList.js
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useOrangTuaList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orang-tua");
      setData(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengambil data orang tua");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function createOrangTua(payload) {
    try {
      const res = await api.post("/orang-tua", payload);
      await fetchData();
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Gagal menambahkan orang tua");
    }
  }

  async function updateOrangTua(id, payload) {
    try {
      const res = await api.put(`/orang-tua/${id}`, payload);
      await fetchData();
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Gagal memperbarui orang tua");
    }
  }

  async function deleteOrangTua(id) {
    try {
      await api.delete(`/orang-tua/${id}`);
      await fetchData();
    } catch (err) {
      throw new Error(err.response?.data?.message || "Gagal menghapus orang tua");
    }
  }

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    createOrangTua,
    updateOrangTua,
    deleteOrangTua,
  };
}

export default useOrangTuaList;