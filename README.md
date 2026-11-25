# GradePilot — Smart SGPA & Exam Planner 🎓✈️

[![Live Demo](https://img.shields.io/badge/Live%20Demo-cgpa--calc--ai--ml.vercel.app-F59E0B?style=for-the-badge&logo=vercel&logoColor=white)](https://cgpa-calc-ai-ml.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-15%2F15%20Passed-10B981?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)

> **Live Deployment:** [https://cgpa-calc-ai-ml.vercel.app/](https://cgpa-calc-ai-ml.vercel.app/)  
> **Reference Design Inspiration:** [ease-gpa.vercel.app](https://ease-gpa.vercel.app/)

---

## 🌟 Overview

**GradePilot** is a production-quality, responsive academic marks calculator, reverse-engineering exam planner, and cumulative CGPA tracker. Specifically configured for the **Dayananda Sagar University (DSU) AI & ML / Engineering** assessment structure, it models the **60 CIA + 40 SEE** system alongside pure **100% internal SEC** courses.

Unlike traditional GPA calculators that only tally marks after exams finish, GradePilot focuses on **predictive planning**: answering the exact question students face before finals:
> *"How many marks do I need in each end-semester examination to secure an O, A+, or target SGPA?"*

---

## 🚀 Live Demo & Key Capabilities

🌐 **Access the live web app:** **[https://cgpa-calc-ai-ml.vercel.app/](https://cgpa-calc-ai-ml.vercel.app/)**

### 1. 📊 Main Semester Dashboard
- Instant live recalculation of total marks, letter grades, grade points, and weighted SGPA.
- Comprehensive metric cards: Total Subjects (7), Total Credits (22), Total CIA Marks obtained, Expected SGPA, Highest Possible SGPA (with 40/40 SEE), and Lowest Pass SGPA.
- One-click **Demo Data** to populate realistic marks across all 7 subjects in a single click.

### 2. 🎯 Smart Reverse SEE Target Calculator (Flagship Feature)
- Calculates the minimum marks required in the 40-mark End-Semester Examination (SEE) for every grade band:
  $$\text{Required SEE} = \text{Target Grade Threshold} - \text{CIA Marks}$$
- **Enforces Minimum Passing SEE Floor**: If the raw score needed is below 16 (e.g. 5 or 10 marks), the system highlights that the student still must score $\ge 16/40$ to satisfy the mandatory passing threshold.
- **Accurately Flags Impossible Targets**: If a grade requires $>40$ marks, it is prominently labeled **Impossible** with an explanation.
- **CIA Ineligibility Detection**: Flags students with $<24/60$ internal marks as ineligible under university guidelines.
- **Highlights Next Achievable Grade**: Shows the immediate next grade threshold and exact marks needed.
- **Special SEC Course Logic**: Shows pure internal scoring without phantom SEE exam inputs.

### 3. 🧠 "What Do I Need for My Target SGPA?" Planner
- Choose between preset SGPA goals (**10.0, 9.5, 9.0, 8.5, 8.0, 7.5, 7.0**) or enter a custom target.
- Optimization algorithm determines the combination of grades that achieves the target while **minimizing total required SEE marks** across all papers.
- **Strategic Credit Leverage Ranking**: Identifies **DS** and **PDM** (4 credits each, comprising 36.4% of total semester weight) as high-leverage courses where study effort has the greatest direct impact (+0.1818 SGPA per grade jump).
- **Apply Plan**: One-click action to populate the recommended exam marks directly into your semester calculator.

### 4. 📈 Interactive Analytics & Scenario Simulator
- **Visual Charts** built with Recharts:
  - Stacked marks breakdown: CIA obtained vs SEE marks vs maximum capacity.
  - Grade distribution donut chart.
- **Editable Scenario Simulator**:
  - **Conservative Performance** (e.g., tough paper / modest preparation)
  - **Expected Performance** (standard expected marks)
  - **Best-Case Performance** (peak outcome)
  - Sliders update simulated SGPA in real time **without altering saved CIA internal entries**.

### 5. 🧮 Cumulative CGPA Tracker
- Multi-semester credit-weighted calculation:
  $$\text{CGPA} = \frac{\sum (\text{Semester SGPA} \times \text{Semester Credits})}{\sum \text{Semester Credits}}$$
- Add, edit, or remove past semesters.
- When no past semesters exist, the dashboard accurately displays **Current Semester SGPA** rather than mislabeling it as CGPA.

### 6. 💾 Local Storage & Export Features
- Persistent auto-save in `localStorage` across page reloads.
- **Export PDF**: Generates publication-ready academic transcripts with summary boxes and subject tables via `jspdf` and `jspdf-autotable`.
- **Export CSV**: Download complete subject breakdown spreadsheets.
- **Full Settings Customization**: Adjust grade thresholds, minimum pass percentages, subject credits, or add custom courses.

---

## 📚 Semester Subject Configuration

Preloaded with 7 semester subjects totalling **22 Credits**:

| Subject Code | Subject Name | Credits | CIA Max | SEE Max | Assessment Structure |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **AS&SP** | Applied Statistics & Stochastic Processes | 3 | 60 | 40 | 60 Internal + 40 SEE |
| **DS** | Data Structures & Algorithms | 4 | 60 | 40 | 60 Internal + 40 SEE *(High Impact)* |
| **PDM** | Python & Data Management | 4 | 60 | 40 | 60 Internal + 40 SEE *(High Impact)* |
| **AI** | Artificial Intelligence & Intelligent Agents | 3 | 60 | 40 | 60 Internal + 40 SEE |
| **COA** | Computer Organization & Architecture | 3 | 60 | 40 | 60 Internal + 40 SEE |
| **AIES** | AI Ethics, Society & Emerging Technologies | 3 | 60 | 40 | 60 Internal + 40 SEE |
| **SEC** | Skill Enhancement Course | 2 | 100 | 0 | **100% Internal Assessment Only** |

> ⚠️ **SEC Assessment Rule**: SEC evaluates 100% on internal marks. It has no SEE input, cannot be mistakenly calculated as 60 + 40, and contributes its 2 credits directly to the weighted SGPA.

---

## ⚖️ DSU Grading Scale & Passing Rules

### Grading Scale (Configurable in Settings)
| Marks Range | Grade | Grade Points | Description |
| :---: | :---: | :---: | :--- |
| **90 – 100** | **O** | 10 | Outstanding |
| **80 – 89.99** | **A+** | 9 | Excellent |
| **70 – 79.99** | **A** | 8 | Very Good |
| **60 – 69.99** | **B+** | 7 | Good |
| **55 – 59.99** | **B** | 6 | Above Average |
| **50 – 54.99** | **C** | 5 | Average |
| **40 – 49.99** | **P** | 4 | Pass |
| **0 – 39.99** | **F** | 0 | Fail / Re-appear |

### Minimum Passing Thresholds
- **CIA Minimum**: 24 / 60 marks (40%)
- **SEE Minimum**: 16 / 40 marks (40%)
- **Overall Course Minimum**: 40 / 100 marks (40%)
- **SEC Internal Passing**: 40 / 100 marks (40%)

---

## 🛠️ Technology Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/) (Strict typing, no `any`, decoupled calculation engine)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with custom warm ivory / amber palette
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualizations**: [Recharts 2.15](https://recharts.org/)
- **Document Export**: [jsPDF](https://github.com/parallax/jsPDF) & [jspdf-autotable](https://github.com/simonbengtsson/jsPdf-autotable)
- **Unit Testing**: [Vitest 3](https://vitest.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🧪 Unit Test Suite (15 / 15 Passed)

The pure calculation engine (`src/engine/calculator.ts`) is covered by comprehensive unit tests (`src/engine/__tests__/calculator.test.ts`):

```bash
npm run test
```

```
 ✓ src/engine/__tests__/calculator.test.ts (15 tests)
   ✓ 1. All CIA marks are zero
   ✓ 2. All CIA marks are maximum
   ✓ 3. SEC has 100 internal marks
   ✓ 4. Required SEE is exactly zero
   ✓ 5. Required SEE is exactly 40
   ✓ 6. Required SEE exceeds 40
   ✓ 7. Student fails the CIA eligibility requirement
   ✓ 8. Student fails the SEE requirement
   ✓ 9. Student passes individual components but fails overall
   ✓ 10. All subjects receive O grades
   ✓ 11. All subjects receive F grades
   ✓ 12. SGPA uses correct credit weighting
   ✓ 13. CGPA correctly accounts for previous semester credits
   ✓ 14. Changing one subject updates the entire dashboard
   ✓ 15. Target SGPA Planner optimizes grade combinations and flags impossible targets
```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Rishit-ui/CGPA-CALC-AI-ML.git
cd CGPA-CALC-AI-ML
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run tests
```bash
npm run test
```

### 5. Build for production
```bash
npm run build
npm run preview
```

---

## 🚢 Deployment to Vercel

The application is deployed on Vercel at:
👉 **[https://cgpa-calc-ai-ml.vercel.app/](https://cgpa-calc-ai-ml.vercel.app/)**

Any push to the `main` branch automatically triggers a fresh production build on Vercel.

---

## 📄 License

MIT License © 2026 [Rishit](https://github.com/Rishit-ui). Built with precision for engineering academic excellence.
