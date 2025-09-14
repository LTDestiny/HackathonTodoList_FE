import { z } from "zod";

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống"),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Màu sắc không hợp lệ (định dạng: #RRGGBB)")
    .optional()
    .default("#3B82F6"),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1, "Tên danh mục không được để trống").optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Màu sắc không hợp lệ (định dạng: #RRGGBB)")
    .optional(),
});

// Type inference
export type CategoryFormData = z.infer<typeof categorySchema>;
export type CategoryUpdateFormData = z.infer<typeof categoryUpdateSchema>;

// Utility functions for category validation
export const validateCategoryForm = (data: unknown) => {
  return categorySchema.safeParse(data);
};

export const validateCategoryUpdate = (data: unknown) => {
  return categoryUpdateSchema.safeParse(data);
};

// Color validation helper
export const isValidHexColor = (color: string): boolean => {
  return /^#[0-9A-F]{6}$/i.test(color);
};

// Predefined colors for categories
export const CATEGORY_COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F97316", // Orange
  "#6B7280", // Gray
] as const;
