import api from "./api";

const guruService = {
  getAll() {
    return api.get("/guru");
  },

  getById(id) {
    return api.get(`/guru/${id}`);
  },

  create(data) {
    return api.post("/guru", data);
  },

  update(id, data) {
    return api.put(`/guru/${id}`, data);
  },

  delete(id) {
    return api.delete(`/guru/${id}`);
  },
};

export default guruService;
