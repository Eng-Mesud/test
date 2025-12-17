import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
// src/lib/utils.ts
// src/lib/utils.ts
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import type { ApiErrorResponse } from "@/schemas";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function handleServerErrors<T extends FieldValues>(
  error: any,
  setError: UseFormSetError<T>
) {
  const apiError = error as ApiErrorResponse;

  if (apiError.validationErrors) {
    Object.entries(apiError.validationErrors).forEach(([field, messages]) => {
      // Backend uses PascalCase (e.g. "Username"), Frontend uses camelCase ("username")
      const fieldName = (field.charAt(0).toLowerCase() + field.slice(1)) as Path<T>;

      setError(fieldName, {
        type: "server",
        message: messages[0],
      });
    });
  }
}