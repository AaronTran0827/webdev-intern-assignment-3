import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Không tìm thấy dữ liệu',
  description = 'Chưa có thông tin học sinh nào khớp với điều kiện tìm kiếm.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
      <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl text-slate-400">
        <Inbox className="w-10 h-10" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-slate-200">{title}</h4>
        <p className="text-sm text-slate-400 max-w-sm">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
