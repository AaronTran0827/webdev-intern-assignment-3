import React, { useEffect, useState, useCallback } from 'react';
import { studentApi } from '../../../services/studentApi';
import { SubjectReportDTO, Top10ItemDTO } from '../../../types/student';
import { LoadingState } from '../../../components/common/LoadingState';
import { ErrorState } from '../../../components/common/ErrorState';
import { BarChart3, Trophy, BookOpen, Filter, Award } from 'lucide-react';

export const ReportPage: React.FC = () => {
  const [reports, setReports] = useState<SubjectReportDTO[]>([]);
  const [top10List, setTop10List] = useState<Top10ItemDTO[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string>('A00');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('');

  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isLoadingTop10, setIsLoadingTop10] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [top10Error, setTop10Error] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setIsLoadingReports(true);
    setReportsError(null);
    try {
      const res = await studentApi.getReports(selectedSubjectFilter || undefined);
      setReports(res.data);
    } catch (err: any) {
      setReportsError(err.message || 'Không thể tải báo cáo điểm số.');
    } finally {
      setIsLoadingReports(false);
    }
  }, [selectedSubjectFilter]);

  const fetchTop10 = useCallback(async (block: string) => {
    setIsLoadingTop10(true);
    setTop10Error(null);
    try {
      const res = await studentApi.getTop10(block);
      setTop10List(res.data);
    } catch (err: any) {
      setTop10Error(err.message || `Không thể tải danh sách Top 10 khối ${block}.`);
    } finally {
      setIsLoadingTop10(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    fetchTop10(selectedBlock);
  }, [selectedBlock, fetchTop10]);

  const blocks = [
    { code: 'A00', name: 'Khối A00 (Toán - Lý - Hóa)' },
    { code: 'A01', name: 'Khối A01 (Toán - Lý - Anh)' },
    { code: 'B00', name: 'Khối B00 (Toán - Hóa - Sinh)' },
    { code: 'C00', name: 'Khối C00 (Văn - Sử - Địa)' },
    { code: 'D01', name: 'Khối D01 (Toán - Văn - Anh)' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reports & Analytics (Báo Cáo & Thống Kê)
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Phân tích số lượng thí sinh theo từng khung điểm và vinh danh Top 10 thí sinh dẫn đầu các khối thi.
          </p>
        </div>
      </div>

      {/* SECTION 1: Subject Score Range Reports */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-[var(--color-primary)] font-bold text-lg">
            <BarChart3 className="w-5 h-5" />
            <h3 className="text-slate-900">Thống Kê Khung Điểm Theo Môn Thi</h3>
          </div>

          {/* Subject Filter Dropdown */}
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[var(--color-primary)] font-medium"
            >
              <option value="">-- Tất cả môn thi --</option>
              <option value="toan">Toán</option>
              <option value="nguVan">Ngữ Văn</option>
              <option value="ngoaiNgu">Ngoại Ngữ</option>
              <option value="vatLi">Vật Lý</option>
              <option value="hoaHoc">Hóa Học</option>
              <option value="sinhHoc">Sinh Học</option>
              <option value="lichSu">Lịch Sử</option>
              <option value="diaLi">Địa Lý</option>
              <option value="gdcd">GDCD</option>
            </select>
          </div>
        </div>

        {isLoadingReports ? (
          <LoadingState message="Đang tải dữ liệu phân tích khung điểm..." />
        ) : reportsError ? (
          <ErrorState message={reportsError} onRetry={fetchReports} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reports.map((report) => (
              <SubjectCard key={report.subjectCode} report={report} />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Top 10 High Achievers by Block */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-lg">
            <Trophy className="w-5 h-5 text-amber-600" />
            <h3 className="text-slate-900">Top 10 Thí Sinh Điểm Cao Nhất</h3>
          </div>

          {/* Block Selection Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {blocks.map((b) => (
              <button
                key={b.code}
                onClick={() => setSelectedBlock(b.code)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                  selectedBlock === b.code
                    ? 'bg-[var(--color-primary)] text-white font-bold shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {b.code}
              </button>
            ))}
          </div>
        </div>

        {/* Top 10 Content */}
        {isLoadingTop10 ? (
          <LoadingState message={`Đang tải bảng xếp hạng khối ${selectedBlock}...`} />
        ) : top10Error ? (
          <ErrorState message={top10Error} onRetry={() => fetchTop10(selectedBlock)} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Bảng Vinh Danh Top 10 Thí Sinh Dẫn Đầu {blocks.find(b => b.code === selectedBlock)?.name}</span>
              </span>
              <span className="text-xs text-slate-500">Số lượng: {top10List.length} thí sinh</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-800">
                <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 text-center w-16">Hạng</th>
                    <th className="px-5 py-3.5">Số Báo Danh (SBD)</th>
                    <th className="px-5 py-3.5">Khối</th>
                    <th className="px-5 py-3.5 text-right">Tổng Điểm {selectedBlock}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {top10List.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-500">
                        Chưa có thí sinh đạt tiêu chí cho khối này.
                      </td>
                    </tr>
                  ) : (
                    top10List.map((item, idx) => {
                      const rank = idx + 1;
                      return (
                        <tr key={item.student.sbd} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3 text-center font-bold">
                            {rank === 1 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 text-amber-800 rounded-full font-bold text-xs">
                                🥇 1
                              </span>
                            ) : rank === 2 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 text-slate-800 rounded-full font-bold text-xs">
                                🥈 2
                              </span>
                            ) : rank === 3 ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-50 text-amber-700 rounded-full font-bold text-xs">
                                🥉 3
                              </span>
                            ) : (
                              <span className="text-slate-500 text-xs font-mono">{rank}</span>
                            )}
                          </td>

                          <td className="px-5 py-3 font-mono font-bold text-slate-900">
                            {item.student.sbd}
                          </td>

                          <td className="px-5 py-3">
                            {item.student.group === 'NATURAL' ? (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Tự Nhiên
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                                Xã Hội
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-3 text-right">
                            <span className="font-mono font-bold text-[var(--color-primary)] text-base">
                              {item.totalScore.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SubjectCardProps {
  report: SubjectReportDTO;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ report }) => {
  const total = report.totalCount || 1;

  const excPct = Math.round((report.excellentCount / total) * 100);
  const goodPct = Math.round((report.goodCount / total) * 100);
  const avgPct = Math.round((report.averageCount / total) * 100);
  const poorPct = Math.round((report.poorCount / total) * 100);

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
          <h4 className="font-bold text-slate-900 text-base">{report.subjectName}</h4>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Tong: {report.totalCount.toLocaleString()}
        </span>
      </div>

      {/* Stacked Progress Bar */}
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
        <div style={{ width: `${excPct}%` }} className="bg-emerald-500 h-full" title={`Giỏi: ${excPct}%`} />
        <div style={{ width: `${goodPct}%` }} className="bg-blue-500 h-full" title={`Khá: ${goodPct}%`} />
        <div style={{ width: `${avgPct}%` }} className="bg-amber-500 h-full" title={`Trung bình: ${avgPct}%`} />
        <div style={{ width: `${poorPct}%` }} className="bg-rose-500 h-full" title={`Yếu: ${poorPct}%`} />
      </div>

      {/* Breakdown detail list */}
      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
          <span className="text-slate-600 block">Giỏi (≥ 8.0)</span>
          <span className="font-mono font-bold text-emerald-700">{report.excellentCount.toLocaleString()} ({excPct}%)</span>
        </div>

        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-slate-600 block">Khá (6.0 - 7.9)</span>
          <span className="font-mono font-bold text-blue-700">{report.goodCount.toLocaleString()} ({goodPct}%)</span>
        </div>

        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
          <span className="text-slate-600 block">Trung Bình (4.0 - 5.9)</span>
          <span className="font-mono font-bold text-amber-700">{report.averageCount.toLocaleString()} ({avgPct}%)</span>
        </div>

        <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg">
          <span className="text-slate-600 block">Yếu (&lt; 4.0)</span>
          <span className="font-mono font-bold text-rose-700">{report.poorCount.toLocaleString()} ({poorPct}%)</span>
        </div>
      </div>
    </div>
  );
};
