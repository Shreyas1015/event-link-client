import React from "react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import toast from "react-hot-toast";

const TitleAndLogout = (props) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/logout`
      );

      if (response.status === 200) {
        secureLocalStorage.removeItem("uid");
        secureLocalStorage.removeItem("isLogin");
        secureLocalStorage.removeItem("user_type");

        navigate("/");
        toast.success("Logged Out Successfully");
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
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
