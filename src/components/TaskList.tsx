import React from "react";
import TaskCard from "./TaskCard";
import { StaggerContainer, StaggerItem } from "./PageTransition";
import type { Task } from "@/types";

interface TaskListProps {
  displayedTasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  searchTerm: string;
  onStatusChange: (taskId: string, status: Task["status"]) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({
  displayedTasks,
  filteredTasks,
  loading,
  searchTerm,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Stats */}
      <div className="mb-4 text-sm text-gray-600">
        Hiển thị {displayedTasks.length} / {filteredTasks.length} nhiệm vụ
        {searchTerm && ` (tìm kiếm: "${searchTerm}")`}
      </div>

      {/* Tasks Grid */}
      {displayedTasks.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          {filteredTasks.length === 0 ? (
            <div>
              <p className="mb-2 text-base sm:text-lg">
                Không tìm thấy nhiệm vụ nào
              </p>
              <p className="text-sm">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm</p>
            </div>
          ) : (
            <div>
              <p className="mb-2 text-base sm:text-lg">Chưa có nhiệm vụ nào</p>
              <p className="text-sm">Tạo nhiệm vụ đầu tiên của bạn!</p>
            </div>
          )}
        </div>
      ) : (
        <StaggerContainer>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {displayedTasks.map((task) => (
              <StaggerItem key={task.id}>
                <TaskCard
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                  onClick={onEdit}
                  showCategory={true}
                />
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      )}
    </>
  );
};

export default TaskList;
