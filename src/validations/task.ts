import { z } from "zod";

// Task validation schemas
export const taskSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  status: z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]).optional(),
  deadlineAt: z.string().optional(),
  estimateMinutes: z
    .number()
    .min(1, "Thời gian ước tính phải lớn hơn 0")
    .optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống").optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  status: z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]).optional(),
  deadlineAt: z.string().optional(),
  estimateMinutes: z
    .number()
    .min(1, "Thời gian ước tính phải lớn hơn 0")
    .optional(),
});

export const taskStatusUpdateSchema = z.object({
  status: z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]),
});

// Task query/filter validation
export const taskQuerySchema = z.object({
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]).optional(),
  status: z.enum(["INCOMPLETE", "IN_PROGRESS", "COMPLETED"]).optional(),
  sortBy: z
    .enum(["createdAt", "updatedAt", "deadlineAt", "priority", "title"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Type inference
export type TaskFormData = z.infer<typeof taskSchema>;
export type TaskUpdateFormData = z.infer<typeof taskUpdateSchema>;
export type TaskStatusUpdateData = z.infer<typeof taskStatusUpdateSchema>;
export type TaskQueryData = z.infer<typeof taskQuerySchema>;

// Utility functions for task validation
export const validateTaskForm = (data: unknown) => {
  return taskSchema.safeParse(data);
};

export const validateTaskUpdate = (data: unknown) => {
  return taskUpdateSchema.safeParse(data);
};

export const validateTaskQuery = (data: unknown) => {
  return taskQuerySchema.safeParse(data);
};
