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

import PageTitle from "../components/PageTitle";
import LoggedInName from "../components/LoggedInName";
import SideBar from "../components/SideBar";

function CardPage() {
  return (
    <div className="h-screen flex">
      <SideBar />
      {/*Main Content*/}
      <main className="flex-1 p-6">
        {/*4 cards side by side */}
        <div className="grid grid-cols-4 gap-4 mb-6 mt-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Card 1</h2>
            <p>Content goes here...</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Card 2</h2>
            <p>Content goes here...</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Card 3</h2>
            <p>Content goes here...</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Card 4</h2>
            <p>Content goes here...</p>
          </div>
        </div>

        {/* Bottom row: 2 wider cards side by side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-bold">Profit and Loss</h2>
            <p>Content goes here...</p>
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

