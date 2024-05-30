import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://event-link-server-link.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
