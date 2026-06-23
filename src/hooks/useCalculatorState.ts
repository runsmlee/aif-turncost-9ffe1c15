import { useState, useEffect, useMemo, useCallback } from 'react';
import { DEFAULT_INPUTS } from '../lib/constants';
import { calculateTotalCost, type CostBreakdownResult } from '../lib/calcEngine';

const STORAGE_KEY = 'turncost_inputs';

interface PersistedInputs {
  teamSize: number;
  avgSalary: number;
  turnoverRate: number; // stored as percentage (e.g., 20 = 20%)
  retentionBudget: number;
}

function loadFromStorage(): PersistedInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedInputs>;
      return {
        teamSize: parsed.teamSize ?? DEFAULT_INPUTS.TEAM_SIZE,
        avgSalary: parsed.avgSalary ?? DEFAULT_INPUTS.AVG_SALARY,
        turnoverRate: parsed.turnoverRate ?? DEFAULT_INPUTS.TURNOVER_RATE,
        retentionBudget: parsed.retentionBudget ?? DEFAULT_INPUTS.RETENTION_BUDGET,
      };
    }
  } catch {
    // localStorage might be unavailable
  }
  return {
    teamSize: DEFAULT_INPUTS.TEAM_SIZE,
    avgSalary: DEFAULT_INPUTS.AVG_SALARY,
    turnoverRate: DEFAULT_INPUTS.TURNOVER_RATE,
    retentionBudget: DEFAULT_INPUTS.RETENTION_BUDGET,
  };
}

function saveToStorage(inputs: PersistedInputs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

export function useCalculatorState() {
  const initial = loadFromStorage();

  const [teamSize, setTeamSize] = useState<number>(initial.teamSize);
  const [avgSalary, setAvgSalary] = useState<number>(initial.avgSalary);
  const [turnoverRate, setTurnoverRate] = useState<number>(initial.turnoverRate);
  const [retentionBudget, setRetentionBudget] = useState<number>(initial.retentionBudget);

  // Persist to localStorage on any input change
  useEffect(() => {
    saveToStorage({ teamSize, avgSalary, turnoverRate, retentionBudget });
  }, [teamSize, avgSalary, turnoverRate, retentionBudget]);

  // Track analytics on input change
  const trackEvent = useCallback((event: string, props?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.aif?.track) {
      window.aif.track(event, props);
    }
  }, []);

  const handleTeamSizeChange = useCallback((value: number) => {
    setTeamSize(value);
    trackEvent('input_change', { field: 'team_size', value });
  }, [trackEvent]);

  const handleSalaryChange = useCallback((value: number) => {
    setAvgSalary(value);
    trackEvent('input_change', { field: 'avg_salary', value });
  }, [trackEvent]);

  const handleTurnoverChange = useCallback((value: number) => {
    setTurnoverRate(value);
    trackEvent('input_change', { field: 'turnover_rate', value });
  }, [trackEvent]);

  const handleBudgetChange = useCallback((value: number) => {
    setRetentionBudget(value);
    if (value > 0) {
      trackEvent('roi_budget_entered', { budget: value });
    }
  }, [trackEvent]);

  // Derive calculation result — memoized so it only recomputes when inputs change
  const calcResult: CostBreakdownResult = useMemo(() => {
    return calculateTotalCost(
      teamSize,
      avgSalary,
      turnoverRate / 100 // convert percentage to decimal
    );
  }, [teamSize, avgSalary, turnoverRate]);

  // Validation
  const isValid =
    teamSize > 0 && avgSalary > 0 && turnoverRate > 0 && turnoverRate <= 100;

  return {
    teamSize,
    avgSalary,
    turnoverRate,
    retentionBudget,
    calcResult,
    isValid,
    setTeamSize: handleTeamSizeChange,
    setAvgSalary: handleSalaryChange,
    setTurnoverRate: handleTurnoverChange,
    setRetentionBudget: handleBudgetChange,
  };
}
