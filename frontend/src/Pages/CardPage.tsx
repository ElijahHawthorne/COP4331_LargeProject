// import PageTitle from "../components/PageTitle";
// import LoggedInName from "../components/LoggedInName";
// import SideBar from "../components/SideBar";
// //import CardUI from "../components/CardUI";
// const CardPage = () => {
//   return (
//     <div className="App">
//       <SideBar />
//       {/* <LoggedInName /> Add logout button to sidebar*/}
//     </div>
//   );
// };
// export default CardPage;
//
//Just saved this before adding all the extra cards
//*************************************************************************************************** */
import { useState, useEffect } from "react";
import PageTitle from "../components/PageTitle";
import LoggedInName from "../components/LoggedInName";
import SideBar from "../components/SideBar";
import AddExpenses from "../components/AddExpense";
import ViewExpense from "../components/ViewExpense";

function CardPage() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [curUserExpenses, setCurUserExpenses] = useState([]);

  const [error, setError] = useState("");

  // Fetch sessionId from localStorage
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
      fetchExpenses();
    }
  }, [sessionId]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://777finances.com:5000/api/getexpenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: sessionId }),
      });

      const data = await response.json();
      setCurUserExpenses(data.expenses);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
      
    }
  };

  // Function to trigger a re-fetch of expenses
  const handleRerender = () => {
    
    fetchExpenses(); // Re-fetch the expenses
  };

  

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-screen flex">
      <SideBar />
      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Card 1</h2>
            <AddExpenses onRerender={handleRerender} /> {/* Pass rerender function to AddExpenses */}
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Card 2</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Profit and Loss</h2>
            <ViewExpense expenseList={curUserExpenses} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Revenue & Expenses Over Time</h2>
            <p>Content goes here...</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CardPage;
