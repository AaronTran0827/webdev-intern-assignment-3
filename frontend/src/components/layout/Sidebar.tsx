import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, BarChart3, PlusCircle } from 'lucide-react';

interface SidebarProps {
  onOpenCreateModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenCreateModal }) => {
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

  return (
    <aside className="w-60 bg-[var(--color-sidebar-bg)] border-r border-[var(--color-sidebar-border)] flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Menu Header */}
      <div className="p-6 border-b border-[var(--color-sidebar-border)]">
        <h2 className="text-base font-bold text-slate-900 tracking-wide uppercase">Menu</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
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
            onClick={onOpenCreateModal}
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
    </aside>
  );
};
