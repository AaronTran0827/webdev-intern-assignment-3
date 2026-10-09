import { z } from 'zod';
import { StudentGroup } from '../../domain/enums/StudentGroup.js';

const scoreSchema = z
  .union([z.number(), z.null(), z.undefined()])
  .transform((val) => (val === null || val === undefined ? 0.0 : val))
  .pipe(
    z
      .number({ invalid_type_error: 'Score must be a number' })
      .min(0.0, { message: 'Score cannot be less than 0.0' })
      .max(10.0, { message: 'Score cannot be greater than 10.0' })
  );

const maNgoaiNguSchema = z
  .string()
  .regex(/^N[1-7]$/, { message: 'Foreign language code must be between N1 and N7 (e.g., N1)' })
  .nullable()
  .optional();

export const SbdParamSchema = z.object({
  sbd: z
    .string({ required_error: 'SBD is required' })
    .trim()
    .regex(/^\d{6,10}$/, { message: 'SBD must be between 6 and 10 numeric digits' }),
});

export const StudentQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  group: z.nativeEnum(StudentGroup).optional(),
  sortBy: z.string().trim().optional().default('sbd'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export const CreateStudentSchema = z.object({
  sbd: z
    .string({ required_error: 'SBD is required' })
    .trim()
    .regex(/^\d{6,10}$/, { message: 'SBD must be between 6 and 10 numeric digits' }),
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
