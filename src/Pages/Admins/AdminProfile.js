import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";

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

const AdminProfile = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  console.log("UserId: ", uid);

  const [errorMessage, setErrorMessage] = useState("");
  const [adminID, setAdminID] = useState("");
  const [formData, setFormData] = useState({
    profile_img: "",
    uid: uid,
    college_name: "",
    email: "",
    contact: "",
    address: "",
  });

  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    async function fetchAdminID() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/get_admin_id?uid=${uid}`
        );
        const fetchedAdminID = response.data.admin_id;
        console.log("Fetched admin ID:", fetchedAdminID);
        setAdminID(fetchedAdminID);
        console.log("Response from API:", response.data);
      } catch (error) {
        console.error("Error fetching admin_id:", error);
      }
    }
    fetchAdminID();
  }, [uid]);

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

  useEffect(() => {
    async function fetchAdminProfileData() {
      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };
        if (adminID) {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/get_admin_profile_data?admin_id=${adminID}`,
            { headers }
          );

          const profileData = response.data;

          setFormData({
            profile_img: profileData.profile_img,
            uid: uid,
            college_name: profileData.college_name,
            email: profileData.email,
            contact: profileData.contact,
            address: profileData.address,
          });
        }
      } catch (error) {
        console.error("Error fetching admin profile data:", error);
      }
    }

    fetchAdminProfileData();
  }, [storedToken, adminID, uid]);

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
        `${process.env.REACT_APP_BASE_URL}/profile_setup`,
        updatedFormData,
        { headers }
      );

      alert("Profile SetUp Completed");
      const newAdminID = response.data.admin_id;

      if (adminID) {
        navigate(`/addpost?uid=${uid}&admin_id=${adminID}`);
      } else {
        setAdminID(newAdminID);
        navigate(`/addpost?uid=${uid}&admin_id=${newAdminID}`);
      }

      setFormData({
        profile_img: "",
        college_name: "",
        email: "",
        contact: "",
        address: "",
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
            <AdminSidebar />
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
                    name="address"
                    className="form-control admin-profile-inputs"
                    placeholder="Leave a comment here"
                    id="address"
                    style={{ height: 100 }}
                    onChange={handleChange}
                    value={formData.address}
                    required
                  />
                  <label htmlFor="address">College Address</label>
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

export default AdminProfile;
