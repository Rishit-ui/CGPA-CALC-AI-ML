import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { GradePilotProvider, useGradePilot } from './context/GradePilotContext';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { MarksEntryTable } from './components/marks/MarksEntryTable';
import { SeePredictor } from './components/predictor/SeePredictor';
import { SgpaPlanner } from './components/planner/SgpaPlanner';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CgpaTracker } from './components/cgpa/CgpaTracker';
import { SettingsView } from './components/settings/SettingsView';
import { exportToPdf } from './utils/exportPdf';
import { exportToCsv } from './utils/exportCsv';
import { TargetSgpaPlan } from './types';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    subjects,
    calculatedSubjects,
    overview,
    predictions,
    targetPlan,
    cgpaSummary,
    previousSemesters,
    boundaries,
    passingRules,
    scenarioOffsets,
    targetSgpa,
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
    removePreviousSemester,
  } = useGradePilot();

  const handleLoadDemo = () => {
    loadDemoData();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // Ignore if canvas confetti is not supported
    }
  };

  const handleApplyPlan = (plan: TargetSgpaPlan) => {
    plan.subjects.forEach(s => {
      if (!s.isSec) {
        updateSee(s.subjectId, s.requiredSee);
      }
    });
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    setCurrentTab('marks-entry');
  };

  const handleExportPdf = () => {
    exportToPdf(calculatedSubjects, overview, cgpaSummary);
  };

  const handleExportCsv = () => {
    exportToCsv(calculatedSubjects, overview, cgpaSummary);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col antialiased">
      {/* Responsive Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        expectedSgpa={overview.expectedSgpa}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <Navbar
          currentTab={currentTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          onLoadDemo={handleLoadDemo}
          onReset={resetMarks}
          onExportPdf={handleExportPdf}
          onExportCsv={handleExportCsv}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              overview={overview}
              calculatedSubjects={calculatedSubjects}
              targetPlan={targetPlan}
              onUpdateCia={updateCia}
              onUpdateSee={updateSee}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'marks-entry' && (
            <div className="space-y-6">
              <MarksEntryTable
                calculatedSubjects={calculatedSubjects}
                onUpdateCia={updateCia}
                onUpdateSee={updateSee}
              />
            </div>
          )}

          {currentTab === 'predictor' && (
            <SeePredictor
              predictions={predictions}
              calculatedSubjects={calculatedSubjects}
              onUpdateSee={updateSee}
            />
          )}

          {currentTab === 'target-sgpa' && (
            <SgpaPlanner
              targetPlan={targetPlan}
              currentTargetSgpa={targetSgpa}
              onSelectTarget={setTargetSgpa}
              onApplyPlan={handleApplyPlan}
              calculatedSubjects={calculatedSubjects}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              calculatedSubjects={calculatedSubjects}
              overview={overview}
              scenarioOffsets={scenarioOffsets}
              onUpdateScenarioOffset={updateScenarioOffset}
              boundaries={boundaries}
              passingRules={passingRules}
            />
          )}

          {currentTab === 'cgpa-tracker' && (
            <CgpaTracker
              cgpaSummary={cgpaSummary}
              previousSemesters={previousSemesters}
              onAddSemester={addPreviousSemester}
              onRemoveSemester={removePreviousSemester}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              boundaries={boundaries}
              passingRules={passingRules}
              subjects={subjects}
              onUpdateBoundaries={updateBoundaries}
              onUpdatePassingRules={updatePassingRules}
              onUpdateSubjectConfig={updateSubjectConfig}
              onAddSubject={addSubject}
              onRemoveSubject={removeSubject}
              onResetAllToDefault={resetAllToDefault}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <GradePilotProvider>
      <MainApp />
    </GradePilotProvider>
  );
}

export default App;
