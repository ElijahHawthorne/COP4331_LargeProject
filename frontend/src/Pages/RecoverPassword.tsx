import { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RecoveryPage: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [userId, setUserId] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  };

  const validatePassword = (pw: string) => {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/.test(
      pw
    );
  };

  const handleEmailSubmit = async () => {
    setError("");
    try {
      const response = await fetch(
        "http://777finances.com:5000/api/searchUserByEmail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      console.log(email);
      const result = await response.json();

      if (result.success) {
        setUserId(result.userId);
        const generatedCode = generateCode();
        setCodeSent(generatedCode);

        // Send the code
        await fetch("http://777finances.com:5000/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail: email,
            subject: "Your Account Recovery Verification Code",
            message: `Your verification code is: ${generatedCode}`,
          }),
        });

        setStep(2);
      } else {
        setError("No user found with that email.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  const handleCodeSubmit = () => {
    if (codeInput === codeSent) {
      setStep(3);
    } else {
      setError("Incorrect code. Please check your email and try again.");
    }
  };

  const handlePasswordSubmit = async () => {
    setError("");
    if (!validatePassword(password)) {
      return setError(
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
      );
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await fetch(
        "http://777finances.com:5000/api/updatepassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            newPassword: password,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setSuccess("Password updated successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to update password. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        mt: 10,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 2,
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Account Recovery
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {step === 1 && (
        <>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" onClick={handleEmailSubmit}>
            Send Verification Code
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <TextField
            fullWidth
            label="Verification Code"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" onClick={handleCodeSubmit}>
            Verify Code
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant="contained" onClick={handlePasswordSubmit}>
            Reset Password
          </Button>
        </>
      )}
    </Box>
  );
};

export default RecoveryPage;
