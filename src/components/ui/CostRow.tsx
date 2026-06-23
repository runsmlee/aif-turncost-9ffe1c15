import { formatCurrency } from '../../lib/calcEngine';

interface CostRowProps {
  categoryKey: string;
  label: string;
  formula: string;
  amount: number;
}

export function CostRow({ categoryKey, label, formula, amount }: CostRowProps) {
  return (
    <div
      data-testid={`cost-row-${categoryKey}`}
      data-category={categoryKey}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 py-3 px-3 -mx-3 rounded-lg hover:bg-gray-50/80 transition-colors duration-150 border-b border-gray-100 last:border-b-0 last:pb-2"
    >
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        <div
          data-testid={`formula-${categoryKey}`}
          className="font-mono text-[11px] text-gray-400 mt-0.5 leading-relaxed"
        >
          {formula}
        </div>
      </div>
      <div
        data-testid={`amount-${categoryKey}`}
        data-value={amount}
        className="text-sm font-bold text-gray-900 tabular-nums sm:text-right whitespace-nowrap"
      >
        {formatCurrency(amount)}
      </div>
    </div>
  );
}
