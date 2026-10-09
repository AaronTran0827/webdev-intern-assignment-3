import { IStudentRepository, StudentQueryOptions } from '../../domain/repositories/IStudentRepository.js';

export class GetAllStudents {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(options: StudentQueryOptions = {}) {
    const result = await this.studentRepository.findAll(options);
    return {
      ...result,
      data: result.data.map((s) => s.toDTO()),
    };
  }
}

