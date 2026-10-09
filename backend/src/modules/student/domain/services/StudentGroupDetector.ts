import { StudentGroup } from '../enums/StudentGroup.js';
import { Score } from '../value-objects/Score.js';
import { UnknownStudentGroupError } from '../../../../shared/errors/AppError.js';

export interface RawScoresInput {
  sbd: string;
  vatLi?: Score | number | null;
  hoaHoc?: Score | number | null;
  sinhHoc?: Score | number | null;
  lichSu?: Score | number | null;
  diaLi?: Score | number | null;
  gdcd?: Score | number | null;
}

/**
 * Domain Service responsible for unambiguously detecting Student Group (NATURAL / SOCIAL)
 */
export class StudentGroupDetector {
  public static detectGroup(scores: RawScoresInput): StudentGroup {
    const extractNum = (val?: Score | number | null): number => {
      if (val === undefined || val === null) return 0;
      if (val instanceof Score) return val.isNull() ? 0 : val.getValue();
      return typeof val === 'number' && !isNaN(val) ? val : 0;
    };

    const isExplicitlyNotNull = (val?: Score | number | null): boolean => {
      if (val === undefined || val === null) return false;
      if (val instanceof Score) return !val.isNull();
      return true;
    };

    const vatLi = extractNum(scores.vatLi);
    const hoaHoc = extractNum(scores.hoaHoc);
    const sinhHoc = extractNum(scores.sinhHoc);

    const lichSu = extractNum(scores.lichSu);
    const diaLi = extractNum(scores.diaLi);
    const gdcd = extractNum(scores.gdcd);

    const naturalPositives = (vatLi > 0 ? 1 : 0) + (hoaHoc > 0 ? 1 : 0) + (sinhHoc > 0 ? 1 : 0);
    const socialPositives = (lichSu > 0 ? 1 : 0) + (diaLi > 0 ? 1 : 0) + (gdcd > 0 ? 1 : 0);

    // If candidate has positive scores (> 0) in BOTH Natural and Social groups,
    // it is an invalid mixed combination ("nửa Tự nhiên nửa Xã hội"). Reject creation!
    if (naturalPositives > 0 && socialPositives > 0) {
      throw new UnknownStudentGroupError(scores.sbd);
    }

    if (naturalPositives > 0 && socialPositives === 0) {
      return StudentGroup.NATURAL;
    }

    if (socialPositives > 0 && naturalPositives === 0) {
      return StudentGroup.SOCIAL;
    }

    // Fallback if no positive scores (>0) in either group: check explicit non-null values
    const naturalNonNullCount =
      (isExplicitlyNotNull(scores.vatLi) ? 1 : 0) +
      (isExplicitlyNotNull(scores.hoaHoc) ? 1 : 0) +
      (isExplicitlyNotNull(scores.sinhHoc) ? 1 : 0);

    const socialNonNullCount =
      (isExplicitlyNotNull(scores.lichSu) ? 1 : 0) +
      (isExplicitlyNotNull(scores.diaLi) ? 1 : 0) +
      (isExplicitlyNotNull(scores.gdcd) ? 1 : 0);

    if (naturalNonNullCount > 0 && socialNonNullCount === 0) {
      return StudentGroup.NATURAL;
    }

    if (socialNonNullCount > 0 && naturalNonNullCount === 0) {
      return StudentGroup.SOCIAL;
    }

    // Ambiguous or no valid group detected
    throw new UnknownStudentGroupError(scores.sbd);
  }
}
