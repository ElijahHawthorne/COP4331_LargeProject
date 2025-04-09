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
        {!isActive && componentCollapsed}
        {isActive && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              height: "100%",
            }}
          >
            <Box sx={{ width: "200px", overflowY: "auto", height: "100%" }}>
              {componentCollapsed}
            </Box>
            <Box sx={{ width: "150px", overflowY: "auto", height: "100%" }}>
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
