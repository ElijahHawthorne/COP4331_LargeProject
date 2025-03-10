import PageTitle from '../components/PageTitle.tsx';
import Login from '../components/Login.tsx';
import Signup from '../components/Signup.tsx';

const LoginPage = () => {
    return (
        <div className="login-content">
            <PageTitle />
            <Login />
            <Signup />
        </div>
    );
};

export default LoginPage;
