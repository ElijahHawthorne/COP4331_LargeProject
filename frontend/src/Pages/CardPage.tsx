import PageTitle from "../components/PageTitle";
import LoggedInName from "../components/LoggedInName";
import AddExpenses from "../components/AddExpenses";
import AddIncomes from "../components/SetIncome";
import ViewExpense from "../components/ViewExpense";
import SetStartFunds from "../components/SetStartFunds";
import TotalAssets from "../components/TotalAssets";
//import CardUI from "../components/CardUI";
const CardPage = () => {
  return (
    <div>
      <PageTitle />
      <SetStartFunds />
      <AddExpenses />
      <LoggedInName />
      <AddIncomes />
      <ViewExpense />
      <TotalAssets />
    </div>
  );
};
export default CardPage;
