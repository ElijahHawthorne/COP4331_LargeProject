import React, { useState, useEffect } from "react";
import { Button, Typography, TextField, Box, Stack, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the back arrow icon
import { useNavigate } from "react-router-dom";
import NewAvatar from "../dashboard/components/NewAvatar";
import PasswordChangeDialog from "../dashboard/components/PasswordChangeDialogue";

interface Data {
  _id: string;
  UserId: number;
  Login: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Email: string;
}

interface UserData {
  success: boolean;
  user: Data;
}

const AccountSettings = () => {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentFirstname, setCurrentFirstname] = useState<string | null>(null);
  const [currentLastname, setCurrentLastname] = useState<string | null>(null);
  const [userData, setUserData] = useState<Data | null>(null); // State to store the fetched user data
  const [error, setError] = useState<string>(''); // State to handle errors
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility
  const [newPassword, setNewPassword] = useState<string>(''); // State for new password input
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setSessionId(userData.id);
        setCurrentFirstname(userData.firstName);
        setCurrentLastname(userData.lastName);
        console.log("UserData:", userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (sessionId !== null) { // Only fetch user data once sessionId is available
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://777finances.com:5000/api/getinfo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: sessionId }), // Send the userId to the backend
          });

          const data = await response.json();

          if (data.success) {
            setUserData(data.user);
            // Optionally, update local state for Firstname and Lastname as well
            setCurrentFirstname(data.user.FirstName);
            setCurrentLastname(data.user.LastName);
            console.log(data);
          } else {
            setError(data.error || 'Failed to fetch user data');
          }
        } catch (err) {
          console.error(err);
          setError('An unexpected error occurred');
        }
      };

      fetchUserData();
    }
  }, [sessionId]);

  const handlePasswordChange = () => {
    // Open the dialog when the button is clicked
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    // Close the dialog
    setDialogOpen(false);
  };

  const handleSavePassword = () => {
    // Logic for saving the new password goes here
    console.log("New Password:", newPassword);
    // Close the dialog after saving the password
    setDialogOpen(false);
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: "auto",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        position: "relative", // To position the arrow button inside the Box
      }}
    >
      {/* Arrow Back Button */}
      <IconButton
        onClick={handleBackClick} // Trigger the back click function
        sx={{
          position: "absolute", // Position it absolutely inside the Box
          top: 10,              // 10px from the top
          left: 10,             // 10px from the left
          color: "black",       // Arrow color
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Centering NewAvatar Component */}
      <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
        <NewAvatar currentFirstname={currentFirstname} />
      </Box>

      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>

      {error && (
        <Typography color="error" variant="body1" gutterBottom>
          {error}
        </Typography>
      )}

      <Stack spacing={3}>
        <div>
          <Typography variant="h6">First Name:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={currentFirstname || ""}
            InputProps={{
              readOnly: true,
            }}
            sx={{ marginBottom: 2 }}
          />
        </div>

        <div>
          <Typography variant="h6">Last Name:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={currentLastname || ""}
            InputProps={{
              readOnly: true,
            }}
            sx={{ marginBottom: 2 }}
          />
        </div>

        <div>
          <Typography variant="h6">Username:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={userData ? userData.Login : ""}
            InputProps={{
              readOnly: true,
            }}
            sx={{ marginBottom: 2 }}
          />
        </div>

        <div>
          <Typography variant="h6">Email:</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={userData?.Email}
            InputProps={{
              readOnly: true,
            }}
            sx={{ marginBottom: 2 }}
          />
        </div>

        <Button
          variant="contained"
          color="primary"
          onClick={handlePasswordChange}
          sx={{ width: "200px", alignSelf: "center" }}
        >
          Change Password
        </Button>
      </Stack>

      {/* Change Password Dialog */}
      <PasswordChangeDialog
        userId={sessionId}
        userEmail={userData?.Email || ""}
        open={isDialogOpen}  // Pass open state to dialog
        onClose={() => setIsDialogOpen(false)} // Close the dialog
      />
    </Box>
  );
};

export default AccountSettings;
