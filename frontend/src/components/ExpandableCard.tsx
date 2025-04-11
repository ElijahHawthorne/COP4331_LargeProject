import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ExpandableCardProps {
  title: string;
  index: number;
  onClick: (event: React.MouseEvent) => void;
  isActive: boolean;
  componentCollapsed: React.ReactNode;
  componentExpanded: React.ReactNode;
  cardRef: (el: HTMLDivElement | null) => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  onClick,
  isActive,
  componentCollapsed,
  componentExpanded,
  cardRef,
}) => {
  const handleCardClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClick(event);
  };

  return (
    <Card
      ref={cardRef}
      onClick={handleCardClick}
      sx={{
        p: 2,
        borderRadius: "4px",
        boxShadow: 1,
        transition: "transform 0.3s ease, z-index 0.3s ease, height 0.3s ease",
        position: isActive ? "fixed" : "relative",
        top: isActive ? "50%" : "auto",
        left: isActive ? "50%" : "auto",
        transform: isActive ? "translate(-50%, -50%) scale(1.5)" : "scale(1)",
        height: isActive ? "500px" : "300px",
        width: isActive ? "500px" : "300px",
        zIndex: isActive ? 9999 : 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title is now fixed, does NOT scroll */}
      <CardHeader
        title={title}
        sx={{ flexShrink: 0 }}
      />

      {/* Scrollable content section */}
      <CardContent
        sx={{
          padding: 0,
          overflowY: "auto", // scrollable area
          flexGrow: 1,
        }}
      >
        {!isActive && componentCollapsed}

        {isActive && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              height: "100%",
              overflow: "hidden", // To ensure inner sections scroll individually
            }}
          >
            {/* Left scrollable section */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                height: "100%",
              }}
            >
              {componentCollapsed}
            </Box>

            {/* Right scrollable section */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                height: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  borderBottom: "1px solid",
                  mb: 1,
                }}
              >
                Add {title}
              </Typography>
              {componentExpanded}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpandableCard;
