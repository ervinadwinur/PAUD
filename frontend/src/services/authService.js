import api from "./api";

const authService = {
  login(data) {
    return api.post("/auth/login", data);
  },

  register(data) {
    return api.post("/auth/register", data);
  },

  forgotPassword(data) {
    return api.post("/auth/forgot-password", data);
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  profile() {
    return api.get("/auth/me");
  },
};

export default authService;
