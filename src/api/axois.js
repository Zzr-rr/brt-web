import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:8080",
  timeout: 10000,
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
