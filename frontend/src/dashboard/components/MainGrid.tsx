import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import ExpandableCard from "../../components/ExpandableCard";
import ViewGoals from "../../components/ViewGoals";
import AddGoal from "../../components/AddGoal";
import UpcomingExpensesCard from "../../components/UpcomingExpenses";
import { UserData } from "../../Types";
import { Goal } from "../../Types";
import AddExpenses from "../../components/AddExpense";
import Viewdebt from "../../components/ViewDebt";
import AddDebt from "../../components/AddDebt";
import ViewExpense from "../../components/ViewExpense";
import AddIncome from "../../components/AddIncome";

const sampleExpenses = [
  {
    id: 1,
    description: "Electricity Bill",
    amount: 100.5,
    dueDate: "2023-08-30T00:00:00.000Z",
  },
  {
    id: 2,
    description: "Water Bill",
    amount: 45.75,
    dueDate: "2023-09-01T00:00:00.000Z",
  },
  {
    id: 3,
    description: "Internet Bill",
    amount: 60.0,
    dueDate: "2023-09-05T00:00:00.000Z",
  },
];

const data: Object[] = [
  {
    title: "Users",
    value: "14k",
    interval: "Last 30 days",
    trend: "up",
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340,
      380, 360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: "Conversions",
    value: "325",
    interval: "Last 30 days",
    trend: "down",
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600,
      820, 780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300,
      220,
    ],
  },
  {
    title: "Event count",
    value: "200k",
    interval: "Last 30 days",
    trend: "neutral",
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510,
      530, 520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

const TestGoals: Goal[] = [
  {
    name: "Buy a Car",
    cost: 20000,
    paymentAmount: 1000,
    progress: 5000,
    date: "2025-12-31",
  },
  {
    name: "Buy PS5",
    cost: 500,
    paymentAmount: 20,
    progress: 140,
    date: "2025-12-31",
  },
  {
    name: "Student Loan",
    cost: 20000,
    paymentAmount: 150,
    progress: 5000,
    date: "2025-12-31",
  },
];

export default function MainGrid() {
  //
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [curUserData, setCurUserData] = useState<UserData>({
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
      const userData: UserData = data.userData;
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
    // Toggle the card: collapse if it's already active, or expand otherwise
    setActiveCard((prevIndex) => (prevIndex === cardIndex ? null : cardIndex));
  };

  const goals = curUserData?.goals || [];
  const expenses = curUserData?.expenses || [];

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Click outside any card to collapse it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRefs.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setActiveCard(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log(curUserData);

  return (
    <Box sx={{ width: "100%", maxWidth: "none", p: 4 }}>
      {/*TOP SECTION*/}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>

      {/*TOP ROW*/}
      <Grid
        container
        spacing={3}
        columns={15} // Use 15 columns so 5 cards each with lg={3} fit on one row
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {/*Upcoming Expenses*/}
        <Grid item xs={12} sm={6} lg={4}>
          <UpcomingExpensesCard expenses={sampleExpenses} />
        </Grid>

        {/*Expenses*/}
        <Grid item xs={12} sm={6} lg={4}>
          <ExpandableCard
            title="Expenses"
            index={1}
            onClick={() => handleCardClick(1)}
            isActive={activeCard === 1}
            componentCollapsed={<ViewExpense expenseList={expenses} />}
            componentExpanded={
              <div className="flex">
                <div>
                  {sessionId ? (
                    <AddExpenses userId={sessionId} onRerender={fetchUserData} />
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            }
            cardRef={(el) => (cardRefs.current[1] = el)}
          />
        </Grid>

        {/*Income*/}
        <Grid item xs={12} sm={6} lg={4}>
          <ExpandableCard
            title="Income"
            index={2}
            onClick={() => handleCardClick(2)}
            isActive={activeCard === 2}
            componentCollapsed={<p>Your total income: ${curUserData.income}</p>}
            componentExpanded={
              <div className="flex">
                <div className="w-1/2">
                  <p className="text-lg font-medium">
                    Your current income is: ${curUserData.income}
                  </p>
                </div>
                <div className="w-1/2">
                  {sessionId ? (
                    <AddIncome userId={sessionId} onIncomeAdded={fetchUserData} />
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            }
            cardRef={(el) => (cardRefs.current[2] = el)}
          />
        </Grid>

        {/*Debt*/}
        <Grid item xs={12} sm={6} lg={4}>
          <ExpandableCard
            title="Debt"
            index={3}
            onClick={() => handleCardClick(3)}
            isActive={activeCard === 3}
            componentCollapsed={<Viewdebt debt={curUserData.debt} />}
            componentExpanded={<AddDebt userId={sessionId} onDebtAdded={fetchUserData} />}
            cardRef={(el) => (cardRefs.current[3] = el)}
          />
        </Grid>

        {/*Goals*/}
        <Grid item xs={12} sm={6} lg={4}>
          <ExpandableCard
            title="Goals"
            index={0}
            onClick={() => handleCardClick(0)}
            isActive={activeCard === 0}
            componentCollapsed={<ViewGoals goals={curUserData.goals} />}
            componentExpanded={<AddGoal userId={sessionId} onGoalAdded={fetchUserData} />}
            cardRef={(el) => (cardRefs.current[0] = el)}
          />
        </Grid>
      </Grid>

      {/* BOTTOM SECTION */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>

      {/*BOTTOM ROW (TWO BLANK CARDS)*/}
      <Grid container spacing={4} columns={15}>
        <Grid item xs={12} sm={6} lg={6}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              height: '200px', // Adjust as needed
            }}
          >
            <Typography variant="body1">
              {/*Empty card 1*/}
              Eddy's Graph
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              height: '200px', // Adjust as needed
            }}
          >
            <Typography variant="body1">
              {/*Empty card 2*/}
              Eddy's Graph
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
