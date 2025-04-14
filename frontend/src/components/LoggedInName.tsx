import { useNavigate } from "react-router-dom";

function LoggedInName() {
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
        className="buttons"
        onClick={doLogout}
      >
        {" "}
        Log Out{" "}
      </button>
    </div>
  );
}
export default LoggedInName;
