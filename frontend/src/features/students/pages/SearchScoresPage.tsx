import React, { useState } from 'react';
import { studentApi } from '../../../services/studentApi';
import { StudentDTO } from '../../../types/student';
import { Search, Loader2, AlertCircle, Award, BookOpen } from 'lucide-react';

export const SearchScoresPage: React.FC = () => {
  const [sbdInput, setSbdInput] = useState('');
  const [student, setStudent] = useState<StudentDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sampleSbds = ['01000001', '01000002', '01000003', '01000084'];

  const handleSearch = async (e?: React.FormEvent, targetSbd?: string) => {
    if (e) e.preventDefault();
    const querySbd = (targetSbd || sbdInput).trim();

    if (!querySbd) {
      setErrorMsg('Vui lòng nhập Số Báo Danh (SBD) để tra cứu.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await studentApi.getStudentBySbd(querySbd);
      setStudent(res.data);
    } catch (err: any) {
      setStudent(null);
      setErrorMsg(err.message || `Không tìm thấy thông tin điểm thi cho SBD ${querySbd}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Search Scores Form Card */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          Search Scores (Tra Cứu Điểm Thi)
        </h2>

        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Registration Number (Số Báo Danh):
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={sbdInput}
              onChange={(e) => setSbdInput(e.target.value)}
              placeholder="Enter registration number (e.g. 01000001, 01000084...)"
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-2.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-sm font-semibold rounded-lg shadow-sm transition-all shrink-0 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Submit</span>
            </button>
          </div>
        </form>

        {/* Quick Sample Buttons */}
        <div className="flex items-center space-x-2 pt-2 flex-wrap gap-y-2">
          <span className="text-xs text-slate-500 font-medium">SBD mẫu gợi ý:</span>
          {sampleSbds.map((sbd) => (
            <button
              key={sbd}
              onClick={() => {
                setSbdInput(sbd);
                handleSearch(undefined, sbd);
              }}
              className="text-xs font-mono px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded transition-colors"
            >
              {sbd}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Detailed Scores Card */}
      <div className="bg-[var(--color-card-bg)] border border-[var(--color-card-border)] rounded-xl p-6 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          Detailed Scores (Chi Tiết Bảng Điểm)
        </h3>

        {!student ? (
          <p className="text-sm text-slate-500">
            Detailed view of search scores here! Vui lòng nhập SBD ở trên và bấm Submit để hiển thị kết quả.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-black font-mono text-[var(--color-primary)]">
                    SBD: {student.sbd}
                  </span>
                  {student.group === 'NATURAL' ? (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Khối Tự Nhiên
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                      Khối Xã Hội
                    </span>
                  )}
                </div>
                {student.maNgoaiNgu && (
                  <span className="text-xs text-slate-500 block mt-1">Mã Ngoại Ngữ: {student.maNgoaiNgu}</span>
                )}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center space-x-3 shrink-0">
                <Award className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Điểm TB Thi</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {student.averageScore ?? 0.0}
                  </span>
                </div>
              </div>
            </div>

            {/* Subject Scores Grid */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Điểm Thi Các Môn</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <ScoreBox label="Toán" value={student.scores.toan} />
                <ScoreBox label="Ngữ Văn" value={student.scores.nguVan} />
                <ScoreBox label="Ngoại Ngữ" value={student.scores.ngoaiNgu} />
                {student.group === 'NATURAL' ? (
                  <>
                    <ScoreBox label="Vật Lý" value={student.scores.vatLi} />
                    <ScoreBox label="Hóa Học" value={student.scores.hoaHoc} />
                    <ScoreBox label="Sinh Học" value={student.scores.sinhHoc} />
                  </>
                ) : (
                  <>
                    <ScoreBox label="Lịch Sử" value={student.scores.lichSu} />
                    <ScoreBox label="Địa Lý" value={student.scores.diaLi} />
                    <ScoreBox label="GDCD" value={student.scores.gdcd} />
                  </>
                )}
              </div>
            </div>

            {/* College Admissions Combinations */}
            <div className="pt-2">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">
                Tổng Điểm Xét Tuyển Đại Học (Khối Thi)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {student.group === 'NATURAL' ? (
                  <>
                    <CombinationBox label="Khối A00 (Toán + Lý + Hóa)" score={student.combinations.groupA} />
                    <CombinationBox label="Khối B00 (Toán + Hóa + Sinh)" score={student.combinations.groupB} />
                    <CombinationBox label="Khối A01 (Toán + Lý + Anh)" score={student.combinations.groupA1} />
                  </>
                ) : (
                  <>
                    <CombinationBox label="Khối C00 (Văn + Sử + Địa)" score={student.combinations.groupC} />
                    <CombinationBox label="Khối D01 (Toán + Văn + Anh)" score={student.combinations.groupD} />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ScoreBox: React.FC<{ label: string; value?: number }> = ({ label, value }) => {
  const val = value ?? 0.0;
  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center space-y-1">
      <span className="text-xs text-slate-500 font-medium block">{label}</span>
      <span className={`text-lg font-bold font-mono ${val >= 8.0 ? 'text-emerald-600' : val >= 5.0 ? 'text-slate-900' : 'text-rose-600'}`}>
        {val}
      </span>
    </div>
  );
};

const CombinationBox: React.FC<{ label: string; score?: number }> = ({ label, score }) => {
  return (
    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
      <span className="text-xs text-slate-600 font-medium">{label}</span>
      <span className="text-lg font-bold font-mono text-[var(--color-primary)]">
        {score ?? 0.0}
      </span>
    </div>
  );
};
