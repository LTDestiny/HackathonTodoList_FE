import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "@/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector);

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
  };
};

export const useTasks = () => {
  const tasks = useSelector((state: RootState) => state.tasks);

  return {
    tasks: tasks.tasks,
    loading: tasks.loading,
    error: tasks.error,
    pagination: tasks.pagination,
    filters: tasks.filters,
    urgentTasks: tasks.urgentTasks,
  };
};

export const useCategories = () => {
  const categories = useSelector((state: RootState) => state.categories);

  return {
    categories: categories.categories,
    loading: categories.loading,
    error: categories.error,
  };
};

export const useStats = () => {
  const stats = useSelector((state: RootState) => state.stats);

  return {
    stats: stats.stats,
    loading: stats.loading,
    error: stats.error,
  };
};
