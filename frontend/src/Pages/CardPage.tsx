import PageTitle from "../components/PageTitle";
import LoggedInName from "../components/LoggedInName";
import AddExpenses from "../components/AddExpenses";
import AddIncomes from "../components/SetIncomeFuture";
import ViewExpense from "../components/ViewExpense";
import SetStartFunds from "../components/SetStartFunds";
import CategoryChart from "../components/CategoryChart";
import TotalAssets from "../components/TotalAssets";
import TimeChart from "../components/TimeChart";
import CurFundChart from "../components/curFundChart";
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
      <CategoryChart />
      <TimeChart />
      <CurFundChart />
    </div>
  );
};
export default CardPage;
