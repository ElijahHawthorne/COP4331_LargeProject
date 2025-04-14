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
  const [generatedCode, setGeneratedCode] = useState("");

  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 8);
    setGeneratedCode(code);
    return code;
  };

  const handleSendVerificationCode = async () => {
    const code = generateVerificationCode();

    try {
      const response = await fetch(
        "http://777finances.com:5000/api/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail: userEmail, 
            subject: "Password Change Verification Code",
            message: `Please use the verification code to change your password: ${code}. This code will expire in 10 minutes.`,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setCodeSent(true);
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
      setCodeVerified(true);
      setError("");
    } else {
      setError("Invalid verification code");
    }
  };

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
              Click link below to receive verification code.
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
              height: "30vh", 
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
          
            <Box sx={{ mt: 4, minHeight: "60px" }}>
              {error && (
                <Alert severity="error">{error}</Alert>
              )}
            </Box>
          </Box>
          
        ) : (
            <Box
            sx={{
              paddingTop: 10,
              width: "30vw",
              maxWidth: "100%",
              margin: "0 auto",
              height: "30vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
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

            {error && (
            <Box sx={{ mt: 0 }}>
              <Alert severity={error === "Password changed successfully" ? "success" : "error"}>
                {error}
              </Alert>
            </Box>
        )}

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