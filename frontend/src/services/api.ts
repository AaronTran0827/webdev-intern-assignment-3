import {
  StudentScoreDTO,
  TopGroupAStudent,
  SubjectStatisticDTO,
  DashboardSummaryDTO,
} from '../types';

const API_BASE_URL = '/api';

export const fetchScoreBySbd = async (sbd: string): Promise<StudentScoreDTO> => {
  const res = await fetch(`${API_BASE_URL}/scores/${sbd}`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || `Không tìm thấy Số báo danh ${sbd}`);
  }
  return json.data;
};

export const fetchTop10GroupA = async (): Promise<TopGroupAStudent[]> => {
  const res = await fetch(`${API_BASE_URL}/reports/top10-group-a`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Lỗi khi tải dữ liệu Top 10 Khối A');
  }
  return json.data;
};

export const fetchScoreLevelReport = async (): Promise<SubjectStatisticDTO[]> => {
  const res = await fetch(`${API_BASE_URL}/reports/score-levels`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Lỗi khi tải dữ liệu Báo cáo phổ điểm');
  }
  return json.data;
};

export const fetchDashboardSummary = async (): Promise<DashboardSummaryDTO> => {
  const res = await fetch(`${API_BASE_URL}/reports/dashboard`);
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Lỗi khi tải dữ liệu Thống kê tổng quan');
  }
  return json.data;
};
