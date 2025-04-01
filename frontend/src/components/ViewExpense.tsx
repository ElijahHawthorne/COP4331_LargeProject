import React, { useState, useEffect } from "react";

interface Expense {
    name: string;
    cost: number;
  }
  
  interface ViewExpenseProps {
    expenseList: Expense[]; // Define the type for the expenseList prop
  }
  
  const ViewExpense: React.FC<ViewExpenseProps> = ({ expenseList }) => {
    return (
      <div className="overflow-y-auto">
        <div className="text-[30px]">Expense List</div>
        <ul>
          {expenseList.map((expense, index) => (
            <li key={index}>
              <strong>{expense.name}</strong>: ${expense.cost}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ViewExpense;
  