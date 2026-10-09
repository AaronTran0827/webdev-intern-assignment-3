import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';

export class GetSubjectReport {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(subjectCode?: string) {
    return await this.studentRepository.getSubjectReport(subjectCode);
  }
}
