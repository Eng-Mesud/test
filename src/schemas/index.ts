// src/schemas/index.ts

/** Backend Response Interfaces **/
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ApiErrorResponse {
  success: boolean;
  errorCode: string;
  message: string;
  validationErrors?: Record<string, string[]>;
}

/** Filter Interfaces **/
export interface BaseFilters {
  page: number;
  pageSize: number;
  search?: string;
}

