import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ExpandableCard from "../../components/ExpandableCard";
import ViewGoals from "../../components/ViewGoals";
import AddGoal from "../../components/AddGoal";
import AddExpenses from "../../components/AddExpense";
import ViewExpense from "../../components/ViewExpense";
import AddIncome from "../../components/AddIncome";
import Viewdebt from "../../components/ViewDebt";
import AddDebt from "../../components/AddDebt";
import { Stack } from "@mui/material";

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
        console.log("UserData:", userData);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click happened outside all cards
      if (cardRefs.current.every((ref) => ref && !ref.contains(event.target as Node))) {
        setActiveCard(null); // Collapse all cards if clicked outside
      }
    };

    // Add event listener for detecting clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);







  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <Stack sx={{ width: 'calc(33.33% - 16px)' }}>
        <ExpandableCard
          title="Expenses"
          index={3}
          onClick={() => handleCardClick(3)}
          isActive={activeCard === 3}
          componentCollapsed={<ViewExpense expenseList={curUserData.expenses} />}
          componentExpanded={<AddExpenses userId={sessionId} onRerender={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[3] = el)}
        />
      </Stack>

      <Stack sx={{ width: 'calc(33.33% - 16px)' }}>
        <ExpandableCard
          title="Income"
          index={2}
          onClick={() => handleCardClick(2)}
          isActive={activeCard === 2}
          componentCollapsed={<p>Your total income: ${curUserData.income}</p>}
          componentExpanded={<AddIncome userId={sessionId} onIncomeAdded={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[2] = el)}
        />
      </Stack>

      <Stack sx={{ width: 'calc(33.33% - 16px)' }}>
        <ExpandableCard
          title="Debt"
          index={1}
          onClick={() => handleCardClick(1)}
          isActive={activeCard === 1}
          componentCollapsed={<Viewdebt userId={sessionId} onDebtDeleted={fetchUserData} debt={curUserData.debt} />}
          componentExpanded={<AddDebt userId={sessionId} onDebtAdded={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[1] = el)}
        />
      </Stack>

      <Stack sx={{ width: 'calc(33.33% - 16px)' }}>
        <ExpandableCard
          title="Goals"
          index={0}
          onClick={() => handleCardClick(0)}
          isActive={activeCard === 0}
          componentCollapsed={<ViewGoals userId={sessionId} onGoalDeleted={fetchUserData} goals={curUserData.goals} />}
          componentExpanded={<AddGoal userId={sessionId} onGoalAdded={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[0] = el)}
        />
      </Stack>

      {/* Add more cards as needed */}
    </Stack>
  );
}
