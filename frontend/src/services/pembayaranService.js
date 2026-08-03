import api from "./api";

const pembayaranService = {
  getAll() {
    return api.get("/pembayaran");
  },

  buatPengingatWhatsApp(id) {
    return api.post(`/pembayaran/${id}/pengingat-wa`);
  },

  uploadBukti(id, data) {
    return api.post(`/pembayaran/${id}/upload-bukti`, data, { headers: { "Content-Type": "multipart/form-data" } });
  },

  verifikasi(id, data) {
    return api.put(`/pembayaran/${id}/verifikasi`, data);
  },

  getById(id) {
    return api.get(`/pembayaran/${id}`);
  },

  create(data) {
    return api.post("/pembayaran", data);
  },

  buatTagihan(data) {
    return api.post("/pembayaran/tagihan", data);
  },

  update(id, data) {
    return api.put(`/pembayaran/${id}`, data);
  },

  delete(id) {
    return api.delete(`/pembayaran/${id}`);
  },
};

export default pembayaranService;