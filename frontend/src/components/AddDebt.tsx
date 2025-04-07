import React, { useState } from 'react';
import { Debt } from '../Types';

interface AddDebtProps {
  userId: number | null;  // Allow null as userId is optional at first
  onDebtAdded: () => void;
}

const AddDebt: React.FC<AddDebtProps> = ({ userId, onDebtAdded }) => {
  const [debtName, setDebtName] = useState('');
  const [debtCost, setDebtCost] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [debtDate, setDebtDate] = useState('');
  const [progress, setProgress] = useState(0);

  const handleDebtSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if userId is null
    if (userId === null) {
      alert('User is not logged in');
      return; // Prevent form submission if userId is null
    }

    // Validate that the cost, payment amount, and progress are numbers
    const debtCostNum = Number(debtCost);
    const paymentAmountNum = Number(paymentAmount);
    const progressNum = Number(progress);

    if (isNaN(debtCostNum) || isNaN(paymentAmountNum) || isNaN(progressNum)) {
      alert('Please enter valid numbers for cost, payment amount, and progress.');
      return;
    }

    const newDebt: Debt = {
      name: debtName,
      cost: debtCostNum,
      paymentAmount: paymentAmountNum,
      progress: progressNum,
      date: debtDate,
    };

    try {
      // Send debt data to the server
      const debtResponse = await fetch('http://777finances.com:5000/api/adddebt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          debtName: newDebt.name,
          debtCost: newDebt.cost,
          paymentAmount: newDebt.paymentAmount,
          debtDate: newDebt.date,
          progress: newDebt.progress,
        }),
      });

      const debtData = await debtResponse.json();

      if (debtData.success) {
        // After adding debt, add expense
        const expenseData = {
          userId,
          expenseName: newDebt.name,
          expenseCost: newDebt.paymentAmount,
          expenseDate: newDebt.date,
          expenseCategory: 'debt',
        };

        const expenseResponse = await fetch('http://777finances.com:5000/api/addexpense', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expenseData),
        });

        const expenseDataResponse = await expenseResponse.json();

        if (expenseDataResponse.success) {
          onDebtAdded();
          alert('Debt and expense added successfully!');
        } else {
          alert(`Failed to add expense: ${expenseDataResponse.error}`);
        }
      } else {
        alert(`Failed to add debt: ${debtData.error}`);
      }
    } catch (error) {
      console.error('Error submitting debt and expense:', error);
      alert('An error occurred while adding the debt and expense.');
    }
  };

  return (
    <form onSubmit={handleDebtSubmit}>
      <div>
        <label>
          Debt Name:
          <input
            type="text"
            value={debtName}
            onChange={(e) => setDebtName(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Debt Cost:
          <input
            type="text"  // Using text input but validating the number later
            value={debtCost}
            onChange={(e) => setDebtCost(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Payment Amount:
          <input
            type="text"  // Using text input but validating the number later
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Target Date:
          <input
            type="date"
            value={debtDate}
            onChange={(e) => setDebtDate(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Progress:
          <input
            type="text" // Progress is treated as a number
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <button type="submit">Add Debt</button>
    </form>
  );
};

export default AddDebt;
