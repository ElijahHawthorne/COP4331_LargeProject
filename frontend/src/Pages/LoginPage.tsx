import PageTitle from "../components/PageTitle.tsx";
import Login from "../components/Login.tsx";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary">
      <PageTitle />
      <Login />
    </div>
  );
};

export default LoginPage;
