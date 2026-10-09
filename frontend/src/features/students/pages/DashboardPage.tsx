import React, { useEffect, useState, useCallback } from 'react';
import { studentApi } from '../../../services/studentApi';
import { StudentDTO, StudentInputDTO } from '../../../types/student';
import { PaginationMeta, StudentQueryParams } from '../../../types/api';
import { StudentTable } from '../components/StudentTable';
import { StudentFilters } from '../components/StudentFilters';
import { StudentDetailModal } from '../components/StudentDetailModal';
import { StudentFormModal } from '../components/StudentFormModal';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { ErrorState } from '../../../components/common/ErrorState';
import { Users, BookOpen, Award, PlusCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [students, setStudents] = useState<StudentDTO[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState<StudentQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'sbd',
    sortOrder: 'asc',
  });

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<StudentDTO | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDTO | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<StudentDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await studentApi.getStudents(queryParams);
      setStudents(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể tải danh sách thí sinh.');
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleFilterChange = (newParams: Partial<StudentQueryParams>) => {
    setQueryParams((prev) => ({ ...prev, ...newParams, page: newParams.page ?? 1 }));
  };

  const handleResetFilters = () => {
    setQueryParams({
      page: 1,
      limit: 10,
      sortBy: 'sbd',
      sortOrder: 'asc',
    });
  };

  const handleOpenDetail = (student: StudentDTO) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingStudent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: StudentDTO) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (student: StudentDTO) => {
    setDeletingStudent(student);
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await studentApi.deleteStudent(deletingStudent.sbd);
      setDeletingStudent(null);
      fetchStudents();
    } catch (err: any) {
      alert(err.message || 'Xóa thí sinh thất bại.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSubmit = async (data: StudentInputDTO) => {
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        await studentApi.updateStudent(editingStudent.sbd, data);
      } else {
        await studentApi.createStudent(data);
      }
      setIsFormOpen(false);
      fetchStudents();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Tổng Quan Thí Sinh
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Quản lý danh sách, tra cứu điểm và tổ hợp khối thi THPT 2024
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm Thí Sinh Mới</span>
        </button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-[var(--color-primary)] rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Tổng Thí Sinh CSDL</span>
            <p className="text-xl font-extrabold text-slate-900 font-mono">
              {pagination?.totalItems ? pagination.totalItems.toLocaleString() : '1,061,607'}
            </p>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Khối Tự Nhiên</span>
            <p className="text-sm font-bold text-emerald-700">Toán, Lý, Hóa, Sinh</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Khối Xã Hội</span>
            <p className="text-sm font-bold text-purple-700">Văn, Sử, Địa, GDCD</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">Thang Điểm Quy Chuẩn</span>
            <p className="text-sm font-bold text-amber-700">0.0 - 10.0 điểm</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <StudentFilters
        queryParams={queryParams}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Error state */}
      {errorMsg && <ErrorState message={errorMsg} onRetry={fetchStudents} />}

      {/* Student Data Table */}
      <StudentTable
        students={students}
        pagination={pagination}
        isLoading={isLoading}
        onView={handleOpenDetail}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onPageChange={(page) => handleFilterChange({ page })}
        onLimitChange={(limit) => handleFilterChange({ limit, page: 1 })}
      />

      {/* Modals */}
      <StudentDetailModal
        isOpen={isDetailOpen}
        student={selectedStudent}
        onClose={() => setIsDetailOpen(false)}
      />

      <StudentFormModal
        isOpen={isFormOpen}
        initialData={editingStudent}
        isLoading={isSubmitting}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={!!deletingStudent}
        title="Xác nhận xóa thí sinh"
        message={`Bạn có chắc chắn muốn xóa thông tin thí sinh có SBD: ${deletingStudent?.sbd}? Thao tác này không thể khôi phục.`}
        confirmLabel="Xóa Ngay"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingStudent(null)}
      />
    </div>
  );
};
