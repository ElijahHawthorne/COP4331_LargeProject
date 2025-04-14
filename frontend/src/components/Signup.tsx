import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

function Signup() {
  const navigate = useNavigate(); // Get the navigate function

  const [message, setMessage] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState(""); // User entered confirmation code
  const [generatedCode, setGeneratedCode] = useState(""); // The randomly generated code
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Control the dialog visibility
  const [isSendingEmail, setIsSendingEmail] = useState(false); // Loading state for sending email
  const [emailSent, setEmailSent] = useState(false); // Track if the email is sent successfully
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

  const generateRandomString = (): string => {
    return Math.random().toString(36).substr(2, 12); // Generate a random 12-character string
  };

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
  
    if (!validateEmail(email)) {
      setSignupSuccess(false);
      setMessage("Invalid email format");
      return;
    }
  
    if (!validatePassword(signupPassword)) {
      setSignupSuccess(false);
      setMessage(
        "Password must be at least 8 characters long, contain an uppercase letter, a number, and a special character."
      );
      return;
    }
  
    if (signupPassword !== confirmPassword) {
      setSignupSuccess(false);
      setMessage("Passwords do not match");
      return;
    }
  
    // 🔍 Check for existing username and email
    try {
      const [usernameRes, emailRes] = await Promise.all([
        fetch("http://777finances.com:5000/api/searchUserByUsername", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: signupName }),
        }),
        fetch("http://777finances.com:5000/api/searchUserByEmail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        }),
      ])
  
      const usernameData = await usernameRes.json();
      const emailData = await emailRes.json();
  
      if (usernameData.success === true) {
        setSignupSuccess(false);
        setMessage("Username is already taken.");
        return;
      }
  
      if (emailData.success === true) {
        setSignupSuccess(false);
        setMessage("Email is already in use.");
        return;
      }
    } catch (err) {
      console.error("Error checking username/email:", err);
      setSignupSuccess(false);
      setMessage("Server error while validating username or email.");
      return;
    }
  
    // ✅ Passed all checks
    const randomString = generateRandomString();
    setGeneratedCode(randomString);
    setIsDialogOpen(true);
  
    try {
      setIsSendingEmail(true);
      const response = await fetch("http://777finances.com:5000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: email,
          subject: "Email Validation Code",
          message: `Please use the verification code to validate your email: ${randomString}. This code will expire in 10 minutes.`,
        }),
      });
  
      const result = await response.json();
      if (result.success) {
        setEmailSent(true);
        setMessage("Please check your email for the confirmation code.");
      } else {
        setMessage("Failed to send email. Please try again.");
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      setMessage("Error sending email. Please try again later.");
    } finally {
      setIsSendingEmail(false);
    }
  }

  // Handle the confirmation code input change
  function handleConfirmationCodeChange(e: any): void {
    setConfirmationCode(e.target.value);
  }

  // Handle dialog submission to check the confirmation code
  async function handleConfirmationCodeSubmit(): Promise<void> {
    if (confirmationCode === generatedCode) {
      // If the confirmation code matches, proceed with signup
      await finalizeSignup();
    } else {
      setMessage("Invalid confirmation code. Please try again.");
    }
  }

  // Finalize signup after successful confirmation
  async function finalizeSignup() {
    const obj = {
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
        console.log(initUser);
        setSignupSuccess(true);
        setMessage("Signup successful! Redirecting to login...");

        setTimeout(() => {
          navigate("/login"); // Use navigate function to redirect
        }, 2000);
      } else {
        setSignupSuccess(false);
        setMessage(res.error || "Signup failed. Please try again.");
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

  // Reset dialog states when closing the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    // Reset states to restart the process
    setGeneratedCode("");
    setConfirmationCode("");
    setEmailSent(false);
    setMessage("");
  };

  return (
    <div
      id="signupDiv"
      className="mt-4 flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-[70%] " style={{height: "65vh", width: "35vw"}}
    >
      <span id="inner-title" className="text-3xl font-bold mb-6" style={{paddingBottom: "1.5rem",}}>
        PLEASE SIGN UP
      </span>
      <br />
      <input
        type="text"
        className="w-[50%] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" style={{ marginBottom: "1rem" }}
        id="firstName"
        placeholder="First Name"
        onChange={handleSetFirstName}
      />
      <br />
      <input
        type="text"
        className="w-[50%] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" style={{ marginBottom: "1rem" }}
        id="lastName"
        placeholder="Last Name"
        onChange={handleSetLastName}
      />
      <br />
      <input
        type="email"
        className="w-[50%] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" style={{ marginBottom: "1rem" }}
        id="email"
        placeholder="Email"
        onChange={handleSetEmail}
      />
      <br />
      <input
        type="text"
        className="w-[50%] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" style={{ marginBottom: "1rem" }}
        id="signupName"
        placeholder="Username"
        onChange={handleSetSignupName}
      />
      <br />
      <input
        type="password"
        className="w-[50%] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" style={{ marginBottom: "1rem" }}
        id="signupPassword"
        placeholder="Password"
        onChange={handleSetPassword}
      />
      <br />
      <input
        type="password"
        className="w-[50%] bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500" style={{ marginBottom: "1rem" }}
        id="confirmPassword"
        placeholder="Confirm Password"
        onChange={handleSetConfirmPassword}
      />
      <br />
      <input
        type="submit"
        id="signupButton"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-[60%]" style={{ marginBottom: "1rem", marginTop: "1rem" }}
        value="Sign Up"
        onClick={doSignup}
      />
      <p className="text-black" style={{ padding: "1rem" }}>
        Already have an account?{" "}
        <a className="text-blue-500 underline" href="#" onClick={goToLogin}>
          Log in
        </a>{" "}
        here.
      </p>
      {(message && !isDialogOpen) && (
        <div className="w-full mt-4">
          <div className="p-2">
            <Alert severity={SignupSuccess ? "success" : "error"}>
              {message}
            </Alert>
          </div>
        </div>
      )}

      {/* Email Confirmation Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Email Confirmation</DialogTitle>
        <DialogContent>
          {isSendingEmail ? (
            <CircularProgress />
          ) : (
            <>
              {emailSent ? (
                <Typography>
                  A confirmation email has been sent to {email}. Please check
                  your inbox to complete your registration.
                </Typography>
              ) : (
                <Typography>
                  We are sending you a confirmation email. Please check your
                  inbox.
                </Typography>
              )}
              {emailSent && (
                <TextField
                  label="Enter Confirmation Code"
                  variant="outlined"
                  value={confirmationCode}
                  onChange={handleConfirmationCodeChange}
                  fullWidth
                />
              )}
            </>
          )}
        </DialogContent>
        {(message && isDialogOpen) && (
                  <div className="w-full mt-4">
                  <div className="p-2">
                    <Alert severity={SignupSuccess ? "success" : "error"}>
                      {message}
                    </Alert>
                  </div>
                </div>
              )}
        <DialogActions>
          <Button onClick={handleConfirmationCodeSubmit} color="primary">
            Submit
          </Button>
          <Button onClick={handleDialogClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Signup;
