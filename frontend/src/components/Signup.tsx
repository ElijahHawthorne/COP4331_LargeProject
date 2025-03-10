import React, { useState } from "react";

function Signup() {
    const app_name = "777finances.com";

    function buildPath(route: string): string {
        if (process.env.NODE_ENV !== "development") {
            return "http://" + app_name + ":5000/" + route;
        } else {
            return "http://localhost:5000/" + route;
        }
    }

    const [message, setMessage] = useState("");
    const [signupName, setSignupName] = React.useState("");
    const [signupPassword, setPassword] = React.useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    async function doSignup(event: any): Promise<void> {
        event.preventDefault();

        var obj = {
            login: signupName, // Matching API field name
            password: signupPassword,
            firstName: firstName,
            lastName: lastName,
            email: email,
        };

        var js = JSON.stringify(obj);

        try {
            const response = await fetch(buildPath("api/signup"), {
                method: "POST",
                body: js,
                headers: { "Content-Type": "application/json" },
            });

            var res = JSON.parse(await response.text());

            if (res.success) {
                setMessage("Signup successful! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            } else {
                setMessage(res.error || "Signup failed. Please try again.");
            }
        } catch (error: any) {
            alert(error.toString());
            return;
        }
    }

    function handleSetSignupName(e: any): void {
        setSignupName(e.target.value);
    }
    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }
    function handleSetFirstName(e: any): void {
        setFirstName(e.target.value);
    }
    function handleSetLastName(e: any): void {
        setLastName(e.target.value);
    }
    function handleSetEmail(e: any): void {
        setEmail(e.target.value);
    }

    return (
        <div id="signupDiv">
            <span id="inner-title">PLEASE SIGN UP</span>
            <br />
            <input
                type="text"
                id="firstName"
                placeholder="First Name"
                onChange={handleSetFirstName}
            />
            <br />
            <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                onChange={handleSetLastName}
            />
            <br />
            <input
                type="email"
                id="email"
                placeholder="Email"
                onChange={handleSetEmail}
            />
            <br />
            <input
                type="text"
                id="signupName"
                placeholder="Username"
                onChange={handleSetSignupName}
            />
            <br />
            <input
                type="password"
                id="signupPassword"
                placeholder="Password"
                onChange={handleSetPassword}
            />
            <br />
            <input
                type="submit"
                id="signupButton"
                className="buttons"
                value="Sign Up"
                onClick={doSignup}
            />
            <span id="signupResult">{message}</span>
        </div>
    );
}

export default Signup;
