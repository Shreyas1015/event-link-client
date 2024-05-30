import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";
import * as XLSX from "xlsx";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const firebaseConfig = {
  apiKey: "AIzaSyC3-kql5gHN8ZQRaFkrwWDBE8ksC5SbdAk",
  authDomain: "event-link-b0613.firebaseapp.com",
  projectId: "event-link-b0613",
  storageBucket: "event-link-b0613.appspot.com",
  messagingSenderId: "21608943759",
  appId: "1:21608943759:web:b96c788f67bcab9ee720fa",
  measurementId: "G-ZMGC41BPHD",
};

firebase.initializeApp(firebaseConfig);
// const storage = firebase.storage();
const UsersData = () => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const [userData, setUserData] = useState([]);

  const BackToLogin = () => {
    navigate("/");
  };

  const handleDownload = async (format) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/getUserTeamData`,
        { decryptedUID }
      );

      if (format === "csv") {
        const csvData = response.data.csvData;
        const blob = new Blob([csvData], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "UserData.csv";
        link.click();
      } else if (format === "excel") {
        const sheetData = response.data.userData;
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "UserData");
        XLSX.writeFile(workbook, "UserData.xlsx");
      }
    } catch (error) {
      console.error("Error downloading user data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getUserTeamData`,
          { decryptedUID }
        );
        setUserData(response.data.userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [decryptedUID]);

  const handleDelete = async (userProfileID, uid) => {
    try {
      await axiosInstance.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/delete_user/${userProfileID}/${uid}`,
        { data: { decryptedUID } }
      );

      setUserData((prevUsers) =>
        prevUsers.filter((user) => user.user_profile_id !== userProfileID)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!decryptedUID) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>INVALID URL. Please provide a valid UID.</h2>
          <button onClick={BackToLogin} className="btn blue-buttons">
            Back to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className="container-fluid"
        style={{ backgroundColor: "#272727", minHeight: "100vh" }}
      >
        <div
          className="col-lg-2 col-md-2 col-sm-3 col-3 sidebar z-2"
          style={{
            backgroundColor: "#272727",
            height: "auto",
            position: "fixed",
          }}
        >
          {/* Sidebar */}
          <DeveloperSidebar />
        </div>
        <div className="row">
          {/* Analysis */}
          <div className="col-lg-2"></div>
          <div className="col-lg-10 col-md-9 col-sm-9 col-9 px-4">
            <TitleAndLogout title="Users Data" />
            <hr className="my-3 p-0" style={{ color: "white" }} />
            <button
              onClick={() => handleDownload("excel")}
              className="btn blue-buttons mt-2 ms-3"
            >
              Download Excel
            </button>
            <button
              onClick={() => handleDownload("csv")}
              className="btn blue-buttons mt-2 mx-4"
            >
              Download CSV
            </button>
            <div className="table-responsive container mt-2 p-3">
              <table
                className="table text-center glassomorphic-effect table-bordered "
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05) !important",
                  boxShadow: "2px 2px 30px rgba(0, 0, 0, 0.5)",
                  backdropFilter: " blur(5px)",
                }}
              >
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Profile Img</th>
                    <th>Name</th>
                    <th>College Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {user.profile_img ? (
                          <img
                            src={user.profile_img}
                            alt="alt Title"
                            className="rounded-circle admin-team-img"
                            onError={() =>
                              console.log("Title Image Load Error")
                            }
                          />
                        ) : (
                          <p>No title image available</p>
                        )}
                      </td>
                      <td>{user.name}</td>
                      <td>{user.college_name}</td>
                      <td>{user.contact}</td>
                      <td>{user.email}</td>
                      <td>{user.clg_address}</td>
                      <td>
                        <Link
                          to={`/developeredituser?user_profile_id=${user.user_profile_id}&uid=${encryptedUID}`}
                          className="post-link text-decoration-none"
                        >
                          <button className="btn blue-buttons mt-2">
                            Edit
                          </button>
                        </Link>
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleDelete(user.user_profile_id, user.uid)
                          }
                          className="btn blue-buttons mt-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersData;
