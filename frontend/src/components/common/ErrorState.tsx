import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Đã có lỗi xảy ra khi tải dữ liệu',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-3 my-4">
      <div className="p-2.5 bg-rose-100 rounded-full text-rose-600">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-rose-900">Lỗi kết nối</h4>
        <p className="text-xs text-rose-700 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Thử lại
        </button>
      )}
    </div>
  );
};
