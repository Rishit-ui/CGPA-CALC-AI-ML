import { CalculatedSubject, SemesterOverview, CgpaSummary } from '../types';

export function exportToCsv(
  calculatedSubjects: CalculatedSubject[],
  overview: SemesterOverview,
  cgpaSummary: CgpaSummary
) {
  const headers = [
    'Subject Code',
    'Subject Name',
    'Credits',
    'CIA Obtained',
    'CIA Max',
    'SEE Obtained',
    'SEE Max',
    'Total Marks',
    'Grade',
    'Grade Points',
    'Credit Points',
    'Status',
  ];

  const rows = calculatedSubjects.map(s => [
    `"${s.config.code}"`,
    `"${s.config.name}"`,
    s.config.credits,
    s.ciaObtained,
    s.config.ciaMax,
    s.config.isSec ? 'N/A' : s.seeObtained,
    s.config.isSec ? 'N/A' : s.config.seeMax,
    s.totalMarks,
    `"${s.grade}"`,
    s.gradePoints,
    s.creditWeightedPoints,
    `"${s.isPassed ? 'PASS' : s.status}"`,
  ]);

  // Summary lines
  const summaryLines = [
    [],
    ['"SEMESTER SUMMARY"'],
    ['"Total Credits"', overview.totalCredits],
    ['"Total Subjects"', overview.totalSubjects],
    ['"Total CIA Obtained"', `${overview.totalCiaObtained} / ${overview.totalPossibleCia} (${overview.ciaPercentage}%)`],
    ['"Expected SGPA"', overview.expectedSgpa.toFixed(2)],
    ['"Highest Possible SGPA"', overview.highestPossibleSgpa.toFixed(2)],
    ['"Lowest Possible SGPA"', overview.lowestPossibleSgpa.toFixed(2)],
    ['"Passed Subjects"', overview.totalPassedSubjects],
    ['"Failed / Ineligible"', overview.totalFailedSubjects],
  ];

  if (cgpaSummary.hasPreviousSemesters) {
    summaryLines.push(
      [],
      ['"CUMULATIVE CGPA SUMMARY"'],
      ['"Cumulative CGPA"', cgpaSummary.cumulativeCgpa.toFixed(2)],
      ['"Total Cumulative Credits"', cgpaSummary.totalCumulativeCredits]
    );
  }

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(',')),
    ...summaryLines.map(r => r.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `GradePilot_Semester_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
