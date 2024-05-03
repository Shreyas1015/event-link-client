import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import UserSidebar from "../../Components/Users/UserSidebar";

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

const UserProfile = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  console.log("UserId: ", uid);

  const [errorMessage, setErrorMessage] = useState("");
  const [userProfileID, setUserProfileID] = useState("");
  const [formData, setFormData] = useState({
    profile_img: "",
    uid: uid,
    name: "",
    college_name: "",
    email: "",
    contact: "",
    clg_address: "",
  });

  useEffect(() => {
    async function fetchUserProfileID() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_user_profile_id?uid=${uid}`
        );
        const fetchedUserProfileID = response.data.user_profile_id;
        console.log("Fetched User Profile ID:", fetchedUserProfileID);
        setUserProfileID(fetchedUserProfileID);
        console.log("Response from API:", response.data);
      } catch (error) {
        console.error("Error fetching user_profile_id:", error);
      }
    }
    fetchUserProfileID();
  }, [uid]);

  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUserProfileData() {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        if (userProfileID) {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/get_user_profile_data?user_profile_id=${userProfileID}`,
            { headers }
          );

          const profileData = response.data;

          setFormData({
            profile_img: profileData.profile_img,
            uid: uid,
            name: profileData.name,
            college_name: profileData.college_name,
            email: profileData.email,
            contact: profileData.contact,
            clg_address: profileData.clg_address,
          });
        }
      } catch (error) {
        console.error("Error fetching admin profile data:", error);
      }
    }

    fetchUserProfileData();
  }, [storedToken, userProfileID, uid]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_img" && files && files[0]) {
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

  const BackToLogin = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const imageFile = formData.profile_img;
      const imageRef = storage
        .ref()
        .child(`profile_images/${uid}_${imageFile.name}`);
      await imageRef.put(imageFile, { contentType: "image/jpeg" });
      const imageUrl = await imageRef.getDownloadURL();

      const updatedFormData = { ...formData, profile_img: imageUrl };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/user_profile_setup`,
        updatedFormData,
        { headers }
      );

      alert("Profile SetUp Completed");
      const newuserProfileID = response.data.user_profile_id;

      if (userProfileID) {
        navigate(`/userdashboard?uid=${uid}&user_profile_id=${userProfileID}`);
      } else {
        setUserProfileID(newuserProfileID);
        navigate(
          `/userdashboard?uid=${uid}&user_profile_id=${newuserProfileID}`
        );
      }

      setFormData({
        name: "",
        profile_img: "",
        college_name: "",
        email: "",
        contact: "",
        clg_address: "",
      });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred during profile setup.");
      }
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

  const updateNote = (
    <div className="mb-3">
      <p className="text-info">
        To Update Your Profile Image please Fill out the Image field without
        fail !!
      </p>
    </div>
  );
  return (
    <>
      <DasboardNavbar />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div
            className="col-lg-3 col-md-3 col-sm-3 col-3 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            {/* My Profile */}
            <UserSidebar />
          </div>
          {/* Analysis */}
          <div className="col-lg-9 col-md-9 col-sm-9 col-9">
            <div className="container my-3">
              <h1 className="fw-bolder">My Profile</h1>
              <hr />
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="uid" value={formData.uid} />
                <div className="mb-3">
                  <label
                    htmlFor="profile_img"
                    className="form-label fw-bolder "
                    onChange={handleChange}
                    value={formData.profile_img}
                  >
                    Profile Pic :
                  </label>
                  <input
                    type="file"
                    name="profile_img"
                    className="form-control admin-profile-inputs"
                    id="profile_img"
                    accept="image/*"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-bolder ">
                    Full Name :
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control admin-profile-inputs"
                    id="name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="college_name"
                    className="form-label fw-bolder "
                  >
                    College Name :
                  </label>
                  <input
                    type="text"
                    name="college_name"
                    className="form-control admin-profile-inputs"
                    id="college_name"
                    onChange={handleChange}
                    value={formData.college_name}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-bolder ">
                    Email :
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control admin-profile-inputs"
                    id="email"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="contact" className="form-label fw-bolder ">
                    Contact :
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    className="form-control admin-profile-inputs"
                    placeholder="888 888 8888"
                    maxLength="10"
                    onChange={handleChange}
                    value={formData.contact}
                    required
                  />
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    name="clg_address"
                    className="form-control admin-profile-inputs"
                    placeholder="Leave a comment here"
                    id="clg_address"
                    style={{ height: 100 }}
                    onChange={handleChange}
                    value={formData.clg_address}
                    required
                  />
                  <label htmlFor="clg_address">College Address</label>
                </div>
                {updateNote}
                <div className="mb-3">
                  <h3>{errorMessage}</h3>
                </div>
                <div className="mb-3">
                  <input
                    type="submit"
                    className="btn blue-buttons admin-profile-inputs"
                    value="Submit"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
