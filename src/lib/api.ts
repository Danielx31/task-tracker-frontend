import axios from 'axios';
import { Task, TasksResponse, TaskFilters } from '../types/task';

// IMPORTANT: Update this URL to match your Laravel backend
// For local development, typically: http://localhost:8000/api
// Make sure CORS is enabled in your Laravel backend
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for authentication token if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

export const taskApi = {
  // Get all tasks with optional filters and pagination
  getTasks: async (page = 1, filters?: TaskFilters): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Get single task
  getTask: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  createTask: async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  },

  // Update task
  updateTask: async (id: number, task: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

export default api;