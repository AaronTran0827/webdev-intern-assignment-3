import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';

export class GetTop10Students {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(blockCode: string = 'A00') {
    const items = await this.studentRepository.findTop10ByBlock(blockCode);
    return items.map((item) => ({
      student: item.student.toDTO(),
      totalScore: item.totalScore,
      block: item.block,
    }));
  }
}
