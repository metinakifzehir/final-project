import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar} className="navbar">
      <Link to="/recommendations" style={styles.logo}>
        🍽️ FoodieAI
      </Link>

      <div style={styles.links} className="navbar-links">
        <Link
          to="/recommendations"
          style={{
            ...styles.link,
            ...(isActive("/recommendations") ? styles.activeLink : {}),
          }}
        >
          Recommendations
        </Link>

        <Link
          to="/search"
          style={{
            ...styles.link,
            ...(isActive("/search") ? styles.activeLink : {}),
          }}
        >
          Search
        </Link>
      </div>

      <div style={styles.userArea} className="navbar-user">
        <span style={styles.user}>{localStorage.getItem("userName") || ""}</span>

        <button
            style={styles.logout}
            onClick={() => {
                localStorage.removeItem("userName");
                navigate("/login");
            }}
        >
            Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    height: "76px",
    padding: "0 70px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#222",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
  },
  link: {
    color: "#555",
    textDecoration: "none",
    fontWeight: "600",
    padding: "10px 0",
    borderBottom: "3px solid transparent",
  },
  activeLink: {
    color: "#FF6B35",
    borderBottom: "3px solid #FF6B35",
  },
  userArea: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "18px",
    alignItems: "center",
  },
  user: {
    color: "#444",
    fontWeight: "600",
  },
  logout: {
  background: "#FF6B35",
  color: "white",
  padding: "10px 18px",
  borderRadius: "12px",
  fontWeight: "700",
  border: "none",
  cursor: "pointer",
  },
};

export default Navbar;