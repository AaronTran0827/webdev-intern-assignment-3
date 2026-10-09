import { Router } from 'express';
import { StudentController } from '../controllers/StudentController.js';

export const createStudentRouter = (studentController: StudentController): Router => {
  const router = Router();

  // GET /api/reports - Score statistics report across 4 levels (>=8, 6-8, 4-6, <4)
  router.get('/reports', studentController.getReports);

  // GET /api/students/top-10 - Top 10 students leaderboard (supports blocks: A00, A01, B00, C00, D01)
  router.get('/students/top-10', studentController.getTop10);
  router.get('/students/top-group-a', studentController.getTop10);

  // GET /api/students - List all students (paginated & filtered)
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
