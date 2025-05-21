import { redirect } from 'next/navigation';
import { getMe } from '@/lib/api/auth';

export async function protectRoute() {
  try {
    await getMe();
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Auth error:', err.message);
    }
    redirect('/auth/login');
  }
}

export function withAuth(Component: any) {
  return function AuthProtected(props: any) {
    // This will run on the client side only
    protectRoute();
    
    return Component(props);
  };
} 