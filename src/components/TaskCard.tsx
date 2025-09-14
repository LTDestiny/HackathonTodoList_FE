import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  Flag,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  Play,
  Edit3,
  Trash2,
} from "lucide-react";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { vi } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";

interface TaskCardProps {
  task: Task;
  showCategory?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: Task["status"]) => Promise<void>;
  onClick?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  showCategory = false,
  onEdit,
  onDelete,
  onClick,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityText = (priority: Task["priority"]) => {
    switch (priority) {
      case "HIGH":
        return "Cao";
      case "MEDIUM":
        return "Trung bình";
      case "LOW":
        return "Thấp";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "IN_PROGRESS":
        return <Play className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: Task["status"]) => {
    switch (status) {
      case "COMPLETED":
        return "Hoàn thành";
      case "IN_PROGRESS":
        return "Đang làm";
      case "INCOMPLETE":
        return "Chưa làm";
      default:
        return "Không xác định";
    }
  };

  const isOverdue =
    task.deadlineAt &&
    isBefore(new Date(task.deadlineAt), new Date()) &&
    task.status !== "COMPLETED";
  const isDueSoon =
    task.deadlineAt &&
    isAfter(new Date(task.deadlineAt), new Date()) &&
    isBefore(new Date(task.deadlineAt), addDays(new Date(), 1));

  const handleCardClick = () => {
    if (onClick) {
      onClick(task);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`relative overflow-hidden cursor-pointer transition-shadow hover:shadow-lg h-full ${
          isOverdue
            ? "border-red-300 bg-red-50"
            : isDueSoon
            ? "border-yellow-300 bg-yellow-50"
            : ""
        }`}
        onClick={handleCardClick}
      >
        <CardContent className="flex flex-col h-full p-3 sm:p-4">
          <div className="flex items-start justify-between mb-auto">
            <div className="flex-1 min-w-0">
              <div className="flex items-center mb-2">
                <div className="flex-shrink-0 mr-2 transition-transform sm:mr-3">
                  {getStatusIcon(task.status)}
                </div>
                <h3
                  className={`font-medium text-sm leading-tight ${
                    task.status === "COMPLETED"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {task.title}
                </h3>
              </div>

              {/* Description with fixed height to ensure consistent spacing */}
              <div className="mb-2 sm:mb-3 min-h-[2.5rem]">
                {task.description && (
                  <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mb-2 sm:gap-2 sm:mb-3">
                <Badge
                  variant="secondary"
                  className={`${getPriorityColor(
                    task.priority
                  )} text-white text-xs px-2 py-1 pointer-events-none`}
                >
                  <Flag className="hidden w-3 h-3 mr-1 sm:inline" />
                  <span className="sm:hidden">
                    {task.priority === "HIGH"
                      ? "🔴"
                      : task.priority === "MEDIUM"
                      ? "🟡"
                      : "🔵"}
                  </span>
                  <span className="hidden sm:inline">
                    {getPriorityText(task.priority)}
                  </span>
                </Badge>

                <Badge variant="outline" className="px-2 py-1 text-xs">
                  <span className="hidden sm:inline">
                    {getStatusText(task.status)}
                  </span>
                  <span className="sm:hidden">
                    {task.status === "COMPLETED"
                      ? "✅"
                      : task.status === "IN_PROGRESS"
                      ? "🔄"
                      : "📋"}
                  </span>
                </Badge>

                {showCategory && task.category && (
                  <Badge
                    variant="outline"
                    className="px-2 py-1 text-xs truncate max-w-24 sm:max-w-none"
                    style={{
                      borderColor: task.category.color,
                      color: task.category.color,
                    }}
                  >
                    {task.category.name}
                  </Badge>
                )}
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div className="relative flex-shrink-0" ref={menuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 ml-1 sm:ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>

                {showMenu && (
                  <div className="absolute right-0 z-50 w-32 bg-white border border-gray-200 rounded-md shadow-lg top-8">
                    {onEdit && (
                      <button
                        className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(task);
                          setShowMenu(false);
                        }}
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Chỉnh sửa</span>
                        <span className="sm:hidden">Sửa</span>
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Bạn có chắc muốn xóa task này?")) {
                            onDelete(task.id);
                          }
                          setShowMenu(false);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Bottom section with fixed height for consistent layout */}
          <div className="mt-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground min-h-[1.5rem]">
              {task.deadlineAt && (
                <div
                  className={`flex items-center ${
                    isOverdue
                      ? "text-red-600"
                      : isDueSoon
                      ? "text-yellow-600"
                      : ""
                  }`}
                >
                  <Calendar className="flex-shrink-0 w-3 h-3 mr-1" />
                  <span className="truncate">
                    {format(new Date(task.deadlineAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </span>
                </div>
              )}

              {task.estimateMinutes && (
                <div className="flex items-center">
                  <Clock className="flex-shrink-0 w-3 h-3 mr-1" />
                  <span>
                    {task.estimateMinutes > 60
                      ? `${Math.floor(task.estimateMinutes / 60)}h ${
                          task.estimateMinutes % 60
                        }m`
                      : `${task.estimateMinutes}m`}
                  </span>
                </div>
              )}
            </div>
          </div>{" "}
          {isOverdue && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="destructive" className="text-xs">
                Quá hạn
              </Badge>
            </div>
          )}
          {isDueSoon && !isOverdue && (
            <div className="absolute bottom-2 right-2">
              <Badge className="text-xs text-white bg-yellow-500">
                Sắp hết hạn
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
