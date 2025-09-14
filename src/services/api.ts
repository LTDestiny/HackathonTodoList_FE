import axios from "axios";
import type {
  User,
  Task,
  Category,
  TaskFormData,
  CategoryFormData,
  AuthFormData,
  TaskQuery,
  TasksResponse,
  Stats,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: async (data: AuthFormData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: Omit<AuthFormData, "fullName">) => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  me: async (): Promise<{ user: User }> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

// Tasks API
export const tasksApi = {
  getTasks: async (query: TaskQuery = {}): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    const response = await api.get(`/tasks?${params}`);
    return response.data;
  },

  getTaskById: async (id: string): Promise<{ task: Task }> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (
    data: TaskFormData
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.post("/tasks", data);
    return response.data;
  },

  updateTask: async (
    id: string,
    data: Partial<TaskFormData>
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  updateTaskStatus: async (
    id: string,
    status: Task["status"]
  ): Promise<{ task: Task; message: string }> => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  getTasksByUrgency: async (): Promise<{ tasks: Task[] }> => {
    const response = await api.get("/tasks/urgency");
    return response.data;
  },

  suggestDeadline: async (
    priority: string,
    estimateMinutes?: number
  ): Promise<{ suggestedDeadline: string; message: string }> => {
    const params = new URLSearchParams({ priority });
    if (estimateMinutes) {
      params.append("estimateMinutes", estimateMinutes.toString());
    }
    const response = await api.get(`/tasks/suggest-deadline?${params}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await api.get("/categories");
    return response.data;
  },

  getCategoryById: async (id: string): Promise<{ category: Category }> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (
    data: CategoryFormData
  ): Promise<{ category: Category; message: string }> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  updateCategory: async (
    id: string,
    data: Partial<CategoryFormData>
  ): Promise<{ category: Category; message: string }> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Stats API
export const statsApi = {
  getUserStats: async (): Promise<{ stats: Stats }> => {
    const response = await api.get("/stats");
    return response.data;
  },
};

export default api;
