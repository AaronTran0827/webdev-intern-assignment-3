import React from 'react';
import { StudentDTO } from '../../../types/student';
import { PaginationMeta } from '../../../types/api';
import { Eye, Edit3, Trash2, ChevronLeft, ChevronRight, Hash } from 'lucide-react';

interface StudentTableProps {
  students: StudentDTO[];
  pagination?: PaginationMeta;
  isLoading?: boolean;
  onView: (student: StudentDTO) => void;
  onEdit: (student: StudentDTO) => void;
  onDelete: (student: StudentDTO) => void;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  pagination,
  isLoading = false,
  onView,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden p-6 space-y-4 shadow-sm">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3.5 px-5">SBD</th>
              <th className="py-3.5 px-5">Nhóm Khối</th>
              <th className="py-3.5 px-4 text-center">Toán</th>
              <th className="py-3.5 px-4 text-center">Văn</th>
              <th className="py-3.5 px-4 text-center">Anh</th>
              <th className="py-3.5 px-4 text-center">ĐTB</th>
              <th className="py-3.5 px-5 text-center">Tổ Hợp Nổi Bật</th>
              <th className="py-3.5 px-5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {students.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  Không tìm thấy học sinh nào trong cơ sở dữ liệu.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isNatural = student.group === 'NATURAL';
                return (
                  <tr
                    key={student.sbd}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* SBD */}
                    <td className="py-3 px-5 font-mono font-bold text-slate-900 flex items-center space-x-1.5">
                      <Hash className="w-3.5 h-3.5 text-slate-400" />
                      <span>{student.sbd}</span>
                    </td>

                    {/* Group Badge */}
                    <td className="py-3 px-5">
                      {isNatural ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Tự Nhiên
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          Xã Hội
                        </span>
                      )}
                    </td>

                    {/* Basic Scores */}
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {student.scores.toan ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {student.scores.nguVan ?? 0}
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {student.scores.ngoaiNgu ?? 0}
                    </td>

                    {/* Average Score */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-[var(--color-primary)] font-mono">
                        {student.averageScore ?? 0}
                      </span>
                    </td>

                    {/* Combinations */}
                    <td className="py-3 px-5 text-center">
                      <div className="flex items-center justify-center space-x-1.5 flex-wrap gap-y-1">
                        {isNatural ? (
                          <>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              A: <b>{student.combinations.groupA ?? 0}</b>
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              B: <b>{student.combinations.groupB ?? 0}</b>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              C: <b>{student.combinations.groupC ?? 0}</b>
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              D: <b>{student.combinations.groupD ?? 0}</b>
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => onView(student)}
                          title="Xem Chi Tiết"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(student)}
                          title="Chỉnh Sửa"
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(student)}
                          title="Xóa Thí Sinh"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-slate-600">
            <span>Hiển thị</span>
            <select
              value={pagination.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none"
            >
              <option value={10}>10 dòng</option>
              <option value={20}>20 dòng</option>
              <option value={50}>50 dòng</option>
            </select>
            <span>trong tổng số <b className="text-slate-900">{pagination.totalItems.toLocaleString()}</b> thí sinh</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-600 mr-2">
              Trang <b className="text-slate-900">{pagination.page}</b> / {pagination.totalPages}
            </span>
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
              className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
