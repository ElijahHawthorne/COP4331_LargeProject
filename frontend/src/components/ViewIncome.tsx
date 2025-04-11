import React from 'react';
import { Typography, Box, Card, CardContent } from '@mui/material';

interface ViewIncomeProps {
  income: number;
}

const ViewIncome: React.FC<ViewIncomeProps> = ({ income }) => {
  return (
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
      <Card
        sx={{
          width: 250,
          border: 'none',
          textAlign: 'center',
          p: 2,
        }}
      >
        <CardContent>
          {/* Income Display */}
          <Typography
            variant="h3"
            sx={{
              fontSize: "2.5rem",
              my: 1,
              color: (theme) => theme.palette.text.primary,
              fontWeight: "bold"
            }}
          >
            ${income.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewIncome;
