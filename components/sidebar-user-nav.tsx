/**
 * Sidebar User Navigation Component
 *
 * This component displays the current user profile and provides account-related actions.
 * Features:
 * - Shows user avatar and email in the sidebar footer
 * - Provides a dropdown menu with user-related actions
 * - Includes theme toggling functionality
 * - Provides sign out capability with success notification
 * - Mobile-responsive design
 *
 * Used in the sidebar footer to give users quick access to account settings
 * and personalization options.
 */

'use client';
import { ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { toast } from 'sonner';

// Mocked user type
interface MockUser {
  email: string;
  name?: string;
  image?: string;
}

export function SidebarUserNav({ user }: { user: MockUser }) {
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  // Mock sign out function
  const handleSignOut = () => {
    // Add any cleanup logic here (clear local storage, cookies, etc.)
    toast.success('Signed out successfully');

    // Redirect to home page
    setTimeout(() => {
      router.push('/');
      router.refresh();
    }, 1000);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <Image
                src={user.image || `https://avatar.vercel.sh/${user.email}`}
                alt={user.email ?? 'User Avatar'}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="truncate">{user?.email}</span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
