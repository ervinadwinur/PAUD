import api from "./api";

const siswaService = {
  getAll() {
    return api.get("/siswa");
  },

  getById(id) {
    return api.get(`/siswa/${id}`);
  },

  create(data) {
    return api.post("/siswa", data);
  },

  update(id, data) {
    return api.put(`/siswa/${id}`, data);
  },

  delete(id) {
    return api.delete(`/siswa/${id}`);
  },
};

export default siswaService;
