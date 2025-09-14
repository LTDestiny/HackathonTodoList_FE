import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { isBefore } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/SearchInput";
import FilterBar from "@/components/FilterBar";
import TaskList from "@/components/TaskList";
import TaskDialog from "@/components/TaskDialog";
import Pagination from "@/components/Pagination";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { fetchTasks, updateTaskAsync, deleteTask } from "@/store/tasksSlice";
import { fetchCategories } from "@/store/categoriesSlice";
import type { Task } from "@/types";

const TasksPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const { categories } = useAppSelector((state) => state.categories);
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<Task["status"] | "ALL">(
    "ALL"
  );
  const [selectedPriority, setSelectedPriority] = useState<
    Task["priority"] | "ALL"
  >("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    dispatch(fetchTasks({ limit: 100 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle URL parameters for filtering
  useEffect(() => {
    const statusParam = searchParams.get("status");
    const priorityParam = searchParams.get("priority");
    const typeParam = searchParams.get("type");

    if (
      statusParam &&
      ["COMPLETED", "IN_PROGRESS", "INCOMPLETE"].includes(statusParam)
    ) {
      setSelectedStatus(statusParam as Task["status"]);
    }

    if (priorityParam && ["HIGH", "MEDIUM", "LOW"].includes(priorityParam)) {
      setSelectedPriority(priorityParam as Task["priority"]);
    }

    // Handle special type filters
    if (typeParam === "overdue") {
      setShowOverdueOnly(true);
    }
  }, [searchParams]);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || task.status === selectedStatus;
    const matchesPriority =
      selectedPriority === "ALL" || task.priority === selectedPriority;
    const matchesCategory =
      selectedCategory === "ALL" || task.categoryId === selectedCategory;

    // Check for overdue filter
    let matchesOverdue = true;
    if (showOverdueOnly) {
      const isOverdue =
        task.deadlineAt &&
        isBefore(new Date(task.deadlineAt), new Date()) &&
        task.status !== "COMPLETED";
      matchesOverdue = !!isOverdue;
    }

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory &&
      matchesOverdue
    );
  });

  // Pagination calculations
  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedTasks = filteredTasks.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedStatus,
    selectedPriority,
    selectedCategory,
    showOverdueOnly,
  ]);

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

      // Reload tasks
      dispatch(fetchTasks({ limit: 100 }));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowTaskDialog(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();

      // Reload tasks
      dispatch(fetchTasks({ limit: 100 }));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleOverdueToggle = () => {
    const newOverdueState = !showOverdueOnly;
    setShowOverdueOnly(newOverdueState);
    setCurrentPage(1); // Reset to first page when changing filter

    if (newOverdueState) {
      setSelectedStatus("ALL");
      setSelectedPriority("ALL");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("ALL");
    setSelectedPriority("ALL");
    setSelectedCategory("ALL");
    setShowOverdueOnly(false);
    setCurrentPage(1);
  };

  // Helper functions để reset trang khi thay đổi filter
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: Task["status"] | "ALL") => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handlePriorityFilterChange = (priority: Task["priority"] | "ALL") => {
    setSelectedPriority(priority);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <CardTitle className="text-lg sm:text-xl">
              Quản lý nhiệm vụ
            </CardTitle>
            <Button
              onClick={() => setShowTaskDialog(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Thêm nhiệm vụ mới</span>
              <span className="sm:hidden">Thêm mới</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-6">
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm nhiệm vụ..."
            />

            <FilterBar
              selectedStatus={selectedStatus}
              selectedPriority={selectedPriority}
              selectedCategory={selectedCategory}
              showOverdueOnly={showOverdueOnly}
              categories={categories}
              onStatusChange={handleStatusFilterChange}
              onPriorityChange={handlePriorityFilterChange}
              onCategoryChange={handleCategoryFilterChange}
              onOverdueToggle={handleOverdueToggle}
              onClearFilters={clearFilters}
              searchTerm={searchTerm}
            />
          </div>

          <TaskList
            displayedTasks={displayedTasks}
            filteredTasks={filteredTasks}
            loading={loading}
            searchTerm={searchTerm}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </CardContent>
      </Card>

      <TaskDialog
        open={showTaskDialog}
        task={editingTask}
        onOpenChange={(open) => {
          setShowTaskDialog(open);
          if (!open) {
            setEditingTask(null);
          }
        }}
        onSuccess={() => {
          dispatch(fetchTasks({ limit: 100 }));
          setEditingTask(null);
          setShowTaskDialog(false);
        }}
      />
    </div>
  );
};

export default TasksPage;
