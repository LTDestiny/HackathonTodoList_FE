import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import {
  X,
  Save,
  Edit3,
  Plus,
  Flag,
  Clock,
  FileText,
  Target,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tasksApi } from "@/services/api";
import { addTask, updateTaskLocal } from "@/store/tasksSlice";
import type { Task } from "@/types";
import { taskSchema } from "@/validations";

// Use Zod inferred type instead of the interface
type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  task?: Task | null;
  onSuccess?: () => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  open,
  onOpenChange,
  onClose,
  task = null,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(task);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: "MEDIUM",
      status: "INCOMPLETE",
    },
  });

  const watchedPriority = watch("priority");
  const watchedStatus = watch("status");

  useEffect(() => {
    if (isEditing && task) {
      reset({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        estimateMinutes: task.estimateMinutes || undefined,
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "INCOMPLETE",
        estimateMinutes: undefined,
      });
    }
  }, [isEditing, task, reset]);

  const handleClose = () => {
    reset();
    setError("");
    onClose?.();
    onOpenChange?.(false);
  };

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    setError("");

    try {
      // Ensure required fields have default values
      const taskData = {
        ...data,
        priority: data.priority || "MEDIUM",
        status: data.status || "INCOMPLETE",
      };

      if (isEditing && task) {
        const response = await tasksApi.updateTask(task.id, taskData);
        dispatch(updateTaskLocal(response.task));
      } else {
        const response = await tasksApi.createTask(taskData);
        dispatch(addTask(response.task));
      }

      reset();

      onSuccess?.();

      handleClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `${isEditing ? "Cập nhật" : "Tạo"} nhiệm vụ thất bại`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return {
          color: "bg-gradient-to-r from-red-500 to-pink-600",
          icon: <Star className="w-4 h-4" />,
          text: "Cao",
          bg: "bg-red-50 border-red-200",
        };
      case "MEDIUM":
        return {
          color: "bg-gradient-to-r from-orange-500 to-yellow-600",
          icon: <Flag className="w-4 h-4" />,
          text: "Trung bình",
          bg: "bg-orange-50 border-orange-200",
        };
      case "LOW":
        return {
          color: "bg-gradient-to-r from-green-500 to-teal-600",
          icon: <Target className="w-4 h-4" />,
          text: "Thấp",
          bg: "bg-green-50 border-green-200",
        };
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-gray-600",
          icon: <Flag className="w-4 h-4" />,
          text: "Chưa xác định",
          bg: "bg-gray-50 border-gray-200",
        };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          color: "bg-gradient-to-r from-green-500 to-emerald-600",
          text: "Đã làm",
          emoji: "✅",
        };
      case "IN_PROGRESS":
        return {
          color: "bg-gradient-to-r from-blue-500 to-cyan-600",
          text: "Đang làm",
          emoji: "🔄",
        };
      case "INCOMPLETE":
        return {
          color: "bg-gradient-to-r from-gray-500 to-slate-600",
          text: "Chưa làm",
          emoji: "📋",
        };
      default:
        return {
          color: "bg-gradient-to-r from-gray-500 to-gray-600",
          text: "Chưa xác định",
          emoji: "❓",
        };
    }
  };

  const priorityConfig = getPriorityConfig(watchedPriority || "MEDIUM");
  const statusConfig = getStatusConfig(watchedStatus || "INCOMPLETE");

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg sm:max-w-xl lg:max-w-2xl "
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="relative overflow-hidden bg-white border-0 shadow-2xl">
              {/* Dynamic Header */}
              <CardHeader
                className={`relative ${
                  isEditing
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-gradient-to-r from-green-500 to-blue-600"
                } text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      {isEditing ? (
                        <Edit3 className="w-6 h-6" />
                      ) : (
                        <Plus className="w-6 h-6" />
                      )}
                    </motion.div>
                    <CardTitle className="text-xl">
                      {isEditing ? "Chỉnh sửa nhiệm vụ" : "Tạo nhiệm vụ mới"}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClose}
                    className="text-white transition-colors hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {isEditing && task && (
                  <motion.p
                    className="mt-2 text-sm text-white/80"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    📝 {task.title}
                  </motion.p>
                )}
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <motion.div
                      className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <span>⚠️</span>
                      {error}
                    </motion.div>
                  )}

                  {/* Title Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Label
                      htmlFor="title"
                      className="flex items-center gap-2 mb-2 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4 text-blue-500" />
                      Tiêu đề *
                    </Label>
                    <Input
                      id="title"
                      {...register("title")}
                      placeholder="Nhập tiêu đề nhiệm vụ..."
                      className="transition-colors border-2 focus:border-blue-500"
                    />
                    {errors.title && (
                      <motion.p
                        className="flex items-center gap-1 mt-1 text-sm text-red-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <span>❌</span>
                        {errors.title.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Description Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label
                      htmlFor="description"
                      className="flex items-center gap-2 mb-2 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4 text-green-500" />
                      Mô tả
                    </Label>
                    <textarea
                      id="description"
                      {...register("description")}
                      placeholder="Nhập mô tả chi tiết..."
                      className="w-full p-3 border-2 rounded-md min-h-[100px] resize-none focus:border-green-500 transition-colors"
                    />
                  </motion.div>

                  {/* Priority and Status Fields Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    {/* Priority Field */}
                    <div>
                      <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
                        {priorityConfig.icon}
                        <span className="text-orange-500">Độ ưu tiên</span>
                      </Label>
                      <div className="space-y-3">
                        <select
                          {...register("priority")}
                          className="w-full p-3 transition-colors border-2 rounded-md focus:border-orange-500"
                        >
                          <option value="LOW">🔵 Thấp</option>
                          <option value="MEDIUM">🟡 Trung bình</option>
                          <option value="HIGH">🔴 Cao</option>
                        </select>
                        <motion.div
                          className={`p-3 rounded-lg ${priorityConfig.bg} border-2 min-h-[60px] flex items-center`}
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center w-full gap-2 text-sm font-medium">
                            {priorityConfig.icon}
                            <span>Độ ưu tiên: {priorityConfig.text}</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Status Field */}
                    <div>
                      <Label className="flex items-center gap-2 mb-2 text-sm font-medium">
                        <Target className="w-4 h-4 text-purple-500" />
                        <span className="text-purple-500">Trạng thái</span>
                      </Label>
                      <div className="space-y-3">
                        <select
                          {...register("status")}
                          className="w-full p-3 transition-colors border-2 rounded-md focus:border-purple-500"
                        >
                          <option value="INCOMPLETE">📋 Chưa làm</option>
                          <option value="IN_PROGRESS">🔄 Đang làm</option>
                          <option value="COMPLETED">✅ Đã làm</option>
                        </select>
                        <motion.div
                          className="p-3 rounded-lg bg-purple-50 border-2 border-purple-200 min-h-[60px] flex items-center"
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center w-full gap-2 text-sm font-medium">
                            <span className="text-lg">
                              {statusConfig.emoji}
                            </span>
                            <span>Trạng thái: {statusConfig.text}</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Estimate Time Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label
                      htmlFor="estimateMinutes"
                      className="flex items-center gap-2 mb-2 text-sm font-medium"
                    >
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span className="text-indigo-500">
                        Thời gian ước tính (phút)
                      </span>
                    </Label>
                    <Input
                      id="estimateMinutes"
                      type="number"
                      {...register("estimateMinutes", { valueAsNumber: true })}
                      placeholder="Ví dụ: 60"
                      className="transition-colors border-2 focus:border-indigo-500"
                    />
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    className="flex gap-3 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1 border-2"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className={`flex-1 ${
                        isEditing
                          ? priorityConfig.color
                          : "bg-gradient-to-r from-green-500 to-blue-600"
                      } hover:shadow-lg transition-all duration-200`}
                    >
                      <motion.div
                        className="flex items-center gap-2"
                        animate={loading ? { x: [0, 5, 0] } : {}}
                        transition={{
                          repeat: loading ? Infinity : 0,
                          duration: 0.5,
                        }}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {loading
                          ? "Đang xử lý..."
                          : isEditing
                          ? "Cập nhật"
                          : "Tạo mới"}
                      </motion.div>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TaskDialog;
