import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 bg-[var(--color-header-bg)] text-[var(--color-header-text)] px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-black tracking-wide text-white">G-Scores</h1>
        <span className="text-xs bg-white/15 px-2.5 py-0.5 rounded-full font-medium text-blue-100">
          Hệ Thống Quản Lý Điểm Thi THPT 2024
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-xs text-blue-100/80 font-medium">
          <span className="bg-white/10 px-2.5 py-1 rounded">API Connected</span>
          <span className="bg-white/10 px-2.5 py-1 rounded">Prisma + Express</span>
        </div>

        <div className="flex items-center space-x-2 border-l border-white/20 pl-4">
          <div className="w-8 h-8 rounded-full bg-white text-[var(--color-header-bg)] flex items-center justify-center font-bold text-xs">
            GO
          </div>
          <span className="text-xs font-semibold hidden lg:inline">Admin</span>
        </div>
      </div>
    </header>
  );
};
