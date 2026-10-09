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

    if (group === StudentGroup.NATURAL) {
      return new NaturalStudent({
        sbd: raw.sbd,
        toan: raw.toan ?? null,
        nguVan: raw.ngu_van ?? null,
        ngoaiNgu: raw.ngoai_ngu ?? null,
        maNgoaiNgu: raw.ma_ngoai_ngu ?? null,
        vatLi: raw.vat_li ?? null,
        hoaHoc: raw.hoa_hoc ?? null,
        sinhHoc: raw.sinh_hoc ?? null,
      });
    }

    if (group === StudentGroup.SOCIAL) {
      return new SocialStudent({
        sbd: raw.sbd,
        toan: raw.toan ?? null,
        nguVan: raw.ngu_van ?? null,
        ngoaiNgu: raw.ngoai_ngu ?? null,
        maNgoaiNgu: raw.ma_ngoai_ngu ?? null,
        lichSu: raw.lich_su ?? null,
        diaLi: raw.dia_li ?? null,
        gdcd: raw.gdcd ?? null,
      });
    }

    throw new Error(`Unsupported student group for sbd: ${raw.sbd}`);
  }
}
