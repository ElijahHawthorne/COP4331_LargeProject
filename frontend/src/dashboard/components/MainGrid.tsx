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
          componentCollapsed={<p>Your total income: ${curUserData.income}</p>}
          componentExpanded={<AddIncome userId={sessionId} onIncomeAdded={fetchUserData} />}
          cardRef={(el) => (cardRefs.current[2] = el)}
        />
      </Box>

      {/* Expense Card */}
      <Box
        sx={{
          width: 'calc(33.33% - 16px)',
        }}
      >
        <ExpandableCard
          title="Expenses"
          index={3}
          onClick={() => handleCardClick(3)}
          isActive={activeCard === 3}
          componentCollapsed={<ViewExpense expenseList={curUserData.expenses} />}
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
          title="New Card"
          index={4}  // Ensure the index is unique
          onClick={() => handleCardClick(4)}
          isActive={activeCard === 4}
          componentCollapsed={<div>Content for New Card</div>}  // Customize this
          componentExpanded={<div>Expanded Content for New Card</div>}  // Customize this
          cardRef={(el) => (cardRefs.current[4] = el)}  // Add to card refs array
        />
      </Box>

      <Box
        sx={{
          width: 'calc(33.33% - 16px)',  // Maintain the same width as other cards
        }}
      >
        <ExpandableCard
          title="New Card"
          index={5}  // Ensure the index is unique
          onClick={() => handleCardClick(5)}
          isActive={activeCard === 5}
          componentCollapsed={<div>Content for New Card</div>}  // Customize this
          componentExpanded={<div>Expanded Content for New Card</div>}  // Customize this
          cardRef={(el) => (cardRefs.current[5] = el)}  // Add to card refs array
        />
      </Box>


    </Box>
  );
}
