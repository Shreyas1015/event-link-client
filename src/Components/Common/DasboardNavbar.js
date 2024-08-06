import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import toast from "react-hot-toast";

const DasboardNavbar = () => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");

  const [adminID, setAdminID] = useState("");
  const [UserProfileID, setUserProfileID] = useState("");

  useEffect(() => {
    async function fetchAdminID() {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/c-admin/get_admin_id?uid=${decryptedUID}`,
          { decryptedUID }
        );
        const fetchedAdminID = response.data.admin_id;
        setAdminID(fetchedAdminID);
      } catch (error) {
        console.error("Error fetching admin_id:", error);
      }
    }
    async function fetchUserProfileID() {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/get_user_profile_id?uid=${decryptedUID}`,
          { decryptedUID }
        );
        const fetchedUserProfileID = response.data.user_profile_id;
        setUserProfileID(fetchedUserProfileID);
      } catch (error) {
        console.error("Error fetching user_profile_id:", error);
      }
    }
    fetchAdminID();
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
    <>
      <nav
        className="navbar navbar-dark navbar-expand-lg m-0 p-0"
        style={{ backgroundColor: "#62c1bf" }}
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/dashboard">
            <img
              className="img-fluid brand-img"
              src="/Images/bgless-logo.png"
              alt="Event Link"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex={-1}
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                EVENT LINK
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body">
              {UserProfileID && (
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 d-lg-none">
                  <Link
                    className="text-decoration-none"
                    to={`/userprofile?uid=${encryptedUID}`}
                  >
                    <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
                      <i className="fa-solid fa-user fa-bounce me-2"></i> My
                      Profile
                    </li>
                  </Link>
                  <Link
                    className="text-decoration-none"
                    to={`/userdashboard?uid=${encryptedUID}&user_profile_id=${UserProfileID}`}
                  >
                    <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
                      <i className="fa-brands fa-windows fa-bounce me-2"></i>{" "}
                      Dashboard
                    </li>
                  </Link>
                  <li
                    className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3"
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket fa-bounce me-2" />
                    Logout
                  </li>
                  <Link
                    className="text-decoration-none"
                    to={`/user_feedback?uid=${encryptedUID}&user_profile_id=${UserProfileID}`}
                  >
                    <li className="py-3 px-3 sidebar-li mx-4 my-2 blue-buttons rounded-3 fixed-bottom report-li">
                      <i className="fa-solid fa-flag fa-bounce ms-1 me-2"></i>{" "}
                      Report / Feedback
                    </li>
                  </Link>
                </ul>
              )}
              {adminID && (
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3 d-lg-none">
                  <Link
                    className="text-decoration-none"
                    to={`/adminprofile?uid=${encryptedUID}`}
                  >
                    <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
                      <i className="fa-solid fa-user fa-bounce me-2"></i> My
                      Profile
                    </li>
                  </Link>
                  <Link
                    className="text-decoration-none"
                    to={`/dashboard?uid=${encryptedUID}&admin_id=${adminID}`}
                  >
                    <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
                      <i className="fa-brands fa-windows fa-bounce me-2"></i>{" "}
                      Dashboard
                    </li>
                  </Link>
                  <Link
                    className="text-decoration-none"
                    to={`/addpost?uid=${encryptedUID}&admin_id=${adminID}`}
                  >
                    <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
                      <i className="fa-solid fa-file-export fa-bounce me-2"></i>{" "}
                      Add Post
                    </li>
                  </Link>
                  <li
                    className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3"
                    onClick={handleLogout}
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket fa-bounce me-2" />
                    Logout
                  </li>
                  <Link
                    className="text-decoration-none"
                    to={`/admin_feedback?uid=${encryptedUID}&admin_id=${adminID}`}
                  >
                    <li className="py-3 px-3 sidebar-li mx-4 my-2 blue-buttons rounded-3 fixed-bottom report-li">
                      <i className="fa-solid fa-flag fa-bounce ms-1 me-2"></i>{" "}
                      Report / Feedback
                    </li>
                  </Link>
                </ul>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default DasboardNavbar;
