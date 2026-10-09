export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  block?: string;
}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  group?: 'NATURAL' | 'SOCIAL';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
