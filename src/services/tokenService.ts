const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const setUserData = (userData: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserData = (): any | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const removeUserData = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const clearAuth = (): void => {
  removeAuthToken();
  removeUserData();
};