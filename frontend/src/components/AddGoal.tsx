import React, { useState } from 'react';

interface Goal {
  name: string;
  cost: number;
  paymentAmount: number;
  progress: number;
  date: string;
}

interface AddGoalProps {
  userId: number | null;  // Allow null as userId is optional at first
  onGoalAdded: () => void;
}

const AddGoal: React.FC<AddGoalProps> = ({ userId, onGoalAdded }) => {
  const [goalName, setGoalName] = useState('');
  const [goalCost, setGoalCost] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [progress, setProgress] = useState(0);  // Progress is added, and it will be set to 0 initially

  const handleGoalSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if userId is null
    if (userId === null) {
      alert('User is not logged in');
      return; // Prevent form submission if userId is null
    }

    // Validate that the cost and payment amount are numbers
    if (isNaN(Number(goalCost)) || isNaN(Number(paymentAmount))) {
      alert('Please enter valid numbers for cost and payment amount.');
      return;
    }

    const newGoal: Goal = {
      name: goalName,
      cost: Number(goalCost),
      paymentAmount: Number(paymentAmount),
      progress: progress,  // Progress value passed in the API call
      date: goalDate,
    };

    try {
      // Send goal data to the server
      const goalResponse = await fetch('http://777finances.com:5000/api/addgoal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          goalName: newGoal.name,
          goalCost: newGoal.cost,
          paymentAmount: newGoal.paymentAmount,
          goalDate: newGoal.date,
          progress: newGoal.progress,  // Add progress in the request body for the API
        }),
      });

      const goalData = await goalResponse.json();

      if (goalData.success) {
        // After adding goal, add expense
        const expenseData = {
          userId,
          expenseName: newGoal.name,
          expenseCost: newGoal.paymentAmount,
          expenseDate: newGoal.date,
          expenseCategory: 'saving goal',
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
          onGoalAdded();
          alert('Goal and expense added successfully!');
        } else {
          alert(`Failed to add expense: ${expenseDataResponse.error}`);
        }
      } else {
        alert(`Failed to add goal: ${goalData.error}`);
      }
    } catch (error) {
      console.error('Error submitting goal and expense:', error);
      alert('An error occurred while adding the goal and expense.');
    }
  };

  return (
    <> 
  <h2 className="text-lg font-bold mb-2">Add a New Goal</h2>
    <form onSubmit={handleGoalSubmit}>
    <div>
      <label>
        Goal Name:
        <input
          type="text"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          required
        />
      </label>
    </div>
    <div>
      <label>
        Goal Cost:
        <input
          type="text"  // Using text input instead of number input
          value={goalCost}
          onChange={(e) => setGoalCost(e.target.value)}
          required
        />
      </label>
    </div>
    <div>
      <label>
        Payment Amount:
        <input
          type="text"  // Using text input instead of number input
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
          value={goalDate}
          onChange={(e) => setGoalDate(e.target.value)}
          required
        />
      </label>
    </div>
    <div>
      <label>
        Progress:
        <input
          type="text" // Progress can be a number
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}  // Handling progress value
          required
        />
      </label>
    </div>
    <button type="submit">Add Goal</button>
  </form> </>
    
  );
};

export default AddGoal;
