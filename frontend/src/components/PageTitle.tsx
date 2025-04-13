import "../App.css";
import logo from "../assets/logo.png";

function PageTitle() {
  return( 
  <div>
  
  <img src={logo} alt="Company Logo" className="logo" style={{ width: '10rem', height: '10rem', borderRadius: "2.5rem"}} />
  
  
  </div>
  );
}

export default PageTitle;
