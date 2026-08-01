// In-memory data store for Edu-Space
import { v4 as uuidv4 } from 'uuid';

export const db = {
  users: [
    { id: 'admin_1', name: 'Admin Jane', role: 'admin', xp: 0, streak: 0 },
    { id: 'teacher_1', name: 'Mr. Smith', role: 'teacher', xp: 0, streak: 0 },
    { id: 'student_1', name: 'Alex Johnson', role: 'student', xp: 450, streak: 5 },
    { id: 'student_2', name: 'Sam Lee', role: 'student', xp: 620, streak: 12 },
    { id: 'student_3', name: 'Jordan Taylor', role: 'student', xp: 310, streak: 2 },
  ],
  classes: [
    { id: 'class_1', name: 'Advanced Mathematics', code: 'MATH201', teacherId: 'teacher_1', studentIds: ['student_1', 'student_2', 'student_3'], avgScore: 85 },
    { id: 'class_2', name: 'Introduction to Physics', code: 'PHYS101', teacherId: 'teacher_1', studentIds: ['student_1', 'student_2'], avgScore: 78 },
  ],
  quizzes: [
    { 
      id: 'quiz_1', 
      title: 'Algebra Basics', 
      classId: 'class_1', 
      createdBy: 'teacher_1',
      questions: [
        { 
          id: 'q1', 
          question: 'What is x if 2x = 10?', 
          options: ['2', '4', '5', '10'], 
          correctIndex: 2, 
          explanation: 'Divide both sides by 2.' 
        },
        { 
          id: 'q2', 
          question: 'Expand (a+b)^2', 
          options: ['a^2+b^2', 'a^2+2ab+b^2', 'a^2-2ab+b^2', '2a+2b'], 
          correctIndex: 1, 
          explanation: 'Use the binomial expansion formula.' 
        }
      ]
    }
  ],
  quizAttempts: [
    { id: 'attempt_1', quizId: 'quiz_1', studentId: 'student_1', answers: [2, 1], score: 100, timestamp: Date.now() - 86400000 },
    { id: 'attempt_2', quizId: 'quiz_1', studentId: 'student_2', answers: [2, 0], score: 50, timestamp: Date.now() - 43200000 },
  ],
  projects: [
    { id: 'proj_1', title: 'Math Portfolio', description: 'Collection of my best algebra work.', link: 'https://github.com/alex/math', studentId: 'student_1', status: 'approved', timestamp: Date.now() - 172800000 },
    { id: 'proj_2', title: 'Physics Engine', description: 'Simple 2D physics simulation.', link: 'https://github.com/sam/physics', studentId: 'student_2', status: 'pending', timestamp: Date.now() - 3600000 },
  ],
  events: [
    { id: 'event_1', title: 'Science Fair 2026', description: 'Annual school science fair. Bring your best projects!', date: Date.now() + 604800000, createdBy: 'admin_1', attendees: ['student_1', 'student_2'] },
    { id: 'event_2', title: 'Math Olympiad Prep', description: 'Intensive prep session for the upcoming Olympiad.', date: Date.now() + 172800000, createdBy: 'teacher_1', attendees: ['student_2'] },
  ],
  meetings: [
    { id: 'meet_1', classId: 'class_1', roomId: 'math-advanced-2026', startedBy: 'teacher_1', participants: ['student_1', 'student_2'], startTime: Date.now() - 1800000 },
  ],
  attendanceRecords: [
    { studentId: 'student_1', classId: 'class_1', date: new Date().toISOString().split('T')[0], method: 'meeting' },
    { studentId: 'student_2', classId: 'class_1', date: new Date().toISOString().split('T')[0], method: 'meeting' },
    { studentId: 'student_1', classId: 'class_2', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], method: 'manual' },
  ],
};

// Helper methods to read/write data in memory

export const getStudents = () => db.users.filter(u => u.role === 'student');
export const getTeachers = () => db.users.filter(u => u.role === 'teacher');
export const getClasses = () => db.classes;
export const getClassById = (id) => db.classes.find(c => c.id === id);
export const getQuizzesForClass = (classId) => db.quizzes.filter(q => q.classId === classId);
export const getProjectsForStudent = (studentId) => db.projects.filter(p => p.studentId === studentId);
export const getPendingProjects = () => db.projects.filter(p => p.status === 'pending');
export const getEvents = () => db.events;

export const addProject = (project) => {
  const newProject = { ...project, id: uuidv4(), timestamp: Date.now(), status: 'pending' };
  db.projects.push(newProject);
  return newProject;
};

export const updateProjectStatus = (projectId, status) => {
  const project = db.projects.find(p => p.id === projectId);
  if (project) {
    project.status = status;
  }
  return project;
};

export const addEvent = (event) => {
  const newEvent = { ...event, id: uuidv4(), attendees: [] };
  db.events.push(newEvent);
  return newEvent;
};

export const attendEvent = (eventId, studentId) => {
  const event = db.events.find(e => e.id === eventId);
  if (event && !event.attendees.includes(studentId)) {
    event.attendees.push(studentId);
    return true;
  }
  return false;
};

export const addQuiz = (quiz) => {
  const newQuiz = { ...quiz, id: uuidv4() };
  db.quizzes.push(newQuiz);
  return newQuiz;
};

export const updateUserXP = (userId, amount) => {
  const user = db.users.find(u => u.id === userId);
  if (user) {
    user.xp += amount;
  }
  return user;
};

// Admin CRUD Helpers
export const addTeacher = (teacherData) => {
  const newTeacher = { 
    id: `teacher_${uuidv4().slice(0,6)}`, 
    role: 'teacher', 
    xp: 0, 
    streak: 0,
    ...teacherData 
  };
  db.users.push(newTeacher);
  return newTeacher;
};

export const deleteTeacher = (teacherId) => {
  db.users = db.users.filter(u => u.id !== teacherId);
};

export const addClass = (classData) => {
  const newClass = {
    id: `class_${uuidv4().slice(0,6)}`,
    studentIds: [],
    avgScore: 0,
    ...classData
  };
  db.classes.push(newClass);
  return newClass;
};

export const deleteClass = (classId) => {
  db.classes = db.classes.filter(c => c.id !== classId);
};
