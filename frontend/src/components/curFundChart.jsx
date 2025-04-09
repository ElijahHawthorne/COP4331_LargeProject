import React from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { totalFunds as useTotalFunds } from "../hooks/totalFunds";
import { useExpenses } from "../hooks/useExpenses";
import { useIncomes } from "../hooks/useIncomes";

function CurFundChart() {
  let _ud = localStorage.getItem("user_data");
  let ud = JSON.parse(_ud);
  let userId = ud.id;

  const { expenses, error } = useExpenses(userId);
  const { curFunds } = useTotalFunds(userId);

  const sortedExpenses = [...expenses].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  let runningBalance = curFunds || 0;
  const xLabels = [];
  const yValues = [];

  sortedExpenses.forEach((exp) => {
    runningBalance -= exp.cost;
    xLabels.push(new Date(exp.timestamp).toISOString());
    yValues.push(runningBalance);
  });

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Current Funds Over Time</h2>

      {error && <p className="text-red-500">{error}</p>}

      {xLabels.length > 0 ? (
        <LineChart
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          series={[{ data: yValues, label: 'Total Funds ($)' }]}
          width={500}
          height={300}
        />
      ) : (
        <p>No expense data to display.</p>
      )}
    </div>
  );
}

export default CurFundChart;