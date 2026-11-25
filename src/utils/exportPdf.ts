import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculatedSubject, SemesterOverview, CgpaSummary } from '../types';

export function exportToPdf(
  calculatedSubjects: CalculatedSubject[],
  overview: SemesterOverview,
  cgpaSummary: CgpaSummary
) {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Title & Header
  doc.setFontSize(20);
  doc.setTextColor(24, 24, 27); // Charcoal 900
  doc.text('GradePilot — Academic Performance Report', 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(113, 113, 122); // Charcoal 500
  doc.text(`Generated on ${dateStr} • Assessment Model: DSU (60 CIA + 40 SEE / SEC 100)`, 14, 28);

  // Summary Metrics Box
  doc.setDrawColor(228, 228, 231);
  doc.setFillColor(250, 249, 246);
  doc.roundedRect(14, 34, 182, 28, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(113, 113, 122);
  doc.text('EXPECTED SGPA', 20, 42);
  doc.text('HIGHEST REACHABLE', 65, 42);
  doc.text('TOTAL CIA', 115, 42);
  doc.text(cgpaSummary.hasPreviousSemesters ? 'CUMULATIVE CGPA' : 'TOTAL CREDITS', 155, 42);

  doc.setFontSize(16);
  doc.setTextColor(24, 24, 27);
  doc.text(`${overview.expectedSgpa.toFixed(2)}`, 20, 52);
  doc.text(`${overview.highestPossibleSgpa.toFixed(2)}`, 65, 52);
  doc.text(`${overview.totalCiaObtained} / ${overview.totalPossibleCia}`, 115, 52);
  doc.text(
    cgpaSummary.hasPreviousSemesters
      ? `${cgpaSummary.cumulativeCgpa.toFixed(2)}`
      : `${overview.totalCredits} cr`,
    155,
    52
  );

  // Table Data
  const tableData = calculatedSubjects.map(s => [
    s.config.code,
    s.config.name,
    s.config.credits,
    `${s.ciaObtained}/${s.config.ciaMax}`,
    s.config.isSec ? 'N/A' : `${s.seeObtained}/${s.config.seeMax}`,
    `${s.totalMarks}/${s.maxPossibleTotal}`,
    s.grade,
    s.gradePoints,
    `${s.creditWeightedPoints} pts`,
    s.isPassed ? 'PASS' : s.status === 'FAIL_CIA' ? 'CIA Ineligible' : 'Fail',
  ]);

  autoTable(doc, {
    startY: 68,
    head: [
      [
        'Code',
        'Subject',
        'Credits',
        'CIA',
        'SEE',
        'Total',
        'Grade',
        'GP',
        'Credit Pts',
        'Status',
      ],
    ],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [39, 39, 42],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [39, 39, 42],
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left' },
      1: { cellWidth: 50 },
      2: { halign: 'center' },
      3: { halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'center', fontStyle: 'bold' },
      6: { halign: 'center', fontStyle: 'bold' },
      7: { halign: 'center' },
      8: { halign: 'center', fontStyle: 'bold' },
      9: { halign: 'center' },
    },
  });

  // Footer notes
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 180;
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122);
  doc.text(
    '* Assessment Note: Normal subjects evaluate on 60 CIA + 40 SEE with 40% minimum passing requirement in each component. SEC is evaluated 100% internally.',
    14,
    finalY + 12
  );
  doc.text(
    '** SGPA Formula: Sum(Credits × Grade Points) / Sum(Credits). Built with GradePilot.',
    14,
    finalY + 17
  );

  doc.save(`GradePilot_Semester_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}
