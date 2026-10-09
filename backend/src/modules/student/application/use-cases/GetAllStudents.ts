import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';

export class GetAllStudents {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute() {
    const students = await this.studentRepository.findAll();
    return students.map((s) => s.toDTO());
  }
}
