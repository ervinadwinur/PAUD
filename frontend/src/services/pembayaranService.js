import api from "./api";

const pembayaranService = {
  getAll() {
    return api.get("/pembayaran");
  },

  getById(id) {
    return api.get(`/pembayaran/${id}`);
  },

  create(data) {
    return api.post("/pembayaran", data);
  },

  update(id, data) {
    return api.put(`/pembayaran/${id}`, data);
  },

  delete(id) {
    return api.delete(`/pembayaran/${id}`);
  },
};

export default pembayaranService;
