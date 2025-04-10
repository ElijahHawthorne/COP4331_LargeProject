import React from "react";
import { PieChart } from '@mui/x-charts';
import { useExpenses } from "../hooks/useExpenses";

function CategoryChart() {
  const _ud = localStorage.getItem("user_data");
  const ud = JSON.parse(_ud);
  const userId = ud.id;

  const { expenses, error } = useExpenses(userId);

  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.cost;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([category, total], index) => ({
    id: index,
    value: total,
    label: category,
  }));

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Expenses by Category</h2>

      {error && <p className="text-red-500">{error}</p>}

      {pieData.length > 0 ? (
        <PieChart
          series={[
            {
              data: pieData,
            },
          ]}
          width={400}
          height={200}
        />
      ) : (
        <p>No expenses to display.</p>
      )}
    </div>
  );
}

export default CategoryChart;
