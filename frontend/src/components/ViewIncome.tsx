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
          width: 'max-content',
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
              fontSize: "3.5rem",
              my: 1,
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
