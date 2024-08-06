import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundVideo from "../../Components/Common/BackgroundVideo";
import axiosInstance from "../../API/axiosInstance";
import secureLocalStorage from "react-secure-storage";
import toast from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginRes = await axiosInstance.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        formData
      );
      const userId = loginRes.data.uid;
      const userType = loginRes.data.user_type;

      secureLocalStorage.setItem("uid", userId);
      secureLocalStorage.setItem("user_type", userType);

      const encryptedUID = localStorage.getItem("@secure.n.uid");
      const decryptedUserType = secureLocalStorage.getItem("user_type");

      if (decryptedUserType == 1) {
        navigate(`/adminprofile?uid=${encryptedUID}`);
      } else if (decryptedUserType == 2) {
        navigate(`/userprofile?uid=${encryptedUID}`);
      } else if (decryptedUserType == 3) {
        navigate(`/developerdashboard?uid=${encryptedUID}`);
      }
      toast.success("Logged In Successfully");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  return (
    <>
      <div className="container-fluid">
        <BackgroundVideo />
        <div className="row">
          <div className="col-lg-6 m-0 p-0">
            <img
              className="img-fluid d-none d-lg-block"
              style={{ height: "100vh", objectFit: "cover" }}
              src="/Images/Logo 1.png"
              alt=""
            />
          </div>
          <div className="col-lg-6 m-0 p-0">
            <form
              className="glassomorphic-effect login-container mx-auto rounded-4"
              onSubmit={handleSubmit}
            >
              <div className="text-center login-text pt-4 mx-auto mb-5">
                <h1 className="mb-3">Login</h1>
                <i>
                  "Connecting Minds, Bridging Futures: Your Hub for Technical,
                  Social, Cultural, and Placement Events !!"
                </i>
              </div>
              <div className="form-container pb-4 mx-auto">
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
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
                  <label htmlFor="password" className="form-label">
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
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <br />
                <div className="row">
                  <div className="col-lg-6">
                    <input
                      className="btn px-4 py-2"
                      style={{ backgroundColor: "#62c1bf", color: "white" }}
                      type="submit"
                      value="Login"
                    />
                  </div>
                  <div className="col-lg-6 p-1 text-center">
                    <Link
                      className="text-decoration-none blue-text "
                      to="/forgetPass"
                    >
                      Forgot Password ?
                    </Link>
                  </div>
                </div>
              </div>
              <div className="text-center p-3 ">
                <Link className="text-decoration-none blue-text" to="/signup">
                  Don't Have An Account ? SignUp Here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
