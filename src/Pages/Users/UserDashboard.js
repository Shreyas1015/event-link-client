import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import UserSidebar from "../../Components/Users/UserSidebar";
import BackgroundVideoCopy from "../../Components/Common/BackgroundVideoCopy";

const UserDashboard = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  const userProfileID = new URLSearchParams(location.search).get(
    "user_profile_id"
  );
  console.log("Received Token:", token);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dashboardData, setDashboardData] = useState({
    profile_img: "",
    name: "",
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
          `${process.env.REACT_APP_BASE_URL}/get_user_data?uid=${uid}&user_profile_id=${userProfileID}`,
          { headers }
        );
        console.log("Dashboard data response:", dashboardResponse.data);
        console.log("Title Image URL:", dashboardData.profile_img);
        setDashboardData(dashboardResponse.data.userData);

        const postsResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_all_posts`,
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

    if (uid && userProfileID && storedToken) {
      fetchData();
    }
  }, [uid, userProfileID, storedToken, dashboardData.profile_img]);

  const BackToLogin = () => {
    navigate("/");
  };

  if (!(uid && userProfileID)) {
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
            className="col-lg-3 col-md-3 col-sm-3 col-3 m-0 p-0"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            <UserSidebar uid={uid} adminID={userProfileID} />
          </div>
          {/* <div className="col-lg-3 col-md-3 col-sm-3 col-3 m-0 p-0"></div> */}
          <div className="col-lg-9 col-md-9 col-sm-9 col-9">
            <div className="containers" style={{ width: "100%" }}>
              <BackgroundVideoCopy />
            </div>

            <div className="container my-3">
              {/* Dashboard Profile */}
              <div className="dashboard-info dashboard-top-bin glassomorphic-effect rounded-4 my-5 ">
                <img
                  className="img-fluid dashboard-background-img"
                  src="/Images/ec9eeefc-739d-4dbe-98ec-7862d163050e.jpeg"
                  alt=""
                />
                <hr />
                <div className="container-fluid profile-info text-end px-3 pt-3 pb-5">
                  <h2 className="">{dashboardData.name.toUpperCase()}</h2>
                  <p className="">{dashboardData.college_name}</p>
                  <p className="me-2">Contact: {dashboardData.contact}</p>
                  <p className="ms-2">Email: {dashboardData.email}</p>
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
              {/* Filter Button & Title  */}

              <div className="row my-3">
                <div className="col-lg-3 m-0 py-1 ps-4 pe-0">
                  <label
                    htmlFor="categorySelect"
                    className="form-label fw-bolder fs-4 my-2"
                    style={{ color: "#62c1bf" }}
                  >
                    FILTER BY CATEGORY:
                  </label>
                </div>
                <div className="col-lg-9">
                  <div className="my-1">
                    <button
                      className="btn btn-outline-dark mx-2 btn-lg"
                      onClick={() => setSelectedCategory("all")}
                    >
                      All Categories
                    </button>
                    <button
                      className="btn btn-outline-dark mx-2 btn-lg"
                      onClick={() => setSelectedCategory("1")}
                    >
                      Cultural
                    </button>
                    <button
                      className="btn btn-outline-dark mx-2 btn-lg"
                      onClick={() => setSelectedCategory("2")}
                    >
                      Social
                    </button>
                    <button
                      className="btn btn-outline-dark mx-2 btn-lg"
                      onClick={() => setSelectedCategory("3")}
                    >
                      Technical
                    </button>
                    <button
                      className="btn btn-outline-dark mx-2 btn-lg"
                      onClick={() => setSelectedCategory("4")}
                    >
                      Placement
                    </button>
                  </div>
                </div>
              </div>

              {/* All Posts  */}
              <div className="row">
                {isLoading ? (
                  <p>Loading posts...</p>
                ) : (
                  posts
                    .filter(
                      (post) =>
                        selectedCategory === "all" ||
                        post.category_id === parseInt(selectedCategory)
                    )
                    .map((post) => (
                      <div className="col-lg-4" key={post.posts_id}>
                        <div
                          className="card my-3 mx-auto glassomorphic-effect"
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
                            {/* <h3 className="card-title">{post.college_name}</h3> */}
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
                              className="card-text text-secondary"
                              style={{ height: "3rem", overflow: "hidden" }}
                            >
                              Description : {post.event_desc}
                            </p>
                            <p className="card-text text-secondary">
                              Date :{" "}
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
                              to={`/show_post?post_id=${post.posts_id}&uid=${uid}&user_profile_id=${userProfileID}`}
                              className="post-link text-decoration-none"
                            >
                              <button className="btn blue-buttons me-4">
                                View Post
                              </button>
                            </Link>
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

export default UserDashboard;
