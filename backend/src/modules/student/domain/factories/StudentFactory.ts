import { Student } from '../entities/Student.js';
import { NaturalStudent } from '../entities/NaturalStudent.js';
import { SocialStudent } from '../entities/SocialStudent.js';
import { StudentGroupDetector } from '../services/StudentGroupDetector.js';
import { StudentGroup } from '../enums/StudentGroup.js';

export interface RawStudentDatabaseRow {
  sbd: string;
  toan?: number | null;
  ngu_van?: number | null;
  ngoai_ngu?: number | null;
  vat_li?: number | null;
  hoa_hoc?: number | null;
  sinh_hoc?: number | null;
  lich_su?: number | null;
  dia_li?: number | null;
  gdcd?: number | null;
  ma_ngoai_ngu?: string | null;
}

/**
 * Factory Pattern: Instantiates concrete Student Domain Entities from Raw Data Rows
 */
export class StudentFactory {
  public static createFromRaw(raw: RawStudentDatabaseRow): Student {
    const group = StudentGroupDetector.detectGroup({
      sbd: raw.sbd,
      vatLi: raw.vat_li,
      hoaHoc: raw.hoa_hoc,
      sinhHoc: raw.sinh_hoc,
      lichSu: raw.lich_su,
      diaLi: raw.dia_li,
      gdcd: raw.gdcd,
    });

    if (group === StudentGroup.SOCIAL) {
      return new SocialStudent({
        sbd: raw.sbd,
        toan: raw.toan ?? 0.0,
        nguVan: raw.ngu_van ?? 0.0,
        ngoaiNgu: raw.ngoai_ngu ?? 0.0,
        maNgoaiNgu: raw.ma_ngoai_ngu ?? null,
        lichSu: raw.lich_su ?? 0.0,
        diaLi: raw.dia_li ?? 0.0,
        gdcd: raw.gdcd ?? 0.0,
      });
    }

    return new NaturalStudent({
      sbd: raw.sbd,
      toan: raw.toan ?? 0.0,
      nguVan: raw.ngu_van ?? 0.0,
      ngoaiNgu: raw.ngoai_ngu ?? 0.0,
      maNgoaiNgu: raw.ma_ngoai_ngu ?? null,
      vatLi: raw.vat_li ?? 0.0,
      hoaHoc: raw.hoa_hoc ?? 0.0,
      sinhHoc: raw.sinh_hoc ?? 0.0,
    });
  }
}
