import React, { useState } from 'react';
import {
  Plus,
  Trash2,
} from 'lucide-react';
import { PreviousSemester, CgpaSummary } from '../../types';

interface CgpaTrackerProps {
  cgpaSummary: CgpaSummary;
  previousSemesters: PreviousSemester[];
  onAddSemester: (sem: Omit<PreviousSemester, 'id'>) => void;
  onRemoveSemester: (id: string) => void;
}

export const CgpaTracker: React.FC<CgpaTrackerProps> = ({
  cgpaSummary,
  previousSemesters,
  onAddSemester,
  onRemoveSemester,
}) => {
  const [newSemName, setNewSemName] = useState('');
  const [newSgpa, setNewSgpa] = useState('');
  const [newCredits, setNewCredits] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const sgpaVal = parseFloat(newSgpa);
    const creditsVal = parseFloat(newCredits);

    if (isNaN(sgpaVal) || sgpaVal < 0 || sgpaVal > 10) return;
    if (isNaN(creditsVal) || creditsVal <= 0) return;

    onAddSemester({
      semesterName: newSemName.trim() || `Semester ${previousSemesters.length + 1}`,
      sgpa: sgpaVal,
      credits: creditsVal,
    });

    setNewSemName('');
    setNewSgpa('');
    setNewCredits('');
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Result Card */}
        <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
              {cgpaSummary.hasPreviousSemesters ? 'Cumulative CGPA' : 'Semester SGPA (Current)'}
            </span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                cgpaSummary.hasPreviousSemesters
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-charcoal-100 text-charcoal-700'
              }`}
            >
              {cgpaSummary.hasPreviousSemesters
                ? `${previousSemesters.length + 1} Semesters Combined`
                : 'Single Semester'}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-extrabold text-charcoal-900 tracking-tight">
              {cgpaSummary.cumulativeCgpa.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-charcoal-500">/ 10.00</span>
          </div>

          <p className="text-xs text-charcoal-600 leading-relaxed pt-2 border-t border-charcoal-700/5">
            {cgpaSummary.hasPreviousSemesters ? (
              <span>
                Calculated using true credit-weighted formula:{' '}
                <code className="px-1.5 py-0.5 rounded bg-surface-subtle font-mono text-charcoal-800">
                  CGPA = Σ(SGPA × Credits) / Σ(Credits)
                </code>
                . Avoids simple unweighted averaging errors.
              </span>
            ) : (
              <span>
                No previous semesters recorded yet. Showing your current Semester SGPA ({cgpaSummary.currentSemesterSgpa.toFixed(2)}). Add previous semesters below to track your cumulative CGPA.
              </span>
            )}
          </p>
        </div>

        {/* Total Cumulative Credits */}
        <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block">
            Total Academic Credits
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-charcoal-900">
              {cgpaSummary.totalCumulativeCredits}
            </span>
            <span className="text-xs text-charcoal-500 font-medium">Credits Earned</span>
          </div>
          <div className="text-xs text-charcoal-500 pt-2 border-t border-charcoal-700/5 space-y-1">
            <div className="flex justify-between">
              <span>Current Semester:</span>
              <strong className="text-charcoal-800">{cgpaSummary.currentSemesterCredits} cr</strong>
            </div>
            <div className="flex justify-between">
              <span>Previous Semesters:</span>
              <strong className="text-charcoal-800">
                {cgpaSummary.totalCumulativeCredits - cgpaSummary.currentSemesterCredits} cr
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Add Semester Form & Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-4">
          <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-600" />
            <span>Add Previous Semester</span>
          </h3>

          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Semester Label
              </label>
              <input
                type="text"
                placeholder={`Semester ${previousSemesters.length + 1}`}
                value={newSemName}
                onChange={e => setNewSemName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-charcoal-700/15 focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Semester SGPA (0.00 – 10.00) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                placeholder="e.g. 8.65"
                value={newSgpa}
                onChange={e => setNewSgpa(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-charcoal-700/15 focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-charcoal-600 block mb-1">
                Total Credits *
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="40"
                required
                placeholder="e.g. 22"
                value={newCredits}
                onChange={e => setNewCredits(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-charcoal-700/15 focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 text-charcoal-900 hover:bg-amber-400 shadow-soft transition-colors"
            >
              Add Semester to Record
            </button>
          </form>
        </div>

        {/* Semesters Table */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-charcoal-700/10 shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-charcoal-700/10 flex items-center justify-between bg-surface-subtle/50">
            <div>
              <h3 className="text-base font-bold text-charcoal-900">Academic History Breakdown</h3>
              <p className="text-xs text-charcoal-500">
                Combined record of previous and ongoing semester metrics.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-subtle text-xs font-bold uppercase tracking-wider text-charcoal-500 border-b border-charcoal-700/10">
                  <th className="py-3 px-6">Semester</th>
                  <th className="py-3 px-4 text-center">SGPA</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-6 text-center">Credit Points</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-700/5">
                {/* Current Semester Row */}
                <tr className="bg-amber-50/40">
                  <td className="py-3.5 px-6 font-bold text-charcoal-900">
                    <div className="flex items-center gap-2">
                      <span>Current Semester (In Progress)</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                        Active
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-charcoal-900">
                    {cgpaSummary.currentSemesterSgpa.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-charcoal-700">
                    {cgpaSummary.currentSemesterCredits}
                  </td>
                  <td className="py-3.5 px-6 text-center font-bold text-charcoal-800">
                    {(cgpaSummary.currentSemesterSgpa * cgpaSummary.currentSemesterCredits).toFixed(1)} pts
                  </td>
                  <td className="py-3.5 px-4 text-center text-xs text-charcoal-400">
                    Calculated live
                  </td>
                </tr>

                {/* Previous Semesters */}
                {previousSemesters.map(sem => (
                  <tr key={sem.id} className="hover:bg-surface-subtle/50 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-charcoal-800">
                      {sem.semesterName}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-charcoal-900">
                      {sem.sgpa.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-charcoal-700">
                      {sem.credits}
                    </td>
                    <td className="py-3.5 px-6 text-center font-medium text-charcoal-700">
                      {(sem.sgpa * sem.credits).toFixed(1)} pts
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onRemoveSemester(sem.id)}
                        className="p-1 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete semester"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
