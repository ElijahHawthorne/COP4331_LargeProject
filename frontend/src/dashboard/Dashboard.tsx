
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid-pro/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import MainGrid from './components/MainGrid';

import AppTheme from '../shared-theme/AppTheme';
import type {} from '@mui/material/themeCssVarsAugmentation';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',  // Ensure the container takes up the full height
        }}
      >
        {/* Navbar */}
        <AppNavbar />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',  // Horizontally center content
            alignItems: 'center',      // Vertically center content
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
            paddingTop: '500px', // Add padding at the top to avoid content hiding behind the navbar
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 0,
              pb: 5,
              mt: { xs: 4, md: 4 },
            }}
          >
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
