import { useState } from "react";

import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

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
        
       navigate("/dashboard");
      }
    } catch (error: any) {
      setMessage("An error occurred. Please try again later.");
      console.error(error);
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
      className=" flex flex-col items-center justify-center bg-white rounded-lg shadow-md"
    >
      <span id="inner-title" className="text-3xl font-bold" style={{paddingTop: "1.5rem",
        paddingBottom: "0.5rem"
      }}>
        PLEASE LOG IN
      </span>
      <br />
      <input
        type="text"
        className="w-[50%] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
        id="loginName"
        placeholder="Username"
        onChange={handleSetLoginName}
      />
      <br />
      <input
        type="password"
        className="w-[50%] bg-transparent border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none transition-all duration-200 py-2"
        id="loginPassword"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br />
      <input
        type="submit"
        id="loginButton"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-[20%]"
        style={{marginTop: "1rem"}}
        value="Do It"
        onClick={doLogin}
      />
      <p className="text-black" style={{padding: "1rem"}}>
        Don't have an account?{" "}
        <a className="text-blue-500 underline" href="#" onClick={goToSignup}>
          Sign up
        </a>{" "}
        here.
      </p>
      <span
        id="loginResult"
        className="block mt-4 p-2 text-red-500"
      >
        {message}
      </span>
    </div>
  );
}

export default Login;