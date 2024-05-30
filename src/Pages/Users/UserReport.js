import React, { useState } from "react";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import RatingInput from "../../Components/Common/RatingInput";
import UserSidebar from "../../Components/Users/UserSidebar";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";

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

const storage = firebase.storage();

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const userProfileID = new URLSearchParams(location.search).get(
    "user_profile_id"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedback_id: "",
    feedback_subject: "",
    feedback_desc: "",
    ratings: "",
    attachments: "",
    contact_preference_id: "",
    uid: decryptedUID,
    user_profile_id: userProfileID,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachments" && files && files[0]) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageFile = formData.attachments;
      const imageRef = storage
        .ref()
        .child(`Feebacks/${decryptedUID}_${imageFile.name}`);
      await imageRef.put(imageFile, { contentType: "image/jpeg" });
      const imageUrl = await imageRef.getDownloadURL();

      const updatedFormData = {
        ...formData,
        attachments: imageUrl,
        ratings: formData.ratings,
      };

      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/user/submit_user_feedback`,
        { updatedFormData, decryptedUID }
      );

      alert("FeedBack Submitted Successfully");
      setFormData({
        name: "",
        email: "",
        feedback_id: "",
        feedback_subject: "",
        feedback_desc: "",
        ratings: "",
        attachments: "",
        contact_preference_id: "",
      });

      navigate(
        `/userdashboard?uid=${encryptedUID}&user_profile_id=${userProfileID}`
      );
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred during post addition.");
      }
    }
  };

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
            className="col-lg-3 col-md-3 col-sm-3 col-3 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            <UserSidebar />
          </div>
          <div className="col-lg-9 col-md-9 col-sm-9 col-9">
            <div className="container my-3">
              <h1>Report / FeedBack</h1>
              <hr />
              <form onSubmit={handleSubmit}>
                {/* uid */}
                <input type="hidden" name="uid" value={formData.uid} />
                {/* userProfileID */}
                <input
                  type="hidden"
                  name="user_profile_id"
                  value={formData.user_profile_id}
                />
                {/* Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bolder ">
                    Name :
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control admin-profile-inputs"
                    id="name"
                    required
                    onChange={handleChange}
                    value={formData.name}
                  />
                </div>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bolder ">
                    Email :
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control admin-profile-inputs"
                    id="email"
                    required
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>
                {/* Feedback Type  */}
                <div className="mb-3">
                  <label
                    htmlFor="feedback_id"
                    className="form-label fw-bolder "
                  >
                    Feedback Type :
                  </label>
                  <select
                    name="feedback_id"
                    className="form-control admin-profile-inputs"
                    id="feedback_id"
                    required
                    onChange={handleChange}
                    value={formData.feedback_id}
                    aria-label="Default select example"
                  >
                    <option value="">Open this select menu</option>
                    <option value="1">General Feedback</option>
                    <option value="2">Bug Report</option>
                    <option value="3">Feature Request</option>
                    <option value="4">Suggestion</option>
                    <option value="5">Other</option>
                  </select>
                </div>
                {/* Feedback Subject */}
                <div className="mb-3">
                  <label
                    htmlFor="feedback_subject"
                    className="form-label fw-bolder "
                  >
                    FeedBack Subject :
                  </label>
                  <input
                    type="text"
                    name="feedback_subject"
                    className="form-control admin-profile-inputs"
                    id="feedback_subject"
                    required
                    onChange={handleChange}
                    value={formData.feedback_subject}
                  />
                </div>
                {/* Feedback Description */}
                <div className="form-floating mb-3">
                  <textarea
                    name="feedback_desc"
                    className="form-control admin-profile-inputs"
                    placeholder="Leave a comment here"
                    id="feedback_desc"
                    style={{ height: 100 }}
                    onChange={handleChange}
                    value={formData.feedback_desc}
                  />
                  <label htmlFor="feedback_desc">FeedBack Description</label>
                </div>
                {/* Rating */}
                <div className="mb-3">
                  <label htmlFor="ratings" className="form-label fw-bolder">
                    Rating:
                  </label>
                  <RatingInput
                    value={formData.ratings}
                    onChange={(value) => {
                      setFormData({ ...formData, ratings: value });
                    }}
                  />
                </div>
                {/* Attachments */}
                <div className="mb-3">
                  <label
                    htmlFor="attachments"
                    className="form-label fw-bolder"
                    onChange={handleChange}
                    value={formData.attachments}
                  >
                    Attachement :
                  </label>{" "}
                  (Optional)
                  <input
                    type="file"
                    name="attachments"
                    className="form-control admin-profile-inputs"
                    id="attachments"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
                {/* Contact Preference */}
                <div className="mb-3">
                  <label
                    htmlFor="contactPreference"
                    className="form-label fw-bolder"
                  >
                    Contact Preference:
                  </label>
                  <select
                    id="contactPreference"
                    name="contact_preference_id"
                    className="form-control admin-profile-inputs"
                    value={formData.contact_preference_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Contact Preference</option>
                    <option value="1">Email</option>
                    <option value="2">Phone</option>
                    <option value="3">No follow-up needed</option>
                  </select>
                </div>
                {/* Submit Button */}
                <div className="mb-3">
                  <input
                    type="submit"
                    className="btn blue-buttons admin-profile-inputs"
                    value="Submit"
                  />
                </div>
                <div className="mb-3">
                  <h3>{errorMessage}</h3>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Report;
