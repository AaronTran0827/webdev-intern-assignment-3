import { Student, BaseStudentProps } from './Student.js';
import { Score } from '../value-objects/Score.js';
import { StudentGroup } from '../enums/StudentGroup.js';
import {
  Subject,
  HistorySubject,
  GeographySubject,
  CivicEducationSubject,
} from '../subjects/Subject.js';

export interface SocialStudentProps extends BaseStudentProps {
  lichSu: Score | number | null;
  diaLi: Score | number | null;
  gdcd: Score | number | null;
}

/**
 * Concrete SocialStudent Entity (Khối Xã Hội)
 * Implements Polymorphic behaviors specific to Social stream.
 */
export class SocialStudent extends Student {
  public readonly lichSu: Score;
  public readonly diaLi: Score;
  public readonly gdcd: Score;

  constructor(props: SocialStudentProps) {
    super(props);
    this.lichSu = props.lichSu instanceof Score ? props.lichSu : new Score(props.lichSu);
    this.diaLi = props.diaLi instanceof Score ? props.diaLi : new Score(props.diaLi);
    this.gdcd = props.gdcd instanceof Score ? props.gdcd : new Score(props.gdcd);
  }

  public override getGroup(): StudentGroup {
    return StudentGroup.SOCIAL;
  }

  public override getGroupSubjects(): Subject[] {
    return [new HistorySubject(), new GeographySubject(), new CivicEducationSubject()];
  }

  /**
   * Calculates Khối C Total Score (Văn, Sử, Địa)
   */
  public getGroupCScore(): number | null {
    if (this.nguVan.isNull() || this.lichSu.isNull() || this.diaLi.isNull()) return null;
    return Math.round((this.nguVan.getValue()! + this.lichSu.getValue()! + this.diaLi.getValue()!) * 100) / 100;
  }

  /**
   * Calculates Khối D Total Score (Toán, Văn, Anh)
   */
  public getGroupDScore(): number | null {
    if (this.toan.isNull() || this.nguVan.isNull() || this.ngoaiNgu.isNull()) return null;
    return Math.round((this.toan.getValue()! + this.nguVan.getValue()! + this.ngoaiNgu.getValue()!) * 100) / 100;
  }

  public override calculateAverageScore(): number | null {
    return this.calculateAverage([
      this.toan,
      this.nguVan,
      this.ngoaiNgu,
      this.lichSu,
      this.diaLi,
      this.gdcd,
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
        lichSu: this.lichSu.getValue(),
        diaLi: this.diaLi.getValue(),
        gdcd: this.gdcd.getValue(),
      },
      combinations: {
        groupC: this.getGroupCScore(),
        groupD: this.getGroupDScore(),
      },
    };
  }
}
