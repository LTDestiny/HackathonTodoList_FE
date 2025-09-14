export interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  userId: string;
  categoryId?: string;
  title: string;
  description?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "INCOMPLETE" | "IN_PROGRESS" | "COMPLETED";
  deadlineAt?: string;
  estimateMinutes?: number;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface TaskFormData {
  title: string;
  description?: string;
  categoryId?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status?: "INCOMPLETE" | "IN_PROGRESS" | "COMPLETED";
  deadlineAt?: string;
  estimateMinutes?: number;
}

export interface CategoryFormData {
  name: string;
  color: string;
}

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}

export interface TaskQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  status?: "INCOMPLETE" | "IN_PROGRESS" | "COMPLETED";
  sortBy?: "createdAt" | "updatedAt" | "deadlineAt" | "priority" | "title";
  sortOrder?: "asc" | "desc";
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Stats {
  overview: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    completionRate: number;
  };
  weekly: {
    completedTasks: number;
  };
  monthly: {
    completedTasks: number;
  };
  categories: Array<{
    id: string;
    name: string;
    color: string;
    completedTasks: number;
  }>;
  priorities: Array<{
    priority: string;
    count: number;
  }>;
  dailyCompletion: Array<{
    date: string;
    completed: number;
  }>;
  recentActivity: Task[];
}
