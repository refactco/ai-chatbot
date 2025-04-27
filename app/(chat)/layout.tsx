'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import Script from 'next/script';

export const experimental_ppr = true;

// Mock user for development (to show SidebarUserNav)
const mockUser = {
  id: 'dev-user',
  email: 'dev@user.com',
  name: 'Dev User',
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Minimal state for toggling sidebar
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={isOpen}>
        <AppSidebar user={mockUser} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
