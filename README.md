# GradePilot — Smart SGPA & Exam Planner

A precision academic dashboard and end-semester target planning engine designed specifically for university grading models (such as DSU 60 CIA + 40 SEE with 100-mark SEC internal assessment).

---

## Key Features

1. **Semester Dashboard & Live Calculation**
   - Real-time recalculation of total marks, letter grades, grade points, and SGPA.
   - Preloaded with 7 semester courses totalling 22 credits:
     - **AS&SP** (3 Credits, 60 CIA + 40 SEE)
     - **DS** (4 Credits, 60 CIA + 40 SEE)
     - **PDM** (4 Credits, 60 CIA + 40 SEE)
     - **AI** (3 Credits, 60 CIA + 40 SEE)
     - **COA** (3 Credits, 60 CIA + 40 SEE)
     - **AIES** (3 Credits, 60 CIA + 40 SEE)
     - **SEC** (2 Credits, 100 CIA Internal, 0 SEE)

2. **Smart Reverse End-Semester Target Calculator**
   - Answers: *"How much do I need in my SEE to achieve an O, A+, A, B+, B, C, or P grade?"*
   - Formula: `Required SEE = Target Grade Threshold − CIA Marks`.
   - Automatically enforces minimum SEE passing requirement (16/40) even if raw difference is lower.
   - Automatically enforces CIA eligibility rules (24/60) and flags student ineligibility.
   - Accurately flags impossible targets (>40/40) with visual warnings.
   - Tailored SEC internal scoring view without phantom SEE inputs.

3. **Target SGPA Planner**
   - Presets for 10.0, 9.5, 9.0, 8.5, 8.0, 7.5, 7.0 and custom SGPA.
   - Knapsack/branch-and-bound optimization to find the combination of grades that minimizes total required SEE exam pressure across all courses.
   - Credit-weighted leverage ranking showing that 4-credit courses (DS & PDM) produce the largest impact per grade increase.
   - "Apply Plan to Marks Entry" button to test the roadmap in 1 click.

4. **Results & Analytics**
   - Recharts visual breakdowns: CIA vs SEE stacked marks comparison and grade distribution.
   - **Interactive Scenario Simulator**: Test Conservative, Expected, and Best-Case exam performance without modifying saved internal marks.

5. **Cumulative CGPA Tracker**
   - Multi-semester credit-weighted tracker: `CGPA = Σ(SGPA × Credits) / Σ(Credits)`.
   - Prevents unweighted average errors. Displays current SGPA if no prior semesters exist.

6. **Local Persistence & Export**
   - Auto-saves marks, previous semesters, and settings to `localStorage`.
   - **PDF Export**: Generates clean, publication-ready academic performance transcripts.
   - **CSV Export**: Clean spreadsheet export of marks and course breakdowns.
   - **Demo Data**: 1-click realistic sample data to immediately explore all features.

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Test Suite
```bash
npm run test
```

### 4. Build for Production
```bash
npm run build
```

---

## Deployment to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel automatically detects the Vite framework with:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. The pre-configured `vercel.json` will handle all routing and SPA rewriting out-of-the-box.
