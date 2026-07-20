const { error } = require("../utils/response");

// Penggunaan: authorize("ADMIN", "GURU")
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, "Belum terautentikasi", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, "Anda tidak memiliki akses ke resource ini", 403);
    }

    next();
  };
}

module.exports = authorize;
