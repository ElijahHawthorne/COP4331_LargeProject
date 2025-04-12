import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography, Paper } from "@mui/material";
import { Expense } from "../Types"; // Import the Expense interface
import { ResponsiveContainer } from "recharts";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#FF9F40",
  "#8E44AD",
];

interface PieChartProps {
  expenses: Expense[]; // Prop to receive the array of expenses
}

const PieChartComponent: React.FC<PieChartProps> = ({ expenses }) => {
  // Get the current month and year
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11 (January is 0)
  const currentYear = now.getFullYear(); // 4-digit year, e.g., 2025

  // Filter expenses to include only those from the current month
  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  // If no expenses for the current month, show a message
  if (currentMonthExpenses.length === 0) {
    return <Typography>No expenses for the current month.</Typography>;
  }

  // Group the filtered expenses by category and sum the costs for each category
  const groupedData = currentMonthExpenses.reduce(
    (acc: { [key: string]: number }, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.cost;
      return acc;
    },
    {}
  );

  // Convert the grouped data into an array for the pie chart
  const pieData = Object.keys(groupedData).map((category) => ({
    name: category,
    value: groupedData[category],
  }));

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Expense Distribution by Category (Current Month)
      </Typography>
      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${entry}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PieChartComponent;
