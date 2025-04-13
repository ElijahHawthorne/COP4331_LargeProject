import PageTitle from "../components/PageTitle.tsx";
import Login from "../components/Login.tsx";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      {/* Page Title */}
      <PageTitle />

      {/* Login Card */}
      <div className="w-full h-1/3 max-w-md bg-white p-6 rounded shadow-lg">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
