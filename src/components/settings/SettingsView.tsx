import React, { useState } from 'react';
import {
  RotateCcw,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
} from 'lucide-react';
import {
  GradeBoundary,
  PassingRules,
  SubjectConfig,
} from '../../types';

interface SettingsViewProps {
  boundaries: GradeBoundary[];
  passingRules: PassingRules;
  subjects: SubjectConfig[];
  onUpdateBoundaries: (boundaries: GradeBoundary[]) => void;
  onUpdatePassingRules: (rules: PassingRules) => void;
  onUpdateSubjectConfig: (subject: SubjectConfig) => void;
  onAddSubject: (subject: Omit<SubjectConfig, 'id'>) => void;
  onRemoveSubject: (id: string) => void;
  onResetAllToDefault: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  boundaries,
  passingRules,
  subjects,
  onUpdateBoundaries,
  onUpdatePassingRules,
  onUpdateSubjectConfig,
  onAddSubject,
  onRemoveSubject,
  onResetAllToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'grades' | 'rules' | 'subjects'>('grades');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // New subject state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCredits, setNewCredits] = useState('3');
  const [newCiaMax, setNewCiaMax] = useState('60');
  const [newSeeMax, setNewSeeMax] = useState('40');
  const [newIsSec, setNewIsSec] = useState(false);

  const triggerFeedback = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    onAddSubject({
      code: newCode.trim().toUpperCase(),
      name: newName.trim() || newCode.trim(),
      credits: parseFloat(newCredits) || 3,
      ciaMax: parseFloat(newCiaMax) || 60,
      seeMax: newIsSec ? 0 : (parseFloat(newSeeMax) || 40),
      isSec: newIsSec,
    });

