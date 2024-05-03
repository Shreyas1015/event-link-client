import { Link, useLocation, useNavigate } from "react-router-dom";
// import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import { useState } from "react";
import axios from "axios";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";

const AddClient = ({ token }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const uid = new URLSearchParams(location.search).get("uid");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    user_type: "",
    password: "",
    confirmPassword: "",
  });

  console.log("UserId: ", uid);

  const BackToLogin = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/add_client`,
        formData,
        {
          headers,
        }
      );
      alert("Client Registered Successfully");
      window.location.reload();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred during Adding Client.");
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
          {/* Analysis */}
          <div className="col-lg-2"></div>
          <div className="col-lg-10 col-md-9 col-sm-9 col-9 px-4">
            <TitleAndLogout title="Clients Data" />
            <hr className="my-3 p-0" style={{ color: "white" }} />

            <div className="container-fluid glassomorphic-effect px-5 py-3 rounded-4">
              <div className="row">
                <div className="col-lg-6">
                  <h2 className="text-blue pt-3">Adding Client Form</h2>
                </div>
                <div className="col-lg-6 text-end py-auto">
                  <div className="text-end mt-3">
                    <Link
                      to={`/developerhandleclients?uid=${uid}`}
                      className="text-decoration-none"
                    >
                      <button className="btn blue-buttons btn-lg mx-3">
                        Client Data
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              <hr className="text-light" />
              <form className="mx-auto" onSubmit={handleSubmit}>
                <div className="form-container border rounded-4 p-4 mx-auto">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-blue">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      placeholder="name@gmail.com"
                      required
                      onChange={handleChange}
                      value={formData.email}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="user_type" className="form-label text-blue">
                      User Type
                    </label>
                    <select
                      id="user_type"
                      required
                      name="user_type"
                      className="form-select"
                      aria-label="Default select example"
                      onChange={handleChange}
                      value={formData.user_type}
                    >
                      <option defaultValue>Open this select menu</option>
                      <option value={1}>Admin</option>
                      <option value={2}>User</option>
                      <option value={3}>Developer</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label text-blue">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        id="password"
                        placeholder="At least 8-20 charac."
                        required
                        onChange={handleChange}
                        value={formData.password}
                      />
                      <button
                        className="btn blue-buttons"
                        type="button"
                        onClick={handleTogglePassword}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="confirmPassword"
                      className="form-label text-blue"
                    >
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        required
                        onChange={handleChange}
                        value={formData.confirmPassword}
                      />
                      <button
                        className="btn blue-buttons"
                        type="button"
                        onClick={handleToggleConfirmPassword}
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>
                  <span className="text-danger p-2">{errorMessage}</span>
                  <br />
                  <input
                    className="btn px-4 py-2"
                    style={{ backgroundColor: "#62c1bf", color: "white" }}
                    type="submit"
                    value="Add Client"
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

export default AddClient;
