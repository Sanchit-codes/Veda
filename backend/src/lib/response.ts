export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data, timestamp: new Date().toISOString() };
}

export function failure(error: string): ApiResponse<null> {
  return { success: false, error, timestamp: new Date().toISOString() };
}
