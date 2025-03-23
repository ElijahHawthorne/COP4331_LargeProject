import PageTitle from "../components/PageTitle";
import LoggedInName from "../components/LoggedInName";
import SideBar from "../components/SideBar";
//import CardUI from "../components/CardUI";
const CardPage = () => {
  return (
    <div className="min-h-screen bg-[#EBE9E1] flex flex-col items-center justify-center">
      <PageTitle />
      <LoggedInName />
      <SideBar />
    </div>
  );
};
export default CardPage;
