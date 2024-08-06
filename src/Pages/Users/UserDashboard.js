import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import UserSidebar from "../../Components/Users/UserSidebar";
import BackgroundVideoCopy from "../../Components/Common/BackgroundVideoCopy";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const userProfileID = new URLSearchParams(location.search).get(
    "user_profile_id"
  );

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

  useEffect(() => {
    async function fetchData() {
      try {
        const dashboardResponse = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/get_user_data?uid=${decryptedUID}&user_profile_id=${userProfileID}`,
          { decryptedUID }
        );
        setDashboardData(dashboardResponse.data.userData);

        const postsResponse = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/get_all_posts`,
          { decryptedUID }
        );

        setPosts(postsResponse.data);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    if (decryptedUID && userProfileID) {
      fetchData();
    }
  }, [decryptedUID, userProfileID, dashboardData.profile_img]);

  const BackToLogin = () => {
    navigate("/");
  };

  if (!(decryptedUID && userProfileID)) {
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
      <DasboardNavbar />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-lg-3 col-md-0 col-sm-0 col-0 m-0 p-0"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            <UserSidebar />
          </div>
          <div className="col-lg-9 col-md-12 col-sm-12 col-12">
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
                  <div className="row text-center">
                    <div className="col-12 col-lg-4">
                      <button
                        className="btn btn-outline-dark my-2 btn-md"
                        onClick={() => setSelectedCategory("all")}
                      >
                        All Categories
                      </button>
                    </div>
                    <div className="col-6 col-lg-2">
                      <button
                        className="btn btn-outline-dark my-2 btn-md"
                        onClick={() => setSelectedCategory("1")}
                      >
                        Cultural
                      </button>
                    </div>
                    <div className="col-6 col-lg-2">
                      <button
                        className="btn btn-outline-dark my-2 btn-md"
                        onClick={() => setSelectedCategory("2")}
                      >
                        Social
                      </button>
                    </div>
                    <div className="col-6 col-lg-2">
                      {" "}
                      <button
                        className="btn btn-outline-dark my-2 btn-md"
                        onClick={() => setSelectedCategory("3")}
                      >
                        Technical
                      </button>
                    </div>
                    <div className="col-6 col-lg-2">
                      <button
                        className="btn btn-outline-dark my-2 btn-md"
                        onClick={() => setSelectedCategory("4")}
                      >
                        Placement
                      </button>
                    </div>
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
                              to={`/show_post?post_id=${post.posts_id}&uid=${encryptedUID}&user_profile_id=${userProfileID}`}
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
