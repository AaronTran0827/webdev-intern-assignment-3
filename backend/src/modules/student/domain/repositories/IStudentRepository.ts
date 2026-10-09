import { Student } from '../entities/Student.js';
import { StudentGroup } from '../enums/StudentGroup.js';

export interface StudentQueryOptions {
  page?: number;
  limit?: number;
  group?: StudentGroup;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
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

export interface Top10BlockItem {
  student: Student;
  totalScore: number;
  block: string;
}

export interface IStudentRepository {
  findBySbd(sbd: string): Promise<Student | null>;
  findAll(options?: StudentQueryOptions): Promise<PaginatedResult<Student>>;
  findByGroup(group: StudentGroup): Promise<Student[]>;
  save(student: Student): Promise<Student>;
  update(student: Student): Promise<Student>;
  delete(sbd: string): Promise<boolean>;
  getSubjectReport(subjectCode?: string): Promise<SubjectReportDTO[]>;
  findTop10ByBlock(blockCode?: string): Promise<Top10BlockItem[]>;
}

