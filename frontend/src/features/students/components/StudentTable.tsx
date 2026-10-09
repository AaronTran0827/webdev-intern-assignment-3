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
  const [pageInput, setPageInput] = React.useState<string>(
    pagination?.page ? String(pagination.page) : '1'
  );

  React.useEffect(() => {
    if (pagination?.page) {
      setPageInput(String(pagination.page));
    }
  }, [pagination?.page]);

  const handlePageInputSubmit = () => {
    const pageNum = parseInt(pageInput, 10);
    if (!isNaN(pageNum) && pagination) {
      const targetPage = Math.max(1, Math.min(pageNum, pagination.totalPages));
      if (targetPage !== pagination.page) {
        onPageChange(targetPage);
      } else {
        setPageInput(String(targetPage));
      }
    } else if (pagination) {
      setPageInput(String(pagination.page));
    }
  };

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
                              A00: <b>{student.combinations.groupA ?? 0}</b>
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                              A01: <b>{student.combinations.groupA1 ?? 0}</b>
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              B00: <b>{student.combinations.groupB ?? 0}</b>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              C00: <b>{student.combinations.groupC ?? 0}</b>
                            </span>
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                              D01: <b>{student.combinations.groupD ?? 0}</b>
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
            <div className="flex items-center space-x-1 text-xs text-slate-600 mr-1">
              <span>Trang</span>
              <input
                type="number"
                min={1}
                max={pagination.totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handlePageInputSubmit();
                  }
                }}
                onBlur={handlePageInputSubmit}
                className="w-20 px-2 py-1 text-center font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] shadow-2xs"
                title="Nhập số trang và ấn Enter để chuyển trang"
              />
              <span className="text-slate-500 font-medium">
                / <b className="text-slate-900 font-mono">{pagination.totalPages.toLocaleString()}</b>
              </span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={!pagination.hasPrevPage}
                title="Trang trước"
                className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!pagination.hasNextPage}
                title="Trang sau"
                className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
