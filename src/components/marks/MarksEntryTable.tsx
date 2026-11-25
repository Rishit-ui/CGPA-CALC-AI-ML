import React from 'react';
import {
  AlertCircle,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { CalculatedSubject } from '../../types';

interface MarksEntryTableProps {
  calculatedSubjects: CalculatedSubject[];
  onUpdateCia: (id: string, val: number) => void;
  onUpdateSee: (id: string, val: number) => void;
}

export const getGradeBadgeClass = (grade: string): string => {
  switch (grade) {
    case 'O':
      return 'bg-amber-100 text-amber-900 border-amber-300 ring-1 ring-amber-400/30';
    case 'A+':
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    case 'A':
      return 'bg-teal-100 text-teal-900 border-teal-300';
    case 'B+':
      return 'bg-sky-100 text-sky-900 border-sky-300';
    case 'B':
      return 'bg-indigo-100 text-indigo-900 border-indigo-300';
    case 'C':
      return 'bg-purple-100 text-purple-900 border-purple-300';
    case 'P':
      return 'bg-zinc-100 text-zinc-900 border-zinc-300';
    case 'F':
    default:
      return 'bg-rose-100 text-rose-900 border-rose-300';
  }
};

export const MarksEntryTable: React.FC<MarksEntryTableProps> = ({
  calculatedSubjects,
  onUpdateCia,
  onUpdateSee,
}) => {
  return (
    <div className="bg-surface rounded-2xl border border-charcoal-700/10 shadow-soft overflow-hidden">
      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-charcoal-700/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-subtle/50">
        <div>
          <h2 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
            <span>Subject Marks & Grade Calculation</span>
            <span className="text-xs font-normal text-charcoal-500">
              ({calculatedSubjects.length} subjects • 22 credits)
            </span>
          </h2>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Type directly to update. Normal subjects: 60 CIA + 40 SEE. SEC: 100 Internal.
          </p>
        </div>

        {/* Quick legend */}
        <div className="flex items-center gap-3 text-xs text-charcoal-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            Min CIA: 24/60
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
            Min SEE: 16/40
          </span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-surface-subtle text-xs font-bold uppercase tracking-wider text-charcoal-500 border-b border-charcoal-700/10">
              <th className="py-3.5 px-6">Subject</th>
              <th className="py-3.5 px-4 text-center">Credits</th>
              <th className="py-3.5 px-6">CIA Marks</th>
              <th className="py-3.5 px-6">SEE Marks</th>
              <th className="py-3.5 px-6 text-center">Total Marks</th>
              <th className="py-3.5 px-4 text-center">Grade</th>
              <th className="py-3.5 px-4 text-center">Grade Points</th>
              <th className="py-3.5 px-6 text-center">Credit Pts</th>
              <th className="py-3.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-700/5">
            {calculatedSubjects.map(sub => {
              const isSec = sub.config.isSec;
              const hasCiaWarning = !sub.isCiaEligible;
              const hasSeeWarning = !isSec && !sub.isSeeEligible && sub.seeObtained > 0;

              return (
                <tr
                  key={sub.config.id}
                  className="hover:bg-amber-50/30 transition-colors group"
                >
                  {/* Subject Name & Code */}
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-charcoal-900 group-hover:text-amber-700 transition-colors">
                            {sub.config.code}
                          </span>
                          {isSec && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                              Internal Only
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-charcoal-500 block line-clamp-1 max-w-[220px]">
                          {sub.config.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Credits */}
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-surface-subtle text-charcoal-800 font-semibold text-xs border border-charcoal-700/10">
                      {sub.config.credits}
                    </span>
                  </td>

                  {/* CIA Input */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={sub.config.ciaMax}
                          step={0.5}
                          value={sub.ciaObtained || ''}
                          onChange={e => {
                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                            onUpdateCia(sub.config.id, val);
                          }}
                          placeholder="0"
                          className={`w-20 px-3 py-2 text-sm font-semibold rounded-xl border text-center transition-all focus:outline-none focus:ring-2 ${
                            hasCiaWarning
                              ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-rose-400'
                              : 'border-charcoal-700/15 bg-surface text-charcoal-900 focus:border-amber-500 focus:ring-amber-400/30'
                          }`}
                        />
                      </div>
                      <span className="text-xs font-medium text-charcoal-400">
                        / {sub.config.ciaMax}
                      </span>
                    </div>
                    {hasCiaWarning && (
                      <span className="text-[10px] font-semibold text-rose-600 block mt-1">
                        Ineligible (&lt; 24 min)
                      </span>
                    )}
                  </td>

                  {/* SEE Input */}
                  <td className="py-4 px-6">
                    {isSec ? (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-charcoal-400 bg-surface-subtle px-3 py-2 rounded-xl border border-dashed border-charcoal-700/15 w-fit">
                        <Lock className="w-3.5 h-3.5 text-charcoal-400" />
                        <span>No SEE Exam</span>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={sub.config.seeMax}
                            step={0.5}
                            value={sub.seeObtained || ''}
                            onChange={e => {
                              const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                              onUpdateSee(sub.config.id, val);
                            }}
                            placeholder="0"
                            className={`w-20 px-3 py-2 text-sm font-semibold rounded-xl border text-center transition-all focus:outline-none focus:ring-2 ${
                              hasSeeWarning
                                ? 'border-amber-400 bg-amber-50/50 text-amber-900 focus:ring-amber-400'
                                : 'border-charcoal-700/15 bg-surface text-charcoal-900 focus:border-amber-500 focus:ring-amber-400/30'
                            }`}
                          />
                          <span className="text-xs font-medium text-charcoal-400">
                            / {sub.config.seeMax}
                          </span>
                        </div>
                        {hasSeeWarning && (
                          <span className="text-[10px] font-semibold text-amber-700 block mt-1">
                            Below min pass (16)
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Total Marks */}
                  <td className="py-4 px-6 text-center">
                    <span className="text-sm font-extrabold text-charcoal-900">
                      {sub.totalMarks}
                    </span>
                    <span className="text-xs text-charcoal-400 block font-normal">
                      / {sub.maxPossibleTotal}
                    </span>
                  </td>

                  {/* Letter Grade */}
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center min-w-[36px] px-2.5 py-1 rounded-xl text-xs font-bold border ${getGradeBadgeClass(
                        sub.grade
                      )}`}
                    >
                      {sub.grade}
                    </span>
                  </td>

                  {/* Grade Points */}
                  <td className="py-4 px-4 text-center font-bold text-charcoal-800">
                    {sub.gradePoints}
                  </td>

                  {/* Credit Weighted Points */}
                  <td className="py-4 px-6 text-center">
                    <span className="text-xs font-bold text-charcoal-800">
                      {sub.creditWeightedPoints}
                    </span>
                    <span className="text-[11px] text-charcoal-400 block">
                      ({sub.config.credits} × {sub.gradePoints})
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {sub.isPassed ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Pass
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-semibold"
                        title={sub.statusMessage}
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        {sub.status === 'FAIL_CIA'
                          ? 'CIA Ineligible'
                          : sub.status === 'FAIL_SEE'
                          ? 'SEE Min Fail'
                          : 'Fail'}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden p-4 space-y-3">
        {calculatedSubjects.map(sub => {
          const isSec = sub.config.isSec;
          const hasCiaWarning = !sub.isCiaEligible;
          const hasSeeWarning = !isSec && !sub.isSeeEligible && sub.seeObtained > 0;

          return (
            <div
              key={sub.config.id}
              className="p-4 rounded-xl border border-charcoal-700/10 bg-surface shadow-soft-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-charcoal-900">{sub.config.code}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-surface-subtle font-semibold text-charcoal-700 border border-charcoal-700/10">
                      {sub.config.credits} cr
                    </span>
                    {isSec && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        SEC (Internal)
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-charcoal-500 block mt-0.5">{sub.config.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${getGradeBadgeClass(
                      sub.grade
                    )}`}
                  >
                    Grade {sub.grade}
                  </span>
                </div>
              </div>

              {/* Input grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-charcoal-700/5">
                <div>
                  <label className="text-xs font-medium text-charcoal-500 block mb-1">
                    CIA Marks ({sub.config.ciaMax})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={sub.config.ciaMax}
                      value={sub.ciaObtained || ''}
                      onChange={e => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        onUpdateCia(sub.config.id, val);
                      }}
                      className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-charcoal-700/15 focus:ring-2 focus:ring-amber-400/30"
                    />
                  </div>
                  {hasCiaWarning && (
                    <span className="text-[10px] font-semibold text-rose-600 block mt-1">
                      Ineligible (&lt; 24)
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-medium text-charcoal-500 block mb-1">
                    SEE Marks ({sub.config.seeMax})
                  </label>
                  {isSec ? (
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-400 bg-surface-subtle px-3 py-2 rounded-xl border border-dashed">
                      <Lock className="w-3.5 h-3.5" />
                      <span>No SEE</span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="number"
                        min={0}
                        max={sub.config.seeMax}
                        value={sub.seeObtained || ''}
                        onChange={e => {
                          const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                          onUpdateSee(sub.config.id, val);
                        }}
                        className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-charcoal-700/15 focus:ring-2 focus:ring-amber-400/30"
                      />
                      {hasSeeWarning && (
                        <span className="text-[10px] font-semibold text-amber-700 block mt-1">
                          Below pass (16)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Total & points summary */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-charcoal-700/5 text-charcoal-600">
                <div>
                  Total: <strong className="text-charcoal-900">{sub.totalMarks}</strong> /{' '}
                  {sub.maxPossibleTotal}
                </div>
                <div>
                  Grade Points: <strong className="text-charcoal-900">{sub.gradePoints}</strong> (
                  {sub.creditWeightedPoints} pts)
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
