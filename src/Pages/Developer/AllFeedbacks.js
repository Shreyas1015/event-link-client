import { Link, useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";

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

const AllFeedbacks = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  const [feedbackData, setFeedbackData] = useState([]);
  console.log("UserId: ", uid);

  const BackToLogin = () => {
    navigate("/");
  };

  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_all_feedbacks`,
          { headers }
        );
        setFeedbackData(response.data.feedback);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchData();
  }, [storedToken]);

  const handleResolveClick = async (fid) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      console.log(`Sending PUT request for feedback ID ${fid}`);

      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/update_feedback/${fid}`,
        {},
        { headers }
      );

      console.log("Response from backend:", response.data);
      alert("Feedback Updated");
      window.location.reload();
      setFeedbackData((prevFeedback) =>
        prevFeedback.map((feedback) =>
          feedback.fid === fid ? { ...feedback, resolved: 1 } : feedback
        )
      );
    } catch (error) {
      console.error("Error resolving feedback:", error);
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
            <TitleAndLogout title="All Feedback Data" />
            <hr className="my-3 p-0" style={{ color: "white" }} />
            <div className="text-end">
              <Link to={`/developerresolvedfeedbacks?uid=${uid}`}>
                <button className="btn blue-buttons btn-lg">
                  Resolved Issues
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
                    <th>Feedback ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Feedback Type</th>
                    <th>Feedback Subject</th>
                    <th>Feedback Description</th>
                    <th>Ratings</th>
                    <th>Attachments</th>
                    <th>Contact Preference ID</th>
                    <th>User ID</th>
                    <th>Admin ID</th>
                    <th>User Profile ID</th>
                    <th>Client Profile</th>
                    <th>Feedback Date</th>
                    <th>Resolved</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbackData.map((feedback) => (
                    <tr key={feedback.fid}>
                      <td>{feedback.fid}</td>
                      <td>{feedback.name}</td>
                      <td>{feedback.email}</td>
                      <td>
                        {feedback.feedback_id == 1
                          ? "General Feedback"
                          : feedback.feedback_id == 2
                          ? "Bug Report"
                          : feedback.feedback_id == 3
                          ? "Feature Request"
                          : feedback.feedback_id == 4
                          ? "Suggestion"
                          : feedback.feedback_id == 5
                          ? "Other"
                          : ""}
                      </td>

                      <td>{feedback.feedback_subject}</td>
                      <td>{feedback.feedback_desc}</td>
                      <td>{feedback.ratings + " Star"}</td>
                      <td>
                        <a href={feedback.attachments} target="blank">
                          Attachment Link
                        </a>
                      </td>
                      <td>
                        {feedback.contact_preference_id == 1
                          ? "Email"
                          : feedback.contact_preference_id == 2
                          ? "Phone"
                          : feedback.contact_preference_id == 3
                          ? "No follow-up needed"
                          : ""}
                      </td>

                      <td>{feedback.uid}</td>
                      <td>{feedback.admin_id}</td>
                      <td>{feedback.user_profile_id}</td>
                      <td>
                        {feedback.uid &&
                        feedback.admin_id &&
                        !feedback.user_profile_id
                          ? "Admin"
                          : "User"}
                      </td>
                      <td>
                        {new Date(feedback.feedback_date).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleResolveClick(feedback.fid)}
                          className="btn blue-buttons mt-2"
                          disabled={feedback.resolved === 1}
                        >
                          Resolved
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

export default AllFeedbacks;
