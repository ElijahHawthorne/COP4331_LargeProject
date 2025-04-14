import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Typography, Paper } from "@mui/material";
import { Expense } from "../Types";

interface PieChartProps {
  expenses: Expense[];
}

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#FF9F40",
  "#8E44AD",
];

const PieChartComponent: React.FC<PieChartProps> = ({ expenses }) => {
  // Group expenses
  const groupedData = expenses.reduce(
    (acc: { [key: string]: number }, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.cost;
      return acc;
    },
    {}
  );

  //Convert data into an array
  const pieData = Object.keys(groupedData).map((category) => ({
    name: category,
    value: groupedData[category],
  }));
  console.log("Passed in:", expenses);
  console.log("Pie Data:", pieData);

  if (pieData.length === 0) {
    return <Typography>No expenses available to display.</Typography>;
  }

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
          "&:hover": {
          //Change shadow color based on mode.
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 4px 16px #2c4f83"
              : "0px 4px 16px #007FFF",
        },

      })}
    >
      <Typography variant="h6" gutterBottom>
        Expense Distribution by Category
      </Typography>
      <Box sx={{ width: 300, height: 300 }}>
        <PieChart width={300} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${entry}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Box>
    </Paper>
  );
};

export default PieChartComponent;
