import { z } from 'zod';
import { StudentGroup } from '../../domain/enums/StudentGroup.js';

const scoreSchema = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((val) => {
    if (val === null || val === undefined || (typeof val === 'string' && val.trim() === '')) {
      return 0.0;
    }
    const num = typeof val === 'string' ? Number(val) : val;
    return isNaN(num) ? val : Math.round(num * 100) / 100;
  })
  .pipe(
    z
      .number({ invalid_type_error: 'Điểm số phải là một chữ số' })
      .min(0.0, { message: 'Điểm số không được nhỏ hơn 0.0' })
      .max(10.0, { message: 'Điểm số không được lớn hơn 10.0' })
  );

const maNgoaiNguSchema = z
  .string()
  .regex(/^N[1-7]$/, { message: 'Mã ngoại ngữ phải có dạng từ N1 đến N7 (ví dụ: N1)' })
  .nullable()
  .optional();

export const SbdParamSchema = z.object({
  sbd: z
    .string({ required_error: 'Số báo danh (SBD) là bắt buộc' })
    .trim()
    .regex(/^\d{6,10}$/, { message: 'Số báo danh (SBD) phải bao gồm từ 6 đến 10 chữ số' }),
});

export const StudentQuerySchema = z.object({
  page: z
    .any()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return 1;
      const num = Number(val);
      if (isNaN(num) || !Number.isFinite(num) || num < 1 || num > Number.MAX_SAFE_INTEGER) {
        return 1;
      }
      return Math.floor(num);
    })
    .default(1),
  limit: z
    .any()
    .transform((val) => {
      if (val === undefined || val === null || val === '') return 10;
      const num = Number(val);
      if (isNaN(num) || !Number.isFinite(num) || num < 1) {
        return 10;
      }
      return Math.min(100, Math.floor(num));
    })
    .default(10),
  group: z.nativeEnum(StudentGroup).optional(),
  sortBy: z.string().trim().optional().default('sbd'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const CreateStudentSchema = z.object({
  sbd: z
    .string({ required_error: 'Số báo danh (SBD) là bắt buộc' })
    .trim()
    .regex(/^\d{6,10}$/, { message: 'Số báo danh (SBD) phải bao gồm từ 6 đến 10 chữ số' }),
  toan: scoreSchema,
  nguVan: scoreSchema,
  ngoaiNgu: scoreSchema,
  vatLi: scoreSchema,
  hoaHoc: scoreSchema,
  sinhHoc: scoreSchema,
  lichSu: scoreSchema,
  diaLi: scoreSchema,
  gdcd: scoreSchema,
  maNgoaiNgu: maNgoaiNguSchema,
});

export const UpdateStudentSchema = z.object({
  toan: scoreSchema,
  nguVan: scoreSchema,
  ngoaiNgu: scoreSchema,
  vatLi: scoreSchema,
  hoaHoc: scoreSchema,
  sinhHoc: scoreSchema,
  lichSu: scoreSchema,
  diaLi: scoreSchema,
  gdcd: scoreSchema,
  maNgoaiNgu: maNgoaiNguSchema,
});
