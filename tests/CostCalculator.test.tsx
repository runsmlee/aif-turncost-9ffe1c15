import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { App } from '../src/App';

describe('CostCalculator', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crash', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: /TurnCost/i })).toBeInTheDocument();
  });

  it('displays three input fields: team size, average salary, turnover rate', () => {
    render(<App />);
    expect(screen.getByLabelText(/team size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/average salary/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/turnover rate/i)).toBeInTheDocument();
  });

  it('shows default values on load (team size, salary, turnover rate pre-populated with sensible defaults)', () => {
    render(<App />);
    const teamSizeInput = screen.getByLabelText(/team size/i) as HTMLInputElement;
    const salaryInput = screen.getByLabelText(/average salary/i) as HTMLInputElement;
    const turnoverInput = screen.getByLabelText(/turnover rate/i) as HTMLInputElement;

    expect(Number(teamSizeInput.value)).toBeGreaterThan(0);
    expect(Number(salaryInput.value)).toBeGreaterThan(0);
    expect(Number(turnoverInput.value)).toBeGreaterThan(0);
  });

  it('updating team size input updates the total annual cost in real-time', () => {
    render(<App />);
    const teamSizeInput = screen.getByLabelText(/team size/i);

    // Get initial total
    const totalElement = screen.getByTestId('total-annual-cost');
    const initialTotal = Number(totalElement.getAttribute('data-value'));

    // Change team size
    fireEvent.change(teamSizeInput, { target: { value: '200' } });

    const updatedTotal = Number(totalElement.getAttribute('data-value'));
    expect(updatedTotal).toBeGreaterThan(initialTotal);
  });

  it('updating average salary input updates the total annual cost in real-time', () => {
    render(<App />);
    const salaryInput = screen.getByLabelText(/average salary/i);
    const totalElement = screen.getByTestId('total-annual-cost');
    const initialTotal = Number(totalElement.getAttribute('data-value'));

    fireEvent.change(salaryInput, { target: { value: '150000' } });

    const updatedTotal = Number(totalElement.getAttribute('data-value'));
    expect(updatedTotal).toBeGreaterThan(initialTotal);
  });

  it('updating turnover rate input updates the total annual cost in real-time', () => {
    render(<App />);
    const turnoverInput = screen.getByLabelText(/turnover rate/i);
    const totalElement = screen.getByTestId('total-annual-cost');
    const initialTotal = Number(totalElement.getAttribute('data-value'));

    fireEvent.change(turnoverInput, { target: { value: '40' } });

    const updatedTotal = Number(totalElement.getAttribute('data-value'));
    expect(updatedTotal).toBeGreaterThan(initialTotal);
  });

  it('entering zero or negative values shows validation error', () => {
    render(<App />);
    const teamSizeInput = screen.getByLabelText(/team size/i);

    fireEvent.change(teamSizeInput, { target: { value: '0' } });

    // The input field itself should show an error (aria-invalid)
    expect(teamSizeInput).toHaveAttribute('aria-invalid', 'true');
    // An error message should be visible
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays itemized breakdown with at least 4 cost categories (recruitment, onboarding, lost productivity, knowledge drain)', () => {
    render(<App />);
    const breakdown = screen.getByTestId('cost-breakdown');
    const rows = within(breakdown).getAllByTestId(/cost-row-/);
    expect(rows.length).toBeGreaterThanOrEqual(4);

    const labels = rows.map((r) => r.getAttribute('data-category'));
    expect(labels).toContain('recruitment');
    expect(labels).toContain('onboarding');
    expect(labels).toContain('lost-productivity');
    expect(labels).toContain('knowledge-drain');
  });

  it('each cost category shows the formula used', () => {
    render(<App />);
    const breakdown = screen.getByTestId('cost-breakdown');
    const formulas = within(breakdown).getAllByTestId(/formula-/);
    expect(formulas.length).toBeGreaterThanOrEqual(4);
    formulas.forEach((f) => {
      expect(f.textContent).toBeTruthy();
      expect(f.textContent!.length).toBeGreaterThan(3);
    });
  });

  it('each cost category shows the computed dollar amount', () => {
    render(<App />);
    const breakdown = screen.getByTestId('cost-breakdown');
    const amounts = within(breakdown).getAllByTestId(/amount-/);
    expect(amounts.length).toBeGreaterThanOrEqual(4);
    amounts.forEach((a) => {
      expect(a.textContent).toMatch(/\$/);
    });
  });

  it('total cost equals the sum of all itemized categories', () => {
    render(<App />);
    const breakdown = screen.getByTestId('cost-breakdown');
    const amounts = within(breakdown).getAllByTestId(/amount-/);
    const sum = amounts.reduce((acc, el) => {
      return acc + Number(el.getAttribute('data-value'));
    }, 0);
    const totalElement = screen.getByTestId('total-annual-cost');
    const total = Number(totalElement.getAttribute('data-value'));
    expect(total).toBeCloseTo(sum, 0);
  });
});
