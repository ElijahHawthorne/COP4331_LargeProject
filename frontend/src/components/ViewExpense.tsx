import { Expense } from "../Types";

interface ViewExpenseProps {
  expenseList?: Expense[]; // Make the prop optional
}

const ViewExpense: React.FC<ViewExpenseProps> = ({ expenseList = [] }) => {
  return (
    <div className="overflow-y-auto p-4">
      <div className="text-[30px] mb-4">Expense List</div>
      <ul className="flex flex-col gap-6">
        {expenseList.map((expense, index) => (
          <li
            key={index}
            className="text-lg font-medium text-gray-800 border-2 rounded-lg p-4"
          >
            <strong>{expense.name}</strong>: ${expense.cost}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewExpense;