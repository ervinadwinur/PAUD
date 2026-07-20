const { verifyToken } = require("../utils/jwt");
const { error } = require("../utils/response");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return error(res, "Token tidak ditemukan, silakan login", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id, role, guruId?, orangTuaId? }
    next();
  } catch (err) {
    return error(res, "Token tidak valid atau sudah kedaluwarsa", 401);
  }
}

module.exports = authenticate;
