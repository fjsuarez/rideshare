export class ApiError extends Error {
    status: number;
    data: any;
  
    constructor(message: string, status = 500, data?: any) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.data = data;
    }
    
    static fromError(error: any): ApiError {
      if (error.response) {
        return new ApiError(
          error.response.data?.message || 'API request failed',
          error.response.status,
          error.response.data
        );
      }
      return new ApiError(error.message || 'Network error');
    }
  }