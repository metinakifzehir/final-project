import { Link, useLocation, useNavigate } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "";

  const handleLogout = () => {
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/recommendations" className="nav-logo">
        <UtensilsCrossed size={34} color="#ff6334" />
        <span>FoodieAI</span>
      </Link>

      <div className="nav-links">
        <Link
          to="/recommendations"
          className={`nav-link ${
            location.pathname === "/recommendations" ? "active" : ""
          }`}
        >
          Recommendations
        </Link>

        <Link
          to="/search"
          className={`nav-link ${
            location.pathname === "/search" ? "active" : ""
          }`}
        >
          Search
        </Link>
      </div>

      <div className="nav-user">
        <span>{userName}</span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;