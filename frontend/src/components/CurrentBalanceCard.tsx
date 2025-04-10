import React from "react";
import {
  Box,
  Divider,
  Typography
} from "@mui/material";

interface CurrentBalanceCardProps {
  currentBalance: number;
  label?: string;
  // If you want to display a small percentage change or variation:
  variation?: number; // e.g., -2, +5, etc.
}

const CurrentBalanceCard: React.FC<CurrentBalanceCardProps> = ({
  currentBalance,
  label = "Current Balance",
  variation
}) => {
  return (
    <Box
      sx={{
        padding: 2,
        textAlign: "center",// adjust if you want a fixed width
      }}
    >
      <Typography variant="h6" gutterBottom>
        {label}
      </Typography>


      {/* Main Balance Display */}
      <Typography variant="h3" sx={{ fontWeight: "bold" }}>
        ${currentBalance.toFixed(2)}
      </Typography>

      {/* Variation (Optional) */}
      {variation !== undefined && (
        <Typography
          variant="body2"
          sx={{
            color: variation >= 0 ? "success.main" : "error.main",
            mt: 1
          }}
        >
          {variation > 0 ? `+${variation}%` : `${variation}%`}
        </Typography>
      )}

      {/* Subtitle, e.g. "Daily earnings", if you want a second label */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Daily earnings
      </Typography>
    </Box>
  );
};

export default CurrentBalanceCard;
