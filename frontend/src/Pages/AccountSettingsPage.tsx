import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  TextField,
  Box,
  Stack,
  IconButton,
  Paper,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

const AccountSettings = () => {
  const theme = useTheme();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentFirstname, setCurrentFirstname] = useState<string | null>(null);
  const [currentLastname, setCurrentLastname] = useState<string | null>(null);
  const [userData, setUserData] = useState<Data | null>(null);
  const [error, setError] = useState<string>("");
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
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (sessionId !== null) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("http://777finances.com:5000/api/getinfo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: sessionId }),
          });

          const data = await response.json();

          if (data.success) {
            setUserData(data.user);
            setCurrentFirstname(data.user.FirstName);
            setCurrentLastname(data.user.LastName);
          } else {
            setError(data.error || "Failed to fetch user data");
          }
        } catch (err) {
          console.error(err);
          setError("An unexpected error occurred");
        }
      };

      fetchUserData();
    }
  }, [sessionId]);

  const handleBackClick = () => navigate(-1);
  const handlePasswordChange = () => setIsDialogOpen(true);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        position: "relative",
        borderRadius: 3,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      {/* Back Button */}
      <IconButton
        onClick={handleBackClick}
        sx={{
          position: "absolute",
          top: theme.spacing(2),
          left: theme.spacing(2),
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      {/* Avatar */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <NewAvatar currentFirstname={currentFirstname} />
      </Box>

      <Typography variant="h4" align="center" gutterBottom>
        Account Settings
      </Typography>

      {error && (
        <Typography color="error" align="center" gutterBottom>
          {error}
        </Typography>
      )}

      <Stack spacing={3}>
        {[
          { label: "First Name", value: currentFirstname },
          { label: "Last Name", value: currentLastname },
          { label: "Username", value: userData?.Login },
          { label: "Email", value: userData?.Email },
        ].map(({ label, value }) => (
          <Box key={label}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {label}
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={value || ""}
              InputProps={{ readOnly: true }}
            />
          </Box>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={handlePasswordChange}
          sx={{ alignSelf: "center", mt: 2, width: "fit-content", px: 4 }}
        >
          Change Password
        </Button>
      </Stack>

      <PasswordChangeDialog
        userId={sessionId}
        userEmail={userData?.Email || ""}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Paper>
  );
};

export default AccountSettings;
