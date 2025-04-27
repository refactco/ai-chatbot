'use client';

import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/services/api-service';

export const SignOutForm = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await apiService.auth.logout();
    router.push('/');
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleSignOut}
        className="w-full text-left px-1 py-0.5 text-red-500"
      >
        Sign out
      </button>
    </div>
  );
};
