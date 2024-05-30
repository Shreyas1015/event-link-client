import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const DeveloperSidebar = () => {
  const decryptedUID = secureLocalStorage.getItem("uid");
  const encryptedUID = localStorage.getItem("@secure.n.uid");

  return (
    <>
      <div
        className="container-fluid glassomorphic-effect p-0 my-2 rounded-4"
        style={{ listStyle: "none" }}
      >
        <h5 className="text-center py-3 fixed-blue rounded-top-4">
          Event Link
        </h5>
        <Link
          className="text-decoration-none "
          to={`/developerdashboard?uid=${encryptedUID}`}
        >
          <li className="sidebar-li my-2 p-3 mx-2 text-blue rounded-3">
            <i className="fa-solid fa-user me-2"></i> Dashboard
          </li>
        </Link>
        <h5 className="text-center py-3 fixed-blue ">Manage Team</h5>
        {/* My Profile */}
        <ul className="mx-2 p-0" style={{ listStyle: "none" }}>
          <Link
            className="text-decoration-none"
            to={`/developeradminteam?uid=${encryptedUID}`}
          >
            <li className="py-2 px-3 my-1 text-blue rounded-3">
              <i className="fa-solid fa-user me-2"></i> Admins
            </li>
          </Link>
          <Link
            className="text-decoration-none"
            to={`/developeruserteam?uid=${encryptedUID}`}
          >
            <li className="py-2 px-3 my-1 text-blue rounded-3">
              <i className="fa-solid fa-user me-2"></i> Users
            </li>
          </Link>
        </ul>
        <h5 className="text-center py-3 fixed-blue ">Pages</h5>
        <ul className="mx-2 p-0" style={{ listStyle: "none" }}>
          <Link
            className="text-decoration-none"
            to={`/developerhandleclients?uid=${encryptedUID}`}
          >
            <li className="py-2 px-3 my-1 text-blue rounded-3">
              <i className="fa-solid fa-user me-2"></i> Client Data
            </li>
          </Link>
          <Link
            className="text-decoration-none"
            to={`/developerfeedbacks?uid=${encryptedUID}`}
          >
            <li className="py-2 px-3 my-1 text-blue rounded-3">
              <i className="fa-solid fa-user me-2"></i> Feedbacks
            </li>
          </Link>
        </ul>
        <h5 className="text-center py-3 fixed-blue ">Charts</h5>
        <ul className="mx-2 p-0" style={{ listStyle: "none" }}>
          <Link
            className="text-decoration-none"
            to={`/developerbargraph?uid=${encryptedUID}`}
          >
            <li className="py-2 px-3 my-1 text-blue rounded-3">
              <i className="fa-solid fa-user me-2"></i> Bar Graph
            </li>
          </Link>
          <Link
            className="text-decoration-none"
            to={`/developerpiechart?uid=${encryptedUID}`}
          >
            <li className="py-2 px-3 my-1 text-blue rounded-3">
              <i className="fa-solid fa-user me-2"></i> Pie Chart
            </li>
          </Link>
          <Link
            className="text-decoration-none"
            to={`/developerlinegraph?uid=${encryptedUID}`}
          >
            <li className="py-2 px-3 my-1 text-blue rounded-3">
              <i className="fa-solid fa-user me-2"></i> Line Graph
            </li>
          </Link>
          <Link
            className="text-decoration-none"
            to={`/developer?uid=${encryptedUID}`}
          >
            <li className="pt-2 pb-3 px-3 my-1 text-blue rounded-3">
              <i className="fa-solid fa-user me-2"></i> Geo - Graph
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
};

export default DeveloperSidebar;
