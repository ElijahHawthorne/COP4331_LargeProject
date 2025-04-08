import Stack from '@mui/material/Stack';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

export default function Header() {
  return (
    <Stack
      direction="row"
      sx={{
        display: 'flex', // Ensure the Header is always visible across all screen sizes
        width: '100%',
        alignItems: 'center', // Center the content vertically
        justifyContent: 'space-between',
        maxWidth: '1700px',  // Max width set to 1700px for medium and larger screens
        pt: 1.5,
        px: 3, // Add horizontal padding to ensure space on small screens
      }}
      spacing={2}
    >
      
      <Stack direction="row" sx={{ gap: 1 }}>
        
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
