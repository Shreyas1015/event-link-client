import React, { useState, useEffect } from "react";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import UserSidebar from "../../Components/Users/UserSidebar";

const ShowPost = ({ token }) => {
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  const userProfileID = new URLSearchParams(location.search).get(
    "user_profile_id"
  );
  const postID = new URLSearchParams(location.search).get("post_id");
  const [formData, setFormData] = useState({
    posts_id: postID,
    cover_img: "",
    event_date: "",
    event_name: "",
    event_desc: "",
    category_id: "",
    contact: "",
    email: "",
    google_form_link: "",
    venue: "",
  });

  useEffect(() => {
    async function fetchPostData() {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const getPostUrl = `${process.env.REACT_APP_BASE_URL}/show_post/${postID}`;

        const postResponse = await axios.get(getPostUrl, { headers });

        const postData = postResponse.data;
        setFormData({
          posts_id: postData.posts_id,
          cover_img: postData.cover_img,
          event_date: postData.event_date,
          event_name: postData.event_name,
          event_desc: postData.event_desc,
          category_id: postData.category_id,
          contact: postData.contact,
          email: postData.email,
          google_form_link: postData.google_form_link,
          venue: postData.venue,
        });
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    }

    fetchPostData();
  }, [postID, token]);

  return (
    <>
      <DasboardNavbar />
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-lg-3 col-md-3 col-sm-3 col-3 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            <UserSidebar />
          </div>
          <div className="col-lg-9 col-md-9 col-sm-9 col-9">
            <div className="container my-5 ">
              <div className="container glassomorphic-effect rounded-4 show-post-container mx-auto p-0 rounded-4 overflow-hidden">
                {/* Image */}
                <div className="mb-3">
                  <img
                    className="show-post-image"
                    src={formData.cover_img}
                    alt="Cover_img"
                  />
                </div>
                {/* Event Title */}
                <div className="mb-3 show-post-title position-absolute ">
                  <h1
                    className="fw-bold show-post-title-text p-4 bordered-text"
                    style={{
                      filter: "drop-shadow(10px 10px 5px rgba(0, 0, 0, 0.5))",
                    }}
                  >
                    {formData.event_name.toUpperCase()}
                  </h1>
                </div>
                <div className="row mb-3">
                  <div className="col-lg-6 border-end ps-5 pe-3 py-2">
                    {/* Desc */}
                    <div className="form-floating">
                      <p>
                        <span className="fw-semibold fs-5 blue-text">
                          Event Desc :{" "}
                        </span>
                        " {formData.event_desc} "
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-6 ps-3 pe-5 py-2">
                    <div className="mb-3">
                      <h5 className="blue-text fw-semibold">Event Venue : </h5>
                      <a href={formData.venue} target="blank">
                        {formData.venue}
                      </a>
                      <hr />
                      <h5 className="blue-text fw-semibold">
                        Contact Details :{" "}
                      </h5>
                      <p>
                        "The upcoming event is scheduled to be held on the
                        specified date{" "}
                        <span className="blue-text fw-bolder">
                          {new Date(formData.event_date).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                        . If you have any questions or need more information,
                        please don't hesitate to reach out to us. You can
                        contact us via phone at{" "}
                        <span className="blue-text fw-bolder">
                          {formData.contact}
                        </span>{" "}
                        or email us at{" "}
                        <span className="blue-text fw-bolder">
                          {formData.email}
                        </span>{" "}
                        ."
                      </p>
                    </div>
                  </div>
                </div>

                {/* google_form_link  */}
                <div className="mb-5 text-center">
                  <h5 className="mx-4 blue-text fw-semibold">
                    {" "}
                    Kindly register for the event by using the following Google
                    Form link.{" "}
                    <a href={formData.google_form_link} target="blank">
                      {formData.google_form_link}
                    </a>
                  </h5>
                </div>
                <Link
                  to={`/userdashboard?uid=${uid}&user_profile_id=${userProfileID}`}
                  className="mb-3 text-decoration-none"
                >
                  <button className="btn btn-lg blue-buttons admin-profile-inputs">
                    Back to Profile
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowPost;
