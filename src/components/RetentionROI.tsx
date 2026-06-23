import { useMemo } from 'react';
import {
  calculateBreakEvenReduction,
  calculateProjectedNetSavings,
  formatCurrency,
  type CostBreakdownResult,
} from '../lib/calcEngine';
import { NumberInput } from './ui/NumberInput';

interface RetentionROIProps {
  retentionBudget: number;
  calcResult: CostBreakdownResult;
  turnoverRate: number;
  onBudgetChange: (value: number) => void;
}

export function RetentionROI({
  retentionBudget,
  calcResult,
  turnoverRate,
  onBudgetChange,
}: RetentionROIProps) {
  const breakEven = useMemo(
    () => calculateBreakEvenReduction(retentionBudget, calcResult.total),
    [retentionBudget, calcResult.total]
  );

  const netSavings = useMemo(
    () => calculateProjectedNetSavings(retentionBudget, calcResult.total),
    [retentionBudget, calcResult.total]
  );

  // Projected turnover rate after reduction
  const projectedTurnover = turnoverRate * (1 - breakEven);

  const isPositive = netSavings >= 0;

  return (
    <section data-testid="retention-roi" className="mt-10">
      <div className="rounded-2xl border border-gray-200/80 bg-white p-6 sm:p-7 shadow-card">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-gray-300" />
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              ROI: Retention Investment Modeler
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              What would you invest in retention? See if it pays for itself.
            </p>
          </div>
        </div>

        <div className="mt-5 max-w-sm">
          <NumberInput
            id="retention-budget"
            name="retention-budget"
            label="Annual Retention Program Budget"
            aria-label="Annual Retention Program Budget"
            value={retentionBudget || ''}
            placeholder="50000"
            prefix="$"
            min={0}
            onValueChange={onBudgetChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {/* Break-even Reduction */}
          <div className="rounded-xl bg-gray-50/80 border border-gray-100 p-5 transition-colors hover:bg-gray-50">
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Break-Even Turnover Reduction
            </div>
            <div
              data-testid="break-even-reduction"
              className="text-2xl font-bold text-gray-900 mt-2 tabular-nums tracking-tight"
            >
              {(breakEven * 100).toFixed(1)}%
            </div>
            <div
              data-testid="break-even-formula"
              className="font-mono text-[11px] text-gray-400 mt-2"
            >
              Budget ÷ Total Annual Cost
            </div>
            <p className="text-xs text-gray-500 mt-1.5 font-medium">
              {retentionBudget > 0
                ? `Reduce turnover from ${turnoverRate}% to ${projectedTurnover.toFixed(1)}%`
                : 'Enter a budget to see break-even analysis'}
            </p>
          </div>

          {/* Projected Net Savings */}
          <div className={`rounded-xl border p-5 transition-all ${
            isPositive
              ? 'bg-green-50/50 border-green-100 hover:bg-green-50/80'
              : 'bg-red-50/30 border-red-100/60 hover:bg-red-50/60'
          }`}>
            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              Projected Net Savings
            </div>
            <div
              data-testid="projected-net-savings"
              className={`text-2xl font-bold mt-2 tabular-nums tracking-tight ${
                isPositive ? 'text-green-700' : 'text-red-600'
              }`}
            >
              {formatCurrency(netSavings)}
            </div>
            <div className="font-mono text-[11px] text-gray-400 mt-2">
              (Total Cost × Break-even %) − Budget
            </div>
            <p className={`text-xs mt-1.5 font-medium ${
              isPositive ? 'text-green-700' : 'text-red-600'
            }`}>
              {retentionBudget > 0
                ? isPositive
                  ? '✓ Program pays for itself'
                  : 'Budget exceeds proportional savings'
                : 'Enter a budget to see projections'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
