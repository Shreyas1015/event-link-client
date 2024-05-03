import React from "react";

const DeveloperCountBox = (props) => {
  return (
    <>
      <div className="card glassomorphic-effect" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title text-blue mb-2">{props.title}</h5>
          <h4 className="card-subtitle mb-2 text-light">{props.count}</h4>
          <p className="card-text text-success">{props.status}</p>
        </div>
      </div>
    </>
  );
};

export default DeveloperCountBox;
