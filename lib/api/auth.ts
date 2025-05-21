import { apiClient } from './client';
import { AuthResponse, LoginFormData, RegisterFormData, User } from '@/types';

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post('/auth/local', {
      identifier: email,
      password,
    });
    return response.data;
  } catch {
    throw new Error('Invalid email or password');
  }
}

export async function register(email: string, password: string, username: string): Promise<AuthResponse> {
  try {
    const response = await apiClient.post('/auth/local/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch {
    throw new Error('Registration failed. Please try again.');
  }
}

export async function logout() {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // Ignore logout errors
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch {
    throw new Error('Failed to get user data');
  }
}

export function storeToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt');
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt');
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
} 