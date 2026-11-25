import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  SubjectConfig,
  SubjectMarks,
  GradeBoundary,
  PassingRules,
  PreviousSemester,
  CalculatedSubject,
  SemesterOverview,
  SubjectPredictionSummary,
  TargetSgpaPlan,
  CgpaSummary,
  ScenarioType,
} from '../types';
import {
  DEFAULT_SUBJECTS,
  DEFAULT_GRADE_BOUNDARIES,
  DEFAULT_PASSING_RULES,
  DEMO_MARKS,
  DEMO_PREVIOUS_SEMESTERS,
} from '../engine/defaults';
import {
  calculateSubject,
  calculateSemesterOverview,
  calculateSubjectPredictions,
  calculateTargetSgpaPlan,
  calculateCumulativeCgpa,
  clamp,
} from '../engine/calculator';

interface GradePilotContextType {
  subjects: SubjectConfig[];
  marks: Record<string, SubjectMarks>;
  boundaries: GradeBoundary[];
  passingRules: PassingRules;
  previousSemesters: PreviousSemester[];
  targetSgpa: number;
  scenarioOffsets: Record<ScenarioType, number>; // e.g. conservative: 0.5 (50%), expected: 0.75 (75%), best: 1.0 (100%)
  
  // Derived state
  calculatedSubjects: CalculatedSubject[];
  overview: SemesterOverview;
  predictions: Record<string, SubjectPredictionSummary>;
  targetPlan: TargetSgpaPlan;
  cgpaSummary: CgpaSummary;
  
  // Actions
  updateCia: (subjectId: string, val: number) => void;
  updateSee: (subjectId: string, val: number) => void;
  loadDemoData: () => void;
  resetMarks: () => void;
  resetAllToDefault: () => void;
  updateSubjectConfig: (subject: SubjectConfig) => void;
  addSubject: (subject: Omit<SubjectConfig, 'id'>) => void;
  removeSubject: (id: string) => void;
  updateBoundaries: (boundaries: GradeBoundary[]) => void;
  updatePassingRules: (rules: PassingRules) => void;
  setTargetSgpa: (val: number) => void;
  updateScenarioOffset: (type: ScenarioType, val: number) => void;
  addPreviousSemester: (sem: Omit<PreviousSemester, 'id'>) => void;
  updatePreviousSemester: (sem: PreviousSemester) => void;
  removePreviousSemester: (id: string) => void;
}

const STORAGE_KEYS = {
  SUBJECTS: 'gradepilot_subjects_v1',
  MARKS: 'gradepilot_marks_v1',
  BOUNDARIES: 'gradepilot_boundaries_v1',
  RULES: 'gradepilot_rules_v1',
  PREV_SEMS: 'gradepilot_prev_sems_v1',
  TARGET_SGPA: 'gradepilot_target_sgpa_v1',
  SCENARIOS: 'gradepilot_scenarios_v1',
};

const GradePilotContext = createContext<GradePilotContextType | undefined>(undefined);

