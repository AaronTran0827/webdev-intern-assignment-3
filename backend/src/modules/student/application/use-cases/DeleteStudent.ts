import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';

export class DeleteStudent {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(sbd: string): Promise<boolean> {
    return await this.studentRepository.delete(sbd);
  }
}
