import React from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isMobileMenuOpen = false,
  onToggleMobileMenu,
}) => {
  return (
    <header className="h-16 bg-[var(--color-header-bg)] text-[var(--color-header-text)] px-4 sm:px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg md:hidden transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}
        <h1 className="text-xl font-black tracking-wide text-white">G-Scores</h1>
        <span className="hidden sm:inline-block text-xs bg-white/15 px-2.5 py-0.5 rounded-full font-medium text-blue-100 truncate max-w-[200px] md:max-w-none">
          Hệ Thống Quản Lý Điểm Thi THPT 2024
        </span>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-xs text-blue-100/80 font-medium">
          <span className="bg-white/10 px-2.5 py-1 rounded">API Connected</span>
          <span className="bg-white/10 px-2.5 py-1 rounded">Prisma + Express</span>
        </div>

        <div className="flex items-center space-x-2 border-l border-white/20 pl-3 sm:pl-4">
          <div className="w-8 h-8 rounded-full bg-white text-[var(--color-header-bg)] flex items-center justify-center font-bold text-xs shadow-xs">
            GO
          </div>
          <span className="text-xs font-semibold hidden lg:inline">Admin</span>
        </div>
      </div>
    </header>
  );
};
