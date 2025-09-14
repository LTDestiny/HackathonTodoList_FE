import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/StatsCard";
import { useStats, useTasks, useAuth, useAppDispatch } from "@/hooks/useStore";
import { setStats } from "@/store/statsSlice";
import {
  setUrgentTasks,
  updateTaskAsync,
  deleteTask,
} from "@/store/tasksSlice";
import { statsApi, tasksApi } from "@/services/api";
import TaskCard from "@/components/TaskCard";
import TaskDialog from "@/components/TaskDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Task } from "@/types";

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useStats();
  const { urgentTasks } = useTasks();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsResponse, urgentTasksResponse] = await Promise.all([
          statsApi.getUserStats(),
          tasksApi.getTasksByUrgency(),
        ]);

        dispatch(setStats(statsResponse.stats));
        dispatch(setUrgentTasks(urgentTasksResponse.tasks));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  // Navigation handlers for stats cards
  const navigateToTasksWithFilter = (filter: {
    status?: string;
    priority?: string;
    type?: string;
  }) => {
    const params = new URLSearchParams();
    if (filter.status) params.set("status", filter.status);
    if (filter.priority) params.set("priority", filter.priority);
    if (filter.type) params.set("type", filter.type);

    navigate(`/tasks?${params.toString()}`);
  };

  // Task handlers
  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setShowTaskDialog(true);
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      await dispatch(
        updateTaskAsync({
          id: taskId,
          updates: {
            status,
            completedAt:
              status === "COMPLETED" ? new Date().toISOString() : undefined,
          },
        })
      ).unwrap();

      // Refresh both stats and urgent tasks after status change
      await refreshDashboardData();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();

      // Refresh both stats and urgent tasks after deletion
      await refreshDashboardData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskDialogClose = () => {
    setShowTaskDialog(false);
    setEditingTask(null);
  };

  const refreshDashboardData = async () => {
    try {
      const [statsResponse, urgentTasksResponse] = await Promise.all([
        statsApi.getUserStats(),
        tasksApi.getTasksByUrgency(),
      ]);

      dispatch(setStats(statsResponse.stats));
      dispatch(setUrgentTasks(urgentTasksResponse.tasks));
    } catch (error) {
      console.error("Failed to refresh dashboard data:", error);
    }
  };

  const handleTaskDialogSuccess = async () => {
    // Refresh both stats and urgent tasks after task creation/update
    await refreshDashboardData();
    handleTaskDialogClose();
  };

  if (loading || statsLoading) {
    return <LoadingSpinner />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <Card className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h1 className="mb-2 text-xl font-bold sm:text-2xl">
                  Chào {user?.fullName?.split(" ").pop()}! 👋
                </h1>
                <p className="text-sm text-blue-100 sm:text-base">
                  Hôm nay bạn có {stats?.overview.totalTasks || 0} nhiệm vụ. Hãy
                  cùng hoàn thành chúng nhé!
                </p>
              </div>
              <Button
                onClick={() => setShowTaskDialog(true)}
                className="w-full text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Tạo nhiệm vụ</span>
                <span className="sm:hidden">Tạo mới</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng nhiệm vụ"
            value={stats?.overview.totalTasks || 0}
            subtitle={`+${
              stats?.weekly.completedTasks || 0
            } hoàn thành tuần này`}
            icon={Calendar}
            onClick={() => navigate(`/tasks`)}
          />

          <StatsCard
            title="Đã hoàn thành"
            value={stats?.overview.completedTasks || 0}
            subtitle={`${stats?.overview.completionRate.toFixed(
              1
            )}% tỷ lệ hoàn thành`}
            icon={CheckCircle}
            className="hover:bg-green-50"
            iconColor="text-green-600"
            onClick={() => navigateToTasksWithFilter({ status: "COMPLETED" })}
          />

          <StatsCard
            title="Đang làm"
            value={stats?.overview.inProgressTasks || 0}
            subtitle="Nhiệm vụ đang thực hiện"
            icon={Clock}
            className="hover:bg-blue-50"
            iconColor="text-blue-600"
            onClick={() => navigateToTasksWithFilter({ status: "IN_PROGRESS" })}
          />

          <StatsCard
            title="Quá hạn"
            value={stats?.overview.overdueTasks || 0}
            subtitle="Cần xử lý ngay"
            icon={AlertTriangle}
            className="hover:bg-red-50"
            iconColor="text-red-600"
            onClick={() => navigateToTasksWithFilter({ type: "overdue" })}
          />
        </div>
      </motion.div>

      {/* Smart Urgent Tasks Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-orange-500" />
                <CardTitle className="text-base sm:text-lg">
                  Nhiệm vụ ưu tiên
                </CardTitle>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Tự động sắp xếp theo độ khẩn cấp
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {urgentTasks.length === 0 ? (
              <div className="py-6 text-center sm:py-8">
                <CheckCircle className="w-10 h-10 mx-auto mb-4 text-green-500 sm:h-12 sm:w-12" />
                <h3 className="mb-2 text-base font-medium sm:text-lg">
                  Tuyệt vời!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bạn không có nhiệm vụ ưu tiên nào. Hãy tiếp tục phát huy!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentTasks.slice(0, 5).map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TaskCard
                      task={task}
                      showCategory
                      onClick={handleTaskClick}
                      onStatusChange={handleStatusChange}
                      onEdit={handleTaskClick}
                      onDelete={handleDeleteTask}
                    />
                  </motion.div>
                ))}
                {urgentTasks.length > 5 && (
                  <div className="pt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={() => navigate("/tasks")}
                      className="w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Xem thêm {urgentTasks.length - 5} nhiệm vụ
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Overview */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                Tiến độ theo danh mục
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div
                        className="flex-shrink-0 w-3 h-3 mr-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm truncate">{category.name}</span>
                    </div>
                    <span className="ml-2 text-sm font-medium">
                      {category.completedTasks} hoàn thành
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentActivity.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center text-sm">
                    <CheckCircle className="flex-shrink-0 w-4 h-4 mr-2 text-green-500" />
                    <span className="truncate">{task.title}</span>
                  </div>
                )) || (
                  <p className="text-sm text-muted-foreground">
                    Chưa có hoạt động nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Task Creation Dialog */}
      <TaskDialog
        open={showTaskDialog}
        onClose={handleTaskDialogClose}
        onSuccess={handleTaskDialogSuccess}
        task={editingTask}
      />
    </motion.div>
  );
};

export default DashboardPage;
