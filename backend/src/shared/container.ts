import { prisma } from '../config/database.js';
import { PrismaStudentRepository } from '../modules/student/infrastructure/repositories/PrismaStudentRepository.js';

import { GetAllStudents } from '../modules/student/application/use-cases/GetAllStudents.js';
import { GetStudentBySbd } from '../modules/student/application/use-cases/GetStudentBySbd.js';
import { GetStudentsByGroup } from '../modules/student/application/use-cases/GetStudentsByGroup.js';
import { CreateStudent } from '../modules/student/application/use-cases/CreateStudent.js';
import { UpdateStudent } from '../modules/student/application/use-cases/UpdateStudent.js';
import { DeleteStudent } from '../modules/student/application/use-cases/DeleteStudent.js';
import { GetSubjectReport } from '../modules/student/application/use-cases/GetSubjectReport.js';
import { GetTop10Students } from '../modules/student/application/use-cases/GetTop10Students.js';

import { StudentController } from '../modules/student/presentation/controllers/StudentController.js';

/**
 * Composition Root (Dependency Injection Container)
 * Instantiates concrete infrastructure, injects repository into Use Cases,
 * and wires up presentation controllers cleanly.
 */
export const createContainer = () => {
  // 1. Infrastructure Layer
  const studentRepository = new PrismaStudentRepository(prisma);

  // 2. Application Layer (Use Cases)
  const getAllStudentsUseCase = new GetAllStudents(studentRepository);
  const getStudentBySbdUseCase = new GetStudentBySbd(studentRepository);
  const getStudentsByGroupUseCase = new GetStudentsByGroup(studentRepository);
  const createStudentUseCase = new CreateStudent(studentRepository);
  const updateStudentUseCase = new UpdateStudent(studentRepository);
  const deleteStudentUseCase = new DeleteStudent(studentRepository);
  const getSubjectReportUseCase = new GetSubjectReport(studentRepository);
  const getTop10StudentsUseCase = new GetTop10Students(studentRepository);

  // 3. Presentation Layer (Controllers)
  const studentController = new StudentController(
    getAllStudentsUseCase,
    getStudentBySbdUseCase,
    getStudentsByGroupUseCase,
    createStudentUseCase,
    updateStudentUseCase,
    deleteStudentUseCase,
    getSubjectReportUseCase,
    getTop10StudentsUseCase
  );

  return {
    studentController,
  };
};
