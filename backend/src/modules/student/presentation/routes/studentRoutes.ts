import { Router } from 'express';
import { StudentController } from '../controllers/StudentController.js';

export const createStudentRouter = (studentController: StudentController): Router => {
  const router = Router();

  // GET /api/students - List all students
  router.get('/students', studentController.getAll);

  // GET /api/students/group/natural - Filter Natural stream students
  router.get('/students/group/natural', studentController.getNaturalGroup);

  // GET /api/students/group/social - Filter Social stream students
  router.get('/students/group/social', studentController.getSocialGroup);

  // GET /api/students/:sbd - Get student details by SBD
  router.get('/students/:sbd', studentController.getBySbd);

  // POST /api/students - Create new student
  router.post('/students', studentController.create);

  // PUT /api/students/:sbd - Update student
  router.put('/students/:sbd', studentController.update);

  // DELETE /api/students/:sbd - Delete student
  router.delete('/students/:sbd', studentController.delete);

  return router;
};
