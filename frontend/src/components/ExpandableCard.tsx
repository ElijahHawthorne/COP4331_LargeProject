



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
        isActive ? "scale-105 z-50" : ""
      }`}
      style={{
        transition: "transform 0.3s ease, z-index 0.3s ease, height 0.3s ease",
        zIndex: isActive ? 9999 : 1, // Ensure it's on top of everything else
        position: isActive ? "fixed" : "relative", // Fixed position when expanded
        top: isActive ? "50%" : "auto", // Center vertically
        left: isActive ? "50%" : "auto", // Center horizontally
        transform: isActive
          ? "translate(-50%, -50%) scale(1.5)" // Scale and center
          : "scale(1)", // Normal scale when not expanded
        height: isActive ? "500px" : "300px", // Adjust expanded height
        width: isActive ? "500px" : "300px", // Adjust expanded width
        overflowY: isActive ? "hidden" : "auto", // Show overflow when expanded
      }}
      onClick={handleCardClick} // Use the handleCardClick to stop propagation
    >
      <h2 className="text-lg font-bold">{title}</h2>
      {!isActive && componentCollapsed}
      {isActive && (
        <div className="flex justify-between gap-4" style={{ height: "100%" }}>
          <div style={{ flex:3,width: "200px", overflowY: "auto", height: "100%" }}>
            {componentCollapsed}
          </div>

          <div style={{ flex:2, width: "150px", overflowY: "auto", height: "100%" }}>
            {/* Corrected Tailwind font size */}
            {componentExpanded}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpandableCard;
