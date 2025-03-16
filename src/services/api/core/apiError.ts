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
      const errorMessage = 
        error.response.data?.detail || 
        error.response.data?.message ||
        (typeof error.response.data === 'string' ? error.response.data : null) ||
        'API request failed';
        
      return new ApiError(
        errorMessage,
        error.response.status,
        error.response.data
      );
    }
        
    return new ApiError(error.message || 'Network error');
  }
}