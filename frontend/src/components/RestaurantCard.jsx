import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant, onExplain }) {
  const navigate = useNavigate();
  return (
    <div style={styles.card}>
      <div>
        <h3 style={styles.name}>{restaurant.name}</h3>
        <p style={styles.category}>{restaurant.category}</p>
      </div>

      <p style={styles.summary}>{restaurant.summary}</p>

      <div style={styles.infoRow}>
        <span>⭐ {restaurant.rating}</span>
        <span>📍 {restaurant.distance} km</span>
        <span>{restaurant.isOpen ? "🟢 Open" : "🔴 Closed"}</span>
      </div>

      <div style={styles.buttons}>
        <button style={styles.primaryBtn} onClick={() => onExplain(restaurant)}>
          Why Recommended?
        </button>
        <button
        style={styles.secondaryBtn}
        onClick={() => navigate(`/restaurants/${restaurant.id}`)}
        >
        Details
        </button>      
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "22px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  name: {
    margin: 0,
    fontSize: "22px",
    color: "#222",
  },
  category: {
    color: "#FF6B35",
    fontWeight: "600",
  },
  summary: {
    color: "#666",
    lineHeight: "1.6",
  },
  infoRow: {
    display: "flex",
    gap: "18px",
    marginTop: "18px",
    color: "#444",
  },
  buttons: {
    display: "flex",
    gap: "12px",
    marginTop: "22px",
  },
  primaryBtn: {
    background: "#FF6B35",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "#fff",
    color: "#FF6B35",
    border: "1px solid #FF6B35",
    padding: "10px 16px",
    borderRadius: "12px",
    cursor: "pointer",
  },
};

export default RestaurantCard;