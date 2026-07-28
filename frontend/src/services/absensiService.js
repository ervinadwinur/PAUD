import api from "./api";

const absensiService = {
  getAll(params) {
    return api.get("/absensi", { params });
  },

  getById(id) {
    return api.get(`/absensi/${id}`);
  },

  create(data) {
    return api.post("/absensi", data);
  },

  update(id, data) {
    return api.put(`/absensi/${id}`, data);
  },

  delete(id) {
    return api.delete(`/absensi/${id}`);
  },
};

export default absensiService;
