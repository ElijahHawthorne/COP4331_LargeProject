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
<<<<<<< HEAD
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        p: 2,
        // Use a fixed, lower borderRadius for sharper corners:
        borderRadius: "4px",
        // A lighter shadow for a modern, minimal look:
        boxShadow: theme.shadows[1],
        height: 300,
        overflowY: isActive ? "hidden" : "auto",
        transition: theme.transitions.create(["transform", "z-index"], {
          duration: theme.transitions.duration.short,
        }),
        ...(isActive
          ? {
              transform: "translate(-50%, -50%) scale(1.5)",
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 50,
            }
          : {
              transform: "scale(1)",
              position: "relative",
            }),
      })}
    >
      <CardHeader title={title} />
      <CardContent>
=======
      sx={{
        backgroundColor: "white",
        p: 2,
        borderRadius: "4px",
        boxShadow: 1,
        transition: "transform 0.3s ease, z-index 0.3s ease, height 0.3s ease",
        position: isActive ? "fixed" : "relative", // Fixed position when expanded
        top: isActive ? "50%" : "auto", // Center vertically
        left: isActive ? "50%" : "auto", // Center horizontally
        transform: isActive ? "translate(-50%, -50%) scale(1.5)" : "scale(1)", // Scale and center
        height: isActive ? "500px" : "300px", // Adjust expanded height
        width: isActive ? "500px" : "300px", // Adjust expanded width
        zIndex: isActive ? 9999 : 1, // Ensure it's on top of everything else
        overflowY: isActive ? "hidden" : "auto", // Show overflow when expanded
      }}
    >
      <CardHeader title={title} />
      <CardContent sx={{ padding: 0 }}>
>>>>>>> origin/NewEliBranch
        {!isActive && componentCollapsed}
        {isActive && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
<<<<<<< HEAD
              height: "100%",
            }}
          >
            <Box sx={{ width: "200px", overflowY: "auto", height: "100%" }}>
              {componentCollapsed}
            </Box>
            <Box sx={{ width: "150px", overflowY: "auto", height: "100%" }}>
=======
              height: "100%", // Make sure the Box fills the height of the Card
              position:"fixed"
            }}
          >
            {/* Left section - scrollable */}
            <Box
              sx={{
                position: "relative",
                width: "200px",
                height: "100%",
                overflowY: "auto", // Enable scrolling for this section
              }}
            >
              {componentCollapsed}
            </Box>

            {/* Right section - scrollable */}
            <Box
              sx={{
                flex: 1,
                width: "150px",
                height: "100%",
                overflowY: "auto", // Enable scrolling for this section
    
              }}
            >
>>>>>>> origin/NewEliBranch
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
