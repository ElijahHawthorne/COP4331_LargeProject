import PageTitle from "../components/PageTitle.tsx";
import Signup from "../components/Signup.tsx";

function SignUpPage() {
    return (
        <div className="flex flex-col  bg-white items-center justify-center min-h-screen">
            <PageTitle />
            <Signup />
        </div>
    );
}

export default SignUpPage;