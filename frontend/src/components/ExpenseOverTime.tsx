import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isSameDay,
  parseISO,
  getDate,
  getMonth,
  getYear,
} from "date-fns";
import { Expense } from "../Types";
import { Typography, Box, Paper } from "@mui/material";

interface SpendingOverTimeProps {
  expenses: Expense[];
}

const SpendingOverTime: React.FC<SpendingOverTimeProps> = ({ expenses }) => {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const daysOfMonth = eachDayOfInterval({ start, end });

  const data = daysOfMonth.map((day) => {
    const dayOfMonth = getDate(day);
    const currentMonth = getMonth(day);
    const currentYear = getYear(day);

    const total = expenses
      .filter((expense) => {
        const expenseDate = parseISO(expense.date);

        if (expense.recurring) {
          // Only match if the day matches, regardless of month/year
          return getDate(expenseDate) === dayOfMonth;
        } else {
          // One-time expense: must match exact day
          return (
            isSameDay(expenseDate, day)
          );
        }
      })
      .reduce((sum, e) => sum + e.cost, 0);

    return {
      date: format(day, "MMM d"),
      amount: total,
    };
  });

  return (
    <Paper
      elevation={3}
      sx={(theme) => ({
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
        transition: "box-shadow 0.3s ease, color 0.3s ease",
        "&:hover": {
          boxShadow:
            theme.palette.mode === "dark"
              ? "0px 4px 16px #2c4f83"
              : "0px 4px 16px #007FFF",
        },
      })}
    >
      <Typography variant="h6" gutterBottom>
        Expense Distribution Over Time
      </Typography>
      <Box sx={{ width: 650, height: 300 }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} interval={0} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SpendingOverTime;
