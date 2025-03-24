import React, { useState } from "react";

function SetStartFunds() {
  const [startFunds, setFunds] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const app_name = "777finances.com";
  function buildPath(route: string): string {
    if (process.env.NODE_ENV !== "development") {
      return "http://" + app_name + ":5000/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }

  let _ud: any = localStorage.getItem("user_data");
  let ud = JSON.parse(_ud);
  let userId: string = ud.id;

  async function setStartFunds(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const obj = { userId, startFunds };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch(buildPath("api/setstartfunds"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json();

      if (res.success) {
        setMessage("Funds set successfully!");
      } else {
        setMessage("Failed to set funds: " + res.error);
      }
    } catch (error: any) {
      setMessage("An error occurred: " + error.toString());
    }
  }

  function handleStartFundsChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setFunds(parseFloat(e.target.value));
  }

  return (
    <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Set initial funds</h2>
      <form onSubmit={setStartFunds} className="w-full">
        <input
          type="number"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          placeholder="Enter initial funds"
          value={startFunds}
          onChange={handleStartFundsChange}
        />
        <button
          type="submit"
          className="bg-accent text-white py-2 px-4 rounded hover:bg-orange w-full"
        >
          Set Funds
        </button>
      </form>
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
}

export default SetStartFunds;