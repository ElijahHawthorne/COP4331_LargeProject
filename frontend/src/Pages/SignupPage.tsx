import PageTitle from "../components/PageTitle.tsx";
import Signup from "../components/Signup.tsx";

function SignUpPage() {
    return (
        <div className="flex flex-col bg-[hsl(194,62.9%,67.3%)] items-center justify-center min-h-screen">
            <PageTitle />
            <Signup />
        </div>
    );
}

export default SignUpPage;