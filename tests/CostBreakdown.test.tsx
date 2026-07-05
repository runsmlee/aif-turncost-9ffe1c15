import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../src/App';

describe('CostBreakdown', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crash', () => {
    render(<App />);
    expect(screen.getByTestId('cost-breakdown')).toBeInTheDocument();
  });

  it('displays each cost category with label, formula, and dollar amount', () => {
    render(<App />);
    const breakdown = screen.getByTestId('cost-breakdown');

    const categories = ['recruitment', 'onboarding', 'lost-productivity', 'knowledge-drain'];
    categories.forEach((cat) => {
      const row = within(breakdown).getByTestId(`cost-row-${cat}`);
      expect(row).toBeInTheDocument();

      const formula = within(breakdown).getByTestId(`formula-${cat}`);
      expect(formula.textContent).toBeTruthy();

      const amount = within(breakdown).getByTestId(`amount-${cat}`);
      expect(amount.textContent).toMatch(/\$/);
    });
  });

  it('formulas are human-readable (e.g., "Employees replaced × Salary × 20%")', () => {
    render(<App />);
    const breakdown = screen.getByTestId('cost-breakdown');
    const formulas = within(breakdown).getAllByTestId(/formula-/);

    formulas.forEach((f) => {
      const text = f.textContent!;
      // Human-readable formulas should contain words, not just symbols
      expect(text.length).toBeGreaterThan(5);
      // Should mention "employees" or "Salary" or similar readable terms
      expect(text.toLowerCase()).toMatch(/employee|salary|%|month/);
    });
  });

  it('shows per-employee cost alongside total cost', () => {
    render(<App />);
    const breakdown = screen.getByTestId('cost-breakdown');

    // Total annual cost
    expect(screen.getByTestId('total-annual-cost')).toBeInTheDocument();

    // Per-employee cost text (in the subtitle of the breakdown)
    const subtitle = within(breakdown).getByText(/per employee/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('numbers are formatted as USD currency', () => {
    render(<App />);
    const breakdown = screen.getByTestId('cost-breakdown');

    const total = screen.getByTestId('total-annual-cost');
    expect(total.textContent).toMatch(/\$\d/);

    const amounts = within(breakdown).getAllByTestId(/amount-/);
    amounts.forEach((a) => {
      expect(a.textContent).toMatch(/\$/);
      // Should contain digits (formatted number)
      expect(a.textContent).toMatch(/\d/);
    });
  });
});
