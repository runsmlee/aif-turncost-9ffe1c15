import { NumberInput } from './ui/NumberInput';
import { CostBreakdown } from './CostBreakdown';
import { type CostBreakdownResult } from '../lib/calcEngine';

interface CostCalculatorProps {
  teamSize: number;
  avgSalary: number;
  turnoverRate: number;
  isValid: boolean;
  calcResult: CostBreakdownResult;
  onTeamSizeChange: (value: number) => void;
  onSalaryChange: (value: number) => void;
  onTurnoverChange: (value: number) => void;
}

export function CostCalculator({
  teamSize,
  avgSalary,
  turnoverRate,
  isValid,
  calcResult,
  onTeamSizeChange,
  onSalaryChange,
  onTurnoverChange,
}: CostCalculatorProps) {
  const teamSizeError = teamSize <= 0 ? 'Please enter a valid team size' : undefined;
  const salaryError = avgSalary <= 0 ? 'Please enter a valid salary' : undefined;
  const turnoverError = turnoverRate <= 0 ? 'Please enter a valid rate' : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Panel */}
      <form aria-label="Turnover cost calculator inputs" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 rounded-full bg-gray-300" />
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">Your Team</h2>
              <p className="text-xs text-gray-500 mt-0.5">Results update instantly — no button needed.</p>
            </div>
          </div>

          <NumberInput
            id="team-size"
            name="team-size"
            label="Team Size"
            aria-label="Team Size — number of employees"
            value={teamSize || ''}
            placeholder="100"
            min={0}
            error={teamSizeError}
            onValueChange={onTeamSizeChange}
          />

          <NumberInput
            id="avg-salary"
            name="avg-salary"
            label="Average Salary"
            aria-label="Average Salary — annual salary per employee"
            value={avgSalary || ''}
            placeholder="90000"
            prefix="$"
            min={0}
            error={salaryError}
            onValueChange={onSalaryChange}
          />

          <NumberInput
            id="turnover-rate"
            name="turnover-rate"
            label="Turnover Rate"
            aria-label="Turnover Rate — annual percentage of employees who leave"
            value={turnoverRate || ''}
            placeholder="20"
            suffix="%"
            min={0}
            max={100}
            error={turnoverError}
            onValueChange={onTurnoverChange}
          />
        </div>
      </form>

      {/* Results Panel */}
      <section aria-label="Annual turnover cost breakdown results" aria-live="polite">
        <CostBreakdown result={calcResult} isValid={isValid} />
      </section>
    </div>
  );
}
