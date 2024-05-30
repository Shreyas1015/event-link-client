import { useLocation, useNavigate } from "react-router-dom";
import "firebase/compat/storage";
import DeveloperSidebar from "../../Components/Developer/DeveloperSidebar";
import TitleAndLogout from "../../Components/Developer/TitleAndLogout";
import BarGraphs from "../../Components/Developer/BarGraph";
import secureLocalStorage from "react-secure-storage";

const BarGraph = ({ token }) => {
  const navigate = useNavigate();
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");

  const BackToLogin = () => {
    navigate("/");
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
          {/* Analysis */}
          <div className="col-lg-2"></div>
          <div className="col-lg-10 col-md-9 col-sm-9 col-9 px-4">
            <TitleAndLogout title="Bar Graph" />
            <hr className="my-3 p-0" style={{ color: "white" }} />
            <div
              className="container glassomorphic-effect rounded-4 p-3"
              style={{ height: "100vh" }}
            >
              <BarGraphs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarGraph;
