import {
  SubjectConfig,
  GradeBoundary,
  PassingRules,
  CalculatedSubject,
  SubjectPredictionSummary,
  TargetGradePrediction,
  SemesterOverview,
  TargetSgpaPlan,
  PreviousSemester,
  CgpaSummary,
} from '../types';

/**
 * Clamp a number between min and max.
 */
export function clamp(val: number, min: number, max: number): number {
  if (isNaN(val)) return min;
  return Math.max(min, Math.min(max, val));
}

/**
 * Find the grade boundary for a given total score, assuming student passes component requirements.
 */
export function getGradeFromScore(score: number, boundaries: GradeBoundary[]): GradeBoundary {
  const sorted = [...boundaries].sort((a, b) => b.minMarks - a.minMarks);
  for (const b of sorted) {
    if (score >= b.minMarks) {
      return b;
    }
  }
  return sorted[sorted.length - 1] || { grade: 'F', minMarks: 0, maxMarks: 39.99, gradePoints: 0 };
}

/**
 * Calculate grade, points, and pass/fail status for an individual subject.
 */
export function calculateSubject(
  config: SubjectConfig,
  ciaInput: number,
  seeInput: number = 0,
  boundaries: GradeBoundary[],
  rules: PassingRules
): CalculatedSubject {
  const cia = clamp(ciaInput, 0, config.ciaMax);
  const see = config.isSec ? 0 : clamp(seeInput, 0, config.seeMax);
  const totalMarks = config.isSec ? cia : Math.round((cia + see) * 100) / 100;
  const maxPossibleTotal = config.isSec ? config.ciaMax : config.ciaMax + config.seeMax;

  // Passing requirements
  const ciaMinRequired = Math.round(((config.isSec ? rules.secMinPercent : rules.ciaMinPercent) / 100) * config.ciaMax * 100) / 100;
  const seeMinRequired = config.isSec ? 0 : Math.round((rules.seeMinPercent / 100) * config.seeMax * 100) / 100;
  const overallMinRequired = Math.round((rules.overallMinPercent / 100) * (config.ciaMax + config.seeMax) * 100) / 100;

  const isCiaEligible = cia >= ciaMinRequired;
  const isSeeEligible = config.isSec ? true : see >= seeMinRequired;
  const isOverallPassing = totalMarks >= overallMinRequired;

  let status: CalculatedSubject['status'] = 'PASS';
  let statusMessage = 'Passed';
  let grade = 'F';
  let gradePoints = 0;

  if (!isCiaEligible) {
    status = 'FAIL_CIA';
    statusMessage = `CIA Ineligible (${cia}/${config.ciaMax} < min ${ciaMinRequired})`;
    grade = 'F';
    gradePoints = 0;
  } else if (!config.isSec && !isSeeEligible) {
    status = 'FAIL_SEE';
    statusMessage = `SEE Minimum Not Met (${see}/${config.seeMax} < min ${seeMinRequired})`;
    grade = 'F';
    gradePoints = 0;
  } else if (!isOverallPassing) {
    status = 'FAIL_OVERALL';
    statusMessage = `Overall Marks Below Pass (${totalMarks}/${maxPossibleTotal} < min ${overallMinRequired})`;
    grade = 'F';
    gradePoints = 0;
  } else {
    // Meets all criteria
    const gradeObj = getGradeFromScore(totalMarks, boundaries);
    grade = gradeObj.grade;
    gradePoints = gradeObj.gradePoints;
  }

  const isPassed = status === 'PASS' && grade !== 'F';
  const creditWeightedPoints = Math.round(gradePoints * config.credits * 100) / 100;

  return {
    config,
    ciaObtained: cia,
    seeObtained: see,
    totalMarks,
    maxPossibleTotal,
    grade,
    gradePoints,
    creditWeightedPoints,
    status,
    statusMessage,
    isPassed,
    isCiaEligible,
    isSeeEligible,
  };
}

/**
 * Calculate SGPA from a list of calculated subjects.
 * Formula: SGPA = Sum(Credits * Grade Points) / Sum(Credits)
 */
