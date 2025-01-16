import React from "react";

const Loading = ({ show }) => {
  if (!show) return null;

  return (
    <div className="loading-backdrop">
      <div className="loading-content">
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <h2 className="loading-title">Loading Event Link</h2>
        <p className="loading-subtitle">
          Preparing your events and connections...
        </p>
      </div>
    </div>
  );
};

export default Loading;
