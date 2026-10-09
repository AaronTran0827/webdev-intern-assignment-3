import { Request, Response, NextFunction } from 'express';
import { GetAllStudents } from '../../application/use-cases/GetAllStudents.js';
import { GetStudentBySbd } from '../../application/use-cases/GetStudentBySbd.js';
import { GetStudentsByGroup } from '../../application/use-cases/GetStudentsByGroup.js';
import { CreateStudent } from '../../application/use-cases/CreateStudent.js';
import { UpdateStudent } from '../../application/use-cases/UpdateStudent.js';
import { DeleteStudent } from '../../application/use-cases/DeleteStudent.js';
import { GetSubjectReport } from '../../application/use-cases/GetSubjectReport.js';
import { GetTop10Students } from '../../application/use-cases/GetTop10Students.js';
import { StudentGroup } from '../../domain/enums/StudentGroup.js';
import {
  SbdParamSchema,
  StudentQuerySchema,
  CreateStudentSchema,
  UpdateStudentSchema,
} from '../validators/studentSchemas.js';
import { ValidationError } from '../../../../shared/errors/AppError.js';

export class StudentController {
  constructor(
    private readonly getAllStudentsUseCase: GetAllStudents,
    private readonly getStudentBySbdUseCase: GetStudentBySbd,
    private readonly getStudentsByGroupUseCase: GetStudentsByGroup,
    private readonly createStudentUseCase: CreateStudent,
    private readonly updateStudentUseCase: UpdateStudent,
    private readonly deleteStudentUseCase: DeleteStudent,
    private readonly getSubjectReportUseCase: GetSubjectReport,
    private readonly getTop10StudentsUseCase: GetTop10Students
  ) {}

  public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const queryParsed = StudentQuerySchema.safeParse(req.query);
      if (!queryParsed.success) {
        throw new ValidationError(queryParsed.error.errors[0].message);
      }

      const result = await this.getAllStudentsUseCase.execute(queryParsed.data);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };

  public getBySbd = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = SbdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const data = await this.getStudentBySbdUseCase.execute(parsed.data.sbd);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getNaturalGroup = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.getStudentsByGroupUseCase.execute(StudentGroup.NATURAL);
      res.status(200).json({
        success: true,
        group: StudentGroup.NATURAL,
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public getSocialGroup = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.getStudentsByGroupUseCase.execute(StudentGroup.SOCIAL);
      res.status(200).json({
        success: true,
        group: StudentGroup.SOCIAL,
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = CreateStudentSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      const data = await this.createStudentUseCase.execute(parsed.data);
      res.status(201).json({
        success: true,
        message: 'Thêm mới thí sinh thành công.',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paramParsed = SbdParamSchema.safeParse(req.params);
      if (!paramParsed.success) {
        throw new ValidationError(paramParsed.error.errors[0].message);
      }

      const bodyParsed = UpdateStudentSchema.safeParse(req.body);
      if (!bodyParsed.success) {
        throw new ValidationError(bodyParsed.error.errors[0].message);
      }

      const data = await this.updateStudentUseCase.execute(paramParsed.data.sbd, bodyParsed.data);
      res.status(200).json({
        success: true,
        message: 'Cập nhật thông tin thí sinh thành công.',
        data,
      });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = SbdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.errors[0].message);
      }

      await this.deleteStudentUseCase.execute(parsed.data.sbd);
      res.status(200).json({
        success: true,
        message: `Xóa thí sinh với SBD ${parsed.data.sbd} thành công.`,
      });
    } catch (error) {
      next(error);
    }
  };

  public getReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subjectCode = req.query.subject as string | undefined;
      const reports = await this.getSubjectReportUseCase.execute(subjectCode);
      res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  };

  public getTop10 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const blockCode = (req.query.block as string) || 'A00';
      const data = await this.getTop10StudentsUseCase.execute(blockCode);
      res.status(200).json({
        success: true,
        block: blockCode.toUpperCase(),
        count: data.length,
        data,
      });
    } catch (error) {
      next(error);
    }
  };
}