export function calculateSgpa(subjects: CalculatedSubject[]): number {
  const totalCredits = subjects.reduce((sum, s) => sum + s.config.credits, 0);
  if (totalCredits === 0) return 0;
  const totalPoints = subjects.reduce((sum, s) => sum + s.creditWeightedPoints, 0);
  return Math.round((totalPoints / totalCredits) * 100) / 100;
}

/**
 * Calculate semester overview metrics.
 */
export function calculateSemesterOverview(
  subjects: SubjectConfig[],
  marksMap: Record<string, { ciaObtained: number; seeObtained?: number }>,
  boundaries: GradeBoundary[],
  rules: PassingRules
): SemesterOverview {
  const calculatedSubjects = subjects.map(s => {
    const entry = marksMap[s.id] || { ciaObtained: 0, seeObtained: 0 };
    return calculateSubject(s, entry.ciaObtained, entry.seeObtained ?? 0, boundaries, rules);
  });

  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const totalCiaObtained = calculatedSubjects.reduce((sum, s) => sum + s.ciaObtained, 0);
  const totalPossibleCia = subjects.reduce((sum, s) => sum + s.ciaMax, 0);
  const ciaPercentage = totalPossibleCia > 0 ? Math.round((totalCiaObtained / totalPossibleCia) * 1000) / 10 : 0;

  const expectedSgpa = calculateSgpa(calculatedSubjects);

  // Highest possible SGPA: Assuming max SEE (40/40) for normal subjects, keeping SEC as-is
  const highestSubjects = subjects.map(s => {
    const entry = marksMap[s.id] || { ciaObtained: 0 };
    const maxSee = s.isSec ? 0 : s.seeMax;
    return calculateSubject(s, entry.ciaObtained, maxSee, boundaries, rules);
  });
  const highestPossibleSgpa = calculateSgpa(highestSubjects);

  // Lowest possible SGPA: Assuming minimum passing SEE (16/40) for eligible normal subjects, or 0 if ineligible
  const lowestSubjects = subjects.map(s => {
    const entry = marksMap[s.id] || { ciaObtained: 0 };
    const ciaMin = (rules.ciaMinPercent / 100) * s.ciaMax;
    const isEligible = entry.ciaObtained >= ciaMin;
    const minSee = s.isSec ? 0 : (isEligible ? (rules.seeMinPercent / 100) * s.seeMax : 0);
    return calculateSubject(s, entry.ciaObtained, minSee, boundaries, rules);
  });
  const lowestPossibleSgpa = calculateSgpa(lowestSubjects);

  const totalPassedSubjects = calculatedSubjects.filter(s => s.isPassed).length;
  const totalFailedSubjects = calculatedSubjects.length - totalPassedSubjects;

  return {
    totalSubjects: subjects.length,
    totalCredits,
    totalCiaObtained,
    totalPossibleCia,
    ciaPercentage,
    expectedSgpa,
    highestPossibleSgpa,
    lowestPossibleSgpa,
    totalPassedSubjects,
    totalFailedSubjects,
  };
}

/**
 * Reverse SEE target calculator for a single subject (Section 5).
 */
