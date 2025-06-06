import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate(); // Get the navigate function

  const [message, setMessage] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Regex for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Regex for password validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Email validation function
  function validateEmail(email: string): boolean {
    return emailRegex.test(email);
  }

  // Password validation function
  function validatePassword(password: string): boolean {
    return passwordRegex.test(password);
  }

  async function doSignup(event: any): Promise<void> {
    event.preventDefault();

    // Validate email
    if (!validateEmail(email)) {
      setMessage("Invalid email format.");
      return;
    }

    // Validate password
    if (!validatePassword(signupPassword)) {
      setMessage(
        "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character."
      );
      return;
    }

    let obj = {
      login: signupName, // Matching API field name
      password: signupPassword,
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    var js = JSON.stringify(obj);

    try {
      const response = await fetch("http://777finances.com:5000/api/signup", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      var res = JSON.parse(await response.text());

      if (res.success) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login"); // Use navigate function to redirect
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

  function goToLogin() {
    navigate("/"); // Use navigate function to go to login page
  }

  return (
    <div
      id="signupDiv"
      className="mt-4 flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-full max-w-md"
    >
      <span id="inner-title" className="text-3xl font-bold mb-6">
        PLEASE SIGN UP
      </span>
      <br />
      <input
        type="text"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        id="firstName"
        placeholder="First Name"
        onChange={handleSetFirstName}
      />
      <br />
      <input
        type="text"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        id="lastName"
        placeholder="Last Name"
        onChange={handleSetLastName}
      />
      <br />
      <input
        type="email"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        id="email"
        placeholder="Email"
        onChange={handleSetEmail}
      />
      <br />
      <input
        type="text"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        id="signupName"
        placeholder="Username"
        onChange={handleSetSignupName}
      />
      <br />
      <input
        type="password"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        id="signupPassword"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br />
      <input
        type="submit"
        id="signupButton"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
        value="Sign Up"
        onClick={doSignup}
      />
      <p>
        Already have an account?{" "}
        <a className="text-blue-500 underline" href="#" onClick={goToLogin}>
          Log in
        </a>{" "}
        here.
      </p>
      <span id="signupResult">{message}</span>
    </div>
  );
}

export default Signup;
