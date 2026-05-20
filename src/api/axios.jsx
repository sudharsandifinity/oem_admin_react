import axios from "axios";

// Your local backend API
const api = axios.create({
  baseURL: "http://192.168.100.82:3002/api/v1",
  baseURL: "http://localhost:3002/api/v1",
  timeout: 10000,
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

const cusadminapi = axios.create({
  baseURL: "http://localhost:3002/api/v1/company-admin", // ✅ corrected
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ recommended for Service Layer cookies
});
// api.interceptors.response.use(
//   (response) => response, // just return response if success
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or unauthorized
//       store.dispatch(logout()); // clear user and token
//       window.location.href = "/login"; // redirect to login page
//     }
//     return Promise.reject(error); // reject so your asyncThunk can catch it
//   }
// );
export default api;
export { cusapi };
export { cusadminapi };

