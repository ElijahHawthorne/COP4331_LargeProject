import PageTitle from "../components/PageTitle";
import Signup from "../components/Signup";

function SignUpPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white-100">
            <PageTitle />
            <Signup />
        </div>
    );
}

export default SignUpPage;