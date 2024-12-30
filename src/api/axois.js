import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 1000000000000000000000000000,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
