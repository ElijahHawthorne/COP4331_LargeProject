import React from "react";
import { useExpenses } from "../hooks/useExpenses";
import { LineChart } from '@mui/x-charts/LineChart';

function TimeChart() {
  let _ud = localStorage.getItem("user_data");
  let ud = JSON.parse(_ud);
  let userId = ud.id;

  const { expenses, error } = useExpenses(userId);

  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const xLabels = sortedExpenses.map(exp => new Date(exp.timestamp).toISOString());
  const yValues = sortedExpenses.map(exp => exp.cost);

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Expenses Over Time</h2>

      {error && <p className="text-red-500">{error}</p>}

      {xLabels.length > 0 ? (
        <LineChart
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          series={[{ data: yValues, label: 'Expenses' }]}
          width={500}
          height={300}
        />
      ) : (
        <p>No expense data to display.</p>
      )}
    </div>
  );
}

export default TimeChart;
