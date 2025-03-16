import PageTitle from "../components/PageTitle";
import LoggedInName from "../components/LoggedInName";
import AddExpenses from "../components/AddExpenses";
import ViewExpense from "../components/ViewExpense";
//import CardUI from "../components/CardUI";
const CardPage = () => {
  return (
    <div>
      <PageTitle />
      <LoggedInName />
      <AddExpenses />
      <ViewExpense />

    </div>
  );
};
export default CardPage;
