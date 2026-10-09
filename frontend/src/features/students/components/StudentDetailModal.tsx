import React from 'react';
import { StudentDTO } from '../../../types/student';
import { X, Hash, Award, CheckCircle2, BookOpen } from 'lucide-react';

interface StudentDetailModalProps {
  student: StudentDTO | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !student) return null;

  const isNatural = student.group === 'NATURAL';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="p-2 sm:p-2.5 bg-blue-50 text-[var(--color-primary)] rounded-lg shrink-0">
              <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-mono">{student.sbd}</h3>
                {isNatural ? (
                  <span className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Khối Tự Nhiên
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] sm:text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    Khối Xã Hội
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Mã Ngoại Ngữ: {student.maNgoaiNgu || 'N1'}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6">
          {/* Average & Overview Card */}
          <div className="p-3.5 sm:p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 text-amber-600 shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-600 block">Điểm Trung Bình</span>
                <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{student.averageScore ?? 0.0}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-slate-500 block">Trạng Thái</span>
              <p className="text-xs font-bold text-emerald-700 flex items-center space-x-1 justify-end mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Hoàn Thành</span>
              </p>
            </div>
          </div>

          {/* Scores Grid */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2.5 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
              <span>Điểm Thi Chi Tiết Các Môn</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <ScoreBadge label="Toán" value={student.scores.toan} />
              <ScoreBadge label="Ngữ Văn" value={student.scores.nguVan} />
              <ScoreBadge label="Ngoại Ngữ" value={student.scores.ngoaiNgu} />

              {isNatural ? (
                <>
                  <ScoreBadge label="Vật Lý" value={student.scores.vatLi} />
                  <ScoreBadge label="Hóa Học" value={student.scores.hoaHoc} />
                  <ScoreBadge label="Sinh Học" value={student.scores.sinhHoc} />
                </>
              ) : (
                <>
                  <ScoreBadge label="Lịch Sử" value={student.scores.lichSu} />
                  <ScoreBadge label="Địa Lý" value={student.scores.diaLi} />
                  <ScoreBadge label="GDCD" value={student.scores.gdcd} />
                </>
              )}
            </div>
          </div>

          {/* Combinations Total Scores */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2.5">Tổng Điểm Các Khối Xét Tuyển ĐH</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              {isNatural ? (
                <>
                  <CombinationBadge label="Khối A00 (Toán, Lý, Hóa)" score={student.combinations.groupA} />
                  <CombinationBadge label="Khối B00 (Toán, Hóa, Sinh)" score={student.combinations.groupB} />
                  <CombinationBadge label="Khối A01 (Toán, Lý, Anh)" score={student.combinations.groupA1} />
                </>
              ) : (
                <>
                  <CombinationBadge label="Khối C00 (Văn, Sử, Địa)" score={student.combinations.groupC} />
                  <CombinationBadge label="Khối D01 (Toán, Văn, Anh)" score={student.combinations.groupD} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-semibold rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const ScoreBadge: React.FC<{ label: string; value?: number }> = ({ label, value }) => {
  const displayVal = value ?? 0.0;
  return (
    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
      <span className="text-xs text-slate-600 font-medium">{label}</span>
      <span className={`text-base font-bold font-mono ${
        displayVal >= 8.0 ? 'text-emerald-700' : displayVal >= 5.0 ? 'text-slate-900' : 'text-rose-700'
      }`}>
        {displayVal}
      </span>
    </div>
  );
};

const CombinationBadge: React.FC<{ label: string; score?: number }> = ({ label, score }) => {
  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
      <span className="text-xs text-slate-500 font-medium block truncate">{label}</span>
      <span className="text-lg font-bold font-mono text-[var(--color-primary)]">
        {score ?? 0.0}
      </span>
    </div>
  );
};
