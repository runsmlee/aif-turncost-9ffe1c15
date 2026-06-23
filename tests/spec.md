# Test Specifications

## Unit Tests (Vitest + React Testing Library)

### CostCalculator.test.tsx
- [ ] renders without crash
- [ ] displays three input fields: team size, average salary, turnover rate
- [ ] shows default values on load (team size, salary, turnover rate pre-populated with sensible defaults)
- [ ] updating team size input updates the total annual cost in real-time
- [ ] updating average salary input updates the total annual cost in real-time
- [ ] updating turnover rate input updates the total annual cost in real-time
- [ ] entering zero or negative values shows validation error
- [ ] displays itemized breakdown with at least 4 cost categories (recruitment, onboarding, lost productivity, knowledge drain)
- [ ] each cost category shows the formula used
- [ ] each cost category shows the computed dollar amount
- [ ] total cost equals the sum of all itemized categories

### CostBreakdown.test.tsx
- [ ] renders without crash
- [ ] displays each cost category with label, formula, and dollar amount
- [ ] formulas are human-readable (e.g., "Employees replaced × Salary × 20%")
- [ ] shows per-employee cost alongside total cost
- [ ] numbers are formatted as USD currency

### RetentionROI.test.tsx
- [ ] renders without crash
- [ ] displays input for annual retention program budget
- [ ] shows break-even turnover reduction percentage
- [ ] shows projected net savings or loss
- [ ] displays formula for break-even calculation
- [ ] handles zero budget input gracefully

### calcEngine.test.ts (pure functions)
- [ ] calculates number of employees replaced correctly (teamSize × turnoverRate)
- [ ] calculates recruitment cost per employee correctly (salary × recruitment factor)
- [ ] calculates onboarding cost per employee correctly (salary × onboarding factor)
- [ ] calculates lost productivity cost correctly (salary × productivity factor × ramp period)
- [ ] calculates knowledge drain cost correctly (salary × knowledge drain factor)
- [ ] sums all categories to produce total annual cost
- [ ] calculates break-even turnover reduction (retention budget / total cost)
- [ ] all factors are clearly defined constants (not magic numbers)

## User Journey Tests

### Primary Workflow
1. App loads → hero shows three pre-populated inputs and a live cost breakdown immediately visible (no click required)
2. User changes team size from default → total cost and all itemized categories update instantly
3. User scrolls down to ROI section → sees retention budget input with break-even analysis based on current calculator output
4. User enters a retention budget → break-even and net savings update in real-time
5. User reloads page → last-entered values are restored from localStorage

### Edge Case Workflow
1. User clears an input field → shows inline validation message, results area shows placeholder state
2. User enters extremely high turnover rate (e.g., 100%) → calculator handles gracefully without errors
3. User enters very small team (1 person) → per-employee and total costs display correctly

## Acceptance Criteria Checklist
(Reviewer verifies these against PRD.md features)
- [ ] AC: Given inputs of team size=100, average salary=$90,000, turnover rate=20%, the calculator produces a total annual cost figure broken down into ≥4 itemized cost categories, each showing the formula used and the computed dollar amount, updating live as inputs change.
- [ ] AC: Given a retention budget input of $50,000 and the calculator's existing turnover cost output, the tool displays the break-even turnover reduction percentage and the projected net savings/loss with clear formulas.
