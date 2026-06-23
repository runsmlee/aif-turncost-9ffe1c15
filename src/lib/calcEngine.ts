import { COST_FACTORS } from './constants';

export interface CalculatorInputs {
  teamSize: number;
  avgSalary: number;
  turnoverRate: number; // as a decimal (0.20 = 20%)
}

export interface CostBreakdownResult {
  employeesReplaced: number;
  recruitment: number;
  onboarding: number;
  lostProductivity: number;
  knowledgeDrain: number;
  total: number;
  perEmployee: number;
}

export interface CostCategoryDetail {
  key: string;
  label: string;
  formula: string;
  amount: number;
}

/**
 * Calculate the number of employees replaced in a year.
 * Formula: teamSize × turnoverRate
 */
export function calculateEmployeesReplaced(
  teamSize: number,
  turnoverRate: number
): number {
  return teamSize * turnoverRate;
}

/**
 * Calculate recruitment cost for all replaced employees.
 * Formula: employeesReplaced × salary × RECRUITMENT_FACTOR
 */
export function calculateRecruitmentCost(
  employeesReplaced: number,
  salary: number
): number {
  return employeesReplaced * salary * COST_FACTORS.RECRUITMENT;
}

/**
 * Calculate onboarding cost for all replaced employees.
 * Formula: employeesReplaced × salary × ONBOARDING_FACTOR
 */
export function calculateOnboardingCost(
  employeesReplaced: number,
  salary: number
): number {
  return employeesReplaced * salary * COST_FACTORS.ONBOARDING;
}

/**
 * Calculate lost productivity cost during ramp-up.
 * Formula: employeesReplaced × salary × PRODUCTIVITY_FACTOR × RAMP_MONTHS
 * The productivity factor represents the fractional output loss per month of ramp-up.
 */
export function calculateLostProductivityCost(
  employeesReplaced: number,
  salary: number
): number {
  return (
    employeesReplaced *
    salary *
    COST_FACTORS.LOST_PRODUCTIVITY_FACTOR *
    COST_FACTORS.RAMP_PERIOD_MONTHS
  );
}

/**
 * Calculate knowledge drain cost.
 * Formula: employeesReplaced × salary × KNOWLEDGE_DRAIN_FACTOR
 */
export function calculateKnowledgeDrainCost(
  employeesReplaced: number,
  salary: number
): number {
  return employeesReplaced * salary * COST_FACTORS.KNOWLEDGE_DRAIN;
}

/**
 * Calculate per-employee cost from total.
 */
export function calculatePerEmployeeCost(
  totalCost: number,
  employeesReplaced: number
): number {
  if (employeesReplaced === 0) return 0;
  return totalCost / employeesReplaced;
}

/**
 * Calculate the complete cost breakdown for all categories.
 */
export function calculateTotalCost(
  teamSize: number,
  avgSalary: number,
  turnoverRate: number
): CostBreakdownResult {
  const employeesReplaced = calculateEmployeesReplaced(teamSize, turnoverRate);
  const recruitment = calculateRecruitmentCost(employeesReplaced, avgSalary);
  const onboarding = calculateOnboardingCost(employeesReplaced, avgSalary);
  const lostProductivity = calculateLostProductivityCost(employeesReplaced, avgSalary);
  const knowledgeDrain = calculateKnowledgeDrainCost(employeesReplaced, avgSalary);
  const total = recruitment + onboarding + lostProductivity + knowledgeDrain;
  const perEmployee = calculatePerEmployeeCost(total, employeesReplaced);

  return {
    employeesReplaced,
    recruitment,
    onboarding,
    lostProductivity,
    knowledgeDrain,
    total,
    perEmployee,
  };
}

/**
 * Get detailed cost category information with formulas and labels.
 */
export function getCostCategoryDetails(
  result: CostBreakdownResult
): CostCategoryDetail[] {
  const { employeesReplaced, recruitment, onboarding, lostProductivity, knowledgeDrain } = result;

  return [
    {
      key: 'recruitment',
      label: 'Recruitment',
      formula: `${employeesReplaced.toFixed(0)} employees × Salary × ${(COST_FACTORS.RECRUITMENT * 100).toFixed(0)}%`,
      amount: recruitment,
    },
    {
      key: 'onboarding',
      label: 'Onboarding & Training',
      formula: `${employeesReplaced.toFixed(0)} employees × Salary × ${(COST_FACTORS.ONBOARDING * 100).toFixed(0)}%`,
      amount: onboarding,
    },
    {
      key: 'lost-productivity',
      label: 'Lost Productivity',
      formula: `${employeesReplaced.toFixed(0)} employees × Salary × ${(COST_FACTORS.LOST_PRODUCTIVITY_FACTOR * 100).toFixed(0)}% × ${COST_FACTORS.RAMP_PERIOD_MONTHS} months`,
      amount: lostProductivity,
    },
    {
      key: 'knowledge-drain',
      label: 'Knowledge Drain',
      formula: `${employeesReplaced.toFixed(0)} employees × Salary × ${(COST_FACTORS.KNOWLEDGE_DRAIN * 100).toFixed(0)}%`,
      amount: knowledgeDrain,
    },
  ];
}

/**
 * Calculate break-even turnover reduction percentage.
 * Formula: retentionBudget / totalAnnualCost
 * This tells you what % of turnover you'd need to eliminate to pay for the budget.
 */
export function calculateBreakEvenReduction(
  retentionBudget: number,
  totalAnnualCost: number
): number {
  if (totalAnnualCost === 0) return 0;
  return retentionBudget / totalAnnualCost;
}

/**
 * Calculate projected net savings from a retention program.
 * Assumes the program reduces turnover proportionally to the budget/cost ratio.
 *
 * Formula: (totalAnnualCost × breakEvenReduction) - retentionBudget
 * If break-even reduction is x%, the program saves totalCost × x% in turnover costs.
 * Net savings = saved costs - program budget.
 */
export function calculateProjectedNetSavings(
  retentionBudget: number,
  totalAnnualCost: number,
  assumedEffectivenessRatio: number = 1.0
): number {
  if (totalAnnualCost === 0 || retentionBudget === 0) return -retentionBudget;
  const breakEven = calculateBreakEvenReduction(retentionBudget, totalAnnualCost);
  const grossSavings = totalAnnualCost * breakEven * assumedEffectivenessRatio;
  return grossSavings - retentionBudget;
}

/**
 * Format a number as USD currency.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
