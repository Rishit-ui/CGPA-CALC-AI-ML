import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Target,
  Award,
} from 'lucide-react';
import { OverviewCards } from './OverviewCards';
import { MarksEntryTable } from '../marks/MarksEntryTable';
import {
  CalculatedSubject,
  SemesterOverview,
  TargetSgpaPlan,
} from '../../types';
import { NavTab } from '../layout/Sidebar';

interface DashboardViewProps {
  overview: SemesterOverview;
  calculatedSubjects: CalculatedSubject[];
  targetPlan: TargetSgpaPlan;
  onUpdateCia: (id: string, val: number) => void;
  onUpdateSee: (id: string, val: number) => void;
  onNavigateTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  overview,
  calculatedSubjects,
  targetPlan,
  onUpdateCia,
  onUpdateSee,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Hero Summary Cards */}
      <OverviewCards overview={overview} />

      {/* 2. Quick Strategy & Next Grade Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Reverse SEE Predictor Callout */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                End-Semester Predictor
              </span>
              <Sparkles className="w-4 h-4 text-amber-700" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 mt-2">
              Reverse SEE Exam Target
            </h3>
            <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
              Find the exact marks needed out of 40 in each paper to achieve O, A+, A, and B+ grades.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('predictor')}
            className="mt-4 inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-charcoal-900 text-white text-xs font-bold hover:bg-charcoal-800 transition-colors shadow-soft"
          >
            <span>Open Grade Predictor</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Target SGPA Planner Callout */}
        <div className="p-5 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                SGPA Optimization
              </span>
              <Target className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <h3 className="text-base font-bold text-charcoal-900">
                Aiming for {targetPlan.targetSgpa.toFixed(1)} SGPA?
              </h3>
            </div>
            <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
              {targetPlan.isPossible
                ? `Requires an aggregate of ${targetPlan.totalRequiredSeeMarks} marks across all exams.`
                : 'Target is impossible with current CIA. Click to see achievable alternatives.'}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('target-sgpa')}
            className="mt-4 inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-amber-500 text-charcoal-900 text-xs font-bold hover:bg-amber-400 transition-colors shadow-soft"
          >
            <span>View SGPA Roadmap</span>
            <ArrowRight className="w-4 h-4 text-charcoal-900" />
          </button>
        </div>

        {/* Highest Credit Leverage Courses */}
        <div className="p-5 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                High-Impact Subjects
              </span>
              <Award className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-charcoal-900 mt-2">
              DS & PDM (4 Credits each)
            </h3>
            <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
              These 2 courses account for 36.4% of your total semester grade! Every grade jump here adds +0.18 to your SGPA.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('analytics')}
            className="mt-4 inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-surface-subtle text-charcoal-800 border border-charcoal-700/10 text-xs font-bold hover:bg-surface transition-colors"
          >
            <span>View Visual Analytics</span>
            <ArrowRight className="w-4 h-4 text-charcoal-600" />
          </button>
        </div>
      </div>

      {/* 3. Live Marks Entry Table */}
      <MarksEntryTable
        calculatedSubjects={calculatedSubjects}
        onUpdateCia={onUpdateCia}
        onUpdateSee={onUpdateSee}
      />
    </div>
  );
};
