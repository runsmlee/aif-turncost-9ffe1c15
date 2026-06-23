# TurnCost — Product Requirements Document

## Problem
People leaders and HR managers drastically underestimate the real financial cost of employee turnover. Most rely on industry hearsay ("it costs 2x salary to replace someone") without a transparent, defensible breakdown. When they try to build a business case for retention investment, they lack credible numbers with clear methodology — so leadership says no, and turnover continues unchecked.

## Target Users
HR Business Partners and People Operations Managers at mid-size companies (50–500 employees) who need to justify retention budgets to finance and leadership teams. These users are data-literate but not actuaries — they need credible, transparent math they can defend in a board meeting.

## Core Feature (default: exactly ONE)
- **Three-Input Turnover Cost Calculator**: User enters team size, average salary, and annual turnover rate, and instantly receives a full actuarial breakdown of total annual attrition cost — including recruitment, onboarding, lost productivity, and knowledge drain — with visible methodology formulas and per-employee itemization. Acceptance Criteria: Given inputs of team size=100, average salary=$90,000, turnover rate=20%, the calculator produces a total annual cost figure broken down into ≥4 itemized cost categories, each showing the formula used and the computed dollar amount, updating live as inputs change.

## Should Have (optional — only if the ONE feature requires it)
- **ROI Retention Investment Modeler**: User enters a proposed annual retention program budget, and the tool calculates break-even turnover reduction needed and projected net savings, using the calculator's existing cost output. Acceptance Criteria: Given a retention budget input of $50,000 and the calculator's existing turnover cost output, the tool displays the break-even turnover reduction percentage and the projected net savings/loss with clear formulas.

## Out of Scope (v1)
- **Employee-level tracking or CRM**: Tracking individual employee tenure, exit reasons, or sentiment would shift this from an instant calculator to a platform — we're building a decision tool, not a HRIS.
- **Multiple team/department segmentation**: Allowing per-department calculations with weighted averages is a natural extension but adds UI complexity and data-entry friction that breaks the "three inputs, instant answer" promise.
- **PDF report export / branded presentations**: Generating downloadable executive summaries is valuable but is a presentation-layer feature, not a calculation feature. Users can screenshot for now.
- **Industry benchmark comparisons**: Pulling external benchmark turnover data would require an API/data partnership and shifts the value from "your numbers, transparently" to "how you compare" — a different product.

## Success Metrics
- Primary: User completes a full turnover cost calculation (3 inputs entered → sees itemized breakdown) in < 15 seconds on first visit
- Secondary: User adjusts at least one input after seeing initial results (indicates the interactive model is engaging and useful)

## Design Principles
- **Radical transparency**: Every number shows its formula. No black boxes. Users must be able to defend every figure.
- **Instant feedback**: Results update live as inputs change — no "Calculate" button, no loading state. The math is fast enough to feel magical.
- **The hero IS the tool**: Three inputs and the breakdown live in the hero viewport. No marketing copy first, no "Get Started" gate. The user's first interaction is the product itself.
