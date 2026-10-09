export interface SubjectScoreItem {
  code: string;
  name: string;
  score: number | null;
  level: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'WEAK' | null;
  isPassing: boolean;
}

export interface GroupScoreItem {
  name: string;
  code: string;
  subjects: string[];
  totalScore: number | null;
  isValid: boolean;
}

export interface StudentScoreDTO {
  sbd: string;
  maNgoaiNgu: string | null;
  subjectScores: SubjectScoreItem[];
  groups: {
    A: GroupScoreItem;
    A1: GroupScoreItem;
    B: GroupScoreItem;
    C: GroupScoreItem;
    D: GroupScoreItem;
  };
}

export interface TopGroupAStudent {
  rank: number;
  sbd: string;
  toan: number;
  vatLi: number;
  hoaHoc: number;
  totalScore: number;
}

export interface SubjectStatisticDTO {
  subject_code: string;
  subject_name: string;
  total_candidates: number;
  average_score: number;
  level_ge_8: number;   // >= 8.0
  level_6_to_8: number; // 6.0 - 7.9
  level_4_to_6: number; // 4.0 - 5.9
  level_lt_4: number;   // < 4.0
}

export interface DashboardSummaryDTO {
  totalCandidates: number;
  totalExamsTaken: number;
  averageScoreOverall: number;
  topGroupAScore: number;
}
