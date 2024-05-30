import { useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import { useEffect, useState } from "react";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";
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

const EditUserData = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const userProfileID = new URLSearchParams(location.search).get(
    "user_profile_id"
  );
  const [userData, setUserData] = useState({
    user_profile_id: "",
    profile_img: "",
    email: "",
    clg_address: "",
    college_name: "",
    contact: "",
    name: "",
    uid: "",
  });

  const BackToLogin = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_BASE_URL}/admin/getIndividualUserTeamData/${userProfileID}`,
          { decryptedUID }
        );

        setUserData(response.data.userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [decryptedUID, userProfileID]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profile_img" && files && files[0]) {
      setUserData((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageFile = userData.profile_img;
      const imageRef = storage
        .ref()
        .child(`profile_images/${decryptedUID}_${imageFile.name}`);
      await imageRef.put(imageFile, { contentType: "image/jpeg" });
      const imageUrl = await imageRef.getDownloadURL();

      const updatedUserData = { ...userData, profile_img: imageUrl };
      await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/admin/postIndividualUserTeamData`,
        { updatedUserData, decryptedUID }
      );

      alert("Profile SetUp Completed");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred during profile setup.");
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

  return (
    <>
      <div
        className="container-fluid"
        style={{ backgroundColor: "#272727", minHeight: "100vh" }}
      >
        <div
          className="col-lg-2 col-md-2 col-sm-3 col-3 sidebar z-2"
          style={{
            backgroundColor: "#272727",
            height: "auto",
            position: "fixed",
          }}
        >
          {/* Sidebar */}
          <DeveloperSidebar />
        </div>
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-10 col-md-9 col-sm-9 col-9 px-4">
            <TitleAndLogout title="Edit User Data" />
            <hr className="my-3 p-0" style={{ color: "white" }} />
            {userData ? (
              <div className="container mt-4 glassomorphic-effect">
                <form onSubmit={handleSubmit}>
                  <input
                    type="hidden"
                    name="admin_id"
                    value={userData.user_profile_id}
                  />
                  <div className="mb-3">
                    <label
                      htmlFor="profile_img"
                      className="form-label fw-bolder "
                      onChange={handleChange}
                      value={userData.profile_img}
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
                      value={userData.name}
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
                      value={userData.college_name}
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
                      value={userData.email}
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
                      value={userData.contact}
                      required
                    />
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      name="address"
                      className="form-control admin-profile-inputs"
                      placeholder="Leave a comment here"
                      id="address"
                      style={{ height: 100 }}
                      onChange={handleChange}
                      value={userData.clg_address}
                      required
                    />
                    <label htmlFor="address">College Address</label>
                  </div>
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
            ) : (
              <div className="container text-center fw-bold">
                <h2>Loading...</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserData;
