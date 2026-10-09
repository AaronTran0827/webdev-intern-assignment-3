import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, BarChart3, PlusCircle, X } from 'lucide-react';

interface SidebarProps {
  onOpenCreateModal?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onOpenCreateModal,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      to: '/search',
      label: 'Search Scores',
      icon: Search,
    },
    {
      to: '/report',
      label: 'Reports',
      icon: BarChart3,
    },
  ];

  const handleNavClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleCreateClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
    if (onOpenCreateModal) {
      onOpenCreateModal();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-sidebar-bg)]">
      {/* Menu Header */}
      <div className="p-5 sm:p-6 border-b border-[var(--color-sidebar-border)] flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase">Menu</h2>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-[var(--color-sidebar-active-bg)] text-[var(--color-sidebar-active-text)] shadow-sm'
                    : 'text-slate-700 hover:bg-[var(--color-sidebar-item-hover)] hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Action Button */}
      {onOpenCreateModal && (
        <div className="p-4 border-t border-[var(--color-sidebar-border)]">
          <button
            onClick={handleCreateClick}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm Thí Sinh</span>
          </button>
        </div>
      )}

      {/* System Badge Footer */}
      <div className="p-4 bg-slate-50 border-t border-[var(--color-sidebar-border)]">
        <div className="text-xs text-slate-500 font-medium space-y-0.5">
          <p className="font-semibold text-slate-700">Golden Owl Portal</p>
          <p>Fullstack JS Assignment</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible on md and up) */}
      <aside className="hidden md:flex w-60 border-r border-[var(--color-sidebar-border)] flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible when isOpenMobile is true on screens < md) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Container */}
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl z-50 flex flex-col">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
