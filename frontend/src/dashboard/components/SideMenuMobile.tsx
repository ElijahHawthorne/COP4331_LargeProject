
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuContent from './MenuContent';

import { useEffect, useState } from 'react';
import NewAvatar from './NewAvatar';
import { useNavigate } from 'react-router-dom';


interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({ open, toggleDrawer }: SideMenuMobileProps) {

 // const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentFirstname, setCurrentFirstname] = useState<string | null>(null);
  const [currentLastname, setCurrentLastname] = useState<string | null>(null);




  useEffect(() => {
    const storedUserData = localStorage.getItem("user_data");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        
        setCurrentFirstname(userData.firstName);
        setCurrentLastname(userData.lastName);
        console.log("UserData:", userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const navigate = useNavigate();


  function handleLogout() {
    //To remove user data from local storage and go back to login
    localStorage.removeItem("user_data");
    navigate("/login");
  }

  



  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <NewAvatar currentFirstname={currentFirstname} />
            <Typography component="p" variant="h6">
              {currentFirstname+" "+currentLastname} 
            </Typography>
          </Stack>
          
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
          <Divider />
        </Stack>
        
        <Stack sx={{ p: 2 }}>
          <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />} onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
