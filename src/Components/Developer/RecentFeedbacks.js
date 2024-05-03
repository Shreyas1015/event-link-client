import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const RecentFeedbacks = () => {
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  console.log("UserId: ", uid);
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchRecentFeedbacks = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_recent_feedbacks`,
          { headers }
        );
        if (res.status === 200) {
          setRecentFeedback(res.data.feedbacks);
        } else {
          console.error("Server Error : ", res.data.message);
          alert("Server Error");
        }
      } catch (error) {
        console.error("Request Error : ", error.message);
        alert("Error in fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentFeedbacks();
    console.log("Fetching All Data");
  }, [storedToken]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div
      className="glassomorphic-effect rounded-2"
      style={{ height: "240px", overflowY: "scroll" }}
    >
      <h4
        id="navbar-example2"
        className="border-bottom border-dark px-3 py-2 mb-3 text-blue"
      >
        Recent Feedbacks
      </h4>

      <div
        data-bs-spy="scroll"
        data-bs-target="#navbar-example2"
        data-bs-root-margin="0px 0px -40%"
        data-bs-smooth-scroll="true"
        className="scrollspy-example px-3 py-1 rounded-2"
        tabIndex={0}
      >
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {recentFeedback.map((feedbacks, index) => (
            <li
              key={index}
              className="mb-3 text-blue border py-1 px-2 rounded-4 "
            >
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{feedbacks.name}</strong>
                  <div>
                    {feedbacks.feedback_id === 1
                      ? "General Feedback"
                      : feedbacks.feedback_id === 2
                      ? "Bug Report"
                      : feedbacks.feedback_id === 3
                      ? "Feature Request"
                      : feedbacks.feedback_id === 4
                      ? "Suggestion"
                      : feedbacks.feedback_id === 5
                      ? "Other"
                      : ""}
                  </div>
                </div>
                <div>{feedbacks.ratings + " Stars"}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentFeedbacks;
