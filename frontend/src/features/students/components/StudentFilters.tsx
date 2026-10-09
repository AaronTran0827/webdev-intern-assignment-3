import React from 'react';
import { ArrowUpDown, RefreshCw } from 'lucide-react';
import { StudentQueryParams } from '../../../types/api';

interface StudentFiltersProps {
  queryParams: StudentQueryParams;
  onChange: (newParams: Partial<StudentQueryParams>) => void;
  onReset: () => void;
}

export const StudentFilters: React.FC<StudentFiltersProps> = ({
  queryParams,
  onChange,
  onReset,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
      {/* Stream Group Filter Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
        <button
          onClick={() => onChange({ group: undefined, page: 1 })}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            !queryParams.group
              ? 'bg-[var(--color-primary)] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tất Cả Thí Sinh
        </button>
        <button
          onClick={() => onChange({ group: 'NATURAL', page: 1 })}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            queryParams.group === 'NATURAL'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Khối Tự Nhiên
        </button>
        <button
          onClick={() => onChange({ group: 'SOCIAL', page: 1 })}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
            queryParams.group === 'SOCIAL'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Khối Xã Hội
        </button>
      </div>

      {/* Sorting & Reset Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-medium">Sắp xếp:</span>
          <select
            value={queryParams.sortBy || 'sbd'}
            onChange={(e) => onChange({ sortBy: e.target.value })}
            className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="sbd">SBD</option>
            <option value="toan">Điểm Toán</option>
            <option value="nguVan">Điểm Văn</option>
            <option value="ngoaiNgu">Điểm Ngoại Ngữ</option>
          </select>
          <select
            value={queryParams.sortOrder || 'asc'}
            onChange={(e) => onChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
            className="bg-transparent text-slate-900 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="asc">Tăng dần ⬆</option>
            <option value="desc">Giảm dần ⬇</option>
          </select>
        </div>

        <button
          onClick={onReset}
          title="Đặt lại bộ lọc"
          className="p-2 text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