export function calculateSubjectPredictions(
  config: SubjectConfig,
  currentCia: number,
  currentSee: number = 0,
  boundaries: GradeBoundary[],
  rules: PassingRules
): SubjectPredictionSummary {
  const cia = clamp(currentCia, 0, config.ciaMax);
  const seeMax = config.isSec ? 0 : config.seeMax;
  const maxPossibleTotal = config.isSec ? cia : cia + seeMax;

  const ciaMinPass = Math.round(((config.isSec ? rules.secMinPercent : rules.ciaMinPercent) / 100) * config.ciaMax * 100) / 100;
  const seeMinPass = config.isSec ? 0 : Math.round((rules.seeMinPercent / 100) * config.seeMax * 100) / 100;
  const isCiaEligible = cia >= ciaMinPass;

  // Sorted from highest grade (O) to lowest passing grade (P)
  const passingGrades = [...boundaries]
    .filter(b => b.grade !== 'F')
    .sort((a, b) => b.minMarks - a.minMarks);

  const predictions: TargetGradePrediction[] = [];

  for (const b of passingGrades) {
    const requiredTotal = b.minMarks;

    if (config.isSec) {
      // SEC evaluation is 100% internal
      const isAchieved = cia >= requiredTotal;
      predictions.push({
        targetGrade: b.grade,
        targetGradePoints: b.gradePoints,
        requiredTotal,
        requiredSee: 0,
        effectiveSeeRequired: 0,
        isAchievable: isAchieved,
        status: isAchieved ? 'ACHIEVED_ALREADY' : 'IMPOSSIBLE_EXCEEDS_MAX',
        notes: isAchieved
          ? `Achieved with internal marks (${cia}/100)`
          : `Internal score ${cia}/100 is below ${requiredTotal} threshold (SEC has no SEE)`,
      });
      continue;
    }

    // Normal subjects
    if (!isCiaEligible) {
      // Ineligible due to CIA
      const rawRequiredSee = requiredTotal - cia;
      predictions.push({
        targetGrade: b.grade,
        targetGradePoints: b.gradePoints,
        requiredTotal,
        requiredSee: rawRequiredSee,
        effectiveSeeRequired: rawRequiredSee,
        isAchievable: false,
        status: 'INELIGIBLE_CIA',
        notes: `Ineligible: CIA marks ${cia}/${config.ciaMax} are below the minimum passing threshold (${ciaMinPass})`,
      });
      continue;
    }

    const rawRequiredSee = Math.round((requiredTotal - cia) * 100) / 100;

    if (rawRequiredSee > seeMax) {
      predictions.push({
        targetGrade: b.grade,
        targetGradePoints: b.gradePoints,
        requiredTotal,
        requiredSee: rawRequiredSee,
        effectiveSeeRequired: rawRequiredSee,
        isAchievable: false,
        status: 'IMPOSSIBLE_EXCEEDS_MAX',
        notes: `${rawRequiredSee}/${seeMax} — Impossible (Exceeds maximum SEE marks of ${seeMax})`,
      });
    } else {
      // Achievable! Account for minimum SEE passing requirement
      const effectiveSee = Math.max(seeMinPass, Math.max(0, rawRequiredSee));

      let notes = '';
      if (rawRequiredSee <= 0) {
        notes = `CIA already covers threshold (${cia} ≥ ${requiredTotal}), but requires min SEE pass marks (${seeMinPass}/${seeMax})`;
      } else if (rawRequiredSee < seeMinPass) {
        notes = `Score needed is ${rawRequiredSee}/${seeMax}, but university minimum pass SEE is ${seeMinPass}/${seeMax}`;
      } else {
        notes = `Need ${rawRequiredSee}/${seeMax} in SEE to achieve ${b.grade}`;
      }

      predictions.push({
        targetGrade: b.grade,
        targetGradePoints: b.gradePoints,
        requiredTotal,
        requiredSee: Math.max(0, rawRequiredSee),
        effectiveSeeRequired: effectiveSee,
        isAchievable: true,
        status: 'ACHIEVABLE',
        notes,
      });
    }
  }

  // Determine maximum possible grade
  let maxPossibleGrade = 'F';
  if (isCiaEligible) {
    for (const b of passingGrades) {
      if (maxPossibleTotal >= b.minMarks) {
        maxPossibleGrade = b.grade;
        break;
      }
    }
  }

  // Determine current grade and next achievable grade
  const currentCalc = calculateSubject(config, cia, currentSee, boundaries, rules);
  let nextAchievableGrade: string | null = null;
  let marksNeededForNextGrade: number | null = null;

  if (isCiaEligible) {
    // Find the immediate grade above current
    for (let i = passingGrades.length - 1; i >= 0; i--) {
      const g = passingGrades[i];
      if (g.gradePoints > currentCalc.gradePoints && maxPossibleTotal >= g.minMarks) {
        nextAchievableGrade = g.grade;
        marksNeededForNextGrade = Math.max(0, Math.round((g.minMarks - currentCalc.totalMarks) * 100) / 100);
        break;
      }
    }
  }

  return {
    subjectId: config.id,
    subjectName: config.name,
    code: config.code,
    credits: config.credits,
    isSec: !!config.isSec,
    currentCia: cia,
    maxCia: config.ciaMax,
    maxSee: seeMax,
    maxPossibleTotal,
    maxPossibleGrade,
    nextAchievableGrade,
    marksNeededForNextGrade,
    predictions,
  };
}

/**
 * Target SGPA Planner (Section 6).
 * Calculates the optimal grade and SEE combination to achieve target SGPA,
 * prioritizing combinations requiring lower total SEE marks.
 */
