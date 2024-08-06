import { useNavigate } from "react-router-dom";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import { useEffect, useState } from "react";
import DeveloperCountBox from "../../Components/Developer/DeveloperCountBox";
import RecentFeedbacks from "../../Components/Developer/RecentFeedbacks";
import GraphCard from "../../Components/Developer/GraphCard";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";
import PieChart from "../../Components/Developer/PieChart";
import LineGraph from "../../Components/Developer/LineGraph";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const [adminCount, setAdminCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const fetchNoOfAdmins = async () => {
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/get_no_of_admins`,
          { decryptedUID }
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
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/get_no_of_posts`,
          { decryptedUID }
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
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/get_no_of_feedbacks`,
          { decryptedUID }
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
      try {
        const res = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/get_no_of_users`,
          { decryptedUID }
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
  }, [
    decryptedUID,
    setAdminCount,
    setUsersCount,
    setPostsCount,
    setFeedbackCount,
  ]);

  const BackToLogin = () => {
    navigate("/");
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
      <div className="container-fluid" style={{ backgroundColor: "#272727" }}>
        <div className="row">
          <div
            className="col-lg-2 col-md-0 col-sm-0 col-0 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            {/* Sidebar */}
            <DeveloperSidebar />
          </div>
          {/* Analysis */}
          <div className="col-lg-10 col-md-12 col-sm-12 col-12">
            <TitleAndLogout title="Dashboard" />
            <hr className="my-3 p-0" style={{ color: "white" }} />
            <div className="row my-3">
              <div className="col-lg-3 col-6">
                <DeveloperCountBox
                  title="Total No. Of Admins"
                  count={adminCount}
                  status="+5 added"
                />
              </div>
              <div className="col-lg-3 col-6">
                <DeveloperCountBox
                  title="Total No. Of Users"
                  count={usersCount}
                  status="+5 added"
                />
              </div>
              <div className="col-lg-3 col-6">
                <DeveloperCountBox
                  title="Total No. Of Feedbacks"
                  count={feedbackCount}
                  status="+5 added"
                />
              </div>
              <div className="col-lg-3 col-6">
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
