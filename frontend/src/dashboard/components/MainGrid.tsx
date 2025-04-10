import { useState, useEffect, useRef } from "react";

import Box from "@mui/material/Box";

import ExpandableCard from "../../components/ExpandableCard";
import ViewGoals from "../../components/ViewGoals";
import AddGoal from "../../components/AddGoal";
import AddExpenses from "../../components/AddExpense";
import ViewExpense from "../../components/ViewExpense";
import AddIncome from "../../components/AddIncome";
import Viewdebt from "../../components/ViewDebt";
import AddDebt from "../../components/AddDebt";

import UpcomingExpensesCard from "../../components/UpcomingExpenses";
import PieChartComponent from "../../components/ExpensesPieChart";
import BalanceCard from "../../components/Balance";
import SpendingOverTimeChart from "../../components/ExpenseOverTime";


export default function MainGrid() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [curUserData, setCurUserData] = useState({
    income: 0,
    currentBalance: 0,
    expenses: [],
    goals: [],
    debt: [],
  });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [error, setError] = useState("");

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setSessionId(userData.id);
        console.log("UserData.id:", userData.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (sessionId !== null) {
      fetchUserData();
    }
  }, [sessionId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("http://777finances.com:5000/api/getdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      console.log("Fetched User Data:", data);
      const userData = data.userData;

      setCurUserData(userData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  const handleCardClick = (cardIndex: number) => {
    setActiveCard((prevIndex) =>
      prevIndex === cardIndex ? cardIndex : cardIndex
    );
  };

  const handleEditExpense = (expense: any) => {
    console.log("Edit expense:", expense);

    // Prompt the user for the new cost of the expense
    const newCost = prompt("Enter new cost for the expense:", expense.cost);

    // Validate the input
    if (!newCost || isNaN(parseFloat(newCost))) {
      alert("Invalid input. Please enter a valid number.");
      return;
    }

    // Send the updated expense cost to the backend
    const updatedExpense = {
      userId: sessionId,
      expenseName: expense.name, // Use the existing name to identify the expense
      newExpenseCost: parseFloat(newCost), // Only update the cost
    };

    fetch("http://777finances.com:5000/api/updateexpense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedExpense),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          console.log("Expense updated successfully");
          fetchUserData(); // Refresh the expense list
        } else {
          console.error("Failed to update expense:", result.error);
        }
      })
      .catch((error) => {
        console.error("Error updating expense:", error);
      });
  };

  const handleDeleteExpense = async (expense: any) => {
    console.log("Delete expense:", expense);
    if (!sessionId) return;

    try {
      const response = await fetch("http://777finances.com:5000/api/removeexpense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: sessionId, expenseName: expense.name }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("Expense deleted successfully");
        fetchUserData(); // Refresh the data after deletion
      } else {
        console.error("Failed to delete expense:", result.error);
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignore clicks inside dropdowns or other specific elements
      if ((event.target as HTMLElement).closest(".MuiMenu-paper")) {
        return; // Do nothing if the click is inside a Material-UI dropdown
      }

      // Check if the click happened outside all cards
      if (
        cardRefs.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setActiveCard(null); // Collapse all cards if clicked outside
      }
    };

    // Add event listener for detecting clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [cardRefs]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',  // Horizontally center the cards
        gap: 2,  // Space between the cards
        alignItems: 'flex-start',
        padding: 2,  // Adjust the padding as needed
      }}
    >
      {/* Goal Card */}
      <Box
        sx={{
          width: 'calc(33.33% - 16px)',  // Make sure the card takes up 1/3 of the available width
        }}
      >
        <ExpandableCard
          title="Goals"
          index={0}
          onClick={() => handleCardClick(0)}
          isActive={activeCard === 0}
          componentCollapsed={<ViewGoals userId={sessionId} onGoalDeleted={fetchUserData} goals={curUserData.goals} />}
          componentExpanded={<AddGoal userId={sessionId} onGoalAdded={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[0] = el)}
        />
      </Box>

      {/* Debt Card */}
      <Box
        sx={{
          width: 'calc(33.33% - 16px)',
        }}
      >
        <ExpandableCard
          title="Debt"
          index={1}
          onClick={() => handleCardClick(1)}
          isActive={activeCard === 1}
          componentCollapsed={<Viewdebt userId={sessionId} onDebtDeleted={fetchUserData} debt={curUserData.debt} />}
          componentExpanded={<AddDebt userId={sessionId} onDebtAdded={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[1] = el)}
        />
      </Box>

      {/* Income Card */}
      <Box
        sx={{
          width: 'calc(33.33% - 16px)',
        }}
      >
        <ExpandableCard
          title="Income"
          index={2}
          onClick={() => handleCardClick(2)}
          isActive={activeCard === 2}
          componentCollapsed={<p>Monthly Income: ${curUserData.income}</p>}
          componentExpanded={<AddIncome userId={sessionId} onIncomeAdded={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[2] = el)}
        />
      </Box>

      {/* Expense Card */}
      <Box
        sx={{
          zIndex: 2,
          width: 'calc(33.33% - 16px)',
        }}
      >
        <ExpandableCard
          title="Expenses"
          index={3}
          onClick={() => handleCardClick(3)}
          isActive={activeCard === 3}
          componentCollapsed={
            <ViewExpense
              expenseList={curUserData.expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          }
          componentExpanded={<AddExpenses userId={sessionId} onRerender={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[3] = el)}
        />
      </Box>

      <Box
        sx={{
          width: 'calc(33.33% - 16px)',  // Maintain the same width as other cards
        }}
      >
        
        <ExpandableCard
          title=""
          index={4}
          onClick={() => null}
          isActive={activeCard === 4}
          componentCollapsed={<BalanceCard expenses={curUserData.expenses} income={curUserData.income}/>}
          componentExpanded={null}
          cardRef={(el) => (cardRefs.current[0] = el)}
        />
      </Box>

      <Box
        sx={{
          width: 'calc(33.33% - 16px)',  // Maintain the same width as other cards
        }}
      >
       <ExpandableCard
          title=""
          index={4}
          onClick={() => null}
          isActive={activeCard === 4}
          componentCollapsed={<UpcomingExpensesCard expenses={curUserData.expenses}/>}
          componentExpanded={null}
          cardRef={(el) => (cardRefs.current[0] = el)}
        />
      </Box>
      <Box
        sx={{
          width: '50%', // Span the full width of the container
          marginTop: 2,  // Add some space before the large card
        }}
      >
        <PieChartComponent expenses={curUserData.expenses} />
      </Box>
      <Box
        sx={{
          width: '50%', // Span the full width of the container
          marginTop: 2,  // Add some space before the large card
        }}
      >
        <SpendingOverTimeChart expenses={curUserData.expenses} />
      </Box>


    </Box>
  );
}
