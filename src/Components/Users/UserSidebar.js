import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uid = new URLSearchParams(location.search).get("uid");
  const [UserProfileID, setUserProfileID] = useState("");

  useEffect(() => {
    async function fetchUserProfileID() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_user_profile_id?uid=${uid}`
        );
        const fetchedUserProfileID = response.data.user_profile_id;
        setUserProfileID(fetchedUserProfileID);
      } catch (error) {
        console.error("Error fetching admin_id:", error);
      }
    }
    fetchUserProfileID();
  }, [uid]);

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
    alert("Logged Out Successfully");
  };

  return (
    <>
      {/* My Profile */}
      <ul className="m-4 p-0" style={{ listStyle: "none" }}>
        <Link className="text-decoration-none" to={`/userprofile?uid=${uid}`}>
          <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
            <i class="fa-solid fa-user fa-bounce me-2"></i> My Profile
          </li>
        </Link>
        {/* Render the Dashboard link only if UserProfileID is available */}
        {UserProfileID && (
          <Link
            className="text-decoration-none"
            to={`/userdashboard?uid=${uid}&user_profile_id=${UserProfileID}`}
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
            to={`/user_feedback?uid=${uid}&user_profile_id=${UserProfileID}`}
          >
            <li className="py-3 px-3 sidebar-li mx-4 my-2 blue-buttons rounded-3 fixed-bottom report-li">
              <i class="fa-solid fa-flag fa-bounce  ms-1 me-2"></i> Report /
              Feedback
            </li>
          </Link>
        )}
      </ul>
    </>
  );
};

export default UserSidebar;
