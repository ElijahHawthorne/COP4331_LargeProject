import { render, screen } from '@testing-library/react';
import BalanceCard from './Balance';
import { Expense } from '../Types';

test('displays correct remaining balance', () => {
  const expenses: Expense[] = [
    { name: 'Food', cost: 50, category: 'Food', date: '2025-04-10' },
    { name: 'Gas', cost: 20, category: 'Transport', date: '2025-04-11' }
  ];

  render(<BalanceCard expenses={expenses} income={100} />);

  expect(screen.getByText('$30.00')).toBeInTheDocument();
});
