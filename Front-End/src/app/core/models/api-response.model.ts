export interface Paginated<T> {
  total: number;
  page: number;
  limit: number;
  [key: string]: T[] | number;
}

export interface ApiError {
  status: string;
  statusCode: number;
  message: string;
  error?: unknown;
}