export function calculateTargetSgpaPlan(
  subjects: SubjectConfig[],
  marksMap: Record<string, { ciaObtained: number; seeObtained?: number }>,
  targetSgpa: number,
  boundaries: GradeBoundary[],
  rules: PassingRules
): TargetSgpaPlan {
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const targetPointsRequired = Math.round(targetSgpa * totalCredits * 100) / 100;

  // Analyze each subject's achievable grades and minimum SEE needed
  const subjectOptions = subjects.map(s => {
    const entry = marksMap[s.id] || { ciaObtained: 0 };
    const predSummary = calculateSubjectPredictions(s, entry.ciaObtained, 0, boundaries, rules);
    
    // Available grades for this subject
    const options: { grade: string; points: number; seeRequired: number }[] = [];
    
    if (s.isSec) {
      const calc = calculateSubject(s, entry.ciaObtained, 0, boundaries, rules);
      options.push({
        grade: calc.grade,
        points: calc.gradePoints,
        seeRequired: 0,
      });
    } else {
      const isCiaEligible = entry.ciaObtained >= (rules.ciaMinPercent / 100) * s.ciaMax;
      if (!isCiaEligible) {
        options.push({ grade: 'F', points: 0, seeRequired: 0 });
      } else {
        for (const p of predSummary.predictions) {
          if (p.isAchievable) {
            options.push({
              grade: p.targetGrade,
              points: p.targetGradePoints,
              seeRequired: p.effectiveSeeRequired,
            });
          }
        }
        // Also option to just pass minimum or F
        const seeMinPass = Math.round((rules.seeMinPercent / 100) * s.seeMax);
        if (!options.some(o => o.grade === 'P')) {
          options.push({ grade: 'P', points: 4, seeRequired: seeMinPass });
        }
      }
    }

    // Sort options by grade points descending
    options.sort((a, b) => b.points - a.points);

    return {
      config: s,
      options,
      predSummary,
    };
  });

  // Calculate maximum achievable SGPA
  const maxPointsPossible = subjectOptions.reduce((sum, s) => {
    const bestOption = s.options[0];
    return sum + (bestOption ? bestOption.points * s.config.credits : 0);
  }, 0);

  const maxAchievableSgpa = Math.round((maxPointsPossible / totalCredits) * 100) / 100;
  const isPossible = targetPointsRequired <= maxPointsPossible;

  // Credit impact rankings (how much 1 grade point jump in each subject increases overall SGPA)
  const creditImpactRankings = subjects
    .map(s => {
      const impactPerGrade = Math.round((s.credits / totalCredits) * 1000) / 1000;
      let advice = '';
      if (s.isSec) {
        advice = 'Fixed 2-credit course (evaluated 100% on internal marks).';
      } else if (s.credits >= 4) {
        advice = `HIGHEST IMPACT (${s.credits} credits): Each grade improvement adds ${(s.credits / totalCredits).toFixed(3)} to your final SGPA!`;
      } else {
        advice = `Standard weight (${s.credits} credits): Each grade improvement adds ${(s.credits / totalCredits).toFixed(3)} to SGPA.`;
      }
      return {
        subjectId: s.id,
        code: s.code,
        credits: s.credits,
        impactScore: impactPerGrade,
        advice,
      };
    })
    .sort((a, b) => b.credits - a.credits);

  // If impossible, return the max achievable configuration
  if (!isPossible) {
    const bestSubjects = subjectOptions.map(s => {
      const best = s.options[0] || { grade: 'F', points: 0, seeRequired: 0 };
      return {
        subjectId: s.config.id,
        code: s.config.code,
        credits: s.config.credits,
        targetGrade: best.grade,
        targetGradePoints: best.points,
        requiredSee: best.seeRequired,
        isSec: !!s.config.isSec,
      };
    });

    return {
      targetSgpa,
      achievableSgpa: maxAchievableSgpa,
      isPossible: false,
      totalRequiredSeeMarks: bestSubjects.reduce((sum, s) => sum + s.requiredSee, 0),
      subjects: bestSubjects,
      creditImpactRankings,
      explanation: `Target SGPA ${targetSgpa.toFixed(2)} is mathematically impossible with current CIA marks. The highest SGPA achievable even with 100% in all remaining end-semester exams is ${maxAchievableSgpa.toFixed(2)}.`,
    };
  }

  // Branch & Bound / Knapsack-like optimization to find the combination meeting targetPoints with minimum total SEE marks
  type Assignment = { grade: string; points: number; seeRequired: number };
  let bestCombination: Assignment[] | null = null;
  let minTotalSee = Infinity;

  function search(index: number, currentPoints: number, currentSee: number, currentAssigned: Assignment[]) {
    if (index === subjectOptions.length) {
      if (currentPoints >= targetPointsRequired && currentSee < minTotalSee) {
        minTotalSee = currentSee;
        bestCombination = [...currentAssigned];
      }
      return;
    }

    const item = subjectOptions[index];
    // Check remaining maximum potential to prune
    let maxRemainingPoints = 0;
    for (let j = index; j < subjectOptions.length; j++) {
      const topOpt = subjectOptions[j].options[0];
      maxRemainingPoints += (topOpt ? topOpt.points : 0) * subjectOptions[j].config.credits;
    }

    if (currentPoints + maxRemainingPoints < targetPointsRequired) {
      return; // Prune
    }

    for (const opt of item.options) {
      if (currentSee + opt.seeRequired >= minTotalSee) {
        continue; // Prune if already worse than best found
      }
      currentAssigned.push(opt);
      search(
        index + 1,
        currentPoints + opt.points * item.config.credits,
        currentSee + opt.seeRequired,
        currentAssigned
      );
      currentAssigned.pop();
    }
  }

  search(0, 0, 0, []);

  // Format chosen subjects
  const resultSubjects: TargetSgpaPlan['subjects'] = (bestCombination || subjectOptions.map(s => s.options[0])).map((opt, idx) => ({
    subjectId: subjectOptions[idx].config.id,
    code: subjectOptions[idx].config.code,
    credits: subjectOptions[idx].config.credits,
    targetGrade: opt.grade,
    targetGradePoints: opt.points,
    requiredSee: opt.seeRequired,
    isSec: !!subjectOptions[idx].config.isSec,
  }));

  const actualPointsAchieved = resultSubjects.reduce((sum, s) => sum + s.credits * s.targetGradePoints, 0);
  const actualSgpa = Math.round((actualPointsAchieved / totalCredits) * 100) / 100;
  const totalSee = resultSubjects.reduce((sum, s) => sum + s.requiredSee, 0);

  return {
    targetSgpa,
    achievableSgpa: actualSgpa,
    isPossible: true,
    totalRequiredSeeMarks: totalSee,
    subjects: resultSubjects,
    creditImpactRankings,
    explanation: `Target SGPA of ${targetSgpa.toFixed(2)} is achievable. By following this recommended SEE mark allocation, you will need an aggregate of only ${totalSee} SEE marks across all examinations.`,
  };
}

