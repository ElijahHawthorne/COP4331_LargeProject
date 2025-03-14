import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setPassword] = useState("");

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();  // Prevent form default submission behavior

    // Check if either loginName or loginPassword is empty
    if (!loginName || !loginPassword) {
      setMessage("Please enter both username and password.");
      return; // Exit the function early if any field is empty
    }

    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch("http://777finances.com:5000/api/login", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });

      const res = await response.json(); // Simplified parsing


      console.log('API Response:', res);

      if (res.id <= 0) {
        setMessage("User/Password combination incorrect");
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        
       navigate("/cards");
      }
    } catch (error: any) {
      setMessage("An error occurred. Please try again later.");
      console.error(error);  // Log for debugging
    }
  }

  function handleSetLoginName(e: any): void {
    setLoginName(e.target.value);
  }

  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  function goToSignup() {
    console.log("Going to signup Page");
    navigate("/signup");
  }

  return (
    <div
      id="loginDiv"
      className="bg-primary mt-4 flex flex-col items-center justify-center p-6 rounded shadow-md w-full max-w-md"
    >
      <span id="inner-title" className="text-3xl font-bold mb-6">
        PLEASE LOG IN
      </span>
      
      <form onSubmit={doLogin} className="w-full">
        <input
          type="text"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          id="loginName"
          placeholder="Username"
          value={loginName}
          onChange={handleSetLoginName}
        />
        <input
          type="password"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
          id="loginPassword"
          placeholder="Password"
          value={loginPassword}
          onChange={handleSetPassword}
        />
        <button
          type="submit"
          id="loginButton"
          className="bg-accent text-white py-2 px-4 rounded hover:bg-orange w-full"
        >
          Do It
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <a className="text-blue-500 underline" href="#" onClick={goToSignup}>
          Sign up
        </a>{" "}
        here.
      </p>

      {message && <span id="loginResult" className="text-red-500">{message}</span>}
    </div>
  );
}

export default Login;