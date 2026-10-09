import { Score } from '../value-objects/Score.js';
import { StudentGroup } from '../enums/StudentGroup.js';
import { Subject } from '../subjects/Subject.js';

export interface BaseStudentProps {
  sbd: string;
  toan?: Score | number | null;
  nguVan?: Score | number | null;
  ngoaiNgu?: Score | number | null;
  maNgoaiNgu?: string | null;
}

/**
 * Abstract Base Class for Student Domain Entity
 * Demonstrates Abstraction, Encapsulation, and Polymorphism.
 */
export abstract class Student {
  public readonly sbd: string;
  public readonly toan: Score;
  public readonly nguVan: Score;
  public readonly ngoaiNgu: Score;
  public readonly maNgoaiNgu: string | null;

  constructor(props: BaseStudentProps) {
    this.sbd = props.sbd;
    this.toan = props.toan instanceof Score ? props.toan : new Score(props.toan);
    this.nguVan = props.nguVan instanceof Score ? props.nguVan : new Score(props.nguVan);
    this.ngoaiNgu = props.ngoaiNgu instanceof Score ? props.ngoaiNgu : new Score(props.ngoaiNgu);
    this.maNgoaiNgu = props.maNgoaiNgu || null;
  }

  /**
   * Abstract Polymorphic methods to be overridden by NaturalStudent & SocialStudent
   */
  public abstract getGroup(): StudentGroup;
  public abstract getGroupSubjects(): Subject[];
  public abstract calculateAverageScore(): number;
  public abstract toDTO(): Record<string, any>;

  /**
   * Protected helper to calculate exact rounded average of scores
   */
  protected calculateAverage(scores: Score[]): number {
    if (scores.length === 0) return 0.0;
    const sum = scores.reduce((acc, curr) => acc + curr.getValue(), 0);
    return Math.round((sum / scores.length) * 100) / 100;
  }
}
