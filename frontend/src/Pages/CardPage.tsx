import React, { useState, useEffect, useRef } from "react";
import SideBar from "../components/SideBar";
import ExpandableCard from "../components/ExpandableCard";
import ViewGoals from "../components/ViewGoals";
import AddGoal from "../components/AddGoal";
import { UserData } from "../Types";

function CardPage() {
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

  return (
    <div className="h-screen flex">
      <SideBar />

      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
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

          <ExpandableCard
            title="Expenses"
            index={1}
            onClick={() => handleCardClick(1)}
            isActive={activeCard === 1}
            componentCollapsed={<p>Click to view your expenses</p>}
            componentExpanded={<ViewGoals goals={goals} />}
            // Pass the specific ref for each card
            cardRef={(el) => (cardRefs.current[1] = el)}
          />
        </div>
      </main>
    </div>
  );
}

export default CardPage;
