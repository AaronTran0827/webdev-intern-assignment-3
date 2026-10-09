import { StudentFactory } from '../../src/modules/student/domain/factories/StudentFactory.js';
import { NaturalStudent } from '../../src/modules/student/domain/entities/NaturalStudent.js';
import { SocialStudent } from '../../src/modules/student/domain/entities/SocialStudent.js';
import { StudentGroup } from '../../src/modules/student/domain/enums/StudentGroup.js';

describe('StudentFactory and Polymorphism Unit Tests', () => {
  test('should create NaturalStudent from Raw Natural Data', () => {
    const rawData = {
      sbd: '1000001',
      toan: 8.4,
      ngu_van: 6.75,
      ngoai_ngu: 8.0,
      vat_li: 6.0,
      hoa_hoc: 5.25,
      sinh_hoc: 5.0,
      ma_ngoai_ngu: 'N1',
    };

    const student = StudentFactory.createFromRaw(rawData);
    expect(student).toBeInstanceOf(NaturalStudent);
    expect(student.getGroup()).toBe(StudentGroup.NATURAL);
    expect((student as NaturalStudent).getGroupAScore()).toBe(19.65);
    expect((student as NaturalStudent).getGroupBScore()).toBe(18.65);
    expect((student as NaturalStudent).getGroupA1Score()).toBe(22.4);
    expect(student.calculateAverageScore()).toBe(6.57);
  });

  test('should create SocialStudent from Raw Social Data', () => {
    const rawData = {
      sbd: '1000002',
      toan: 8.6,
      ngu_van: 8.5,
      ngoai_ngu: 7.2,
      lich_su: 7.25,
      dia_li: 6.0,
      gdcd: 8.0,
      ma_ngoai_ngu: 'N1',
    };

    const student = StudentFactory.createFromRaw(rawData);
    expect(student).toBeInstanceOf(SocialStudent);
    expect(student.getGroup()).toBe(StudentGroup.SOCIAL);
    expect((student as SocialStudent).getGroupCScore()).toBe(21.75);
    expect((student as SocialStudent).getGroupDScore()).toBe(24.3);
    expect(student.calculateAverageScore()).toBe(7.59);
  });

  test('should correctly create SocialStudent and calculate average for candidate 01000022', () => {
    const rawData = {
      sbd: '01000022',
      toan: 0,
      ngu_van: 4.25,
      ngoai_ngu: 0,
      vat_li: 0,
      hoa_hoc: 0,
      sinh_hoc: 0,
      lich_su: 5.75,
      dia_li: 6.25,
      gdcd: 0,
    };

    const student = StudentFactory.createFromRaw(rawData);
    expect(student).toBeInstanceOf(SocialStudent);
    expect(student.getGroup()).toBe(StudentGroup.SOCIAL);
    expect(student.calculateAverageScore()).toBe(5.42); // (4.25 + 5.75 + 6.25) / 3 = 5.42
  });

  test('should correctly calculate average score for candidate 01000084 with 4 taken subjects', () => {
    const rawData = {
      sbd: '01000084',
      toan: 6.6,
      ngu_van: 5.0,
      ngoai_ngu: 0,
      lich_su: 7.5,
      dia_li: 6.75,
      gdcd: 0,
    };

    const student = StudentFactory.createFromRaw(rawData);
    expect(student).toBeInstanceOf(SocialStudent);
    expect(student.calculateAverageScore()).toBe(6.46); // (6.6 + 5.0 + 7.5 + 6.75) / 4 = 6.46
  });
});
