import axios from "axios";

// Your local backend API
const api = axios.create({
  baseURL: "http://192.168.100.82:3002/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// SAP B1 Service Layer API
const cusapi = axios.create({
  baseURL: "https://192.168.100.82:50000/b1s/v2", // ✅ corrected
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ recommended for Service Layer cookies
});

export default api;
export { cusapi };
