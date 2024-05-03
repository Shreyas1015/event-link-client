import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Authentications/LoginPage";
import Dashboard from "./Pages/Admins/Dashboard";
import AddPost from "./Pages/Admins/AddPost";
import AdminProfile from "./Pages/Admins/AdminProfile";
import SignUpPage from "./Pages/Authentications/SignUpPage";
import EditPost from "./Pages/Admins/EditPost";
import UserProfile from "./Pages/Users/UserProfile";
import UserDashboard from "./Pages/Users/UserDashboard";
import ShowPost from "./Pages/Users/ShowPost";
import ForgetPass from "./Pages/Authentications/ForgetPass";
import ResetPass from "./Pages/Authentications/ResetPass";
import Report from "./Pages/Common/Report";
import UserReport from "./Pages/Users/UserReport";
import DeveloperDashboard from "./Pages/Developer/DeveloperDashboard";
import AdminData from "./Pages/Developer/AdminsData";
import EditAdminData from "./Pages/Developer/EditAdminData";
import EditUserData from "./Pages/Developer/EditUserData";
import UsersData from "./Pages/Developer/UsersData";
import HandleClients from "./Pages/Developer/HandleClients";
import AddClient from "./Pages/Developer/AddClient";
import AllFeedbacks from "./Pages/Developer/AllFeedbacks";
import ResolvedFeedbacks from "./Pages/Developer/ResolvedFeedbacks";
import Linegraph from "./Pages/Developer/LineGraph";
import PieChart from "./Pages/Developer/PieChart";
import BarGraph from "./Pages/Developer/BarGraph";
import ErrorPage from "./Pages/Authentications/ErrorPage";

const App = () => {
  const [token, setToken, handleSearch] = useState("");
  const [userType, setUserType] = useState("");

  const handleLogin = (newToken, newUserType) => {
    setToken(newToken);
    setUserType(newUserType);
    window.localStorage.setItem("token", newToken);
    window.localStorage.setItem("user_type", newUserType);
  };

  const handleLogout = () => {
    setToken("");
    setUserType("");
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user_type");
  };

  useEffect(() => {
    const storedToken = window.localStorage.getItem("token");
    const storedUserType = window.localStorage.getItem("user_type");
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, [setToken, setUserType]);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<LoginPage handleLogin={handleLogin} token={token} />}
          />
          <Route
            path="/signup"
            element={<SignUpPage handleLogin={handleLogin} token={token} />}
          />
          {localStorage.getItem("user_type") == 1 ? (
            <Route
              path="/adminprofile"
              element={
                <AdminProfile handleLogout={handleLogout} token={token} />
              }
            />
          ) : localStorage.getItem("user_type") == 2 ? (
            <Route
              path="/userprofile"
              element={
                <UserProfile handleLogout={handleLogout} token={token} />
              }
            />
          ) : localStorage.getItem("user_type") == 3 ? (
            <Route
              path="/developerdashboard"
              element={
                <DeveloperDashboard handleLogout={handleLogout} token={token} />
              }
            />
          ) : (
            <Route path="/errorpage" element={<ErrorPage />} />
          )}

          <Route
            path="/developeradminteam"
            element={<AdminData handleLogout={handleLogout} token={token} />}
          />

          <Route
            path="/developeraddclient"
            element={<AddClient handleLogout={handleLogout} token={token} />}
          />

          <Route
            path="/developerfeedbacks"
            element={<AllFeedbacks handleLogout={handleLogout} token={token} />}
          />

          <Route
            path="/developerresolvedfeedbacks"
            element={
              <ResolvedFeedbacks handleLogout={handleLogout} token={token} />
            }
          />

          <Route
            path="/developerhandleclients"
            element={
              <HandleClients handleLogout={handleLogout} token={token} />
            }
          />

          <Route
            path="/developerlinegraph"
            element={<Linegraph handleLogout={handleLogout} token={token} />}
          />
          <Route
            path="/developerpiechart"
            element={<PieChart handleLogout={handleLogout} token={token} />}
          />
          <Route
            path="/developerbargraph"
            element={<BarGraph handleLogout={handleLogout} token={token} />}
          />
          <Route
            path="/developereditadmin"
            element={
              <EditAdminData handleLogout={handleLogout} token={token} />
            }
          />

          <Route
            path="/developeruserteam"
            element={<UsersData handleLogout={handleLogout} token={token} />}
          />

          <Route
            path="/developeredituser"
            element={<EditUserData handleLogout={handleLogout} token={token} />}
          />

          <Route
            path="/dashboard"
            element={
              <Dashboard
                handleLogout={handleLogout}
                token={token}
                onSearch={handleSearch}
              />
            }
          />
          <Route
            path="/userdashboard"
            element={
              <UserDashboard handleLogout={handleLogout} token={token} />
            }
          />
          <Route
            path="/show_post"
            element={<ShowPost handleLogout={handleLogout} token={token} />}
          />
          <Route
            path="/addpost"
            element={<AddPost handleLogout={handleLogout} token={token} />}
          />
          <Route
            path="/edit_post"
            element={<EditPost handleLogout={handleLogout} token={token} />}
          />
          <Route
            path="/admin_feedback"
            element={<Report handleLogout={handleLogout} token={token} />}
          />
          <Route
            path="/user_feedback"
            element={<UserReport handleLogout={handleLogout} token={token} />}
          />
          <Route path="/forgetPass" element={<ForgetPass />} />

          <Route path="/resetPass" element={<ResetPass />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
