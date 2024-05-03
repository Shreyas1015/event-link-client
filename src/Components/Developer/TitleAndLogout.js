import React from "react";
import { useNavigate } from "react-router-dom";

const TitleAndLogout = (props) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
    alert("Logged Out Successfully");
  };

  return (
    <>
      <div className="container mt-2 glassomorphic-effect rounded-4">
        <div className="row">
          <div className="col-lg-6">
            <h2 className="fw-bolder text-blue p-2">{props.title}</h2>
          </div>
          <div className="col-lg-6 text-end my-auto">
            <button
              className="py-2 px-3 my-1 mx-3 btn blue-buttons text-blue rounded-3"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-arrow-right-from-bracket me-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TitleAndLogout;
