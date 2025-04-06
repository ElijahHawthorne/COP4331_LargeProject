//import React, { useState } from "react";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {
  // const app_name = "777finances.com";
  const navigate = useNavigate(); // Get the navigate function

  const [message, setMessage] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setPassword] = useState("");

  async function doLogin(event: any): Promise<void> {
    console.log("dologin...");
    event.preventDefault();
    const obj = { login: loginName, password: loginPassword };
    const js = JSON.stringify(obj);

    try {
      const response = await fetch("http://777finances.com:5000/api/login", {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      let res = JSON.parse(await response.text());

      console.log(res);

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

  /*Primary: E43D12

Secondary: D6536D

Accent: FFA2B6

Highlight: EFB11D

Background: EBE9E1*/

  return (
    <div
      id="loginDiv"
      className="mt-4 flex flex-col items-center justify-center bg-white p-6 rounded shadow-md"
    >
      <span id="inner-title" className="text-3xl font-bold mb-6">
        PLEASE LOG IN
      </span>
      <br />
      <input
        type="text"
        className="input-style"
        id="loginName"
        placeholder="Username"
        onChange={handleSetLoginName}
      />
      <br />
      <input
        type="password"
        className="input-style"
        id="loginPassword"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br />
      <input
        type="submit"
        id="loginButton"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-[60%]"
        value="Do It"
        onClick={doLogin}
      />
      <p className="text-black">
        Don't have an account?{" "}
        <a className="text-blue-500 underline" href="#" onClick={goToSignup}>
          Sign up
        </a>{" "}
        here.
      </p>
      <span
        id="loginResult"
        className="block mt-4 p-2 text-red-500" // You can adjust the color based on success/error
      >
        {message}
      </span>
    </div>
  );
}

export default Login;