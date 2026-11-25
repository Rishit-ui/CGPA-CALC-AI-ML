import React from 'react';
import {
  Award,
  TrendingUp,
  BookOpen,
  PieChart,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { SemesterOverview } from '../../types';

interface OverviewCardsProps {
  overview: SemesterOverview;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({ overview }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Expected SGPA Card (Hero) */}
      <div className="relative p-5 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft overflow-hidden group hover:border-amber-300 transition-all">
        <div className="absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Expected SGPA
          </span>
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <Award className="w-4 h-4 text-amber-700" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
            {overview.expectedSgpa.toFixed(2)}
          </span>
          <span className="text-xs text-charcoal-500 font-medium">/ 10.00</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-charcoal-700/5">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{overview.totalPassedSubjects} Passed</span>
          </div>
          {overview.totalFailedSubjects > 0 && (
            <div className="flex items-center gap-1.5 text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{overview.totalFailedSubjects} Ineligible / Fail</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. SGPA Potential Range (Highest & Lowest) */}
      <div className="p-5 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            SGPA Potential Range
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-charcoal-400 block font-medium">Highest (40/40 SEE)</span>
            <span className="text-xl font-bold text-emerald-700">
              {overview.highestPossibleSgpa.toFixed(2)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-charcoal-400 block font-medium">Lowest (Pass SEE)</span>
            <span className="text-xl font-bold text-amber-700">
              {overview.lowestPossibleSgpa.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="mt-3 text-xs pt-3 border-t border-charcoal-700/5 text-charcoal-500 flex items-center justify-between">
          <span>Max reachable ceiling</span>
          <span className="font-semibold text-charcoal-800">
            {(overview.highestPossibleSgpa - overview.expectedSgpa >= 0)
              ? `+${(overview.highestPossibleSgpa - overview.expectedSgpa).toFixed(2)} headroom`
              : 'Max reached'}
          </span>
        </div>
      </div>

      {/* 3. CIA Internal Marks */}
      <div className="p-5 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Total CIA Internal
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <PieChart className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
            {overview.totalCiaObtained}
          </span>
          <span className="text-xs text-charcoal-500 font-medium">
            / {overview.totalPossibleCia} ({overview.ciaPercentage}%)
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-3 w-full bg-charcoal-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-amber-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, overview.ciaPercentage)}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-charcoal-400 flex items-center justify-between">
          <span>6 Regular (60) + SEC (100)</span>
          <span className="font-semibold text-charcoal-700">{overview.ciaPercentage.toFixed(1)}%</span>
        </div>
      </div>

      {/* 4. Semester Workload */}
      <div className="p-5 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft group hover:border-amber-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            Semester Workload
          </span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <div>
            <span className="text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {overview.totalCredits}
            </span>
            <span className="text-xs text-charcoal-500 font-medium ml-1">Credits</span>
          </div>
          <span className="text-charcoal-300">•</span>
          <div>
            <span className="text-2xl font-bold text-charcoal-800">
              {overview.totalSubjects}
            </span>
            <span className="text-xs text-charcoal-500 font-medium ml-1">Subjects</span>
          </div>
        </div>
        <div className="mt-3 text-xs pt-3 border-t border-charcoal-700/5 text-charcoal-500 flex items-center justify-between">
          <span>Average Credit Weight</span>
          <span className="font-semibold text-charcoal-800">
            {overview.totalSubjects > 0
              ? (overview.totalCredits / overview.totalSubjects).toFixed(1)
              : '0'}{' '}
            cr/course
          </span>
        </div>
      </div>
    </div>
  );
};
