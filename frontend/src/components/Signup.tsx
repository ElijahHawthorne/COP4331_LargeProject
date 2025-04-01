import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate(); // Get the navigate function

  const [message, setMessage] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [SignupSuccess, setSignupSuccess] = useState<boolean | null>(null);


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

    if (
      !signupName ||
      !signupPassword ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !email
    ) {
      setSignupSuccess(false);
      setMessage("All fields must be filled out");
      return;
    }


    // Validate email
    if (!validateEmail(email)) {
      setSignupSuccess(false);
      setMessage("Invalid email format");
      return;
    }
  
     // Validate password
     if (!validatePassword(signupPassword)) {
      setSignupSuccess(false);
      setMessage(
        "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character."
      );
      return;
    }


    // Check if password and confirm password match
    if (signupPassword !== confirmPassword) {
      setSignupSuccess(false);
      setMessage("Passwords do not match");

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
        //// Inititalize new user in data table

        var initBody = JSON.stringify({ userId: res.userId });
 
        const initUser = await fetch(
          "http://777finances.com:5000/api/datainit",
          {
            method: "POST",
            body: initBody,
            headers: { "Content-Type": "application/json" },
          }
        );



        ////



        setSignupSuccess(true);
        setMessage("Signup successful! Redirecting to login...");

        setTimeout(() => {
          navigate("/login"); // Use navigate function to redirect
        }, 2000);
        
      } else {
        setSignupSuccess(false);

        setMessage(res.error || "Signup failed. Please try again");
      }
    } catch (error: any) {
      setSignupSuccess(false);
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

  function handleSetConfirmPassword(e: any): void {
    setConfirmPassword(e.target.value);
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
      className="mt-4 flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-[70%]"
    >
      <span id="inner-title" className="text-3xl font-bold mb-6">
        PLEASE SIGN UP
      </span>
      <br />
      <input
        type="text"
        className="input-style"
        id="firstName"
        placeholder="First Name"
        onChange={handleSetFirstName}
      />
      <br />
      <input
        type="text"
        className="input-style"
        id="lastName"
        placeholder="Last Name"
        onChange={handleSetLastName}
      />
      <br />
      <input
        type="email"
        className="input-style"
        id="email"
        placeholder="Email"
        onChange={handleSetEmail}
      />
      <br />
      <input
        type="text"
        className="input-style"
        id="signupName"
        placeholder="Username"
        onChange={handleSetSignupName}
      />
      <br />
      <input
        type="password"
        className="input-style"
        id="signupPassword"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br />
      <input
        type="password"
        className="input-style"
        id="confirmPassword"
        placeholder="Confirm Password"
        onChange={handleSetConfirmPassword}
      />
      <br />
      <input
        type="submit"
        id="signupButton"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-[60%]"
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
      <span id="signupResult"
      
      className={`block mt-4 p-2 ${SignupSuccess ? 'text-black' : 'text-red-500'}`} 
      
      >{message}{(SignupSuccess === false) ? "!" : ""}
      </span>
    </div>
  );
}

export default Signup;
