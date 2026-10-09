import { StudentGroup } from '../enums/StudentGroup.js';

export abstract class Subject {
  public abstract readonly code: string;
  public abstract readonly name: string;
  public readonly groupRequirement?: StudentGroup;

  /**
   * Domain behavior method evaluating if this subject is available for a given student group
   */
  public isAvailableForGroup(group: StudentGroup): boolean {
    if (!this.groupRequirement) return true; // Core subjects (Toán, Văn, Anh) available for all groups
    return this.groupRequirement === group;
  }
}

export class MathSubject extends Subject {
  public readonly code = 'toan';
  public readonly name = 'Toán học';
}

export class LiteratureSubject extends Subject {
  public readonly code = 'ngu_van';
  public readonly name = 'Ngữ văn';
}

export class ForeignLanguageSubject extends Subject {
  public readonly code = 'ngoai_ngu';
  public readonly name = 'Ngoại ngữ';
}

export class PhysicsSubject extends Subject {
  public readonly code = 'vat_li';
  public readonly name = 'Vật lý';
  public readonly groupRequirement = StudentGroup.NATURAL;
}

export class ChemistrySubject extends Subject {
  public readonly code = 'hoa_hoc';
  public readonly name = 'Hóa học';
  public readonly groupRequirement = StudentGroup.NATURAL;
}

export class BiologySubject extends Subject {
  public readonly code = 'sinh_hoc';
  public readonly name = 'Sinh học';
  public readonly groupRequirement = StudentGroup.NATURAL;
}

export class HistorySubject extends Subject {
  public readonly code = 'lich_su';
  public readonly name = 'Lịch sử';
  public readonly groupRequirement = StudentGroup.SOCIAL;
}

export class GeographySubject extends Subject {
  public readonly code = 'dia_li';
  public readonly name = 'Địa lý';
  public readonly groupRequirement = StudentGroup.SOCIAL;
}

export class CivicEducationSubject extends Subject {
  public readonly code = 'gdcd';
  public readonly name = 'GDCD';
  public readonly groupRequirement = StudentGroup.SOCIAL;
}
