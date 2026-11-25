import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  Sliders,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  CalculatedSubject,
  SemesterOverview,
  ScenarioType,
  GradeBoundary,
  PassingRules,
} from '../../types';
import { calculateSubject, calculateSgpa } from '../../engine/calculator';

interface AnalyticsViewProps {
  calculatedSubjects: CalculatedSubject[];
  overview: SemesterOverview;
  scenarioOffsets: Record<ScenarioType, number>;
  onUpdateScenarioOffset: (type: ScenarioType, val: number) => void;
  boundaries: GradeBoundary[];
  passingRules: PassingRules;
}

const COLORS = ['#F59E0B', '#10B981', '#14B8A6', '#0284C7', '#6366F1', '#8B5CF6', '#71717A', '#F43F5E'];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  calculatedSubjects,
  overview,
  scenarioOffsets,
  onUpdateScenarioOffset,
  boundaries,
  passingRules,
}) => {
  // Chart 1: Subject performance comparison (CIA vs SEE vs Max Possible)
  const barData = useMemo(() => {
    return calculatedSubjects.map(s => ({
      name: s.config.code,
      cia: s.ciaObtained,
      see: s.seeObtained,
      total: s.totalMarks,
      credits: s.config.credits,
      points: s.creditWeightedPoints,
      isSec: s.config.isSec,
    }));
  }, [calculatedSubjects]);

  // Chart 2: Grade distribution
  const gradeDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    calculatedSubjects.forEach(s => {
      counts[s.grade] = (counts[s.grade] || 0) + 1;
    });
    return Object.entries(counts).map(([grade, count]) => ({
      name: `Grade ${grade}`,
      value: count,
      grade,
    }));
  }, [calculatedSubjects]);

  // Scenarios calculation
  const scenariosData = useMemo(() => {
    const calculateScenarioSgpa = (percent: number) => {
      const simulated = calculatedSubjects.map(s => {
        if (s.config.isSec) {
          return s; // SEC doesn't change
        }
        // Simulated SEE = (percent / 100) * s.config.seeMax
        const simSee = Math.round((percent / 100) * s.config.seeMax);
        return calculateSubject(s.config, s.ciaObtained, simSee, boundaries, passingRules);
      });
      return calculateSgpa(simulated);
    };

    return [
      {
        id: 'conservative' as ScenarioType,
        name: '1. Conservative Performance',
        desc: 'Modest SEE performance (e.g. baseline / tough exams)',
        percent: scenarioOffsets.conservative,
        sgpa: calculateScenarioSgpa(scenarioOffsets.conservative),
        color: 'border-blue-300 bg-blue-50/40 text-blue-900',
        badge: 'bg-blue-100 text-blue-800',
      },
      {
        id: 'expected' as ScenarioType,
        name: '2. Expected Performance',
        desc: 'Standard preparation & anticipated exam marks',
        percent: scenarioOffsets.expected,
        sgpa: calculateScenarioSgpa(scenarioOffsets.expected),
        color: 'border-amber-300 bg-amber-50/40 text-amber-900',
        badge: 'bg-amber-100 text-amber-800',
      },
      {
        id: 'best_case' as ScenarioType,
        name: '3. Best-Case Performance',
        desc: 'Peak performance / near-maximum in remaining exams',
        percent: scenarioOffsets.best_case,
        sgpa: calculateScenarioSgpa(scenarioOffsets.best_case),
        color: 'border-emerald-300 bg-emerald-50/40 text-emerald-900',
        badge: 'bg-emerald-100 text-emerald-800',
      },
    ];
  }, [calculatedSubjects, scenarioOffsets, boundaries, passingRules]);

  return (
    <div className="space-y-6">
      {/* Interactive Scenario Simulator */}
      <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sliders className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-charcoal-900">
                Interactive Exam Scenario Simulator
              </h2>
              <p className="text-xs text-charcoal-500">
                Test different end-semester performance models without altering your saved CIA entries.
              </p>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-subtle font-semibold text-charcoal-600 border border-charcoal-700/10">
            Current Base SGPA: {overview.expectedSgpa.toFixed(2)}
          </span>
        </div>

        {/* 3 Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {scenariosData.map(sc => (
            <div
              key={sc.id}
              className={`p-5 rounded-xl border ${sc.color} transition-all space-y-3`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-charcoal-900">{sc.name}</h3>
                  <p className="text-[11px] text-charcoal-500 mt-0.5">{sc.desc}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${sc.badge}`}>
                  {sc.percent}% SEE
                </span>
              </div>

              {/* Simulated SGPA display */}
              <div className="pt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-charcoal-400 block font-medium">Simulated SGPA</span>
                  <span className="text-2xl font-extrabold text-charcoal-900">
                    {sc.sgpa.toFixed(2)}
                  </span>
                </div>
                <span className="text-xs font-semibold text-charcoal-500">
                  {sc.sgpa >= overview.expectedSgpa ? `+${(sc.sgpa - overview.expectedSgpa).toFixed(2)}` : (sc.sgpa - overview.expectedSgpa).toFixed(2)}
                </span>
              </div>

              {/* Slider for adjusting percentage */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-charcoal-500 mb-1">
                  <span>Exam Target:</span>
                  <span className="font-bold text-charcoal-800">{sc.percent}% ({Math.round(sc.percent * 0.4)} / 40)</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sc.percent}
                  onChange={e => onUpdateScenarioOffset(sc.id, parseInt(e.target.value) || 0)}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Subject Performance Breakdown */}
        <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-charcoal-900">
                Subject Marks Composition (CIA vs SEE)
              </h3>
            </div>
          </div>
          <p className="text-xs text-charcoal-500">
            Compare internal CIA obtained against entered SEE examination marks.
          </p>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#71717A' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#71717A' }} />
                <Tooltip
                  formatter={(val, name) => [
                    `${val} marks`,
                    name === 'cia' ? 'CIA Obtained' : name === 'see' ? 'SEE Marks' : 'Total Marks',
                  ]}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E4E4E7' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="cia" fill="#F59E0B" name="CIA Marks" stackId="a" radius={[0, 0, 4, 4]} />
                <Bar dataKey="see" fill="#10B981" name="SEE Marks" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Grade Distribution */}
        <div className="p-6 rounded-2xl bg-surface border border-charcoal-700/10 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-charcoal-900">
                Semester Grade Distribution
              </h3>
            </div>
          </div>
          <p className="text-xs text-charcoal-500">
            Count of subjects awarded across each letter grade band.
          </p>

          <div className="h-72 w-full flex items-center justify-center">
            {gradeDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gradeDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {gradeDistributionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={val => [`${val} subject(s)`, 'Frequency']}
                    contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E4E4E7' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-charcoal-400">No grades calculated yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
