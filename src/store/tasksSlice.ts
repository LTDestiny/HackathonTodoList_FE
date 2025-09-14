import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Task, TaskQuery } from "@/types";
import { tasksApi } from "@/services/api";

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: TaskQuery;
  urgentTasks: Task[];
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 100,
    total: 0,
    pages: 0,
  },
  filters: {
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  urgentTasks: [],
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (query?: Partial<TaskQuery>) => {
    const response = await tasksApi.getTasks(query);
    return response;
  }
);

export const createTaskAsync = createAsyncThunk(
  "tasks/createTask",
  async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const response = await tasksApi.createTask(taskData);
    return response;
  }
);

export const updateTaskAsync = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, updates }: { id: string; updates: Partial<Task> }) => {
    const response = await tasksApi.updateTask(id, updates);
    return response;
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId: string) => {
    await tasksApi.deleteTask(taskId);
    return taskId;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setTasks: (
      state,
      action: PayloadAction<{
        tasks: Task[];
        pagination: TasksState["pagination"];
      }>
    ) => {
      state.tasks = action.payload.tasks;
      state.pagination = action.payload.pagination;
      state.error = null;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateTaskLocal: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.pagination.total -= 1;
    },
    setFilters: (state, action: PayloadAction<Partial<TaskQuery>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
    setUrgentTasks: (state, action: PayloadAction<Task[]>) => {
      state.urgentTasks = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = action.payload.tasks;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Error fetching tasks";
    });

    // Create task
    builder.addCase(createTaskAsync.fulfilled, (state, action) => {
      state.tasks.unshift(action.payload.task);
      state.pagination.total += 1;
    });

    // Update task
    builder.addCase(updateTaskAsync.fulfilled, (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.task.id
      );
      if (index !== -1) {
        state.tasks[index] = action.payload.task;
      }
    });

    // Delete task
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      state.pagination.total -= 1;
    });
  },
});

export const {
  setLoading,
  setError,
  setTasks,
  addTask,
  updateTaskLocal,
  removeTask,
  setFilters,
  clearFilters,
  setUrgentTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;
