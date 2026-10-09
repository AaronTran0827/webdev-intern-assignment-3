import { Score } from '../../src/modules/student/domain/value-objects/Score.js';
import { InvalidScoreError } from '../../src/shared/errors/AppError.js';

describe('Score Value Object Unit Tests', () => {
  test('should accept valid score numbers [0.0 - 10.0] including 0.05 increments like 9.75', () => {
    const s1 = new Score(8.5);
    const s2 = new Score(0);
    const s3 = new Score(10);
    const s4 = new Score(9.75);
    const s5 = new Score(0.05);

    expect(s1.getValue()).toBe(8.5);
    expect(s2.getValue()).toBe(0);
    expect(s3.getValue()).toBe(10);
    expect(s4.getValue()).toBe(9.75);
    expect(s5.getValue()).toBe(0.05);
    expect(s1.isNull()).toBe(false);
  });

  test('should default null or undefined score to 0.0 value', () => {
    const s1 = new Score(null);
    const s2 = new Score(undefined);

    expect(s1.getValue()).toBe(0.0);
    expect(s2.getValue()).toBe(0.0);
    expect(s1.isNull()).toBe(true);
    expect(s2.isNull()).toBe(true);
  });

  test('should throw InvalidScoreError for out-of-range or NaN scores', () => {
    expect(() => new Score(-0.5)).toThrow(InvalidScoreError);
    expect(() => new Score(10.5)).toThrow(InvalidScoreError);
    expect(() => new Score(NaN)).toThrow(InvalidScoreError);
  });
});
