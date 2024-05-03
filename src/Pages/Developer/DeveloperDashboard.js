import { useLocation, useNavigate } from "react-router-dom";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import DeveloperCountBox from "../../Components/Developer/DeveloperCountBox";
import RecentFeedbacks from "../../Components/Developer/RecentFeedbacks";
import GraphCard from "../../Components/Developer/GraphCard";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";
import PieChart from "../../Components/Developer/PieChart";
import LineGraph from "../../Components/Developer/LineGraph";

const DeveloperDashboard = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  console.log("UserId: ", uid);
  const [adminCount, setAdminCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const fetchNoOfAdmins = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_no_of_admins`,
          { headers }
        );
        if (res.status === 200) {
          setAdminCount(res.data.adminCount);
        } else {
          console.error("Server Error:", res.data.message);
          alert("Server Error");
        }
      } catch (error) {
        console.error("Request Error:", error.message);
        alert("Error in fetching data");
      }
    };

    const fetchNoOfPosts = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_no_of_posts`,
          { headers }
        );
        if (res.status === 200) {
          setPostsCount(res.data.postsCount);
        } else {
          console.error("Server Error:", res.data.message);
          alert("Server Error");
        }
      } catch (error) {
        console.error("Request Error:", error.message);
        alert("Error in fetching data");
      }
    };

    const fetchNoOfFeedback = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_no_of_feedbacks`,
          { headers }
        );
        if (res.status === 200) {
          setFeedbackCount(res.data.feedbackCount);
        } else {
          console.error("Server Error:", res.data.message);
          alert("Server Error");
        }
      } catch (error) {
        console.error("Request Error:", error.message);
        alert("Error in fetching data");
      }
    };

    const fetchNoOfUsers = async () => {
      console.log("fetching users");
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        const res = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_no_of_users`,
          { headers }
        );
        if (res.status === 200) {
          setUsersCount(res.data.usersCount);
        } else {
          console.error("Server Error:", res.data.message);
          alert("Server Error");
        }
      } catch (error) {
        console.error("Request Error:", error.message);
        alert("Error in fetching data");
      }
    };

    fetchNoOfAdmins();
    fetchNoOfUsers();
    fetchNoOfPosts();
    fetchNoOfFeedback();
    console.log("Fetching All Data Count");
  }, [
    storedToken,
    setAdminCount,
    setUsersCount,
    setPostsCount,
    setFeedbackCount,
  ]);

  const BackToLogin = () => {
    navigate("/");
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
      <div className="container-fluid" style={{ backgroundColor: "#272727" }}>
        <div className="row">
          <div
            className="col-lg-2 col-md-2 col-sm-3 col-3 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            {/* Sidebar */}
            <DeveloperSidebar />
          </div>
          {/* Analysis */}
          <div className="col-lg-10 col-md-9 col-sm-9 col-9">
            <TitleAndLogout title="Dashboard" />
            <hr className="my-3 p-0" style={{ color: "white" }} />
            <div className="row my-3">
              <div className="col-lg-3">
                <DeveloperCountBox
                  title="Total No. Of Admins"
                  count={adminCount}
                  status="+5 added"
                />
              </div>
              <div className="col-lg-3">
                <DeveloperCountBox
                  title="Total No. Of Users"
                  count={usersCount}
                  status="+5 added"
                />
              </div>
              <div className="col-lg-3">
                <DeveloperCountBox
                  title="Total No. Of Feedbacks"
                  count={feedbackCount}
                  status="+5 added"
                />
              </div>
              <div className="col-lg-3">
                <DeveloperCountBox
                  title="Total No. Of Posts"
                  count={postsCount}
                  status="+5 added"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-lg-8">
                <div
                  className="card glassomorphic-effect"
                  style={{ height: "240px" }}
                >
                  <h4 className="card-header text-blue">Line Graph</h4>
                  <div className="card-body p-0">
                    <LineGraph />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <RecentFeedbacks />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-lg-4">
                <GraphCard />
              </div>
              <div className="col-lg-4">
                <div className="card glassomorphic-effect">
                  <div className="card-header text-blue">Pie Chart</div>
                  <div className="card-body">
                    <PieChart />
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card glassomorphic-effect">
                  <div className="card-header text-blue">Line Graph</div>
                  <div className="card-body">
                    <LineGraph />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeveloperDashboard;
