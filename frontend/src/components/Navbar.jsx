import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UtensilsCrossed } from "lucide-react";
import { useRecommendations } from "../context/RecommendationContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearRecommendations } = useRecommendations();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    clearRecommendations();
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
          className={`nav-link ${location.pathname === "/recommendations" ? "active" : ""}`}
        >
          Recommendations
        </Link>
        <Link
          to="/search"
          className={`nav-link ${location.pathname === "/search" ? "active" : ""}`}
        >
          Search
        </Link>
      </div>

      <div className="nav-user">
        {user ? (
          <>
            {/* Link stili, normal metin gibi görünmesi için güncellendi */}
            <Link
              to="/profile"
              className="user-name-link"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <span className="user-name">{user.author_name}</span>
            </Link>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
