/**
 * Chat Layout Component
 *
 * This component provides the layout structure for all chat-related pages.
 * Features:
 * - Sidebar for navigation and user profile
 * - Responsive layout that can be toggled open/closed
 * - Pyodide integration for Python execution in the browser
 * - User context provider
 *
 * The layout wraps all chat pages and ensures consistent UI across the chat section.
 */

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
      {/* Load Pyodide for Python code execution in browser */}
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />

      {/* Sidebar context provider with navigation */}
      <SidebarProvider defaultOpen={isOpen}>
        <AppSidebar user={mockUser} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </>
  );
}
