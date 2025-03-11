import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Login() {
  const app_name = "777finances.com";
  const navigate = useNavigate(); // Get the navigate function

  function buildPath(route: string): string {
    if (process.env.NODE_ENV !== "development") {
      return "http://" + app_name + ":5000/" + route;
    } else {
      return "http://localhost:5000/" + route;
    }
  }

  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setPassword] = useState("");

  async function doLogin(event: any): Promise<void> {
    event.preventDefault();
    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("api/login"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      let res = JSON.parse(await response.text());
      if (res.id <= 0) {
        setMessage("User/Password combination incorrect");
      } else {
        const user = {
          firstName: res.firstName,
          lastName: res.lastName,
          id: res.id,
        };
        localStorage.setItem("user_data", JSON.stringify(user));
        setMessage("");
        window.location.href = "/cards";
      }
    } catch (error: any) {
      alert(error.toString());
      return;
    }
  }

  function handleSetLoginName(e: any): void {
    setLoginName(e.target.value);
  }
  function handleSetPassword(e: any): void {
    setPassword(e.target.value);
  }

  function goToSignup() {
    navigate("/signup"); // Use the navigate function to go to the signup page
  }

  return (
    <div id="loginDiv" className="mt-4 flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-full max-w-md">
      <span id="inner-title" className="text-3xl font-bold mb-6">PLEASE LOG IN</span>
      <br />
      <input
        type="text"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        id="loginName"
        placeholder="Username"
        onChange={handleSetLoginName}
      />
      <br />
      <input
        type="password"
        className="mb-4 p-2 border border-gray-300 rounded w-full"
        id="loginPassword"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br />
      <input
        type="submit"
        id="loginButton"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
        value="Do It"
        onClick={doLogin}
      />
      <p>Don't have an account? <a className="text-blue-500 underline"href="#" onClick={goToSignup}>Sign up</a> here.</p>
      <span id="loginResult">{message}</span>
    </div>
  );
}

export default Login;
