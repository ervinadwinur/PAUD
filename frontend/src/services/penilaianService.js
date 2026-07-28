import api from "./api";

const penilaianService = {
  getAll() {
    return api.get("/perkembangan");
  },

  getById(id) {
    return api.get(`/perkembangan/${id}`);
  },

  create(data) {
    return api.post("/perkembangan", data);
  },

  update(id, data) {
    return api.put(`/perkembangan/${id}`, data);
  },

  delete(id) {
    return api.delete(`/perkembangan/${id}`);
  },
};

export default penilaianService;
