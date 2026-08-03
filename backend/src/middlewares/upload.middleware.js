const multer = require("multer");
const path = require("path");
const fs = require("fs");

function createUploader({ folder, allowedMimeTypes, maxSizeMB = 10, errorMessage }) {
  const uploadDir = path.join(__dirname, "../../uploads", folder);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error(errorMessage));
      }
      cb(null, true);
    },
  });
}

// Upload untuk pengumuman — hanya PDF
const uploadPengumuman = createUploader({
  folder: "pengumuman",
  allowedMimeTypes: ["application/pdf"],
  maxSizeMB: 10,
  errorMessage: "Hanya file PDF yang diperbolehkan",
});

// Upload untuk foto kegiatan harian — hanya gambar
const uploadFotoKegiatan = createUploader({
  folder: "kegiatan-harian",
  allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  maxSizeMB: 5,
  errorMessage: "Hanya file gambar (JPG/PNG/WebP) yang diperbolehkan",
});

// Upload untuk file rapor — hanya PDF
const uploadRapor = createUploader({
  folder: "rapor",
  allowedMimeTypes: ["application/pdf"],
  maxSizeMB: 10,
  errorMessage: "Hanya file PDF yang diperbolehkan",
});
// Upload untuk bukti pembayaran — gambar atau PDF
const uploadBukti = createUploader({
  folder: "pembayaran",
  allowedMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf"],
  maxSizeMB: 5,
  errorMessage: "Hanya file gambar (JPG/PNG/WebP) atau PDF yang diperbolehkan",
});

module.exports = { uploadPengumuman, uploadFotoKegiatan, uploadRapor, uploadBukti };
