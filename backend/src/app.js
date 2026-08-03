const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const routes = require("./routes");
const { error } = require("./utils/response");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Akses file yang diunggah (bukti pembayaran, foto kegiatan, rapor, dll)
app.use("/uploads", express.static(path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "API Sistem Informasi PAUD Kober Al-Musyawaroh aktif" });
});

app.use("/api", routes);
app.use("/uploads/pengumuman", express.static(path.join(__dirname, "../uploads/pengumuman")));
// 404 handler
app.use((req, res) => {
  return error(res, "Endpoint tidak ditemukan", 404);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  return error(res, err.message || "Terjadi kesalahan pada server", 500);
});

module.exports = app;
