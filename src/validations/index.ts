// Re-export all validation schemas and types
export * from "./auth";
export * from "./task";
export * from "./category";

// Common validation utilities
import { z } from "zod";

// Common field validations
export const commonValidations = {
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  requiredString: (fieldName: string) =>
    z.string().min(1, `${fieldName} không được để trống`),
  optionalString: z.string().optional(),
  positiveNumber: (fieldName: string) =>
    z.number().min(1, `${fieldName} phải lớn hơn 0`),
  optionalPositiveNumber: (fieldName: string) =>
    z.number().min(1, `${fieldName} phải lớn hơn 0`).optional(),
};

// Validation error handler
export const handleValidationError = (error: z.ZodError) => {
  const formattedErrors: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formattedErrors[path] = err.message;
  });

  return formattedErrors;
};

// Generic validation wrapper
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } => {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: handleValidationError(result.error),
  };
};
