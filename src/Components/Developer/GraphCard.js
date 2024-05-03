import React from "react";
import BarGraph from "./BarGraph";

const GraphCard = () => {
  return (
    <>
      <div className="card glassomorphic-effect">
        <div className="card-header text-blue">Bar Graph</div>
        <div className="card-body">
          <BarGraph />
        </div>
      </div>
    </>
  );
};

export default GraphCard;
