import React, { useState } from "react";
import DasboardNavbar from "../../Components/Common/DasboardNavbar";
import AdminSidebar from "../../Components/Admin/AdminSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
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

const AddPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");
  const adminID = new URLSearchParams(location.search).get("admin_id");
  const [formData, setFormData] = useState({
    cover_img: "",
    event_date: "",
    event_name: "",
    event_desc: "",
    category_id: "",
    contact: "",
    email: "",
    venue: "",
    google_form_link: "",
    uid: decryptedUID,
    admin_id: adminID,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "cover_img" && files && files[0]) {
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
      const imageFile = formData.cover_img;
      const imageRef = storage
        .ref()
        .child(`All_Posts_Images/${decryptedUID}_${imageFile.name}`);
      await imageRef.put(imageFile, { contentType: "image/jpeg" });
      const imageUrl = await imageRef.getDownloadURL();

      const updatedFormData = { ...formData, cover_img: imageUrl };

      const res = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/c-admin/add_posts`,
        {
          updatedFormData,
          decryptedUID,
        }
      );

      if (res.status === 201) {
        const postID = res.data.post_id;
        secureLocalStorage.setItem("post_id", postID);
        toast.success("Post Added Successfully");

        setFormData({
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
      }

      navigate(`/dashboard?uid=${encryptedUID}&admin_id=${adminID}`);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during post addition.");
      }
    }
  };

  const BackToLogin = () => {
    navigate("/");
  };

  if (!(decryptedUID && adminID)) {
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
            className="col-lg-3 col-md-0 col-sm-0 col-0 sidebar"
            style={{ backgroundColor: "#272727", height: "auto" }}
          >
            <AdminSidebar />
          </div>
          <div className="col-lg-9 col-md-12 col-sm-12 col-12">
            <div className="container my-3">
              <h1>Add Posts</h1>
              <hr />
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="uid" value={formData.uid} />
                <input
                  type="hidden"
                  name="admin_id"
                  value={formData.admin_id}
                />
                <div className="mb-3">
                  <label
                    htmlFor="cover_img"
                    className="form-label fw-bolder"
                    onChange={handleChange}
                    value={formData.cover_img}
                  >
                    Cover Img:
                  </label>
                  <input
                    type="file"
                    name="cover_img"
                    className="form-control admin-profile-inputs"
                    id="cover_img"
                    accept="image/*"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="event_name" className="form-label fw-bolder ">
                    Event Name :
                  </label>
                  <input
                    type="text"
                    name="event_name"
                    className="form-control admin-profile-inputs"
                    id="event_name"
                    required
                    onChange={handleChange}
                    value={formData.event_name}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="event_date" className="form-label fw-bolder ">
                    Event Date :
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    className="form-control admin-profile-inputs"
                    id="event_date"
                    required
                    onChange={handleChange}
                    value={formData.event_date}
                  />
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    name="event_desc"
                    className="form-control admin-profile-inputs"
                    placeholder="Leave a comment here"
                    id="event_desc"
                    style={{ height: 100 }}
                    onChange={handleChange}
                    value={formData.event_desc}
                  />
                  <label htmlFor="event_desc">Event Description</label>
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="category_id"
                    className="form-label fw-bolder "
                  >
                    Category :
                  </label>
                  <select
                    name="category_id"
                    className="form-control admin-profile-inputs"
                    id="category_id"
                    required
                    onChange={handleChange}
                    value={formData.category_id}
                    aria-label="Default select example"
                  >
                    <option value="">Open this select menu</option>
                    <option value="1">Cultural</option>
                    <option value="2">Social</option>
                    <option value="3">Technical</option>
                    <option value="4">Placement</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="venue" className="form-label fw-bolder ">
                    Event Venue :
                  </label>
                  <input
                    type="text"
                    name="venue"
                    className="form-control admin-profile-inputs"
                    id="venue"
                    required
                    placeholder="Enter location (Google Maps URL)"
                    onChange={handleChange}
                    value={formData.venue}
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
                    required
                    onChange={handleChange}
                    value={formData.contact}
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
                    required
                    onChange={handleChange}
                    value={formData.email}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="google_form_link"
                    className="form-label fw-bolder "
                  >
                    Google Form Link :
                  </label>
                  <input
                    type="url"
                    name="google_form_link"
                    className="form-control admin-profile-inputs"
                    id="google_form_link"
                    required
                    onChange={handleChange}
                    value={formData.google_form_link}
                  />
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

export default AddPost;