/**
 * Cumulative CGPA calculator (Section 9).
 * Formula: CGPA = Σ(SGPA × Semester Credits) / Σ(Semester Credits)
 */
export function calculateCumulativeCgpa(
  previousSemesters: PreviousSemester[],
  currentSemesterCredits: number,
  currentSemesterSgpa: number
): CgpaSummary {
  if (!previousSemesters || previousSemesters.length === 0) {
    return {
      hasPreviousSemesters: false,
      totalCumulativeCredits: currentSemesterCredits,
      cumulativeCgpa: currentSemesterSgpa,
      currentSemesterCredits,
      currentSemesterSgpa,
    };
  }

  let totalPoints = 0;
  let totalCredits = 0;

  for (const sem of previousSemesters) {
    if (sem.credits > 0 && sem.sgpa >= 0) {
      totalPoints += sem.sgpa * sem.credits;
      totalCredits += sem.credits;
    }
  }

  // Add current semester
  if (currentSemesterCredits > 0) {
    totalPoints += currentSemesterSgpa * currentSemesterCredits;
    totalCredits += currentSemesterCredits;
  }

  const cumulativeCgpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;

  return {
    hasPreviousSemesters: true,
    totalCumulativeCredits: totalCredits,
    cumulativeCgpa,
    currentSemesterCredits,
    currentSemesterSgpa,
  };
}
