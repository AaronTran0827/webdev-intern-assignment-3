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

    const isNatural =
      hasValue(scores.vatLi) &&
      hasValue(scores.hoaHoc) &&
      hasValue(scores.sinhHoc);

    const isSocial =
      hasValue(scores.lichSu) &&
      hasValue(scores.diaLi) &&
      hasValue(scores.gdcd);

    // If both exist or neither exists -> Throw UnknownStudentGroupError
    if (isNatural && isSocial) {
      throw new UnknownStudentGroupError(scores.sbd);
    }

    if (isNatural) {
      return StudentGroup.NATURAL;
    }

    if (isSocial) {
      return StudentGroup.SOCIAL;
    }

    throw new UnknownStudentGroupError(scores.sbd);
  }
}
