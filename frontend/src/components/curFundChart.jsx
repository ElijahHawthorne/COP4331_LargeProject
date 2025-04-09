import React, { useState } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { startFunds as useStartFunds } from "../hooks/startFunds";
import { useExpenses } from "../hooks/useExpenses";
import { useIncomes } from "../hooks/useIncomes";

function CurFundChart() {
  const _ud = localStorage.getItem("user_data");
  const ud = JSON.parse(_ud);
  const userId = ud.id;

const { expenses: realExpenses, error } = useExpenses(userId);

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 5); 

const testExpense = {
  cost: 30,
  timestamp: futureDate.toISOString(),
  description: "Test Future Expense"
};

futureDate.setDate(futureDate.getDate() + 1);

const testExpense2 = {
  cost: 100,
  timestamp: futureDate.toISOString(),
  description: "Test Future Expense"
};

const expenses = [...realExpenses, testExpense, testExpense2];

  const { startFunds } = useStartFunds(userId);
  const { incomes } = useIncomes(userId);

  const [viewMode, setViewMode] = useState('formatted'); // 'formatted' or 'raw'
  const [groupMode, setGroupMode] = useState('day'); // 'day' or 'week'

  // Combine and sort all transactions
  const events = [
    ...expenses.map(exp => ({ type: 'expense', value: -exp.cost, timestamp: exp.timestamp })),
    ...incomes.map(inc => ({ type: 'income', value: +inc.amount, timestamp: inc.timestamp })),
  ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  let runningBalance = startFunds || 300;
  const groupedData = new Map();

  const getGroupKey = (date) => {
    if (groupMode === 'day') {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } else {
      const firstDayOfWeek = new Date(date);
      firstDayOfWeek.setDate(date.getDate() - date.getDay());
      return `Week of ${firstDayOfWeek.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    }
  };

  events.forEach((event) => {
    const date = new Date(event.timestamp);
    const key = viewMode === 'raw' ? date.toISOString() : getGroupKey(date);
    runningBalance += event.value;
    groupedData.set(key, runningBalance);
  });

  const xLabels = Array.from(groupedData.keys());
  const yValues = Array.from(groupedData.values());

  const toggleView = () => {
    setViewMode((prev) => (prev === 'formatted' ? 'raw' : 'formatted'));
  };

  const toggleGroup = () => {
    setGroupMode((prev) => (prev === 'day' ? 'week' : 'day'));
  };

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Current Funds Over Time</h2>

      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-accent text-white rounded hover:bg-orange"
          onClick={toggleView}
        >
          Toggle View: {viewMode === 'formatted' ? 'Raw Timestamps' : 'Formatted'}
        </button>
        <button
          className="px-4 py-2 bg-accent text-white rounded hover:bg-orange"
          onClick={toggleGroup}
        >
          Group by: {groupMode === 'day' ? 'Week' : 'Day'}
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {xLabels.length > 0 ? (
        <LineChart
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          yAxis={[{ min: 0 }]}
          series={[{ data: yValues, label: 'Total Funds ($)' }]}
          width={500}
          height={300}
        />
      ) : (
        <p>No transaction data to display.</p>
      )}
    </div>
  );
}

export default CurFundChart;
