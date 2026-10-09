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
    const hasValue = (val?: Score | number | null): boolean => {
      if (val === undefined || val === null) return false;
      if (val instanceof Score) return !val.isNull();
      return true;
    };

    const naturalCount =
      (hasValue(scores.vatLi) ? 1 : 0) +
      (hasValue(scores.hoaHoc) ? 1 : 0) +
      (hasValue(scores.sinhHoc) ? 1 : 0);

    const socialCount =
      (hasValue(scores.lichSu) ? 1 : 0) +
      (hasValue(scores.diaLi) ? 1 : 0) +
      (hasValue(scores.gdcd) ? 1 : 0);

    if (socialCount > naturalCount) {
      return StudentGroup.SOCIAL;
    }

    // Default to NATURAL if naturalCount >= socialCount (handles full or partial scores and mandatory-only subjects)
    return StudentGroup.NATURAL;
  }
}
