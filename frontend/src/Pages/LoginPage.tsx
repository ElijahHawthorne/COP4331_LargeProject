import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';
// import Signup from '../components/Signup.tsx';

const LoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white-100">
            <PageTitle />
            <Login />
            {/* <Signup /> */}
        </div>
    );
};

export default LoginPage;
