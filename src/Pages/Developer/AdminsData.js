import { Link, useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";
import * as XLSX from "xlsx";

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
const AdminData = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  const [adminData, setAdminData] = useState([]);
  console.log("UserId: ", uid);

  const BackToLogin = () => {
    navigate("/");
  };

  const storedToken = localStorage.getItem("token");

  const handleDownload = async (format) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/getAdminTeamData`,
        { headers }
      );

      if (format === "csv") {
        const csvData = response.data.csvData;
        const blob = new Blob([csvData], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "AdminData.csv";
        link.click();
      } else if (format === "excel") {
        const sheetData = response.data.adminData;
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "AdminData");
        XLSX.writeFile(workbook, "AdminData.xlsx");
      }
    } catch (error) {
      console.error("Error downloading Admin data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/getAdminTeamData`,
          { headers }
        );
        setAdminData(response.data.adminData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, [storedToken]);

  const handleDelete = async (adminID, uid) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/delete_admin/${adminID}/${uid}`,
        {
          headers,
        }
      );

      setAdminData((prevAdmins) =>
        prevAdmins.filter((admin) => admin.admin_id !== adminID)
      );
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  if (!uid) {
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
  if (!token) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>You must be logged in to access this page.</h2>
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
            <TitleAndLogout title="Admin Data" />
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
                    <th>Admin ID</th>
                    <th>Profile Img</th>
                    <th>College Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {adminData.map((admin, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {admin.profile_img ? (
                          <img
                            src={admin.profile_img}
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
                      <td>{admin.college_name}</td>
                      <td>{admin.contact}</td>
                      <td>{admin.email}</td>
                      <td>{admin.address}</td>
                      <td>
                        <Link
                          to={`/developereditadmin?admin_id=${admin.admin_id}&uid=${uid}`}
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
                            handleDelete(admin.admin_id, admin.uid)
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

export default AdminData;
