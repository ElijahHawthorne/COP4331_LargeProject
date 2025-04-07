import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard, { StatCardProps } from './StatCard';
import ExpandableCard from '../../components/ExpandableCard';
import ViewGoals from '../../components/ViewGoals';
import AddGoal from '../../components/AddGoal';
import UpcomingExpensesCard from '../../components/UpcomingExpenses';
import { UserData } from "../../Types";
import { useState, useEffect, useRef} from 'react';

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
//
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
            <ExpandableCard
            title="goals"
            index={0}
            onClick={() => handleCardClick(0)}
            isActive={activeCard === 0}
            componentCollapsed={<ViewGoals goals={goals} />}
            componentExpanded={<AddGoal userId={null} onGoalAdded={fetchUserData }  />}
            // Pass the specific ref for each card
            cardRef={(el) => (cardRefs.current[0] = el)}
          />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} lg={3}>
          <UpcomingExpensesCard expenses={sampleExpenses} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Details
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <CustomizedDataGrid />
        </Grid>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
            <CustomizedTreeView />
            <ChartUserByCountry />
          </Stack>
        </Grid>
      </Grid>
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
