import { PrismaClient } from '@prisma/client';
import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';
import { Student } from '../../domain/entities/Student.js';
import { NaturalStudent } from '../../domain/entities/NaturalStudent.js';
import { SocialStudent } from '../../domain/entities/SocialStudent.js';
import { StudentGroup } from '../../domain/enums/StudentGroup.js';
import { StudentFactory } from '../../domain/factories/StudentFactory.js';
import { NotFoundError, DuplicateStudentError } from '../../../../shared/errors/AppError.js';

export class PrismaStudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findBySbd(sbd: string): Promise<Student | null> {
    const raw = await this.prisma.student.findUnique({
      where: { sbd },
    });

    if (!raw) return null;
    return StudentFactory.createFromRaw(raw);
  }

  public async findAll(): Promise<Student[]> {
    const rows = await this.prisma.student.findMany({
      orderBy: { sbd: 'asc' },
    });

    const students: Student[] = [];
    for (const row of rows) {
      try {
        students.push(StudentFactory.createFromRaw(row));
      } catch {
        // Skip unclassifiable rows if any
      }
    }
    return students;
  }

  public async findByGroup(group: StudentGroup): Promise<Student[]> {
    let whereCondition: any = {};

    if (group === StudentGroup.NATURAL) {
      whereCondition = {
        vat_li: { not: null },
        hoa_hoc: { not: null },
        sinh_hoc: { not: null },
      };
    } else if (group === StudentGroup.SOCIAL) {
      whereCondition = {
        lich_su: { not: null },
        dia_li: { not: null },
        gdcd: { not: null },
      };
    }

    const rows = await this.prisma.student.findMany({
      where: whereCondition,
      orderBy: { sbd: 'asc' },
    });

    const students: Student[] = [];
    for (const row of rows) {
      try {
        const student = StudentFactory.createFromRaw(row);
        if (student.getGroup() === group) {
          students.push(student);
        }
      } catch {
        // Skip
      }
    }
    return students;
  }

  public async save(student: Student): Promise<Student> {
    const existing = await this.prisma.student.findUnique({
      where: { sbd: student.sbd },
    });

    if (existing) {
      throw new DuplicateStudentError(student.sbd);
    }

    const data: any = {
      sbd: student.sbd,
      toan: student.toan.getValue(),
      ngu_van: student.nguVan.getValue(),
      ngoai_ngu: student.ngoaiNgu.getValue(),
      ma_ngoai_ngu: student.maNgoaiNgu,
    };

    if (student instanceof NaturalStudent) {
      data.vat_li = student.vatLi.getValue();
      data.hoa_hoc = student.hoaHoc.getValue();
      data.sinh_hoc = student.sinhHoc.getValue();
    } else if (student instanceof SocialStudent) {
      data.lich_su = student.lichSu.getValue();
      data.dia_li = student.diaLi.getValue();
      data.gdcd = student.gdcd.getValue();
    }

    const created = await this.prisma.student.create({ data });
    return StudentFactory.createFromRaw(created);
  }

  public async update(student: Student): Promise<Student> {
    const existing = await this.prisma.student.findUnique({
      where: { sbd: student.sbd },
    });

    if (!existing) {
      throw new NotFoundError(`Student with SBD ${student.sbd} not found.`);
    }

    const data: any = {
      toan: student.toan.getValue(),
      ngu_van: student.nguVan.getValue(),
      ngoai_ngu: student.ngoaiNgu.getValue(),
      ma_ngoai_ngu: student.maNgoaiNgu,
    };

    if (student instanceof NaturalStudent) {
      data.vat_li = student.vatLi.getValue();
      data.hoa_hoc = student.hoaHoc.getValue();
      data.sinh_hoc = student.sinhHoc.getValue();
    } else if (student instanceof SocialStudent) {
      data.lich_su = student.lichSu.getValue();
      data.dia_li = student.diaLi.getValue();
      data.gdcd = student.gdcd.getValue();
    }

    const updated = await this.prisma.student.update({
      where: { sbd: student.sbd },
      data,
    });

    return StudentFactory.createFromRaw(updated);
  }

  public async delete(sbd: string): Promise<boolean> {
    const existing = await this.prisma.student.findUnique({
      where: { sbd },
    });

    if (!existing) {
      throw new NotFoundError(`Student with SBD ${sbd} not found.`);
    }

    await this.prisma.student.delete({
      where: { sbd },
    });

    return true;
  }
}
