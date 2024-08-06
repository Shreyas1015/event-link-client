import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import UserSidebar from "../../Components/Users/UserSidebar";
import secureLocalStorage from "react-secure-storage";
import axiosInstance from "../../API/axiosInstance";
import toast from "react-hot-toast";

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

const UserProfile = () => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("uid");
  const [userProfileID, setUserProfileID] = useState("");
  const [formData, setFormData] = useState({
    profile_img: "",
    uid: decryptedUID,
    name: "",
    college_name: "",
    email: "",
    contact: "",
    clg_address: "",
  });

  useEffect(() => {
    async function fetchUserProfileID() {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/user/get_user_profile_id?uid=${decryptedUID}`,
          { decryptedUID }
        );
        const fetchedUserProfileID = response.data.user_profile_id;

        setUserProfileID(fetchedUserProfileID);
      } catch (error) {
        console.error("Error fetching user_profile_id:", error);
      }
    }
    fetchUserProfileID();
  }, [decryptedUID]);

  useEffect(() => {
    async function fetchUserProfileData() {
      try {
        if (userProfileID) {
          const response = await axiosInstance.post(
            `${process.env.REACT_APP_BASE_URL}/user/get_user_profile_data?user_profile_id=${userProfileID}`,
            { decryptedUID }
          );

          const profileData = response.data;

          setFormData({
            profile_img: profileData.profile_img,
            uid: decryptedUID,
            name: profileData.name,
            college_name: profileData.college_name,
            email: profileData.email,
            contact: profileData.contact,
            clg_address: profileData.clg_address,
          });
        }
      } catch (error) {
        toast.error("Error fetching admin profile data:", error);
      }
    }

    fetchUserProfileData();
  }, [userProfileID, decryptedUID]);

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
      const imageFile = formData.profile_img;
      const imageRef = storage
        .ref()
        .child(`profile_images/${decryptedUID}_${imageFile.name}`);
      await imageRef.put(imageFile, { contentType: "image/jpeg" });
      const imageUrl = await imageRef.getDownloadURL();

      const updatedFormData = { ...formData, profile_img: imageUrl };

      const response = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/user/user_profile_setup`,
        { updatedFormData, decryptedUID }
      );

      toast.success("Profile SetUp Completed");
      const newuserProfileID = response.data.user_profile_id;

      if (userProfileID) {
        navigate(
          `/userdashboard?uid=${encryptedUID}&user_profile_id=${userProfileID}`
        );
      } else {
        setUserProfileID(newuserProfileID);
        navigate(
          `/userdashboard?uid=${encryptedUID}&user_profile_id=${newuserProfileID}`
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
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during profile setup.");
      }
    }
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
            className="col-lg-3 col-md-0 col-sm-0 col-0 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            {/* My Profile */}
            <UserSidebar />
          </div>
          {/* Analysis */}
          <div className="col-lg-9 col-md-12 col-sm-12 col-12">
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
