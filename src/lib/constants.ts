/**
 * Turnover Cost Factors
 *
 * These factors are based on commonly cited industry research for
 * mid-size companies (50–500 employees). Each constant is named to
 * make the methodology transparent and defensible.
 *
 * Sources: SHRM, Gallup, and Center for American Progress turnover studies.
 */

export const COST_FACTORS = {
  /** Recruitment cost as a fraction of annual salary (job ads, agency fees, interview time) */
  RECRUITMENT: 0.21,

  /** Onboarding cost as a fraction of annual salary (training, equipment, admin) */
  ONBOARDING: 0.11,

  /** Lost productivity factor — fraction of monthly salary value lost during ramp-up (applied as annual_salary × factor × months) */
  LOST_PRODUCTIVITY_FACTOR: 0.04,

  /** Ramp-up period in months for a new hire to reach full productivity */
  RAMP_PERIOD_MONTHS: 3,

  /** Knowledge drain cost as a fraction of annual salary (institutional knowledge lost) */
  KNOWLEDGE_DRAIN: 0.15,
} as const;

export const DEFAULT_INPUTS = {
  TEAM_SIZE: 100,
  AVG_SALARY: 90000,
  TURNOVER_RATE: 20, // percentage (20 = 20%)
  RETENTION_BUDGET: 0,
} as const;
