import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class GetStudentBySbd {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(sbd: string) {
    const student = await this.studentRepository.findBySbd(sbd);
    if (!student) {
      throw new NotFoundError(`Student with registration number (SBD) ${sbd} not found.`);
    }
    return student.toDTO();
  }
}
