import { InvalidScoreError } from '../../../../shared/errors/AppError.js';

/**
 * Score Value Object
 * Encapsulates and enforces invariants for exam subject scores [0.0 .. 10.0] or null.
 */
export class Score {
  private readonly value: number | null;

  constructor(score: number | null | undefined) {
    if (score === undefined || score === null) {
      this.value = null;
      return;
    }

    if (typeof score !== 'number' || isNaN(score) || score < 0 || score > 10) {
      throw new InvalidScoreError(score);
    }

    // Round to 2 decimal places to avoid IEEE 754 precision issues
    this.value = Math.round(score * 100) / 100;
  }

  public getValue(): number | null {
    return this.value;
  }

  public isNull(): boolean {
    return this.value === null;
  }

  public isPassing(): boolean {
    return this.value !== null && this.value > 1.0;
  }

  public equals(other: Score): boolean {
    return this.value === other.getValue();
  }
}
