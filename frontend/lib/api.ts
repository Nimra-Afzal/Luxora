import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});


// ✅ ATTACH ACCESS TOKEN (EXCEPT AUTH ROUTES)
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  if (
    token &&
    config.headers &&
    !config.url?.includes("/auth/login") &&
    !config.url?.includes("/auth/register") &&
    !config.url?.includes("/auth/refresh")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


// 🔁 REFRESH TOKEN LOGIC (KEEP THIS)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes("/auth/login") &&
      !original.url?.includes("/auth/register") &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/auth/refresh",
          { refreshToken }
        );

        localStorage.setItem("token", res.data.accessToken);
        original.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return api(original);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
