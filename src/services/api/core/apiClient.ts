import axios, { AxiosInstance, CancelTokenSource } from 'axios';
import { ApiRequestOptions, ApiResponse } from './apiTypes';
import { ApiError } from './apiError';
import { getAuthToken } from '../../tokenService';

class ApiClient {
  private client: AxiosInstance;
  private cancelTokens: Map<string, CancelTokenSource> = new Map();
  
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async request<T = any>(endpoint: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    try {
      console.log(`Making ${options.method || 'GET'} request to ${endpoint}`);
      
      const response = await this.client({
        url: endpoint,
        method: options.method || 'GET',
        headers: options.headers,
        data: options.data,
        params: options.params,
        cancelToken: options.cancelToken
      });
      
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText
      };
    } catch (error: any) {
      console.error(
        `API request failed: ${endpoint}`,
        error.response?.status,
        error.response?.data
      );
      throw ApiError.fromError(error);
    }
  }
  
  async authenticatedRequest<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const token = getAuthToken();
    if (!token) {
      throw new ApiError('Authentication required', 401);
    }
    
    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: authHeader
      }
    });
  }
  
  createCancelToken(requestId: string): CancelTokenSource {
    // Cancel existing request with same ID if it exists
    if (this.cancelTokens.has(requestId)) {
      this.cancelTokens.get(requestId)?.cancel('Request superseded');
    }
    
    const source = axios.CancelToken.source();
    this.cancelTokens.set(requestId, source);
    return source;
  }
}

// Create a singleton instance with the base URL
const apiClient = new ApiClient('/api');
export default apiClient;