    setNewCode('');
    setNewName('');
    triggerFeedback();
  };

  return (
    <div className="space-y-6">
      {/* Settings Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-charcoal-700/10 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('grades')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'grades'
                ? 'bg-charcoal-900 text-white shadow-soft'
                : 'text-charcoal-600 hover:bg-surface-subtle hover:text-charcoal-900'
            }`}
          >
            Grade Boundaries
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rules'
                ? 'bg-charcoal-900 text-white shadow-soft'
                : 'text-charcoal-600 hover:bg-surface-subtle hover:text-charcoal-900'
            }`}
          >
            Passing Requirements
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'subjects'
                ? 'bg-charcoal-900 text-white shadow-soft'
                : 'text-charcoal-600 hover:bg-surface-subtle hover:text-charcoal-900'
            }`}
          >
            Subjects & Credits ({subjects.length})
          </button>
        </div>

        {saveFeedback && (
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Check className="w-4 h-4" />
            Saved!
          </span>
        )}
      </div>

      {/* Tab 1: Grade Boundaries */}
      {activeTab === 'grades' && (
        <div className="bg-surface rounded-2xl border border-charcoal-700/10 shadow-soft overflow-hidden">
          <div className="p-6 border-b border-charcoal-700/10 bg-surface-subtle/50">
            <h3 className="text-base font-bold text-charcoal-900">
              DSU Standard Grading Scale
            </h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              Adjust minimum total marks and grade point weights for each letter grade.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-surface-subtle text-xs font-bold uppercase tracking-wider text-charcoal-500 border-b border-charcoal-700/10">
                  <th className="py-3 px-6">Letter Grade</th>
                  <th className="py-3 px-6">Minimum Total Marks</th>
                  <th className="py-3 px-6">Maximum Marks</th>
                  <th className="py-3 px-6">Grade Points</th>
                  <th className="py-3 px-6">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-700/5">
                {boundaries.map((b, idx) => (
                  <tr key={b.grade} className="hover:bg-surface-subtle/40">
                    <td className="py-3.5 px-6 font-bold text-charcoal-900">
                      {b.grade}
                    </td>
                    <td className="py-3.5 px-6">
                      <input
                        type="number"
                        step="0.5"
                        value={b.minMarks}
                        onChange={e => {
                          const updated = [...boundaries];
                          updated[idx] = { ...b, minMarks: parseFloat(e.target.value) || 0 };
                          onUpdateBoundaries(updated);
                          triggerFeedback();
                        }}
                        className="w-24 px-3 py-1.5 rounded-lg border border-charcoal-700/15 text-xs font-bold"
                      />
                    </td>
                    <td className="py-3.5 px-6 font-mono text-xs text-charcoal-600">
                      {b.maxMarks}
                    </td>
                    <td className="py-3.5 px-6">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="10"
                        value={b.gradePoints}
                        onChange={e => {
                          const updated = [...boundaries];
                          updated[idx] = { ...b, gradePoints: parseInt(e.target.value) || 0 };
                          onUpdateBoundaries(updated);
                          triggerFeedback();
                        }}
                        className="w-20 px-3 py-1.5 rounded-lg border border-charcoal-700/15 text-xs font-bold"
                      />
                    </td>
                    <td className="py-3.5 px-6 text-xs text-charcoal-500 font-medium">
                      {b.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Passing Rules */}
      {activeTab === 'rules' && (
        <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-6">
          <div>
            <h3 className="text-base font-bold text-charcoal-900">
              Minimum Passing & Eligibility Requirements
            </h3>
            <p className="text-xs text-charcoal-500 mt-0.5">
              These percentages govern eligibility and component-level pass/fail validation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-charcoal-700/10 bg-surface-subtle/50 space-y-2">
              <label className="text-xs font-bold text-charcoal-800 block">
                CIA Minimum Passing / Eligibility (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={passingRules.ciaMinPercent}
                  onChange={e => {
                    onUpdatePassingRules({
                      ...passingRules,
                      ciaMinPercent: parseFloat(e.target.value) || 0,
                    });
                    triggerFeedback();
                  }}
                  className="w-24 px-3 py-2 rounded-xl border border-charcoal-700/15 text-sm font-bold"
                />
                <span className="text-xs text-charcoal-500">
                  (Default 40% = 24 / 60 marks)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-charcoal-700/10 bg-surface-subtle/50 space-y-2">
              <label className="text-xs font-bold text-charcoal-800 block">
                SEE Minimum Exam Passing (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={passingRules.seeMinPercent}
                  onChange={e => {
                    onUpdatePassingRules({
                      ...passingRules,
                      seeMinPercent: parseFloat(e.target.value) || 0,
                    });
                    triggerFeedback();
                  }}
                  className="w-24 px-3 py-2 rounded-xl border border-charcoal-700/15 text-sm font-bold"
                />
                <span className="text-xs text-charcoal-500">
                  (Default 40% = 16 / 40 marks)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-charcoal-700/10 bg-surface-subtle/50 space-y-2">
              <label className="text-xs font-bold text-charcoal-800 block">
                Overall Course Minimum Passing (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={passingRules.overallMinPercent}
                  onChange={e => {
                    onUpdatePassingRules({
                      ...passingRules,
                      overallMinPercent: parseFloat(e.target.value) || 0,
                    });
                    triggerFeedback();
                  }}
                  className="w-24 px-3 py-2 rounded-xl border border-charcoal-700/15 text-sm font-bold"
                />
                <span className="text-xs text-charcoal-500">
                  (Default 40% = 40 / 100 marks)
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-charcoal-700/10 bg-surface-subtle/50 space-y-2">
              <label className="text-xs font-bold text-charcoal-800 block">
                SEC Internal Minimum Passing (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={passingRules.secMinPercent}
                  onChange={e => {
                    onUpdatePassingRules({
                      ...passingRules,
                      secMinPercent: parseFloat(e.target.value) || 0,
                    });
                    triggerFeedback();
                  }}
                  className="w-24 px-3 py-2 rounded-xl border border-charcoal-700/15 text-sm font-bold"
                />
                <span className="text-xs text-charcoal-500">
                  (Default 40% = 40 / 100 marks)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Subjects Configuration */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          {/* Existing Subjects List */}
          <div className="bg-surface rounded-2xl border border-charcoal-700/10 shadow-soft overflow-hidden">
            <div className="p-6 border-b border-charcoal-700/10 bg-surface-subtle/50">
              <h3 className="text-base font-bold text-charcoal-900">Configured Semester Subjects</h3>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Edit credits, CIA/SEE weightages, or SEC classification.
              </p>
            </div>

            <div className="divide-y divide-charcoal-700/5">
              {subjects.map(s => (
                <div key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="px-2.5 py-1 rounded-xl bg-surface-subtle font-extrabold text-sm border border-charcoal-700/10 text-charcoal-900">
                      {s.code}
                    </span>
                    <div>
                      <span className="font-semibold text-charcoal-900 text-sm block">{s.name}</span>
                      <span className="text-xs text-charcoal-500">
                        {s.credits} Credits • {s.isSec ? '100% Internal' : `${s.ciaMax} CIA + ${s.seeMax} SEE`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-charcoal-500">Credits:</span>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={s.credits}
                        onChange={e => {
                          onUpdateSubjectConfig({
                            ...s,
                            credits: parseFloat(e.target.value) || 1,
                          });
                          triggerFeedback();
                        }}
                        className="w-16 px-2 py-1 rounded-lg border text-xs font-bold text-center"
                      />
                    </div>

                    {subjects.length > 1 && (
                      <button
                        onClick={() => onRemoveSubject(s.id)}
                        className="p-1.5 rounded-lg text-charcoal-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete subject"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Custom Subject */}
          <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-charcoal-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>Add Custom Course / Subject</span>
            </h3>

            <form onSubmit={handleAddSubject} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-charcoal-600 block mb-1">Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ML"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-charcoal-700/15"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-charcoal-600 block mb-1">Subject Name</label>
                <input
                  type="text"
                  placeholder="Machine Learning"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-charcoal-700/15"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-charcoal-600 block mb-1">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newCredits}
                  onChange={e => setNewCredits(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-charcoal-700/15"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-charcoal-600 block mb-1">CIA Max Marks</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newCiaMax}
                  onChange={e => setNewCiaMax(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-charcoal-700/15"
                />
              </div>

              {!newIsSec && (
                <div>
                  <label className="text-xs font-medium text-charcoal-600 block mb-1">SEE Max Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newSeeMax}
                    onChange={e => setNewSeeMax(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-charcoal-700/15"
                  />
                </div>
              )}

              <div className="sm:col-span-3 flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="secCheck"
                  checked={newIsSec}
                  onChange={e => setNewIsSec(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <label htmlFor="secCheck" className="text-xs font-medium text-charcoal-700">
                  Is purely Internal / SEC course (No end-semester exam)
                </label>
              </div>

              <div className="sm:col-span-3 pt-2">
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl text-xs font-bold bg-charcoal-900 text-white hover:bg-charcoal-800"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 rounded-2xl bg-surface border border-rose-200 shadow-soft space-y-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="text-base font-bold text-rose-900">Reset to University Factory Defaults</h3>
        </div>
        <p className="text-xs text-charcoal-600 leading-relaxed">
          Clears local storage, restores the original 7 preloaded subjects (22 credits), restores standard
          DSU grade boundaries (O to F) and passing criteria.
        </p>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restore Original Factory Defaults</span>
        </button>
      </div>

      {/* Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-surface rounded-2xl border border-charcoal-700/10 shadow-soft-lg">
            <h3 className="text-base font-bold text-charcoal-900">Restore All Defaults?</h3>
            <p className="mt-2 text-sm text-charcoal-600 leading-relaxed">
              This will reset all subject definitions, grade boundaries, passing thresholds, and marks to the default university configuration.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-charcoal-700 hover:bg-surface-subtle border"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetAllToDefault();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-soft"
              >
                Yes, Restore Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
