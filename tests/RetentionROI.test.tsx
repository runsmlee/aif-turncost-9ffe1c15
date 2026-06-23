import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../src/App';

describe('RetentionROI', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crash', () => {
    render(<App />);
    const roiSection = screen.getByTestId('retention-roi');
    expect(roiSection).toBeInTheDocument();
  });

  it('displays input for annual retention program budget', () => {
    render(<App />);
    expect(screen.getByLabelText(/retention program budget/i)).toBeInTheDocument();
  });

  it('shows break-even turnover reduction percentage', () => {
    render(<App />);
    const budgetInput = screen.getByLabelText(/retention program budget/i);
    fireEvent.change(budgetInput, { target: { value: '50000' } });

    const breakEven = screen.getByTestId('break-even-reduction');
    expect(breakEven).toBeInTheDocument();
    expect(breakEven.textContent).toMatch(/%/);
  });

  it('shows projected net savings or loss', () => {
    render(<App />);
    const budgetInput = screen.getByLabelText(/retention program budget/i);
    fireEvent.change(budgetInput, { target: { value: '50000' } });

    const netSavings = screen.getByTestId('projected-net-savings');
    expect(netSavings).toBeInTheDocument();
    expect(netSavings.textContent).toMatch(/\$/);
  });

  it('displays formula for break-even calculation', () => {
    render(<App />);
    const formula = screen.getByTestId('break-even-formula');
    expect(formula).toBeInTheDocument();
    expect(formula.textContent).toBeTruthy();
    expect(formula.textContent!.length).toBeGreaterThan(5);
  });

  it('handles zero budget input gracefully', () => {
    render(<App />);
    const budgetInput = screen.getByLabelText(/retention program budget/i);
    fireEvent.change(budgetInput, { target: { value: '0' } });

    const breakEven = screen.getByTestId('break-even-reduction');
    const netSavings = screen.getByTestId('projected-net-savings');
    expect(breakEven).toBeInTheDocument();
    expect(netSavings).toBeInTheDocument();
    // Should not show NaN or error
    expect(breakEven.textContent).not.toMatch(/NaN/i);
    expect(netSavings.textContent).not.toMatch(/NaN/i);
  });
});
