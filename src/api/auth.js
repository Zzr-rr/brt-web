import axios from "@/api/axois";

const authApi = {
  login(params) {
    return axios.post("/auth/login", params);
  },

  register(params) {
    return axios.post("/auth/register", params);
  },

  logout() {
    return axios.post("/auth/logout");
  },

  verify() {
    return axios.get("/auth/verify");
  },
};

export default authApi;
