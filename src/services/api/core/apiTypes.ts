export interface ApiRequestOptions {
    method?: string;
    headers?: Record<string, string>;
    data?: any;
    params?: Record<string, any>;
    cancelToken?: any;
  }
  
  export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
  }