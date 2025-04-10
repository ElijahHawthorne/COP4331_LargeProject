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
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, parseISO } from "date-fns";
import { Expense } from "../Types";
import { Typography } from "@mui/material";

interface SpendingOverTimeProps {
  expenses: Expense[];
}

const SpendingOverTime: React.FC<SpendingOverTimeProps> = ({ expenses }) => {
  // Get current month interval
  const start = startOfMonth(new Date());
  const end = endOfMonth(new Date());

  // Generate all days of current month
  const daysOfMonth = eachDayOfInterval({ start, end });

  // Create data for each day with total spending
  const data = daysOfMonth.map((day) => {
    const total = expenses
      .filter((expense) =>
        isSameDay(parseISO(expense.date), day)
      )
      .reduce((sum, e) => sum + e.cost, 0);

    return {
      date: format(day, "MMM d"), // e.g., Apr 10
      amount: total,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
       
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} interval={0} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="amount" stroke="#1976d2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SpendingOverTime;
