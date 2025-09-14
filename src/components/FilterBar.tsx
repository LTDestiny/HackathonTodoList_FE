import React from "react";
import type { Task } from "@/types";

interface FilterBarProps {
  selectedStatus: Task["status"] | "ALL";
  selectedPriority: Task["priority"] | "ALL";
  selectedCategory: string;
  showOverdueOnly: boolean;
  categories: Array<{ id: string; name: string }>;
  onStatusChange: (status: Task["status"] | "ALL") => void;
  onPriorityChange: (priority: Task["priority"] | "ALL") => void;
  onCategoryChange: (categoryId: string) => void;
  onOverdueToggle: () => void;
  onClearFilters: () => void;
  searchTerm: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedStatus,
  selectedPriority,
  selectedCategory,
  showOverdueOnly,
  categories,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onOverdueToggle,
  onClearFilters,
  searchTerm,
}) => {
  const hasActiveFilters =
    selectedStatus !== "ALL" ||
    selectedPriority !== "ALL" ||
    selectedCategory !== "ALL" ||
    showOverdueOnly ||
    searchTerm;

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start lg:items-center">
        {/* Status Filters */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-800">
              Trạng thái
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onStatusChange("ALL")}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedStatus === "ALL"
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => onStatusChange("INCOMPLETE")}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedStatus === "INCOMPLETE"
                  ? "bg-gray-600 text-white border-gray-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              }`}
            >
              <span className="hidden md:inline">📋 Chưa làm</span>
              <span className="md:hidden">📋</span>
            </button>
            <button
              onClick={() => onStatusChange("IN_PROGRESS")}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedStatus === "IN_PROGRESS"
                  ? "bg-amber-500 text-white border-amber-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300"
              }`}
            >
              <span className="hidden md:inline">🔄 Đang làm</span>
              <span className="md:hidden">🔄</span>
            </button>
            <button
              onClick={() => onStatusChange("COMPLETED")}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedStatus === "COMPLETED"
                  ? "bg-green-500 text-white border-green-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-green-50 hover:border-green-300"
              }`}
            >
              <span className="hidden md:inline">✅ Đã làm</span>
              <span className="md:hidden">✅</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-16 bg-gray-300"></div>

        {/* Special Filters */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-800">
              Đặc biệt
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onOverdueToggle}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                showOverdueOnly
                  ? "bg-red-500 text-white border-red-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300"
              }`}
            >
              <span className="hidden md:inline">⚠️ Quá hạn</span>
              <span className="md:hidden">⚠️</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-16 bg-gray-300"></div>

        {/* Priority Filters */}
        <div className="flex flex-col gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-800">
              Độ ưu tiên
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onPriorityChange("ALL")}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedPriority === "ALL"
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => onPriorityChange("HIGH")}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedPriority === "HIGH"
                  ? "bg-red-500 text-white border-red-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-300"
              }`}
            >
              <span className="hidden md:inline">🔴 Cao</span>
              <span className="md:hidden">🔴</span>
            </button>
            <button
              onClick={() => onPriorityChange("MEDIUM")}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedPriority === "MEDIUM"
                  ? "bg-amber-500 text-white border-amber-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300"
              }`}
            >
              <span className="hidden md:inline">🟡 Trung bình</span>
              <span className="md:hidden">🟡</span>
            </button>
            <button
              onClick={() => onPriorityChange("LOW")}
              className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition-all duration-200 ${
                selectedPriority === "LOW"
                  ? "bg-blue-500 text-white border-blue-500 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              <span className="hidden md:inline">🔵 Thấp</span>
              <span className="md:hidden">🔵</span>
            </button>
          </div>
        </div>

        {/* Category and Actions */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:ml-auto items-start lg:items-center">
          {categories.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-800">
                  Danh mục
                </span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium min-w-[120px]"
              >
                <option value="ALL">Tất cả</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-800">
                  Thao tác
                </span>
              </div>
              <button
                onClick={onClearFilters}
                className="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all duration-200 font-medium border-2 border-red-200 hover:border-red-300"
              >
                🗑️ Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
