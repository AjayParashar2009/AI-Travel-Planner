import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 9000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("wander_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      if (!window.location.pathname.includes("/login")) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("wander_token");
        localStorage.removeItem("wander_user");
        window.location.href = "/login";
      }
    }

    if (error.code === "ECONNABORTED") {
      toast.error("The AI is taking a bit longer than usual. Hang tight");
    }

    const errorMessage =
      response?.data?.error || response?.data?.message || "Connection Lost";

    if (response?.status !== 404 && response.status !== 401)
      toast.error(errorMessage);

    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const tripAPI = {
  generate: (data) => api.post("/trip/generate", data),
  getHistory: async () => {
    const res = await api.get("/trip/history");
    return res.data.trips || [];
  },

  getById: (id) => api.get(`/trip/${id}`),
  delete: (id) => api.delete(`/trip/${id}`),
};

export const budgetAPI = {
  calculate: (data) => api.post("/budget/calculate", data),
  getInsight: (budgetId) => api.post("/budget/ai-insight", { budgetId }),
  getHistory: async () => {
    const res = await api.get("/budget/history");
    return res.data.budgets || [];
  },
  getById: (id) => api.get(`/budget/${id}`),

  //I will check it
  updateStatus: (id, status) => api.post(`/budget/${id}`, { status }),

  delete: (id) => api.delete(`/budget/${id}`),
};

export default api;
