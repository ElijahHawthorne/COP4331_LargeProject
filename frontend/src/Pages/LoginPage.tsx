import PageTitle from "../components/PageTitle.tsx";
import Login from "../components/Login.tsx";
const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#D6536D] flex items-center justify-center">
      <div>
        <PageTitle />
        <Login />
      </div>
    </div>
  );
};
export default LoginPage;
