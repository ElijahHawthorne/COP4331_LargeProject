import PageTitle from "../components/PageTitle.tsx";
import Signup from "../components/Signup.tsx";

function SignUpPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white-100">
            <PageTitle />
            <Signup />
        </div>
    );
}

export default SignUpPage;