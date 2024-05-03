import React, { useEffect, useState } from "react";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import BackgroundVideoCopy from "../../Components/Common/BackgroundVideoCopy";

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  const adminID = new URLSearchParams(location.search).get("admin_id");

  console.log("Received Token:", token);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profile_img: "",
    college_name: "",
    contact: "",
    email: "",
  });

  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching dashboard data and posts...");

        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        const dashboardResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_admin_data?uid=${uid}&admin_id=${adminID}`,
          { headers }
        );
        console.log("Dashboard data response:", dashboardResponse.data);
        console.log("Title Image URL:", dashboardData.profile_img);
        setDashboardData(dashboardResponse.data.adminData);

        const postsResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_posts?uid=${uid}&admin_id=${adminID}`,
          { headers }
        );
        console.log("Posts response:", postsResponse.data);
        setPosts(postsResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    if (uid && adminID && storedToken) {
      fetchData();
    }
  }, [uid, adminID, storedToken, dashboardData.profile_img]);

  const BackToLogin = () => {
    navigate("/");
  };

  const handleDelete = async (postID) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/delete_post/${postID}`,
        {
          headers,
        }
      );

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.posts_id !== postID)
      );
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (!(uid && adminID)) {
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

  if (!storedToken) {
    return (
      <>
        <div className="container text-center fw-bold">
          <h2>LOGIN TO ACCESS FURTHER</h2>
          <button onClick={BackToLogin} className="btn blue-buttons">
            Back to Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <DasboardNavbar />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-lg-3 col-md-3 col-sm-3 col-3 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            <AdminSidebar uid={uid} adminID={adminID} />
          </div>
          <div className="col-lg-9 col-md-9 col-sm-9 col-9">
            <div className="containers" style={{ width: "100%" }}>
              <BackgroundVideoCopy />
            </div>
            <div className="container my-3">
              {/* Dashboard Profile */}
              <div className="dashboard-info dashboard-top-bin glassomorphic-effect rounded-4">
                {/* <div className="container-fluid"> */}
                <img
                  className="img-fluid dashboard-background-img"
                  src="/Images/ec9eeefc-739d-4dbe-98ec-7862d163050e.jpeg"
                  alt=""
                />
                {/* </div> */}
                <hr className="m-0 p-0" />
                <div className="container-fluid profile-info text-end px-3 pt-3 pb-5">
                  <h2 className="">
                    {dashboardData.college_name.toUpperCase()}
                  </h2>
                  <p className="text-secondary">
                    CONTACT: {dashboardData.contact}
                  </p>
                  <p className="text-secondary">EMAIL: {dashboardData.email}</p>
                </div>
                <div className="container">
                  <div className="profile-img-container ">
                    {dashboardData.profile_img ? (
                      <img
                        src={dashboardData.profile_img}
                        alt="Dashboard Title"
                        className="dashboard-title-img rounded-5"
                        onError={() => console.log("Title Image Load Error")}
                      />
                    ) : (
                      <p>No title image available</p>
                    )}
                  </div>
                </div>
              </div>
              <hr />
              <h2>YOUR POSTS</h2>
              <div className="row">
                {isLoading ? (
                  <p>Loading posts...</p>
                ) : (
                  posts.map((post) => (
                    <div className="col-lg-4" key={post.posts_id}>
                      <div
                        className="card my-4 mx-auto glassomorphic-effect"
                        style={{ width: "20rem" }}
                      >
                        {post.cover_img ? (
                          <img
                            src={post.cover_img}
                            className="card-img-top img-fluid posts_cards"
                            alt="..."
                          />
                        ) : (
                          <p>No cover image available</p>
                        )}

                        <div className="card-body">
                          <h5
                            className="card-sub-title"
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <span className="fw-bolder">EVENT NAME : </span>
                            {post.event_name.toUpperCase()}
                          </h5>
                          <p
                            className="card-text"
                            style={{
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                            // style={{ height: "3rem", overflow: "hidden" }}
                          >
                            Description : {post.event_desc}
                          </p>
                          <p className="card-text">
                            Date:{" "}
                            {new Date(post.event_date).toLocaleDateString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                          <Link
                            to={`/edit_post?post_id=${post.posts_id}&admin_id=${post.admin_id}&uid=${post.uid}`}
                            className="post-link text-decoration-none"
                          >
                            <button className="btn blue-buttons me-4">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(post.posts_id)}
                            className="btn blue-buttons ms-4"
                          >
                            Delete Post
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
