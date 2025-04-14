
import { useNavigate } from "react-router-dom";
import "../App.css";
import { SideBarData } from "./SideBarData";
import logo from "../assets/LBJlogo.png";
import UserProfile from "./UserProfile";

function SideBar() {
  const navigate = useNavigate();

  function handleLogout() {
    //To remove user data from local storage and go back to login
    localStorage.removeItem("user_data");
    navigate("/login");
  }

  return (
    <div className="SideBar">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="logo" />
      </div>

      <ul className="SideBarList">
        {SideBarData.map((val, key) => (
          <li
            key={key}
            className="row"
            onClick={() => {
              window.location.pathname = val.link;
            }}
          >
            <div id="icon">{val.icon}</div>
            <div id="title">{val.title}</div>
          </li>
        ))}
      </ul>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <UserProfile />
      <br/>
      <br/>
      {/* Logout Button */}
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
    </div>
  );
}

export default SideBar;
