import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");

  const [adminID, setAdminID] = useState("");

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
    fetchAdminID();
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
        alert("Logged Out Successfully");
      } else {
        console.error("Logout failed:", response.error);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="d-none d-lg-block">
      <ul className="m-4 p-0" style={{ listStyle: "none" }}>
        <Link
          className="text-decoration-none"
          to={`/adminprofile?uid=${encryptedUID}`}
        >
          <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
            <i className="fa-solid fa-user fa-bounce me-2"></i> My Profile
          </li>
        </Link>
        {adminID && (
          <Link
            className="text-decoration-none"
            to={`/dashboard?uid=${encryptedUID}&admin_id=${adminID}`}
          >
            <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
              <i className="fa-brands fa-windows fa-bounce me-2"></i> Dashboard
            </li>
          </Link>
        )}
        {adminID && (
          <Link
            className="text-decoration-none"
            to={`/addpost?uid=${encryptedUID}&admin_id=${adminID}`}
          >
            <li className="py-3 px-3 sidebar-li my-2 blue-buttons rounded-3">
              <i className="fa-solid fa-file-export fa-bounce me-2"></i> Add
              Post
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
        {adminID && (
          <Link
            className="text-decoration-none"
            to={`/admin_feedback?uid=${encryptedUID}&admin_id=${adminID}`}
          >
            <li className="py-3 px-3 sidebar-li mx-4 my-2 blue-buttons rounded-3 fixed-bottom report-li">
              <i className="fa-solid fa-flag fa-bounce  ms-1 me-2"></i> Report /
              Feedback
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default AdminSidebar;
