import { StudentGroup } from '../enums/StudentGroup.js';
import { Score } from '../value-objects/Score.js';

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

    const naturalSum = vatLi + hoaHoc + sinhHoc;
    const socialSum = lichSu + diaLi + gdcd;

    // 1. Compare total subject sums
    if (socialSum > naturalSum) {
      return StudentGroup.SOCIAL;
    }

    if (naturalSum > socialSum) {
      return StudentGroup.NATURAL;
    }

    // 2. Compare positive score count (> 0)
    const naturalPositives = (vatLi > 0 ? 1 : 0) + (hoaHoc > 0 ? 1 : 0) + (sinhHoc > 0 ? 1 : 0);
    const socialPositives = (lichSu > 0 ? 1 : 0) + (diaLi > 0 ? 1 : 0) + (gdcd > 0 ? 1 : 0);

    if (socialPositives > naturalPositives) {
      return StudentGroup.SOCIAL;
    }

    if (naturalPositives > socialPositives) {
      return StudentGroup.NATURAL;
    }

    // 3. Fallback: check non-null presence if input uses nulls for non-taken subjects
    const naturalNonNullCount =
      (isExplicitlyNotNull(scores.vatLi) ? 1 : 0) +
      (isExplicitlyNotNull(scores.hoaHoc) ? 1 : 0) +
      (isExplicitlyNotNull(scores.sinhHoc) ? 1 : 0);

    const socialNonNullCount =
      (isExplicitlyNotNull(scores.lichSu) ? 1 : 0) +
      (isExplicitlyNotNull(scores.diaLi) ? 1 : 0) +
      (isExplicitlyNotNull(scores.gdcd) ? 1 : 0);

    if (socialNonNullCount > naturalNonNullCount) {
      return StudentGroup.SOCIAL;
    }

    // Default to NATURAL
    return StudentGroup.NATURAL;
  }
}
