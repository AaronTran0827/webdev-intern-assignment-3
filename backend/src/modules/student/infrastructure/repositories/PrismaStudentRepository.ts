import { PrismaClient } from '@prisma/client';
import { IStudentRepository, StudentQueryOptions, PaginatedResult, SubjectReportDTO, Top10BlockItem } from '../../domain/repositories/IStudentRepository.js';
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

  public async findAll(options: StudentQueryOptions = {}): Promise<PaginatedResult<Student>> {
    let limit = Math.min(100, Math.max(1, Math.floor(Number(options.limit) || 10)));
    if (isNaN(limit) || !Number.isFinite(limit)) limit = 10;

    const where: any = {};

    if (options.group === StudentGroup.NATURAL) {
      where.OR = [
        { vat_li: { gt: 0 } },
        { hoa_hoc: { gt: 0 } },
        { sinh_hoc: { gt: 0 } },
      ];
    } else if (options.group === StudentGroup.SOCIAL) {
      where.OR = [
        { lich_su: { gt: 0 } },
        { dia_li: { gt: 0 } },
        { gdcd: { gt: 0 } },
      ];
    }

    const totalItems = await this.prisma.student.count({ where });
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));

    let page = Math.floor(Number(options.page) || 1);
    if (isNaN(page) || !Number.isFinite(page) || page < 1) {
      page = 1;
    } else if (totalPages > 0 && page > totalPages) {
      page = totalPages;
    }

    const skip = (page - 1) * limit;

    const validSortFields: Record<string, string> = {
      sbd: 'sbd',
      toan: 'toan',
      nguVan: 'ngu_van',
      ngoaiNgu: 'ngoai_ngu',
      vatLi: 'vat_li',
      hoaHoc: 'hoa_hoc',
      sinhHoc: 'sinh_hoc',
      lichSu: 'lich_su',
      diaLi: 'dia_li',
      gdcd: 'gdcd',
    };

    const sortField = validSortFields[options.sortBy || 'sbd'] || 'sbd';
    const sortOrder = options.sortOrder === 'desc' ? 'desc' : 'asc';
    const orderBy = { [sortField]: sortOrder };

    const rows = await this.prisma.student.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });

    const students: Student[] = [];
    for (const row of rows) {
      try {
        students.push(StudentFactory.createFromRaw(row));
      } catch {
        // Skip unclassifiable rows if any
      }
    }

    return {
      data: students,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  public async findByGroup(group: StudentGroup): Promise<Student[]> {
    let whereCondition: any = {};

    if (group === StudentGroup.NATURAL) {
      whereCondition = {
        OR: [
          { vat_li: { gt: 0 } },
          { hoa_hoc: { gt: 0 } },
          { sinh_hoc: { gt: 0 } },
        ],
      };
    } else if (group === StudentGroup.SOCIAL) {
      whereCondition = {
        OR: [
          { lich_su: { gt: 0 } },
          { dia_li: { gt: 0 } },
          { gdcd: { gt: 0 } },
        ],
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
      throw new NotFoundError(`Không tìm thấy thí sinh với Số báo danh (SBD): ${student.sbd}`);
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
      throw new NotFoundError(`Không tìm thấy thí sinh với Số báo danh (SBD): ${sbd}`);
    }

    await this.prisma.student.delete({
      where: { sbd },
    });

    return true;
  }

  public async getSubjectReport(subjectCode?: string): Promise<SubjectReportDTO[]> {
    const subjectsMap: Record<string, { dbCol: string; name: string }> = {
      toan: { dbCol: 'toan', name: 'Toán' },
      nguVan: { dbCol: 'ngu_van', name: 'Ngữ văn' },
      ngu_van: { dbCol: 'ngu_van', name: 'Ngữ văn' },
      ngoaiNgu: { dbCol: 'ngoai_ngu', name: 'Ngoại ngữ' },
      ngoai_ngu: { dbCol: 'ngoai_ngu', name: 'Ngoại ngữ' },
      vatLi: { dbCol: 'vat_li', name: 'Vật lý' },
      vat_li: { dbCol: 'vat_li', name: 'Vật lý' },
      hoaHoc: { dbCol: 'hoa_hoc', name: 'Hóa học' },
      hoa_hoc: { dbCol: 'hoa_hoc', name: 'Hóa học' },
      sinhHoc: { dbCol: 'sinh_hoc', name: 'Sinh học' },
      sinh_hoc: { dbCol: 'sinh_hoc', name: 'Sinh học' },
      lichSu: { dbCol: 'lich_su', name: 'Lịch sử' },
      lich_su: { dbCol: 'lich_su', name: 'Lịch sử' },
      diaLi: { dbCol: 'dia_li', name: 'Địa lý' },
      dia_li: { dbCol: 'dia_li', name: 'Địa lý' },
      gdcd: { dbCol: 'gdcd', name: 'GDCD' },
    };

    const displaySubjects: { code: string; dbCol: string; name: string }[] = [
      { code: 'toan', dbCol: 'toan', name: 'Toán' },
      { code: 'nguVan', dbCol: 'ngu_van', name: 'Ngữ văn' },
      { code: 'ngoaiNgu', dbCol: 'ngoai_ngu', name: 'Ngoại ngữ' },
      { code: 'vatLi', dbCol: 'vat_li', name: 'Vật lý' },
      { code: 'hoaHoc', dbCol: 'hoa_hoc', name: 'Hóa học' },
      { code: 'sinhHoc', dbCol: 'sinh_hoc', name: 'Sinh học' },
      { code: 'lichSu', dbCol: 'lich_su', name: 'Lịch sử' },
      { code: 'diaLi', dbCol: 'dia_li', name: 'Địa lý' },
      { code: 'gdcd', dbCol: 'gdcd', name: 'GDCD' },
    ];

    if (subjectCode && subjectsMap[subjectCode]) {
      const target = subjectsMap[subjectCode];
      const col = target.dbCol;
      const result: any = await this.prisma.$queryRawUnsafe(`
        SELECT 
          SUM(CASE WHEN ${col} >= 8.0 THEN 1 ELSE 0 END)::int as "excellentCount",
          SUM(CASE WHEN ${col} >= 6.0 AND ${col} < 8.0 THEN 1 ELSE 0 END)::int as "goodCount",
          SUM(CASE WHEN ${col} >= 4.0 AND ${col} < 6.0 THEN 1 ELSE 0 END)::int as "averageCount",
          SUM(CASE WHEN ${col} < 4.0 AND ${col} > 0 THEN 1 ELSE 0 END)::int as "poorCount",
          SUM(CASE WHEN ${col} > 0 THEN 1 ELSE 0 END)::int as "totalCount"
        FROM students;
      `);

      const row = result[0] || {};
      return [{
        subjectCode,
        subjectName: target.name,
        excellentCount: Number(row.excellentCount || 0),
        goodCount: Number(row.goodCount || 0),
        averageCount: Number(row.averageCount || 0),
        poorCount: Number(row.poorCount || 0),
        totalCount: Number(row.totalCount || 0),
      }];
    }

    const selectClauses = displaySubjects.map((s) => `
      SUM(CASE WHEN ${s.dbCol} >= 8.0 THEN 1 ELSE 0 END)::int as "${s.code}_exc",
      SUM(CASE WHEN ${s.dbCol} >= 6.0 AND ${s.dbCol} < 8.0 THEN 1 ELSE 0 END)::int as "${s.code}_good",
      SUM(CASE WHEN ${s.dbCol} >= 4.0 AND ${s.dbCol} < 6.0 THEN 1 ELSE 0 END)::int as "${s.code}_avg",
      SUM(CASE WHEN ${s.dbCol} < 4.0 AND ${s.dbCol} > 0 THEN 1 ELSE 0 END)::int as "${s.code}_poor",
      SUM(CASE WHEN ${s.dbCol} > 0 THEN 1 ELSE 0 END)::int as "${s.code}_total"
    `).join(',\n');

    const result: any = await this.prisma.$queryRawUnsafe(`
      SELECT 
        ${selectClauses}
      FROM students;
    `);

    const row = result[0] || {};
    return displaySubjects.map((s) => ({
      subjectCode: s.code,
      subjectName: s.name,
      excellentCount: Number(row[`${s.code}_exc`] || 0),
      goodCount: Number(row[`${s.code}_good`] || 0),
      averageCount: Number(row[`${s.code}_avg`] || 0),
      poorCount: Number(row[`${s.code}_poor`] || 0),
      totalCount: Number(row[`${s.code}_total`] || 0),
    }));
  }

  public async findTop10ByBlock(blockCode: string = 'A00'): Promise<Top10BlockItem[]> {
    const blocks: Record<string, { name: string; cols: string[] }> = {
      A00: { name: 'A00 (Toán, Vật lí, Hóa học)', cols: ['toan', 'vat_li', 'hoa_hoc'] },
      A01: { name: 'A01 (Toán, Vật lí, Tiếng Anh)', cols: ['toan', 'vat_li', 'ngoai_ngu'] },
      B00: { name: 'B00 (Toán, Hóa học, Sinh học)', cols: ['toan', 'hoa_hoc', 'sinh_hoc'] },
      C00: { name: 'C00 (Ngữ văn, Lịch sử, Địa lí)', cols: ['ngu_van', 'lich_su', 'dia_li'] },
      D01: { name: 'D01 (Toán, Ngữ văn, Tiếng Anh)', cols: ['toan', 'ngu_van', 'ngoai_ngu'] },
    };

    const targetBlock = blocks[blockCode.toUpperCase()] || blocks.A00;
    const [c1, c2, c3] = targetBlock.cols;

    const query = `
      SELECT *, (${c1} + ${c2} + ${c3}) as "totalScore"
      FROM students
      WHERE ${c1} IS NOT NULL AND ${c2} IS NOT NULL AND ${c3} IS NOT NULL
      ORDER BY "totalScore" DESC
      LIMIT 10;
    `;

    const rows: any[] = await this.prisma.$queryRawUnsafe(query);

    return rows.map((row) => ({
      student: StudentFactory.createFromRaw(row),
      totalScore: Number(Number(row.totalScore).toFixed(2)),
      block: targetBlock.name,
    }));
  }
}
