import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Базовый URL
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert("Сессия истекла, пожалуйста, войдите снова.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
