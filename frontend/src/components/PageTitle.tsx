
import logo from '../assets/LargeProjLogo.png'; // Ensure the path and extension are correct

function PageTitle() {
  return (
    <div className="flex items-center -mb-1 bg-accent rounded-lg ultra-regular -p-0 ">
    <img src={logo} alt="Logo" className=" bg-accent h-40 -mr-10 rounded-lg" /> {/* Adjust size as needed */}
    <h1 className="text-4xl font-extrabold leading-none tracking-tight text-black md:text-5xl lg:text-6xl  p-6">
      Finances
    </h1>
  </div>
  );
}

export default PageTitle;
