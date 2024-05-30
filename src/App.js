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
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/adminprofile" element={<AdminProfile />} />

          <Route path="/userprofile" element={<UserProfile />} />

          <Route path="/developerdashboard" element={<DeveloperDashboard />} />

          <Route path="/errorpage" element={<ErrorPage />} />

          <Route path="/developeradminteam" element={<AdminData />} />

          <Route path="/developeraddclient" element={<AddClient />} />

          <Route path="/developerfeedbacks" element={<AllFeedbacks />} />

          <Route
            path="/developerresolvedfeedbacks"
            element={<ResolvedFeedbacks />}
          />

          <Route path="/developerhandleclients" element={<HandleClients />} />

          <Route path="/developerlinegraph" element={<Linegraph />} />
          <Route path="/developerpiechart" element={<PieChart />} />
          <Route path="/developerbargraph" element={<BarGraph />} />
          <Route path="/developereditadmin" element={<EditAdminData />} />

          <Route path="/developeruserteam" element={<UsersData />} />

          <Route path="/developeredituser" element={<EditUserData />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/show_post" element={<ShowPost />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/edit_post" element={<EditPost />} />
          <Route path="/admin_feedback" element={<Report />} />
          <Route path="/user_feedback" element={<UserReport />} />
          <Route path="/forgetPass" element={<ForgetPass />} />

          <Route path="/resetPass" element={<ResetPass />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
