import { useEffect } from 'react';
import { useCalculatorState } from './hooks/useCalculatorState';
import { CostCalculator } from './components/CostCalculator';
import { RetentionROI } from './components/RetentionROI';

export function App() {
  const {
    teamSize,
    avgSalary,
    turnoverRate,
    retentionBudget,
    calcResult,
    isValid,
    setTeamSize,
    setAvgSalary,
    setTurnoverRate,
    setRetentionBudget,
  } = useCalculatorState();

  // Track page view on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.aif?.track) {
      window.aif.track('page_view', { path: window.location.pathname });
    }
  }, []);

  // Track scroll on breakdown
  useEffect(() => {
    const handleScroll = () => {
      const breakdown = document.querySelector('[data-testid="cost-breakdown"]');
      if (breakdown && window.aif?.track) {
        const rect = breakdown.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          window.aif.track('breakdown_scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { once: true, passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-brand-sm">
                <span className="text-white font-bold text-sm tracking-tight">TC</span>
              </div>
              <div className="flex items-baseline gap-1">
                <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                  TurnCost
                  <span className="sr-only"> — Employee Turnover Cost Calculator</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                Private · In-browser
              </span>
              <div className="w-2 h-2 rounded-full bg-green-400 ring-4 ring-green-400/10" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero + Calculator */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero */}
        <div className="mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 border border-brand-100 px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-xs font-semibold text-brand-700 tracking-wide">Turnover Cost Calculator</span>
          </div>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-gray-900 max-w-2xl leading-[1.15] tracking-tightest">
            The true cost of turnover,{' '}
            <span className="text-gradient-brand">calculated transparently</span>{' '}
            in three inputs.
          </h2>
          <p className="text-base text-gray-500 mt-4 max-w-xl leading-relaxed">
            No black boxes. Every number shows its formula. Adjust inputs and watch results update instantly.
          </p>
        </div>

        <CostCalculator
          teamSize={teamSize}
          avgSalary={avgSalary}
          turnoverRate={turnoverRate}
          isValid={isValid}
          calcResult={calcResult}
          onTeamSizeChange={setTeamSize}
          onSalaryChange={setAvgSalary}
          onTurnoverChange={setTurnoverRate}
        />

        <RetentionROI
          retentionBudget={retentionBudget}
          calcResult={calcResult}
          turnoverRate={turnoverRate}
          onBudgetChange={setRetentionBudget}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 bg-white/50 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">TC</span>
              </div>
              <span className="text-xs font-medium text-gray-500">TurnCost</span>
            </div>
            <p className="text-xs text-gray-400 max-w-md leading-relaxed">
              Uses established industry factors (SHRM, Gallup, CAP). All calculations happen in your browser — your data never leaves this device.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
