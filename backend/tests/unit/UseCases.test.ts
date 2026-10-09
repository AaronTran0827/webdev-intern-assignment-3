import { IStudentRepository, StudentQueryOptions, PaginatedResult } from '../../src/modules/student/domain/repositories/IStudentRepository.js';
import { Student } from '../../src/modules/student/domain/entities/Student.js';
import { StudentGroup } from '../../src/modules/student/domain/enums/StudentGroup.js';
import { CreateStudent } from '../../src/modules/student/application/use-cases/CreateStudent.js';
import { GetStudentBySbd } from '../../src/modules/student/application/use-cases/GetStudentBySbd.js';
import { GetAllStudents } from '../../src/modules/student/application/use-cases/GetAllStudents.js';
import { GetStudentsByGroup } from '../../src/modules/student/application/use-cases/GetStudentsByGroup.js';
import { DeleteStudent } from '../../src/modules/student/application/use-cases/DeleteStudent.js';
import { NotFoundError } from '../../src/shared/errors/AppError.js';

class InMemoryStudentRepository implements IStudentRepository {
  private students: Map<string, Student> = new Map();

  async findBySbd(sbd: string): Promise<Student | null> {
    return this.students.get(sbd) || null;
  }

  async findAll(options: StudentQueryOptions = {}): Promise<PaginatedResult<Student>> {
    let list = Array.from(this.students.values());
    if (options.group) {
      list = list.filter(s => s.getGroup() === options.group);
    }
    const page = options.page || 1;
    const limit = options.limit || 10;
    const start = (page - 1) * limit;
    const paged = list.slice(start, start + limit);
    const totalPages = Math.ceil(list.length / limit) || 1;
    return {
      data: paged,
      pagination: {
        page,
        limit,
        totalItems: list.length,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findByGroup(group: StudentGroup): Promise<Student[]> {
    return Array.from(this.students.values()).filter((s) => s.getGroup() === group);
  }

  async save(student: Student): Promise<Student> {
    this.students.set(student.sbd, student);
    return student;
  }

  async update(student: Student): Promise<Student> {
    this.students.set(student.sbd, student);
    return student;
  }

  async delete(sbd: string): Promise<boolean> {
    return this.students.delete(sbd);
  }

  async getSubjectReport(): Promise<any[]> {
    return [];
  }

  async findTop10ByBlock(): Promise<any[]> {
    return [];
  }
}

describe('Application Layer - Use Cases', () => {
  let repo: InMemoryStudentRepository;

  beforeEach(() => {
    repo = new InMemoryStudentRepository();
  });

  test('CreateStudent should create and store a NaturalStudent', async () => {
    const createUseCase = new CreateStudent(repo);
    const dto = {
      sbd: '01000001',
      toan: 8.5,
      nguVan: 7.0,
      ngoaiNgu: 8.0,
      vatLi: 9.0,
      hoaHoc: 8.0,
      sinhHoc: 7.5,
    };

    const result = await createUseCase.execute(dto);
    expect(result.sbd).toBe('01000001');
    expect(result.group).toBe(StudentGroup.NATURAL);
    expect(result.combinations.groupA).toBe(25.5);
  });

  test('GetStudentBySbd should return existing student or throw NotFoundError', async () => {
    const createUseCase = new CreateStudent(repo);
    const getUseCase = new GetStudentBySbd(repo);

    await createUseCase.execute({
      sbd: '01000002',
      toan: 6.0,
      nguVan: 8.0,
      ngoaiNgu: 7.0,
      lichSu: 8.5,
      diaLi: 7.5,
      gdcd: 9.0,
    });

    const student = await getUseCase.execute('01000002');
    expect(student.sbd).toBe('01000002');
    expect(student.group).toBe(StudentGroup.SOCIAL);

    await expect(getUseCase.execute('99999999')).rejects.toThrow(NotFoundError);
  });

  test('GetStudentsByGroup should filter correctly', async () => {
    const createUseCase = new CreateStudent(repo);
    const getByGroupUseCase = new GetStudentsByGroup(repo);

    await createUseCase.execute({
      sbd: '01000003',
      toan: 9.0,
      nguVan: 7.0,
      ngoaiNgu: 8.0,
      vatLi: 8.5,
      hoaHoc: 8.0,
      sinhHoc: 8.0,
    });

    await createUseCase.execute({
      sbd: '01000004',
      toan: 7.0,
      nguVan: 9.0,
      ngoaiNgu: 8.0,
      lichSu: 9.0,
      diaLi: 8.5,
      gdcd: 9.5,
    });

    const naturalStudents = await getByGroupUseCase.execute(StudentGroup.NATURAL);
    const socialStudents = await getByGroupUseCase.execute(StudentGroup.SOCIAL);

    expect(naturalStudents).toHaveLength(1);
    expect(naturalStudents[0].sbd).toBe('01000003');

    expect(socialStudents).toHaveLength(1);
    expect(socialStudents[0].sbd).toBe('01000004');
  });

  test('DeleteStudent should delete existing student', async () => {
    const createUseCase = new CreateStudent(repo);
    const deleteUseCase = new DeleteStudent(repo);
    const getUseCase = new GetStudentBySbd(repo);

    await createUseCase.execute({
      sbd: '01000005',
      toan: 5.0,
      nguVan: 5.0,
      ngoaiNgu: 5.0,
      vatLi: 5.0,
      hoaHoc: 5.0,
      sinhHoc: 5.0,
    });

    await deleteUseCase.execute('01000005');
    await expect(getUseCase.execute('01000005')).rejects.toThrow(NotFoundError);
  });
});
