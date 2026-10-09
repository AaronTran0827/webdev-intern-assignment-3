export type StudentGroupType = 'NATURAL' | 'SOCIAL';

export interface StudentScoresDTO {
  toan: number;
  nguVan: number;
  ngoaiNgu: number;
  vatLi?: number;
  hoaHoc?: number;
  sinhHoc?: number;
  lichSu?: number;
  diaLi?: number;
  gdcd?: number;
}

export interface StudentCombinationsDTO {
  groupA?: number;
  groupB?: number;
  groupA1?: number;
  groupC?: number;
  groupD?: number;
}

export interface StudentDTO {
  sbd: string;
  group: StudentGroupType;
  maNgoaiNgu?: string | null;
  averageScore: number;
  scores: StudentScoresDTO;
  combinations: StudentCombinationsDTO;
}

export interface StudentInputDTO {
  sbd: string;
  toan?: number;
  nguVan?: number;
  ngoaiNgu?: number;
  vatLi?: number;
  hoaHoc?: number;
  sinhHoc?: number;
  lichSu?: number;
  diaLi?: number;
  gdcd?: number;
  maNgoaiNgu?: string | null;
}

export interface SubjectReportDTO {
  subjectCode: string;
  subjectName: string;
  excellentCount: number; // >= 8.0
  goodCount: number;      // 6.0 <= score < 8.0
  averageCount: number;   // 4.0 <= score < 6.0
  poorCount: number;      // < 4.0
  totalCount: number;
}

export interface Top10ItemDTO {
  student: StudentDTO;
  totalScore: number;
  block: string;
}
