import "../App.css";
import logo from "../assets/logo.png";

function PageTitle() {
  return( 
  <div>
  
  <img src={logo} alt="Company Logo" className="logo" style={{ width: '10rem', height: '10rem' }} />
  
  <h1 className="title">777 Finances</h1>
  
  
  </div>
  );
}

export default PageTitle;
