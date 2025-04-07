import { useState, useEffect, useRef } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import StatCard, { StatCardProps } from './StatCard';
import ExpandableCard from '../../components/ExpandableCard';
import ViewGoals from '../../components/ViewGoals';
import AddGoal from '../../components/AddGoal';
import UpcomingExpensesCard from '../../components/UpcomingExpenses';
import { UserData } from "../../Types";
import { Goal } from '../../Types';
import AddExpenses from '../../components/AddExpense';
import ViewExpense from '../../components/ViewExpense';
import AddIncome from '../../components/AddIncome';

const sampleExpenses = [
  {
    id: 1,
    description: "Electricity Bill",
    amount: 100.50,
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
    amount: 60.00,
    dueDate: "2023-09-05T00:00:00.000Z",
  },
];

const data: StatCardProps[] = [
  {
    title: 'Users',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Conversions',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

const TestGoals : Goal[] = [
  {
      "name": "Buy a Car",
      "cost": 20000,
      "paymentAmount": 1000,
      "progress": 5000,
      "date": "2025-12-31"
  },
  {
      "name": "Buy PS5",
      "cost": 500,
      "paymentAmount": 20,
      "progress": 140,
      "date": "2025-12-31"
  },
  {
      "name": "Student Loan",
      "cost": 20000,
      "paymentAmount": 150,
      "progress": 5000,
      "date": "2025-12-31"
  }
]


export default function MainGrid() {
//
const [sessionId, setSessionId] = useState<number | null>(null);
  const [curUserData, setCurUserData] = useState<UserData>({
    income: 0,
    currentBalance: 0,
    expenses: [],
    goals: [],
    Debt: [],
  });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Initialize individual refs for each card
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
    setActiveCard((prevIndex) => (prevIndex === cardIndex ? cardIndex : cardIndex));
  };

  


  const goals = curUserData?.goals || [];
  const expenses = curUserData?.expenses || [];

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle click outside to collapse card
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cardRefs.current.every(
          (ref) => ref && !ref.contains(event.target as Node)
        )
      ) {
        setActiveCard(null); // Close the card if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  console.log("Current User Data:", curUserData);
////////////////////
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
          <p>card here</p>  
          </Grid>
        ))}
        <Grid item xs={12} sm={6} lg={3}>
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

            <ExpandableCard
            title="Income"
            index={2} // Unique index for the Income card
            onClick={() => handleCardClick(2)}
            isActive={activeCard === 2}
            componentCollapsed={<p>Your total income: ${curUserData.income}</p>}

            componentExpanded={
              <div className="flex">
                {/* Left Section: Income Details */}
                <div className="w-1/2">
                  <p className="text-lg font-medium">
                    Your current income is: ${curUserData.income}
                  </p>
                </div>

                {/* Right Section: Add Income Form */}
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
        <Grid  className = ""size={{ xs: 12, md: 6 }}>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
        <ExpandableCard
            title="Goals"
            index={0}
            onClick={() => handleCardClick(0)}
            isActive={activeCard === 0}
            componentCollapsed={<ViewGoals goals={TestGoals} />}
            componentExpanded={<AddGoal userId={null} onGoalAdded={fetchUserData }  />}
            // Pass the specific ref for each card
            cardRef={(el) => (cardRefs.current[0] = el)}
          />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
         
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
