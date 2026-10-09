import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';
import { CreateStudentDTO } from '../dto/CreateStudentDTO.js';
import { StudentFactory } from '../../domain/factories/StudentFactory.js';

export class CreateStudent {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(dto: CreateStudentDTO) {
    const student = StudentFactory.createFromRaw({
      sbd: dto.sbd,
      toan: dto.toan,
      ngu_van: dto.nguVan,
      ngoai_ngu: dto.ngoaiNgu,
      vat_li: dto.vatLi,
      hoa_hoc: dto.hoaHoc,
      sinh_hoc: dto.sinhHoc,
      lich_su: dto.lichSu,
      dia_li: dto.diaLi,
      gdcd: dto.gdcd,
      ma_ngoai_ngu: dto.maNgoaiNgu,
    });

    const saved = await this.studentRepository.save(student);
    return saved.toDTO();
  }
}
