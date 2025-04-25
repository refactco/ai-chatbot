import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';
import Script from 'next/script';

export const experimental_ppr = true;

// Mock user session for authentication bypass
const mockSession = {
  user: {
    id: 'admin',
    email: 'admin@admin.com',
    name: 'Admin'
  },
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString() // 7 days from now
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use mock session instead of real auth
  // const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const cookieStore = await cookies();
  const session = mockSession;
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
