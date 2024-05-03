import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import BackgroundVideo from "../../Components/Common/BackgroundVideo";

const SignUpPage = ({ handleLogin, token }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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
      const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/signup`, {
        email: formData.email,
        password: formData.password,
      });
      handleLogin(res.data.token);

      navigate(`/`);
      alert("Signed Up Successfully");
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred during sign up.");
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
              className="img-fluid"
              style={{ height: "100vh", objectFit: "cover" }}
              src="/Images/Logo 1.png"
              alt=""
            />
          </div>
          <div className="col-lg-6 m-0 p-0">
            <form
              className="glassomorphic-effect signup-container mx-auto rounded-4"
              onSubmit={handleSubmit}
            >
              <div className="text-center login-text pt-4 mx-auto mb-5">
                <h1 className="mb-3">Sign Up</h1>
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
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
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
                      className="btn btn-outline-secondary"
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
                  value="Sign Up"
                />
              </div>
              <div className="text-center p-3 ">
                <Link className="text-decoration-none blue-text" to="/">
                  Already Have An Account ? Login Here
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
