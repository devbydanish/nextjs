import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as apiLogin, register as apiRegister, getMe } from '@/lib/api/auth';
import { User, AuthResponse } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiLogin(email, password);
          set({ 
            user: response.user,
            token: response.jwt,
            isLoading: false,
            error: null
          });
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
          set({ 
            isLoading: false,
            error: errorMessage
          });
          throw new Error(errorMessage);
        }
      },
      
      register: async (email: string, password: string, username: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiRegister(email, password, username);
          set({ 
            user: response.user,
            token: response.jwt,
            isLoading: false,
            error: null
          });
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
          set({ 
            isLoading: false,
            error: errorMessage
          });
          throw new Error(errorMessage);
        }
      },
      
      logout: () => {
        set({ 
          user: null,
          token: null,
          error: null
        });
      },
      
      checkAuth: async () => {
        try {
          const user = await getMe();
          set({ user });
        } catch {
          set({ 
            user: null,
            token: null,
            error: 'Session expired. Please login again.'
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user
      })
    }
  )
); 