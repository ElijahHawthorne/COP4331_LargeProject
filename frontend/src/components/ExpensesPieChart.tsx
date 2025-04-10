import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart'; // Correct import path
import { Paper, Typography, Box } from '@mui/material';
import { Expense } from '../Types'; // Adjust path to your types

// Function to group expenses by category and calculate totals
const getCategoryData = (expenses: Expense[]) => {
  const categoryTotals: Record<string, number> = {};

  expenses.forEach(({ category, cost }) => {
    categoryTotals[category] = (categoryTotals[category] || 0) + cost;
  });

  return Object.entries(categoryTotals).map(([category, value], i) => ({
    id: i,
    value,
    label: category,
  }));
};

interface ExpensePieChartProps {
  expenses: Expense[];
}

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ expenses }) => {
  const data = getCategoryData(expenses);

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 500, margin: 'auto' }}>
      <Typography variant="h6" align="center" gutterBottom>
        Expenses by Category
      </Typography>
      <Box height={300}>
        <PieChart
          series={[{ data }]} // Data that represents each category's total cost
          width={400}
          height={300}
          legend={{ hidden: false }} // Display the legend for categories
        >
          {/* If you have no content to put inside PieChart, you can still pass an empty fragment */}
          {/* This can help if `children` is strictly required */}
        </PieChart>
      </Box>
    </Paper>
  );
};

export default ExpensePieChart;
