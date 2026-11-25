import React from 'react';
import {
  Target,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { TargetSgpaPlan, CalculatedSubject } from '../../types';
import { getGradeBadgeClass } from '../marks/MarksEntryTable';

interface SgpaPlannerProps {
  targetPlan: TargetSgpaPlan;
  currentTargetSgpa: number;
  onSelectTarget: (sgpa: number) => void;
  onApplyPlan: (plan: TargetSgpaPlan) => void;
  calculatedSubjects: CalculatedSubject[];
}

export const SgpaPlanner: React.FC<SgpaPlannerProps> = ({
  targetPlan,
  currentTargetSgpa,
  onSelectTarget,
  onApplyPlan,
}) => {
  const presets = [10.0, 9.5, 9.0, 8.5, 8.0, 7.5, 7.0];

  return (
    <div className="space-y-6">
      {/* Target Selector Card */}
      <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Target className="w-5 h-5 text-amber-700" />
              </span>
              <h2 className="text-lg font-bold text-charcoal-900">
                What do I need for my Target SGPA?
              </h2>
            </div>
            <p className="text-xs text-charcoal-500 mt-1 max-w-xl">
              Select your goal below. The engine calculates the optimal credit-weighted grade
              combination that minimizes total examination pressure.
            </p>
          </div>

          {/* Current Target Display */}
          <div className="flex items-baseline gap-2 self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-xs font-semibold text-amber-800">Target:</span>
            <span className="text-2xl font-extrabold text-charcoal-900">
              {currentTargetSgpa.toFixed(2)}
            </span>
            <span className="text-xs text-charcoal-500">/ 10.00</span>
          </div>
        </div>

        {/* Preset Buttons & Custom Input */}
        <div className="mt-6 pt-6 border-t border-charcoal-700/10">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block mb-3">
            Select Goal or Preset SGPA
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {presets.map(sgpa => {
              const isSelected = Math.abs(currentTargetSgpa - sgpa) < 0.01;
              return (
                <button
                  key={sgpa}
                  onClick={() => onSelectTarget(sgpa)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-amber-500 text-charcoal-900 border-amber-500 shadow-soft ring-2 ring-amber-300'
                      : 'bg-surface text-charcoal-700 hover:bg-surface-subtle border-charcoal-700/15'
                  }`}
                >
                  {sgpa.toFixed(1)} SGPA
                </button>
              );
            })}

            {/* Custom Input */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-medium text-charcoal-500">Custom:</span>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={currentTargetSgpa}
                onChange={e => onSelectTarget(parseFloat(e.target.value) || 0)}
                className="w-20 px-3 py-1.5 rounded-xl border border-charcoal-700/15 text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feasibility Alert Banner */}
      {targetPlan.isPossible ? (
        <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Target SGPA {targetPlan.targetSgpa.toFixed(2)} is Achievable!
              </h3>
              <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                {targetPlan.explanation}
              </p>
            </div>
          </div>

          <button
            onClick={() => onApplyPlan(targetPlan)}
            className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-charcoal-900 text-white hover:bg-charcoal-800 transition-colors shadow-soft"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Apply Plan to Marks Entry</span>
          </button>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-rose-600 text-white">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-950">
              Target SGPA {targetPlan.targetSgpa.toFixed(2)} is Mathematically Impossible
            </h3>
            <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
              {targetPlan.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Recommended Subject Allocation Table */}
      <div className="bg-surface rounded-2xl border border-charcoal-700/10 shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-charcoal-700/10 flex items-center justify-between bg-surface-subtle/50">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">
              Recommended Exam Score Allocation
            </h3>
            <p className="text-xs text-charcoal-500">
              Prioritizes combinations requiring lower total SEE marks across all 22 semester credits.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-charcoal-400 block font-medium">Total SEE Marks Needed</span>
            <span className="text-base font-extrabold text-charcoal-900">
              {targetPlan.totalRequiredSeeMarks} Marks Aggregate
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-surface-subtle text-xs font-bold uppercase tracking-wider text-charcoal-500 border-b border-charcoal-700/10">
                <th className="py-3 px-6">Subject</th>
                <th className="py-3 px-4 text-center">Credits</th>
                <th className="py-3 px-6 text-center">Target Grade</th>
                <th className="py-3 px-4 text-center">Grade Points</th>
                <th className="py-3 px-6 text-center">Required SEE Marks</th>
                <th className="py-3 px-6 text-center">Credit Weighted Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-700/5">
              {targetPlan.subjects.map(item => (
                <tr key={item.subjectId} className="hover:bg-amber-50/30 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-charcoal-900">
                    <div className="flex items-center gap-2">
                      <span>{item.code}</span>
                      {item.isSec && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold">
                          SEC (Internal)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-charcoal-700">
                    {item.credits}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span
                      className={`inline-flex items-center justify-center min-w-[32px] px-2.5 py-1 rounded-xl text-xs font-bold border ${getGradeBadgeClass(
                        item.targetGrade
                      )}`}
                    >
                      {item.targetGrade}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-charcoal-800">
                    {item.targetGradePoints}
                  </td>
                  <td className="py-3.5 px-6 text-center font-extrabold text-charcoal-900">
                    {item.isSec ? (
                      <span className="text-xs text-charcoal-400 font-medium">Internal Only</span>
                    ) : (
                      <span>{item.requiredSee} / 40</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center font-bold text-charcoal-800">
                    {item.credits * item.targetGradePoints} pts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Weighting & Strategic Leverage Card */}
      <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Zap className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-900">
              Strategic Credit-Weighted Improvement Analysis
            </h3>
            <p className="text-xs text-charcoal-500">
              Subjects where preparation effort gives the highest boost to your final SGPA.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {targetPlan.creditImpactRankings.map(item => (
            <div
              key={item.subjectId}
              className={`p-4 rounded-xl border transition-all ${
                item.credits >= 4
                  ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/40'
                  : 'bg-surface-subtle border-charcoal-700/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-charcoal-900 text-sm">{item.code}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-surface border font-bold text-charcoal-800">
                  {item.credits} Credits
                </span>
              </div>
              <p className="mt-2 text-xs text-charcoal-600 leading-relaxed">{item.advice}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
