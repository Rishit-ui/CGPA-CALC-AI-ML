import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Lock,
} from 'lucide-react';
import { SubjectPredictionSummary, CalculatedSubject } from '../../types';
import { getGradeBadgeClass } from '../marks/MarksEntryTable';

interface SeePredictorProps {
  predictions: Record<string, SubjectPredictionSummary>;
  calculatedSubjects: CalculatedSubject[];
  onUpdateSee: (id: string, val: number) => void;
}

export const SeePredictor: React.FC<SeePredictorProps> = ({
  predictions,
  calculatedSubjects,
  onUpdateSee,
}) => {
  const subjectList = Object.values(predictions);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjectList[0]?.subjectId || ''
  );

  const selectedPred =
    predictions[selectedSubjectId] || subjectList[0];
  const selectedCalc = calculatedSubjects.find(
    s => s.config.id === selectedPred?.subjectId
  );

  if (!selectedPred) return null;

  return (
    <div className="space-y-6">
      {/* Header explanation banner */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500 text-charcoal-900 shadow-soft-sm">
            <Sparkles className="w-5 h-5 text-charcoal-900" />
          </div>
          <div>
            <h2 className="text-base font-bold text-charcoal-900">
              Smart Reverse SEE Exam Target Calculator
            </h2>
            <p className="text-xs text-charcoal-600 mt-0.5 leading-relaxed max-w-2xl">
              Calculates the exact minimum marks you must score in the 40-mark End-Semester Examination (SEE)
              to achieve each grade. Automatically enforces the minimum SEE passing requirement (16/40)
              and flags impossible targets.
            </p>
          </div>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {subjectList.map(s => {
          const isSelected = s.subjectId === selectedPred.subjectId;
          return (
            <button
              key={s.subjectId}
              onClick={() => setSelectedSubjectId(s.subjectId)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-soft'
                  : 'bg-surface text-charcoal-700 hover:bg-surface-subtle border-charcoal-700/10'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{s.code}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-amber-400 text-charcoal-900 font-bold' : 'bg-charcoal-100 text-charcoal-600'
                  }`}
                >
                  {s.credits}cr
                </span>
                {s.isSec && (
                  <span className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded bg-purple-100 text-purple-800 font-bold">
                    SEC
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Subject Focus Card */}
      <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-6">
        {/* Subject Title and Quick Metrics */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-charcoal-700/10">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-extrabold text-charcoal-900">{selectedPred.code}</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-surface-subtle border font-semibold text-charcoal-700">
                {selectedPred.credits} Credits Course
              </span>
              {selectedPred.isSec && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                  100% Internal Assessment (No SEE Exam)
                </span>
              )}
            </div>
            <p className="text-xs text-charcoal-500 mt-1">{selectedPred.subjectName}</p>
          </div>

          {/* Quick status badges */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Current CIA */}
            <div className="px-3.5 py-2 rounded-xl bg-surface-subtle border border-charcoal-700/10 text-center">
              <span className="text-[11px] font-medium text-charcoal-500 block">Current CIA</span>
              <span className="text-base font-bold text-charcoal-900">
                {selectedPred.currentCia} / {selectedPred.maxCia}
              </span>
            </div>

            {/* Max Possible Grade */}
            <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[11px] font-semibold text-amber-800 block">Max Ceiling</span>
              <span className="text-base font-extrabold text-amber-900">
                Grade {selectedPred.maxPossibleGrade} ({selectedPred.maxPossibleTotal} max)
              </span>
            </div>

            {/* Next Achievable Grade */}
            {selectedPred.nextAchievableGrade && (
              <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-semibold text-emerald-800 block">Next Target</span>
                <span className="text-base font-extrabold text-emerald-900">
                  Grade {selectedPred.nextAchievableGrade} (+{selectedPred.marksNeededForNextGrade} marks)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SEC Special Case Notice */}
        {selectedPred.isSec ? (
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex items-start gap-3">
            <Lock className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-purple-900 leading-relaxed">
              <p className="font-bold">SEC (Skill Enhancement Course) Assessment Rule:</p>
              <p className="mt-0.5">
                SEC is evaluated completely out of 100 internal marks. There is no end-semester examination
                for this subject. Your letter grade is locked to your internal score ({selectedPred.currentCia}/100),
                giving Grade <strong>{selectedCalc?.grade}</strong> ({selectedCalc?.gradePoints} Grade Points).
              </p>
            </div>
          </div>
        ) : null}

        {/* CIA Ineligibility Warning */}
        {selectedPred.currentCia < 24 && !selectedPred.isSec && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900 leading-relaxed">
              <p className="font-bold">CIA Ineligibility Warning (DSU Assessment Rule):</p>
              <p className="mt-0.5">
                Your current CIA is {selectedPred.currentCia}/60, which is below the mandatory 40% minimum passing
                threshold (24/60). Under university guidelines, a student must secure at least 24 in CIA to be
                eligible for passing grades in SEE.
              </p>
            </div>
          </div>
        )}

        {/* Reverse Target Predictions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-surface-subtle text-xs font-bold uppercase tracking-wider text-charcoal-500 border-b border-charcoal-700/10">
                <th className="py-3 px-4">Target Grade</th>
                <th className="py-3 px-4 text-center">Grade Points</th>
                <th className="py-3 px-4 text-center">Required Total</th>
                <th className="py-3 px-6 text-center">Required SEE Marks</th>
                <th className="py-3 px-6">Feasibility Assessment</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700/5">
              {selectedPred.predictions.map(p => {
                const isImpossible = !p.isAchievable;
                const isNextTarget = p.targetGrade === selectedPred.nextAchievableGrade;

                return (
                  <tr
                    key={p.targetGrade}
                    className={`transition-colors ${
                      isNextTarget
                        ? 'bg-amber-50/60 ring-1 ring-inset ring-amber-300'
                        : isImpossible
                        ? 'bg-charcoal-50/30 opacity-75'
                        : 'hover:bg-surface-subtle/70'
                    }`}
                  >
                    {/* Target Grade Badge */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-xl font-bold text-xs border ${getGradeBadgeClass(
                            p.targetGrade
                          )}`}
                        >
                          {p.targetGrade}
                        </span>
                        {isNextTarget && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-charcoal-900">
                            Next Target
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Grade Points */}
                    <td className="py-3.5 px-4 text-center font-bold text-charcoal-700">
                      {p.targetGradePoints}
                    </td>

                    {/* Required Total */}
                    <td className="py-3.5 px-4 text-center font-semibold text-charcoal-800">
                      {p.requiredTotal} / {selectedPred.maxPossibleTotal}
                    </td>

                    {/* Required SEE Marks */}
                    <td className="py-3.5 px-6 text-center">
                      {selectedPred.isSec ? (
                        <span className="text-xs text-charcoal-400 font-medium">N/A (Internal)</span>
                      ) : isImpossible ? (
                        <div className="flex items-center justify-center gap-1.5 text-rose-600 font-bold">
                          <XCircle className="w-4 h-4" />
                          <span>{p.requiredSee} / {selectedPred.maxSee}</span>
                        </div>
                      ) : (
                        <div>
                          <div className="text-sm font-extrabold text-charcoal-900">
                            {p.effectiveSeeRequired} / {selectedPred.maxSee}
                          </div>
                          {p.effectiveSeeRequired > p.requiredSee && (
                            <span className="text-[10px] text-amber-700 block">
                              (Bumped to min pass {p.effectiveSeeRequired})
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Feasibility Assessment Notes */}
                    <td className="py-3.5 px-6">
                      {isImpossible ? (
                        <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs">
                          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>{p.notes}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-800 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{p.notes}</span>
                        </div>
                      )}
                    </td>

                    {/* Interactive Action: Apply this target SEE */}
                    <td className="py-3.5 px-4 text-center">
                      {!selectedPred.isSec && p.isAchievable && (
                        <button
                          onClick={() => onUpdateSee(selectedPred.subjectId, p.effectiveSeeRequired)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-subtle text-charcoal-700 hover:bg-amber-100 hover:text-amber-900 border border-charcoal-700/10 transition-colors"
                          title={`Set SEE to ${p.effectiveSeeRequired} to test this grade`}
                        >
                          Simulate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
