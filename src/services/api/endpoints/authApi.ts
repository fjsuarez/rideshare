import apiClient from '../core/apiClient';
import { UserProfile } from '../../models/userTypes';

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.request<AuthResponse>('/users/login', {
      method: 'POST',
      data: credentials
    });
    return response.data;
  },
  
  async signup(userData: SignupData): Promise<AuthResponse> {
    const response = await apiClient.request<AuthResponse>('/users/signup', {
      method: 'POST',
      data: userData
    });
    return response.data;
  },
  
};