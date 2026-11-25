import { describe, it, expect } from 'vitest';
import {
  calculateSubject,
  calculateSgpa,
  calculateSemesterOverview,
  calculateSubjectPredictions,
  calculateTargetSgpaPlan,
  calculateCumulativeCgpa,
} from '../calculator';
import { DEFAULT_SUBJECTS, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES } from '../defaults';
import { SubjectConfig, PreviousSemester } from '../../types';

describe('GradePilot Calculation Engine Unit Tests', () => {
  const normalSubject: SubjectConfig = {
    id: 'sub-test',
    code: 'DS',
    name: 'Data Structures',
    credits: 4,
    ciaMax: 60,
    seeMax: 40,
    isSec: false,
  };

  const secSubject: SubjectConfig = {
    id: 'sec-test',
    code: 'SEC',
    name: 'Skill Enhancement',
    credits: 2,
    ciaMax: 100,
    seeMax: 0,
    isSec: true,
  };

  it('1. All CIA marks are zero', () => {
    const marksMap: Record<string, { ciaObtained: number; seeObtained?: number }> = {};
    DEFAULT_SUBJECTS.forEach(s => {
      marksMap[s.id] = { ciaObtained: 0, seeObtained: 0 };
    });

    const overview = calculateSemesterOverview(DEFAULT_SUBJECTS, marksMap, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(overview.totalCiaObtained).toBe(0);
    expect(overview.ciaPercentage).toBe(0);
    expect(overview.expectedSgpa).toBe(0);
    // Since CIA is 0 for normal subjects (below 24 min pass), they are ineligible
    expect(overview.highestPossibleSgpa).toBe(0);
    expect(overview.totalFailedSubjects).toBe(DEFAULT_SUBJECTS.length);
  });

  it('2. All CIA marks are maximum', () => {
    const marksMap: Record<string, { ciaObtained: number; seeObtained?: number }> = {};
    DEFAULT_SUBJECTS.forEach(s => {
      marksMap[s.id] = { ciaObtained: s.ciaMax, seeObtained: 0 };
    });

    const overview = calculateSemesterOverview(DEFAULT_SUBJECTS, marksMap, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    // Total possible CIA: 6 * 60 + 100 = 460
    expect(overview.totalCiaObtained).toBe(460);
    expect(overview.totalPossibleCia).toBe(460);
    expect(overview.ciaPercentage).toBe(100);
    // Highest possible with 40/40 in SEE: all 100/100 -> O grade (10.0 GP)
    expect(overview.highestPossibleSgpa).toBe(10.0);
  });

  it('3. SEC has 100 internal marks', () => {
    const result = calculateSubject(secSubject, 100, 0, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(result.totalMarks).toBe(100);
    expect(result.seeObtained).toBe(0);
    expect(result.grade).toBe('O');
    expect(result.gradePoints).toBe(10);
    expect(result.isPassed).toBe(true);
    expect(result.status).toBe('PASS');

    // Also check SEC prediction has no SEE
    const pred = calculateSubjectPredictions(secSubject, 100, 0, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(pred.maxSee).toBe(0);
    expect(pred.predictions[0].requiredSee).toBe(0);
    expect(pred.predictions[0].status).toBe('ACHIEVED_ALREADY');
  });

  it('4. Required SEE is exactly zero', () => {
    // When CIA is 90/60 (or clamped 60/60), required total for B+ (60) has raw requirement = 0
    const pred = calculateSubjectPredictions(normalSubject, 60, 0, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    const bPlus = pred.predictions.find(p => p.targetGrade === 'B+');
    expect(bPlus).toBeDefined();
    expect(bPlus!.requiredSee).toBe(0);
    // But must enforce minimum passing SEE requirement of 16/40
    expect(bPlus!.effectiveSeeRequired).toBe(16);
  });

  it('5. Required SEE is exactly 40', () => {
    // For O grade (90 total), if CIA is 50, required SEE is exactly 40/40
    const pred = calculateSubjectPredictions(normalSubject, 50, 0, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    const oGrade = pred.predictions.find(p => p.targetGrade === 'O');
    expect(oGrade).toBeDefined();
    expect(oGrade!.isAchievable).toBe(true);
    expect(oGrade!.requiredSee).toBe(40);
    expect(oGrade!.effectiveSeeRequired).toBe(40);
    expect(oGrade!.status).toBe('ACHIEVABLE');
  });

  it('6. Required SEE exceeds 40', () => {
    // For O grade (90 total), if CIA is 45, raw required SEE is 45 > 40 -> IMPOSSIBLE
    const pred = calculateSubjectPredictions(normalSubject, 45, 0, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    const oGrade = pred.predictions.find(p => p.targetGrade === 'O');
    expect(oGrade).toBeDefined();
    expect(oGrade!.isAchievable).toBe(false);
    expect(oGrade!.status).toBe('IMPOSSIBLE_EXCEEDS_MAX');
    expect(oGrade!.requiredSee).toBe(45);
    // A+ (80) needs 35/40 -> Achievable
    const aPlus = pred.predictions.find(p => p.targetGrade === 'A+');
    expect(aPlus!.isAchievable).toBe(true);
    expect(aPlus!.effectiveSeeRequired).toBe(35);
  });

  it('7. Student fails the CIA eligibility requirement', () => {
    // CIA is 20/60, which is below 24 (40%)
    const result = calculateSubject(normalSubject, 20, 30, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(result.status).toBe('FAIL_CIA');
    expect(result.isCiaEligible).toBe(false);
    expect(result.isPassed).toBe(false);
    expect(result.grade).toBe('F');
    expect(result.gradePoints).toBe(0);

    // Prediction also marks ineligible
    const pred = calculateSubjectPredictions(normalSubject, 20, 0, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(pred.predictions[0].status).toBe('INELIGIBLE_CIA');
    expect(pred.predictions[0].isAchievable).toBe(false);
  });

  it('8. Student fails the SEE requirement', () => {
    // CIA is 50/60, SEE is 12/40 (total = 62, which would normally be B+),
    // but SEE is below 16 (40% minimum passing requirement)
    const result = calculateSubject(normalSubject, 50, 12, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(result.status).toBe('FAIL_SEE');
    expect(result.isSeeEligible).toBe(false);
    expect(result.isPassed).toBe(false);
    expect(result.grade).toBe('F');
    expect(result.gradePoints).toBe(0);
  });

  it('9. Student passes individual components but fails overall', () => {
    // Custom test case with lower thresholds where components pass but sum < overall
    // E.g. If CIA min is 15, SEE min is 10, but overall min is 40.
    const customRules = {
      ciaMinPercent: 20, // 12
      seeMinPercent: 25, // 10
      overallMinPercent: 50, // 50
      secMinPercent: 40,
    };
    const result = calculateSubject(normalSubject, 20, 15, DEFAULT_GRADE_BOUNDARIES, customRules);
    // Total is 35 < 50
    expect(result.status).toBe('FAIL_OVERALL');
    expect(result.grade).toBe('F');
    expect(result.gradePoints).toBe(0);
  });

  it('10. All subjects receive O grades', () => {
    const marksMap: Record<string, { ciaObtained: number; seeObtained?: number }> = {
      'sub-1': { ciaObtained: 55, seeObtained: 38 }, // 93 -> O
      'sub-2': { ciaObtained: 56, seeObtained: 38 }, // 94 -> O
      'sub-3': { ciaObtained: 58, seeObtained: 36 }, // 94 -> O
      'sub-4': { ciaObtained: 54, seeObtained: 38 }, // 92 -> O
      'sub-5': { ciaObtained: 55, seeObtained: 37 }, // 92 -> O
      'sub-6': { ciaObtained: 55, seeObtained: 39 }, // 94 -> O
      'sub-7': { ciaObtained: 95, seeObtained: 0 },  // 95 -> O
    };

    const overview = calculateSemesterOverview(DEFAULT_SUBJECTS, marksMap, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(overview.expectedSgpa).toBe(10.0);
    expect(overview.totalPassedSubjects).toBe(7);
    expect(overview.totalFailedSubjects).toBe(0);
  });

  it('11. All subjects receive F grades', () => {
    const marksMap: Record<string, { ciaObtained: number; seeObtained?: number }> = {};
    DEFAULT_SUBJECTS.forEach(s => {
      marksMap[s.id] = { ciaObtained: 10, seeObtained: 10 };
    });

    const overview = calculateSemesterOverview(DEFAULT_SUBJECTS, marksMap, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(overview.expectedSgpa).toBe(0);
    expect(overview.totalPassedSubjects).toBe(0);
    expect(overview.totalFailedSubjects).toBe(7);
  });

  it('12. SGPA uses correct credit weighting', () => {
    // Subject A (4 credits) gets O (10 GP) -> 40 points
    // Subject B (2 credits) gets P (4 GP) -> 8 points
    // Total credits = 6, total points = 48 -> SGPA = 48 / 6 = 8.0
    // Simple average would be (10 + 4) / 2 = 7.0 (incorrect!)
    const subA: SubjectConfig = { id: 'a', code: 'A', name: 'A', credits: 4, ciaMax: 60, seeMax: 40, isSec: false };
    const subB: SubjectConfig = { id: 'b', code: 'B', name: 'B', credits: 2, ciaMax: 60, seeMax: 40, isSec: false };

    const calcA = calculateSubject(subA, 55, 38, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES); // 93 -> 10 GP
    const calcB = calculateSubject(subB, 25, 18, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES); // 43 -> 4 GP

    const sgpa = calculateSgpa([calcA, calcB]);
    expect(sgpa).toBe(8.0);
    expect(sgpa).not.toBe(7.0);
  });

  it('13. CGPA correctly accounts for previous semester credits', () => {
    // Sem 1: SGPA 8.0, 20 credits -> 160 points
    // Sem 2: SGPA 9.0, 10 credits -> 90 points
    // Current Sem: SGPA 10.0, 22 credits -> 220 points
    // Total credits = 20 + 10 + 22 = 52
    // Total points = 160 + 90 + 220 = 470
    // CGPA = 470 / 52 = 9.038... -> 9.04
    // Simple average would be (8 + 9 + 10) / 3 = 9.00
    const prev: PreviousSemester[] = [
      { id: 's1', semesterName: 'Sem 1', sgpa: 8.0, credits: 20 },
      { id: 's2', semesterName: 'Sem 2', sgpa: 9.0, credits: 10 },
    ];
    const cgpaResult = calculateCumulativeCgpa(prev, 22, 10.0);
    expect(cgpaResult.hasPreviousSemesters).toBe(true);
    expect(cgpaResult.totalCumulativeCredits).toBe(52);
    expect(cgpaResult.cumulativeCgpa).toBe(9.04);
  });

  it('14. Changing one subject updates the entire dashboard', () => {
    const marksMap: Record<string, { ciaObtained: number; seeObtained?: number }> = {};
    DEFAULT_SUBJECTS.forEach(s => {
      marksMap[s.id] = { ciaObtained: 50, seeObtained: 30 };
    });
    const before = calculateSemesterOverview(DEFAULT_SUBJECTS, marksMap, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);

    // Modify DS (4 credits)
    marksMap['sub-2'] = { ciaObtained: 60, seeObtained: 40 };
    const after = calculateSemesterOverview(DEFAULT_SUBJECTS, marksMap, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);

    expect(after.totalCiaObtained).toBeGreaterThan(before.totalCiaObtained);
    expect(after.expectedSgpa).toBeGreaterThanOrEqual(before.expectedSgpa);
  });

  it('15. Target SGPA Planner optimizes grade combinations and flags impossible targets', () => {
    const marksMap: Record<string, { ciaObtained: number; seeObtained?: number }> = {};
    DEFAULT_SUBJECTS.forEach(s => {
      // Normal subjects have 45/60 CIA, SEC has 75/100
      marksMap[s.id] = { ciaObtained: s.isSec ? 75 : 45, seeObtained: 0 };
    });

    // With CIA 45, max possible total in normal subjects is 45 + 40 = 85 (A+, GP 9).
    // SEC max is 75 (A, GP 8).
    // So SGPA 10.0 is IMPOSSIBLE!
    const impossiblePlan = calculateTargetSgpaPlan(DEFAULT_SUBJECTS, marksMap, 10.0, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(impossiblePlan.isPossible).toBe(false);
    expect(impossiblePlan.explanation).toContain('impossible');

    // But SGPA 8.0 is achievable
    const realisticPlan = calculateTargetSgpaPlan(DEFAULT_SUBJECTS, marksMap, 8.0, DEFAULT_GRADE_BOUNDARIES, DEFAULT_PASSING_RULES);
    expect(realisticPlan.isPossible).toBe(true);
    expect(realisticPlan.achievableSgpa).toBeGreaterThanOrEqual(8.0);
    expect(realisticPlan.totalRequiredSeeMarks).toBeGreaterThan(0);
    // Highest impact subjects should be identified
    expect(realisticPlan.creditImpactRankings[0].credits).toBe(4);
  });
});
