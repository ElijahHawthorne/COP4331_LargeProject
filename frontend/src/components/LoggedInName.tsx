import { useNavigate } from "react-router-dom";

function LoggedInName() {
  //var user={}
  const navigate = useNavigate();

  function doLogout(event: any): void {
    event.preventDefault();

    navigate("/");
  }
  return (
    <div id="loggedInDiv">
      <span id="userName"></span>
      <br />
      <button
        type="button"
        id="logoutButton"
        className="bg-accent text-white py-2 px-4 rounded hover:bg-orange w-full"
        onClick={doLogout}
      >
        {" "}
        Log Out{" "}
      </button>
    </div>
  );
}
export default LoggedInName;
