import { describe, it, expect } from 'vitest';
import {
  calculateEmployeesReplaced,
  calculateRecruitmentCost,
  calculateOnboardingCost,
  calculateLostProductivityCost,
  calculateKnowledgeDrainCost,
  calculateTotalCost,
  calculateBreakEvenReduction,
  calculatePerEmployeeCost,
} from '../src/lib/calcEngine';
import { COST_FACTORS } from '../src/lib/constants';

describe('calcEngine', () => {
  const defaults = { teamSize: 100, avgSalary: 90000, turnoverRate: 0.20 };

  describe('calculateEmployeesReplaced', () => {
    it('calculates number of employees replaced correctly (teamSize × turnoverRate)', () => {
      expect(calculateEmployeesReplaced(100, 0.20)).toBe(20);
      expect(calculateEmployeesReplaced(50, 0.10)).toBe(5);
      expect(calculateEmployeesReplaced(200, 0.50)).toBe(100);
    });
  });

  describe('calculateRecruitmentCost', () => {
    it('calculates recruitment cost per employee correctly (salary × recruitment factor)', () => {
      const perEmployee = 90000 * COST_FACTORS.RECRUITMENT;
      const total = perEmployee * 20; // 20 employees replaced
      expect(calculateRecruitmentCost(20, 90000)).toBe(total);
      expect(calculateRecruitmentCost(20, 90000)).toBe(90000 * COST_FACTORS.RECRUITMENT * 20);
    });
  });

  describe('calculateOnboardingCost', () => {
    it('calculates onboarding cost per employee correctly (salary × onboarding factor)', () => {
      const expected = 90000 * COST_FACTORS.ONBOARDING * 20;
      expect(calculateOnboardingCost(20, 90000)).toBe(expected);
    });
  });

  describe('calculateLostProductivityCost', () => {
    it('calculates lost productivity cost correctly (salary × productivity factor × ramp period)', () => {
      const expected =
        90000 * COST_FACTORS.LOST_PRODUCTIVITY_FACTOR * COST_FACTORS.RAMP_PERIOD_MONTHS * 20;
      expect(calculateLostProductivityCost(20, 90000)).toBe(expected);
    });
  });

  describe('calculateKnowledgeDrainCost', () => {
    it('calculates knowledge drain cost correctly (salary × knowledge drain factor)', () => {
      const expected = 90000 * COST_FACTORS.KNOWLEDGE_DRAIN * 20;
      expect(calculateKnowledgeDrainCost(20, 90000)).toBe(expected);
    });
  });

  describe('calculateTotalCost', () => {
    it('sums all categories to produce total annual cost', () => {
      const result = calculateTotalCost(defaults.teamSize, defaults.avgSalary, defaults.turnoverRate);
      const sum =
        result.recruitment +
        result.onboarding +
        result.lostProductivity +
        result.knowledgeDrain;
      expect(result.total).toBeCloseTo(sum, 2);
    });

    it('produces at least 4 cost categories', () => {
      const result = calculateTotalCost(100, 90000, 0.20);
      const categories = [
        result.recruitment,
        result.onboarding,
        result.lostProductivity,
        result.knowledgeDrain,
      ];
      expect(categories.length).toBeGreaterThanOrEqual(4);
      categories.forEach((c) => expect(c).toBeGreaterThan(0));
    });
  });

  describe('calculatePerEmployeeCost', () => {
    it('calculates per-employee cost from total', () => {
      expect(calculatePerEmployeeCost(100000, 20)).toBe(5000);
      expect(calculatePerEmployeeCost(50000, 10)).toBe(5000);
    });
  });

  describe('calculateBreakEvenReduction', () => {
    it('calculates break-even turnover reduction (retention budget / total cost)', () => {
      // If total cost is $500,000 and budget is $50,000
      // break-even reduction = budget / totalCost = 0.10 (10%)
      expect(calculateBreakEvenReduction(50000, 500000)).toBeCloseTo(0.10, 4);
    });

    it('handles zero total cost gracefully', () => {
      expect(calculateBreakEvenReduction(50000, 0)).toBe(0);
    });
  });

  describe('all factors are clearly defined constants', () => {
    it('COST_FACTORS has all expected factors defined', () => {
      expect(COST_FACTORS.RECRUITMENT).toBeDefined();
      expect(COST_FACTORS.ONBOARDING).toBeDefined();
      expect(COST_FACTORS.LOST_PRODUCTIVITY_FACTOR).toBeDefined();
      expect(COST_FACTORS.RAMP_PERIOD_MONTHS).toBeDefined();
      expect(COST_FACTORS.KNOWLEDGE_DRAIN).toBeDefined();
      // Ensure they are not magic numbers (are named properties)
      expect(typeof COST_FACTORS.RECRUITMENT).toBe('number');
      expect(typeof COST_FACTORS.KNOWLEDGE_DRAIN).toBe('number');
    });
  });
});
