import { apiClient } from '../lib/apiClient';
import { StudentDTO, StudentInputDTO, SubjectReportDTO, Top10ItemDTO } from '../types/student';
import { PaginatedApiResponse, ApiResponse, StudentQueryParams } from '../types/api';

export const studentApi = {
  // GET /api/students (Paginated & Filtered)
  getStudents: async (params: StudentQueryParams = {}): Promise<PaginatedApiResponse<StudentDTO>> => {
    const response = await apiClient.get<PaginatedApiResponse<StudentDTO>>('/students', { params });
    return response.data;
  },

  // GET /api/students/:sbd
  getStudentBySbd: async (sbd: string): Promise<ApiResponse<StudentDTO>> => {
    const response = await apiClient.get<ApiResponse<StudentDTO>>(`/students/${sbd}`);
    return response.data;
  },

  // POST /api/students
  createStudent: async (data: StudentInputDTO): Promise<ApiResponse<StudentDTO>> => {
    const response = await apiClient.post<ApiResponse<StudentDTO>>('/students', data);
    return response.data;
  },

  // PUT /api/students/:sbd
  updateStudent: async (sbd: string, data: Partial<StudentInputDTO>): Promise<ApiResponse<StudentDTO>> => {
    const response = await apiClient.put<ApiResponse<StudentDTO>>(`/students/${sbd}`, data);
    return response.data;
  },

  // DELETE /api/students/:sbd
  deleteStudent: async (sbd: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/students/${sbd}`);
    return response.data;
  },

  // GET /api/reports
  getReports: async (subject?: string): Promise<ApiResponse<SubjectReportDTO[]>> => {
    const response = await apiClient.get<ApiResponse<SubjectReportDTO[]>>('/reports', {
      params: subject ? { subject } : {},
    });
    return response.data;
  },

  // GET /api/students/top-10
  getTop10: async (block: string = 'A00'): Promise<ApiResponse<Top10ItemDTO[]>> => {
    const response = await apiClient.get<ApiResponse<Top10ItemDTO[]>>('/students/top-10', {
      params: { block },
    });
    return response.data;
  },
};
