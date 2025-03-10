import { getAuthToken } from './tokenService';

const API_BASE_URL = '/api';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  token?: string | null;
}

export async function apiRequest(
  endpoint: string, 
  options: ApiRequestOptions = {}
) {
  const { 
    method = 'GET',
    data = undefined,
    token = null
  } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (data) {
    config.body = JSON.stringify(data);
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred');
  }
  
  return response.json();
}

// Authentication specific endpoints
export async function login(email: string, password: string) {
  return apiRequest('/users/login', {
    method: 'POST',
    data: { email, password }
  });
}

export async function signup(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) {
  console.log('Sending signup request with data:', userData);
  return apiRequest('/users/signup', {
    method: 'POST',
    data: userData
  });
}

// Authenticated request helper
export async function authenticatedRequest(
  endpoint: string,
  options: Omit<ApiRequestOptions, 'token'> = {}
) {
  const token = getAuthToken();
  return apiRequest(endpoint, { ...options, token });
}

// User-related endpoints (using the authenticated request abstraction)
export async function createUserProfile(userData: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) {
  return authenticatedRequest('/users/profile', {
    method: 'POST',
    data: userData
  });
}

export async function getUserProfile() {
  return authenticatedRequest('/users/profile');
}

export async function updateUserProfile(userData: any) {
  return authenticatedRequest('/users/profile', {
    method: 'PUT',
    data: userData
  });
}