import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppLayoutProps {
  children?: React.ReactNode;
  onOpenCreateModal?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onOpenCreateModal }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-app-bg)] text-[var(--color-text-main)] font-sans antialiased">
      {/* Top Banner Header */}
      <Header />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar Menu */}
        <Sidebar onOpenCreateModal={onOpenCreateModal} />

        {/* Content Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
