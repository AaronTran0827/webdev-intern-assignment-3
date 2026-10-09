import { Student, BaseStudentProps } from './Student.js';
import { Score } from '../value-objects/Score.js';
import { StudentGroup } from '../enums/StudentGroup.js';
import {
  Subject,
  PhysicsSubject,
  ChemistrySubject,
  BiologySubject,
} from '../subjects/Subject.js';

export interface NaturalStudentProps extends BaseStudentProps {
  vatLi?: Score | number | null;
  hoaHoc?: Score | number | null;
  sinhHoc?: Score | number | null;
}

/**
 * Concrete NaturalStudent Entity (Khối Tự Nhiên)
 * Implements Polymorphic behaviors specific to Natural stream.
 */
export class NaturalStudent extends Student {
  public readonly vatLi: Score;
  public readonly hoaHoc: Score;
  public readonly sinhHoc: Score;

  constructor(props: NaturalStudentProps) {
    super(props);
    this.vatLi = props.vatLi instanceof Score ? props.vatLi : new Score(props.vatLi);
    this.hoaHoc = props.hoaHoc instanceof Score ? props.hoaHoc : new Score(props.hoaHoc);
    this.sinhHoc = props.sinhHoc instanceof Score ? props.sinhHoc : new Score(props.sinhHoc);
  }

  public override getGroup(): StudentGroup {
    return StudentGroup.NATURAL;
  }

  public override getGroupSubjects(): Subject[] {
    return [new PhysicsSubject(), new ChemistrySubject(), new BiologySubject()];
  }

  /**
   * Calculates Khối A Total Score (Toán, Lý, Hóa)
   */
  public getGroupAScore(): number {
    return Math.round((this.toan.getValue() + this.vatLi.getValue() + this.hoaHoc.getValue()) * 100) / 100;
  }

  /**
   * Calculates Khối B Total Score (Toán, Hóa, Sinh)
   */
  public getGroupBScore(): number {
    return Math.round((this.toan.getValue() + this.hoaHoc.getValue() + this.sinhHoc.getValue()) * 100) / 100;
  }

  /**
   * Calculates Khối A1 Total Score (Toán, Lý, Anh)
   */
  public getGroupA1Score(): number {
    return Math.round((this.toan.getValue() + this.vatLi.getValue() + this.ngoaiNgu.getValue()) * 100) / 100;
  }

  public override calculateAverageScore(): number {
    return this.calculateAverage([
      this.toan,
      this.nguVan,
      this.ngoaiNgu,
      this.vatLi,
      this.hoaHoc,
      this.sinhHoc,
    ]);
  }

  public override toDTO(): Record<string, any> {
    return {
      sbd: this.sbd,
      group: this.getGroup(),
      maNgoaiNgu: this.maNgoaiNgu,
      averageScore: this.calculateAverageScore(),
      scores: {
        toan: this.toan.getValue(),
        nguVan: this.nguVan.getValue(),
        ngoaiNgu: this.ngoaiNgu.getValue(),
        vatLi: this.vatLi.getValue(),
        hoaHoc: this.hoaHoc.getValue(),
        sinhHoc: this.sinhHoc.getValue(),
      },
      combinations: {
        groupA: this.getGroupAScore(),
        groupB: this.getGroupBScore(),
        groupA1: this.getGroupA1Score(),
      },
    };
  }
}
