

import React, { useRef } from "react";

interface ExpandableCardProps {
  title: string;
  index: number;
  onClick: (event: React.MouseEvent) => void;
  isActive: boolean;
  componentCollapsed: React.ReactNode;
  componentExpanded: React.ReactNode;
  cardRef: (el: HTMLDivElement | null) => void; // Accept a function to set the ref
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  index,
  onClick,
  isActive,
  componentCollapsed,
  componentExpanded,
  cardRef,
}) => {
  const handleCardClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the event from propagating to the global listener
    onClick(event); // Call the passed onClick handler
  };

  return (
    <div
      ref={cardRef} // Pass the cardRef here
      className={`bg-white p-4 rounded shadow transform transition-all duration-300 ease-in-out ${
        isActive ? "scale-105 z-50 fixed inset-0" : ""
      }`}
      style={{
        transition: "transform 0.3s ease, z-index 0.3s ease",
        zIndex: isActive ? 50 : 1,
        position: isActive ? "absolute" : "relative",
        top: isActive ? "50%" : "auto",
        left: isActive ? "50%" : "auto",
        height: "300px",
        overflowY: isActive? "hidden": "auto",
        transform: isActive ? "translate(-50%, -50%) scale(1.5)" : "scale(1)",
        
      }}
      onClick={handleCardClick} // Use the handleCardClick to stop propagation
    >
      <h2 className="text-lg font-bold">{title}</h2>
      {!isActive && componentCollapsed}
      {isActive && (
        <div className="flex justify-between gap-4" style={{ height: "100%" }}>
        <div style={{ width: "200px", overflowY: "auto", height: "100%" }}>
          {componentCollapsed}
        </div>
        
        <div style={{ width: "150px", overflowY: "auto", height: "100%" }}>
  <strong className="text-[20px] border-black">Add {title}</strong> {/* Corrected Tailwind font size */}
  {componentExpanded}
</div>
      </div>
      )}
    </div>
  );
};

export default ExpandableCard;
