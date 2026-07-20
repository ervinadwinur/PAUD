import api from "./api";

const penilaianService = {
  getAll() {
    return api.get("/penilaian");
  },

  getById(id) {
    return api.get(`/penilaian/${id}`);
  },

  create(data) {
    return api.post("/penilaian", data);
  },

  update(id, data) {
    return api.put(`/penilaian/${id}`, data);
  },

  delete(id) {
    return api.delete(`/penilaian/${id}`);
  },
};

export default penilaianService;
