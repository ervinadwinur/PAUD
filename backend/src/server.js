require("dotenv").config();
const fs = require("fs");
const app = require("./app");

const PORT = process.env.PORT || 5000;
const uploadDir = process.env.UPLOAD_DIR || "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
