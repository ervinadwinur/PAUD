import api from "./api";

export default {
  get: () => api.get("/pengaturan"),
  update: (data) => api.put("/pengaturan", data),
};
