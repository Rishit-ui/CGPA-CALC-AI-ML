import { GradeBoundary, PassingRules, SubjectConfig, SubjectMarks, PreviousSemester } from '../types';

export const DEFAULT_SUBJECTS: SubjectConfig[] = [
  { id: 'sub-1', code: 'AS&SP', name: 'Applied Statistics & Stochastic Processes', credits: 3, ciaMax: 60, seeMax: 40, isSec: false },
  { id: 'sub-2', code: 'DS', name: 'Data Structures & Algorithms', credits: 4, ciaMax: 60, seeMax: 40, isSec: false },
  { id: 'sub-3', code: 'PDM', name: 'Python & Data Management', credits: 4, ciaMax: 60, seeMax: 40, isSec: false },
  { id: 'sub-4', code: 'AI', name: 'Artificial Intelligence & Intelligent Agents', credits: 3, ciaMax: 60, seeMax: 40, isSec: false },
  { id: 'sub-5', code: 'COA', name: 'Computer Organization & Architecture', credits: 3, ciaMax: 60, seeMax: 40, isSec: false },
  { id: 'sub-6', code: 'AIES', name: 'AI Ethics, Society & Emerging Technologies', credits: 3, ciaMax: 60, seeMax: 40, isSec: false },
  { id: 'sub-7', code: 'SEC', name: 'Skill Enhancement Course', credits: 2, ciaMax: 100, seeMax: 0, isSec: true },
];

export const DEFAULT_GRADE_BOUNDARIES: GradeBoundary[] = [
  { grade: 'O', minMarks: 90, maxMarks: 100, gradePoints: 10, description: 'Outstanding' },
  { grade: 'A+', minMarks: 80, maxMarks: 89.99, gradePoints: 9, description: 'Excellent' },
  { grade: 'A', minMarks: 70, maxMarks: 79.99, gradePoints: 8, description: 'Very Good' },
  { grade: 'B+', minMarks: 60, maxMarks: 69.99, gradePoints: 7, description: 'Good' },
  { grade: 'B', minMarks: 55, maxMarks: 59.99, gradePoints: 6, description: 'Above Average' },
  { grade: 'C', minMarks: 50, maxMarks: 54.99, gradePoints: 5, description: 'Average' },
  { grade: 'P', minMarks: 40, maxMarks: 49.99, gradePoints: 4, description: 'Pass' },
  { grade: 'F', minMarks: 0, maxMarks: 39.99, gradePoints: 0, description: 'Fail / Re-appear' },
];

export const DEFAULT_PASSING_RULES: PassingRules = {
  ciaMinPercent: 40,      // 24 / 60
  seeMinPercent: 40,      // 16 / 40
  overallMinPercent: 40,  // 40 / 100
  secMinPercent: 40,      // 40 / 100
};

export const DEMO_MARKS: Record<string, SubjectMarks> = {
  'sub-1': { subjectId: 'sub-1', ciaObtained: 48, seeObtained: 32 }, // AS&SP: 48 + 32 = 80 (A+)
  'sub-2': { subjectId: 'sub-2', ciaObtained: 52, seeObtained: 34 }, // DS: 52 + 34 = 86 (A+)
  'sub-3': { subjectId: 'sub-3', ciaObtained: 54, seeObtained: 37 }, // PDM: 54 + 37 = 91 (O)
  'sub-4': { subjectId: 'sub-4', ciaObtained: 46, seeObtained: 29 }, // AI: 46 + 29 = 75 (A)
  'sub-5': { subjectId: 'sub-5', ciaObtained: 45, seeObtained: 28 }, // COA: 45 + 28 = 73 (A)
  'sub-6': { subjectId: 'sub-6', ciaObtained: 50, seeObtained: 33 }, // AIES: 50 + 33 = 83 (A+)
  'sub-7': { subjectId: 'sub-7', ciaObtained: 88, seeObtained: 0 },  // SEC: 88 (A+)
};

export const DEMO_PREVIOUS_SEMESTERS: PreviousSemester[] = [
  { id: 'prev-1', semesterName: 'Semester 1', sgpa: 8.45, credits: 20 },
  { id: 'prev-2', semesterName: 'Semester 2', sgpa: 8.70, credits: 22 },
  { id: 'prev-3', semesterName: 'Semester 3', sgpa: 8.60, credits: 22 },
];
