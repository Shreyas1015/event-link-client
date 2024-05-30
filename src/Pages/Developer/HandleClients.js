import { Link, useNavigate } from "react-router-dom";
import "firebase/compat/storage";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import { useEffect, useState } from "react";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";
import * as XLSX from "xlsx";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const HandleClients = () => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const [clientData, setClientData] = useState([]);
  const [editingClient, setEditingClient] = useState({
    uid: null,
    user_type: null,
  });

  const BackToLogin = () => {
    navigate("/");
  };

  const handleEditClick = (client) => {
    setEditingClient({ uid: client.uid, user_type: client.user_type });
  };

  const handleSaveClick = async () => {
    try {
      await axiosInstance.put(
        `${process.env.REACT_APP_BASE_URL}/admin/update_user_type/${editingClient.uid}`,
        { user_type: editingClient.user_type, decryptedUID }
      );

      setClientData((prevClients) =>
        prevClients.map((client) =>
          client.uid === editingClient.uid
            ? { ...client, user_type: editingClient.user_type }
            : client
        )
      );

      setEditingClient({ uid: null, user_type: null });
    } catch (error) {
      console.error("Error updating user type:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getAllClientData`,
          { decryptedUID }
        );
        setClientData(response.data.clientData);
      } catch (error) {
        console.error("Error fetching Client data:", error);
      }
    };

    fetchData();
  }, [decryptedUID]);

  const handleDownload = async (format) => {
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/getAllClientData`,
        { decryptedUID }
      );

      if (format === "csv") {
        const csvData = response.data.csvData;
        const blob = new Blob([csvData], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "ClientData.csv";
        link.click();
      } else if (format === "excel") {
        const sheetData = response.data.clientData;
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "ClientData");
        XLSX.writeFile(workbook, "ClientData.xlsx");
      }
    } catch (error) {
      console.error("Error downloading Client data:", error);
    }
  };

  const handleDelete = async (uid) => {
    try {
      await axiosInstance.delete(
        `${process.env.REACT_APP_BASE_URL}/admin/delete_client/${uid}`,
        { data: { decryptedUID } }
      );

      setClientData((prevClients) =>
        prevClients.filter((client) => client.uid !== uid)
      );
    } catch (error) {
      console.error("Error deleting client:", error);
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
            <TitleAndLogout title="Clients Data" />
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
            <div className="text-end">
              <Link
                to={`/developeraddclient?uid=${encryptedUID}`}
                className="text-decoration-none"
              >
                <button className="btn blue-buttons btn-lg mx-3">
                  Add Client
                </button>
              </Link>
            </div>

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
                    <th>CLient ID</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {clientData.map((client, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{client.email}</td>
                      <td>
                        {editingClient.uid === client.uid ? (
                          <select
                            value={editingClient.user_type}
                            onChange={(e) =>
                              setEditingClient({
                                ...editingClient,
                                user_type: e.target.value,
                              })
                            }
                          >
                            <option value="1">Admin</option>
                            <option value="2">User</option>
                            <option value="3">Developer</option>
                          </select>
                        ) : client.user_type == 1 ? (
                          "Admin"
                        ) : client.user_type == 2 ? (
                          "User"
                        ) : (
                          "Developer"
                        )}
                      </td>
                      <td>
                        {editingClient.uid === client.uid ? (
                          <button
                            onClick={handleSaveClick}
                            className="btn blue-buttons my-2 mx-2"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditClick(client)}
                            className="btn blue-buttons my-2 mx-2"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(client.uid)}
                          className="btn blue-buttons my-2"
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

export default HandleClients;
