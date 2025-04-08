// src/types/types.ts
export interface Goal {
    name: string;
    cost: number;
    paymentAmount: number;
    progress: number;
    date: string;
  }
  
  export interface Debt {
    name: string;
    amount: number;
    paymentAmount: number;
    progress: number;
    date: string;
  }


  export interface Expense {
    name: string;
    cost: number;
    category: string;
    date: string;
  }
  
  export interface UserData {
    income: number;
    currentBalance: number;
    expenses: Expense[];
    goals: Goal[];
    debt: Debt[];
  }
  