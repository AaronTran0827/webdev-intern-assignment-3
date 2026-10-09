import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';
import { StudentGroup } from '../../domain/enums/StudentGroup.js';

export class GetStudentsByGroup {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(group: StudentGroup) {
    const students = await this.studentRepository.findByGroup(group);
    return students.map((s) => s.toDTO());
  }
}
