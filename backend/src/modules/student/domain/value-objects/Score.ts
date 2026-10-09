import { InvalidScoreError } from '../../../../shared/errors/AppError.js';

/**
 * Score Value Object
 * Encapsulates and enforces invariants for exam subject scores [0.0 .. 10.0].
 * If a score is omitted or null/empty (e.g. absent from exam paper), it defaults to 0.0.
 */
export class Score {
  private readonly value: number;

  constructor(score?: number | null) {
    if (score === undefined || score === null || (typeof score === 'string' && (score as string).trim() === '')) {
      this.value = 0.0;
      return;
    }

    const numScore = Number(score);

    if (typeof numScore !== 'number' || isNaN(numScore) || numScore < 0.0 || numScore > 10.0) {
      throw new InvalidScoreError(score);
    }

    // Round to 2 decimal places to avoid IEEE 754 precision issues
    this.value = Math.round(numScore * 100) / 100;
  }

  public getValue(): number {
    return this.value;
  }

  public isNull(): boolean {
    return this.value === 0.0;
  }

  public isPassing(): boolean {
    return this.value > 1.0;
  }

  public equals(other: Score): boolean {
    return this.value === other.getValue();
  }
}
