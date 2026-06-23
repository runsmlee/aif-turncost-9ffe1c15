import { useMemo } from 'react';
import { type CostBreakdownResult, getCostCategoryDetails, formatCurrency, calculatePerEmployeeCost } from '../lib/calcEngine';
import { CostRow } from './ui/CostRow';

interface CostBreakdownProps {
  result: CostBreakdownResult;
  isValid: boolean;
}

export function CostBreakdown({ result, isValid }: CostBreakdownProps) {
  const categories = useMemo(() => getCostCategoryDetails(result), [result]);
  const perEmployee = calculatePerEmployeeCost(result.total, result.employeesReplaced);

  if (!isValid) {
    return (
      <div data-testid="cost-breakdown" className="rounded-2xl border border-gray-200 bg-gray-50/50 p-8 text-center shadow-card">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 6h.01M15 9h.01M9 9h6M9 13h6M9 21h6M3 5h18v15H3z" /></svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">
          Enter valid values above to see your cost breakdown.
        </p>
      </div>
    );
  }

  return (
    <div data-testid="cost-breakdown" className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 rounded-full bg-brand-500" />
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Annual Turnover Cost Breakdown</h2>
        </div>
        <p className="text-xs text-gray-500 ml-3">
          {result.employeesReplaced.toFixed(0)} employees replaced · {formatCurrency(perEmployee)} per employee
        </p>
      </div>

      <div className="px-6 pb-2">
        {categories.map((cat) => (
          <CostRow
            key={cat.key}
            categoryKey={cat.key}
            label={cat.label}
            formula={cat.formula}
            amount={cat.amount}
          />
        ))}
      </div>

      <div className="px-6 py-4 bg-gradient-to-r from-brand-50/60 to-gray-50/40 border-t border-gray-200/80">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">Total Annual Cost</span>
          <span
            data-testid="total-annual-cost"
            data-value={result.total}
            className="text-2xl font-bold text-brand-600 tabular-nums tracking-tight"
          >
            {formatCurrency(result.total)}
          </span>
        </div>
      </div>
    </div>
  );
}
