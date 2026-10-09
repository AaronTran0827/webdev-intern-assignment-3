import { Student } from '../entities/Student.js';
import { StudentGroup } from '../enums/StudentGroup.js';

export interface IStudentRepository {
  findBySbd(sbd: string): Promise<Student | null>;
  findAll(): Promise<Student[]>;
  findByGroup(group: StudentGroup): Promise<Student[]>;
  save(student: Student): Promise<Student>;
  update(student: Student): Promise<Student>;
  delete(sbd: string): Promise<boolean>;
}
