import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import toast from "react-hot-toast";

const UserSidebar = () => {
  const navigate = useNavigate();
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");

  const [UserProfileID, setUserProfileID] = useState("");

  useEffect(() => {
    async function fetchUserProfileID() {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/get_user_profile_id?uid=${decryptedUID}`,
          { decryptedUID }
        );
        const fetchedUserProfileID = response.data.user_profile_id;
        setUserProfileID(fetchedUserProfileID);
      } catch (error) {
        console.error("Error fetching admin_id:", error);
      }
    }
    fetchUserProfileID();
  }, [decryptedUID]);

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
    <div div className="d-none d-lg-block">
      {/* My Profile */}
      <ul className="m-4 p-0" style={{ listStyle: "none" }}>
        <Link
          className="text-decoration-none"
          to={`/userprofile?uid=${encryptedUID}`}
        >
          <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
            <i class="fa-solid fa-user fa-bounce me-2"></i> My Profile
          </li>
        </Link>
        {/* Render the Dashboard link only if UserProfileID is available */}
        {UserProfileID && (
          <Link
            className="text-decoration-none"
            to={`/userdashboard?uid=${encryptedUID}&user_profile_id=${UserProfileID}`}
          >
            <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
              <i class="fa-brands fa-windows fa-bounce me-2"></i> Dashboard
            </li>
          </Link>
        )}

        <li
          className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3"
          onClick={handleLogout}
        >
          <i className="fa-solid fa-arrow-right-from-bracket fa-bounce me-2" />
          Logout
        </li>
        {UserProfileID && (
          <Link
            className="text-decoration-none"
            to={`/user_feedback?uid=${encryptedUID}&user_profile_id=${UserProfileID}`}
          >
            <li className="py-3 px-3 sidebar-li mx-4 my-2 blue-buttons rounded-3 fixed-bottom report-li">
              <i class="fa-solid fa-flag fa-bounce  ms-1 me-2"></i> Report /
              Feedback
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default UserSidebar;
