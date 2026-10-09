import { IStudentRepository } from '../../domain/repositories/IStudentRepository.js';
import { UpdateStudentDTO } from '../dto/UpdateStudentDTO.js';
import { StudentFactory } from '../../domain/factories/StudentFactory.js';
import { NotFoundError } from '../../../../shared/errors/AppError.js';

export class UpdateStudent {
  constructor(private readonly studentRepository: IStudentRepository) {}

  public async execute(sbd: string, dto: UpdateStudentDTO) {
    const existing = await this.studentRepository.findBySbd(sbd);
    if (!existing) {
      throw new NotFoundError(`Không tìm thấy thí sinh với Số báo danh (SBD): ${sbd}`);
    }

    const currentDto = existing.toDTO();

    const mergedData = {
      sbd,
      toan: dto.toan !== undefined ? dto.toan : currentDto.scores.toan,
      ngu_van: dto.nguVan !== undefined ? dto.nguVan : currentDto.scores.nguVan,
      ngoai_ngu: dto.ngoaiNgu !== undefined ? dto.ngoaiNgu : currentDto.scores.ngoaiNgu,
      vat_li: dto.vatLi !== undefined ? dto.vatLi : currentDto.scores.vatLi,
      hoa_hoc: dto.hoaHoc !== undefined ? dto.hoaHoc : currentDto.scores.hoaHoc,
      sinh_hoc: dto.sinhHoc !== undefined ? dto.sinhHoc : currentDto.scores.sinhHoc,
      lich_su: dto.lichSu !== undefined ? dto.lichSu : currentDto.scores.lichSu,
      dia_li: dto.diaLi !== undefined ? dto.diaLi : currentDto.scores.diaLi,
      gdcd: dto.gdcd !== undefined ? dto.gdcd : currentDto.scores.gdcd,
      ma_ngoai_ngu: dto.maNgoaiNgu !== undefined ? dto.maNgoaiNgu : currentDto.maNgoaiNgu,
    };

    const updatedStudent = StudentFactory.createFromRaw(mergedData);
    const updated = await this.studentRepository.update(updatedStudent);
    return updated.toDTO();
  }
}
