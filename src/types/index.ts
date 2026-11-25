export interface GradeBoundary {
  grade: string;
  minMarks: number;
  maxMarks: number;
  gradePoints: number;
  description?: string;
}

export interface PassingRules {
  ciaMinPercent: number; // e.g. 40% (24 / 60)
  seeMinPercent: number; // e.g. 40% (16 / 40)
  overallMinPercent: number; // e.g. 40% (40 / 100)
  secMinPercent: number; // e.g. 40% (40 / 100)
}

export interface SubjectConfig {
  id: string;
  code: string;
  name: string;
  credits: number;
  ciaMax: number;
  seeMax: number;
  isSec?: boolean; // If true, SEE is 0, evaluated purely on CIA
}

export interface SubjectMarks {
  subjectId: string;
  ciaObtained: number;
  seeObtained?: number; // Optional until entered; defaults to 0 if null
}

export type SubjectStatus = 'PASS' | 'FAIL_CIA' | 'FAIL_SEE' | 'FAIL_OVERALL';

export interface CalculatedSubject {
  config: SubjectConfig;
  ciaObtained: number;
  seeObtained: number;
  totalMarks: number;
  maxPossibleTotal: number;
  grade: string;
  gradePoints: number;
  creditWeightedPoints: number;
  status: SubjectStatus;
  statusMessage: string;
  isPassed: boolean;
  isCiaEligible: boolean;
  isSeeEligible: boolean;
}

export interface TargetGradePrediction {
  targetGrade: string;
  targetGradePoints: number;
  requiredTotal: number;
  requiredSee: number; // Direct difference: minMarks - cia
  effectiveSeeRequired: number; // Enforcing minimum passing SEE requirement
  isAchievable: boolean;
  status: 'ACHIEVED_ALREADY' | 'ACHIEVABLE' | 'IMPOSSIBLE_EXCEEDS_MAX' | 'INELIGIBLE_CIA';
  notes: string;
}

export interface SubjectPredictionSummary {
  subjectId: string;
  subjectName: string;
  code: string;
  credits: number;
  isSec: boolean;
  currentCia: number;
  maxCia: number;
  maxSee: number;
  maxPossibleTotal: number;
  maxPossibleGrade: string;
  nextAchievableGrade: string | null;
  marksNeededForNextGrade: number | null;
  predictions: TargetGradePrediction[];
}

export interface TargetSgpaSubjectRecommendation {
  subjectId: string;
  code: string;
  credits: number;
  targetGrade: string;
  targetGradePoints: number;
  requiredSee: number;
  isSec: boolean;
}

export interface TargetSgpaPlan {
  targetSgpa: number;
  achievableSgpa: number;
  isPossible: boolean;
  totalRequiredSeeMarks: number;
  subjects: TargetSgpaSubjectRecommendation[];
  creditImpactRankings: {
    subjectId: string;
    code: string;
    credits: number;
    impactScore: number; // Points gained per mark
    advice: string;
  }[];
  explanation: string;
}

export interface SemesterOverview {
  totalSubjects: number;
  totalCredits: number;
  totalCiaObtained: number;
  totalPossibleCia: number;
  ciaPercentage: number;
  expectedSgpa: number;
  highestPossibleSgpa: number;
  lowestPossibleSgpa: number;
  totalPassedSubjects: number;
  totalFailedSubjects: number;
}

export interface PreviousSemester {
  id: string;
  semesterName: string;
  sgpa: number;
  credits: number;
}

export interface CgpaSummary {
  hasPreviousSemesters: boolean;
  totalCumulativeCredits: number;
  cumulativeCgpa: number;
  currentSemesterCredits: number;
  currentSemesterSgpa: number;
}

export type ScenarioType = 'conservative' | 'expected' | 'best_case';

export interface PerformanceScenario {
  id: ScenarioType;
  name: string;
  description: string;
  seePercentages: Record<string, number>; // subjectId -> SEE percentage or marks
  calculatedSgpa: number;
}
