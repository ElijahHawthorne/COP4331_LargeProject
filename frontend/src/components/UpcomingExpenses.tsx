import React, { useState, useEffect } from "react";
import { Expense } from "../Types";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { format, addDays, parseISO, isSameMonth } from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface UpcomingExpensesCardProps {
  expenses: Expense[];
}

const UpcomingExpensesCard: React.FC<UpcomingExpensesCardProps> = ({ expenses }) => {
  const [localExpenses, setLocalExpenses] = useState<Expense[]>(expenses);
  const timeZone = "America/New_York";

  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  const today = toZonedTime(new Date(), timeZone);
  const sevenDaysFromNow = addDays(today, 7);

  const isWithinNextWeek = (date: Date) => {
    return date >= today && date <= sevenDaysFromNow;
  };

  const upcomingExpenses = localExpenses.filter((expense) => {
    const parsed = parseISO(expense.date);

    if (expense.recurring) {
      // Create a simulated recurring date in the current month
      const recurringDate = new Date(today.getFullYear(), today.getMonth(), parsed.getDate());
      return isWithinNextWeek(recurringDate);
    }

    const zonedDate = toZonedTime(parsed, timeZone);
    return isWithinNextWeek(zonedDate);
  });

  return (
    <Box sx={{ padding: 2, border: 'none' }}>
      <List>
        {upcomingExpenses.length > 0 ? (
          upcomingExpenses.map((expense) => {
            const originalDate = parseISO(expense.date);
            let displayDate = originalDate;

            if (expense.recurring && !isSameMonth(originalDate, today)) {
              displayDate = new Date(today.getFullYear(), today.getMonth(), originalDate.getDate());
            }

            const formattedDate = format(toZonedTime(displayDate, timeZone), "MMM d, yyyy");

            return (
              <ListItem key={expense.name}>
                <ListItemText
                  primary={expense.name}
                  secondary={`Due: ${formattedDate} — $${expense.cost.toFixed(2)}`}
                  primaryTypographyProps={{
                    sx: (theme) => ({
                      fontFamily: "Inter, sans-serif",
                      color: theme.palette.text.primary,
                      fontSize: "1.3rem !important",
                      fontWeight: "bold",
                    }),
                  }}
                  secondaryTypographyProps={{
                    sx: (theme) => ({
                      fontFamily: "Inter, sans-serif",
                      color: theme.palette.text.primary,
                      fontSize: "1rem !important",
                    }),
                  }}
                />
                <Checkbox />
              </ListItem>
            );
          })
        ) : (
          <ListItem>
            <ListItemText primary="No upcoming expenses within the next 7 days." />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default UpcomingExpensesCard;
