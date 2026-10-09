import { StudentGroupDetector } from '../../src/modules/student/domain/services/StudentGroupDetector.js';
import { StudentGroup } from '../../src/modules/student/domain/enums/StudentGroup.js';
import { UnknownStudentGroupError } from '../../src/shared/errors/AppError.js';

describe('StudentGroupDetector Unit Tests', () => {
  test('should detect NATURAL group when natural subject scores exist', () => {
    const group = StudentGroupDetector.detectGroup({
      sbd: '1000001',
      vatLi: 8.0,
      hoaHoc: 7.5,
      sinhHoc: 6.0,
      lichSu: null,
      diaLi: null,
      gdcd: null,
    });
    expect(group).toBe(StudentGroup.NATURAL);
  });

  test('should detect SOCIAL group when social subject scores exist', () => {
    const group = StudentGroupDetector.detectGroup({
      sbd: '1000002',
      vatLi: null,
      hoaHoc: null,
      sinhHoc: null,
      lichSu: 8.5,
      diaLi: 7.0,
      gdcd: 9.0,
    });
    expect(group).toBe(StudentGroup.SOCIAL);
  });

  test('should handle partial scores without throwing error', () => {
    const group = StudentGroupDetector.detectGroup({
      sbd: '1000003',
      vatLi: 8.0,
      hoaHoc: null,
      sinhHoc: null,
      lichSu: null,
      diaLi: null,
      gdcd: null,
    });
    expect(group).toBe(StudentGroup.NATURAL);
  });

  test('should detect SOCIAL group when non-taken natural subjects are 0.0 (e.g. SBD 01000022)', () => {
    const group = StudentGroupDetector.detectGroup({
      sbd: '01000022',
      vatLi: 0,
      hoaHoc: 0,
      sinhHoc: 0,
      lichSu: 5.75,
      diaLi: 6.25,
      gdcd: 0,
    });
    expect(group).toBe(StudentGroup.SOCIAL);
  });

  test('should throw UnknownStudentGroupError when candidate has mixed Natural and Social scores', () => {
    expect(() =>
      StudentGroupDetector.detectGroup({
        sbd: '01000000',
        vatLi: 8.0,
        lichSu: 7.25,
      })
    ).toThrow(UnknownStudentGroupError);
  });

  test('should throw UnknownStudentGroupError when candidate has 0 scores in all elective subjects', () => {
    expect(() =>
      StudentGroupDetector.detectGroup({
        sbd: '01000099',
        vatLi: 0,
        hoaHoc: 0,
        sinhHoc: 0,
        lichSu: 0,
        diaLi: 0,
        gdcd: 0,
      })
    ).toThrow(UnknownStudentGroupError);
  });
});
