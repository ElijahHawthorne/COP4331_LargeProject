import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,Box, Alert
} from "@mui/material";

interface PasswordChangeDialogProps {
  userEmail: string;
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

const PasswordChangeDialog: React.FC<PasswordChangeDialogProps> = ({
  userEmail,
  open,
  onClose,
  userId,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(""); // Store generated code

  // Function to generate a random 6-character verification code
  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 8); // Generate random 6-char string
    setGeneratedCode(code); // Store the generated code
    return code;
  };

  // Function to handle sending email
  const handleSendVerificationCode = async () => {
    const code = generateVerificationCode(); // Generate the verification code

    try {
      const response = await fetch(
        "http://777finances.com:5000/api/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail: userEmail, // Using userEmail passed as a prop
            subject: "Password Change Verification Code",
            message: `Please use the verification code to change your password: ${code}. This code will expire in 10 minutes.`,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setCodeSent(true); // Code successfully sent
        setError("");
      } else {
        setError(data.error || "Failed to send verification code");
      }
    } catch (err) {
      setError("Error sending verification code");
    }
  };

  // Function to handle verification of the code
  const handleVerifyCode = () => {
    if (verificationCode === generatedCode) {
      setCodeVerified(true); // Code verified, now allow password change
      setError("");
    } else {
      setError("Invalid verification code");
    }
  };

  // Function to handle password change
  const handlePasswordChange = async () => {
    if (newPassword === confirmNewPassword) {
      try {
        const response = await fetch(
          "http://777finances.com:5000/api/updatepassword",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId, newPassword: newPassword }),
          }
        );

        const data = await response.json();
        if (data.success) {
            setError("Password changed successfully");
            
            // Wait 1 second before closing the dialog
            setTimeout(() => {
              onClose();
            }, 1000);
         
        } else {
          setError(data.error || "Failed to change password");
        }
      } catch (err) {
        setError("Error changing password");
      }
    } else {
      setError("Passwords must match!");
    }
  };

  // Reset all the state variables when the dialog is closed
  const handleClose = () => {
    setVerificationCode("");
    setNewPassword("");
    setError("");
    setCodeSent(false);
    setCodeVerified(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Password</DialogTitle>
      <DialogContent>
        {!codeSent ? (
          <>
            <Typography variant="body1" gutterBottom>
              Enter your email to receive a verification code.
            </Typography>
            <Button onClick={handleSendVerificationCode} color="primary">
              Send Verification Code
            </Button>
          </>
        ) : !codeVerified ? (
            <Box
            sx={{
              width: "30vw",
              maxWidth: "100%",
              margin: "0 auto",
              height: "30vh", // 60% of the viewport height
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" gutterBottom>
              Enter the verification code sent to {userEmail}.
            </Typography>
          
            <TextField
              label="Verification Code"
              fullWidth
              variant="outlined"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
          
            <Button onClick={handleVerifyCode} color="primary">
              Verify Code
            </Button>
          
            {/* Reserved space for error message */}
            <Box sx={{ mt: 4, minHeight: "60px" }}>
              {error && (
                <Alert severity="error">{error}</Alert>
              )}
            </Box>
          </Box>
          
        ) : (
            <Box
            sx={{
              width: "30vw",
              maxWidth: "100%",
              margin: "0 auto",
              height: "30vh", // 60% of the viewport height
              overflowY: "auto", // enables scrolling if content overflows
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // vertically center content
            }}
          >
            <Typography variant="body1" gutterBottom>
              Enter a new password.
            </Typography>
            <TextField
              label="New Password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
            <Typography variant="body1" gutterBottom>
              Confirm new password.
            </Typography>
            <TextField
              label="Confirm New Password"
              fullWidth
              variant="outlined"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              sx={{ marginBottom: 2 }}
            />
           
            <Button onClick={handlePasswordChange} color="primary">
              Change Password
            </Button>

            <Box sx={{ mt: 4, minHeight: "60px" }}>
              {error && (
                <Alert severity={error === "Password changed successfully" ? "success" : "error"}>{error}</Alert>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeDialog;