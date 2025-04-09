import React, { useState, useEffect } from "react";
import { PieChart } from '@mui/x-charts';
import { useExpenses } from "../hooks/useExpenses";

function CategoryChart() {

    const app_name = "777finances.com";
    function buildPath(route) {
        if (process.env.NODE_ENV !== "development") {
            return "http://" + app_name + ":5000/" + route;
        } else {
            return "http://localhost:5000/" + route;
        }
    }

    let _ud = localStorage.getItem("user_data");
    let ud = JSON.parse(_ud);
    let userId = ud.id;

    const { expenses, error } = useExpenses(userId);

    return (
        <div className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md">
            <PieChart
                series={[
                    {
                        data: expenses.map((expense, index) => ({
                            id: index,
                            value: expense.cost,
                            label: expense.name
                        })),
                    },
                ]}
                width={400}
                height={200}
            />
        </div>
    );
}

export default CategoryChart;