export const GradePilotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Subjects
  const [subjects, setSubjects] = useState<SubjectConfig[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
    } catch {
      return DEFAULT_SUBJECTS;
    }
  });

  // Marks
  const [marks, setMarks] = useState<Record<string, SubjectMarks>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MARKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Default initial empty marks
    const initial: Record<string, SubjectMarks> = {};
    DEFAULT_SUBJECTS.forEach(s => {
      initial[s.id] = { subjectId: s.id, ciaObtained: 0, seeObtained: 0 };
    });
    return initial;
  });

  // Boundaries
  const [boundaries, setBoundaries] = useState<GradeBoundary[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOUNDARIES);
      return saved ? JSON.parse(saved) : DEFAULT_GRADE_BOUNDARIES;
    } catch {
      return DEFAULT_GRADE_BOUNDARIES;
    }
  });

  // Passing rules
  const [passingRules, setPassingRules] = useState<PassingRules>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RULES);
      return saved ? JSON.parse(saved) : DEFAULT_PASSING_RULES;
    } catch {
      return DEFAULT_PASSING_RULES;
    }
  });

  // Previous semesters
  const [previousSemesters, setPreviousSemesters] = useState<PreviousSemester[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PREV_SEMS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Target SGPA
  const [targetSgpa, setTargetSgpaState] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TARGET_SGPA);
      return saved ? parseFloat(saved) : 8.5;
    } catch {
      return 8.5;
    }
  });

  // Scenarios (see % assumption for conservative, expected, best)
  const [scenarioOffsets, setScenarioOffsets] = useState<Record<ScenarioType, number>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCENARIOS);
      return saved ? JSON.parse(saved) : { conservative: 50, expected: 75, best_case: 95 };
    } catch {
      return { conservative: 50, expected: 75, best_case: 95 };
    }
  });

  // LocalStorage sync effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch (e) {
      console.error('Failed to save subjects to localStorage', e);
    }
  }, [subjects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MARKS, JSON.stringify(marks));
    } catch (e) {
      console.error('Failed to save marks to localStorage', e);
    }
  }, [marks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BOUNDARIES, JSON.stringify(boundaries));
    } catch (e) {
      console.error('Failed to save boundaries to localStorage', e);
    }
  }, [boundaries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(passingRules));
    } catch (e) {
      console.error('Failed to save rules to localStorage', e);
    }
  }, [passingRules]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PREV_SEMS, JSON.stringify(previousSemesters));
    } catch (e) {
      console.error('Failed to save prev semesters to localStorage', e);
    }
  }, [previousSemesters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TARGET_SGPA, targetSgpa.toString());
    } catch (e) {
      console.error('Failed to save target SGPA to localStorage', e);
    }
  }, [targetSgpa]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCENARIOS, JSON.stringify(scenarioOffsets));
    } catch (e) {
      console.error('Failed to save scenarios to localStorage', e);
    }
  }, [scenarioOffsets]);

  // Actions
  const updateCia = (subjectId: string, val: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    const clamped = clamp(val, 0, subject.ciaMax);
    setMarks(prev => ({
      ...prev,
      [subjectId]: {
        subjectId,
        ciaObtained: clamped,
        seeObtained: subject.isSec ? 0 : (prev[subjectId]?.seeObtained ?? 0),
      },
    }));
  };

  const updateSee = (subjectId: string, val: number) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject || subject.isSec) return;
    const clamped = clamp(val, 0, subject.seeMax);
    setMarks(prev => ({
      ...prev,
      [subjectId]: {
        subjectId,
        ciaObtained: prev[subjectId]?.ciaObtained ?? 0,
        seeObtained: clamped,
      },
    }));
  };

  const loadDemoData = () => {
    setMarks(DEMO_MARKS);
    setPreviousSemesters(DEMO_PREVIOUS_SEMESTERS);
    setTargetSgpaState(9.0);
  };

  const resetMarks = () => {
    const fresh: Record<string, SubjectMarks> = {};
    subjects.forEach(s => {
      fresh[s.id] = { subjectId: s.id, ciaObtained: 0, seeObtained: 0 };
    });
    setMarks(fresh);
  };

  const resetAllToDefault = () => {
    localStorage.clear();
    setSubjects(DEFAULT_SUBJECTS);
    const fresh: Record<string, SubjectMarks> = {};
    DEFAULT_SUBJECTS.forEach(s => {
      fresh[s.id] = { subjectId: s.id, ciaObtained: 0, seeObtained: 0 };
    });
    setMarks(fresh);
    setBoundaries(DEFAULT_GRADE_BOUNDARIES);
    setPassingRules(DEFAULT_PASSING_RULES);
    setPreviousSemesters([]);
    setTargetSgpaState(8.5);
    setScenarioOffsets({ conservative: 50, expected: 75, best_case: 95 });
  };

  const updateSubjectConfig = (updated: SubjectConfig) => {
    setSubjects(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    // Also re-clamp existing marks if max changed
    setMarks(prev => {
      const existing = prev[updated.id];
      if (!existing) return prev;
      return {
        ...prev,
        [updated.id]: {
          subjectId: updated.id,
          ciaObtained: clamp(existing.ciaObtained, 0, updated.ciaMax),
          seeObtained: updated.isSec ? 0 : clamp(existing.seeObtained ?? 0, 0, updated.seeMax),
        },
      };
    });
  };

  const addSubject = (newSub: Omit<SubjectConfig, 'id'>) => {
    const id = `sub-${Date.now()}`;
    const fullSub: SubjectConfig = { ...newSub, id };
    setSubjects(prev => [...prev, fullSub]);
    setMarks(prev => ({
      ...prev,
      [id]: { subjectId: id, ciaObtained: 0, seeObtained: 0 },
    }));
  };

  const removeSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    setMarks(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const updateBoundaries = (newBoundaries: GradeBoundary[]) => {
    setBoundaries(newBoundaries);
  };

  const updatePassingRules = (rules: PassingRules) => {
    setPassingRules(rules);
  };

  const setTargetSgpa = (val: number) => {
    setTargetSgpaState(clamp(val, 0, 10));
  };

  const updateScenarioOffset = (type: ScenarioType, val: number) => {
    setScenarioOffsets(prev => ({ ...prev, [type]: clamp(val, 0, 100) }));
  };

  const addPreviousSemester = (sem: Omit<PreviousSemester, 'id'>) => {
    const id = `prev-${Date.now()}`;
    setPreviousSemesters(prev => [...prev, { ...sem, id }]);
  };

  const updatePreviousSemester = (sem: PreviousSemester) => {
    setPreviousSemesters(prev => prev.map(p => (p.id === sem.id ? sem : p)));
  };

  const removePreviousSemester = (id: string) => {
    setPreviousSemesters(prev => prev.filter(p => p.id !== id));
  };

  // Derived calculations
  const calculatedSubjects = useMemo(() => {
    return subjects.map(s => {
      const m = marks[s.id] || { subjectId: s.id, ciaObtained: 0, seeObtained: 0 };
      return calculateSubject(s, m.ciaObtained, m.seeObtained ?? 0, boundaries, passingRules);
    });
  }, [subjects, marks, boundaries, passingRules]);

  const overview = useMemo(() => {
    return calculateSemesterOverview(subjects, marks, boundaries, passingRules);
  }, [subjects, marks, boundaries, passingRules]);

  const predictions = useMemo(() => {
    const map: Record<string, SubjectPredictionSummary> = {};
    subjects.forEach(s => {
      const m = marks[s.id] || { subjectId: s.id, ciaObtained: 0, seeObtained: 0 };
      map[s.id] = calculateSubjectPredictions(s, m.ciaObtained, m.seeObtained ?? 0, boundaries, passingRules);
    });
    return map;
  }, [subjects, marks, boundaries, passingRules]);

  const targetPlan = useMemo(() => {
    return calculateTargetSgpaPlan(subjects, marks, targetSgpa, boundaries, passingRules);
  }, [subjects, marks, targetSgpa, boundaries, passingRules]);

  const cgpaSummary = useMemo(() => {
    return calculateCumulativeCgpa(previousSemesters, overview.totalCredits, overview.expectedSgpa);
  }, [previousSemesters, overview.totalCredits, overview.expectedSgpa]);

  const value = {
    subjects,
    marks,
    boundaries,
    passingRules,
    previousSemesters,
    targetSgpa,
    scenarioOffsets,
    calculatedSubjects,
    overview,
    predictions,
    targetPlan,
    cgpaSummary,
    updateCia,
    updateSee,
    loadDemoData,
    resetMarks,
    resetAllToDefault,
    updateSubjectConfig,
    addSubject,
    removeSubject,
    updateBoundaries,
    updatePassingRules,
    setTargetSgpa,
    updateScenarioOffset,
    addPreviousSemester,
    updatePreviousSemester,
    removePreviousSemester,
  };

  return <GradePilotContext.Provider value={value}>{children}</GradePilotContext.Provider>;
};

export const useGradePilot = (): GradePilotContextType => {
  const context = useContext(GradePilotContext);
  if (!context) {
    throw new Error('useGradePilot must be used within a GradePilotProvider');
  }
  return context;
};
