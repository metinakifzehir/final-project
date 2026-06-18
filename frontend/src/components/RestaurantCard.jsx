import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant, onExplain }) {
  const navigate = useNavigate();

  // Yorum sayısını daha okunabilir (örneğin 1254 -> 1200+) hale getiren yardımcı fonksiyon
  const formatRatingCount = (count) => {
    if (!count) return "0";
    if (count >= 100) {
      return Math.floor(count / 100) * 100 + "+";
    }
    if (count >= 50) return "50+";
    if (count >= 10) return "10+";
    return count.toString();
  };

  return (
    <div className="restaurant-card-modern">
      <h3>{restaurant.name}</h3>
      <p>{restaurant.category}</p>

      <p>{restaurant.summary || "A popular local choice."}</p>

      <div className="card-info">
        {/* Rating ve formatlanmış rating_count'u birlikte göster */}
        <span>⭐ {restaurant.rating} ({formatRatingCount(restaurant.rating_count)})</span>
        <span>📍 {restaurant.distance_km} km</span>
        <span>{restaurant.is_open ? "Open" : "Closed"}</span>
      </div>

      <div className="card-buttons">
        {onExplain && (
          <button
            className="primary-card-btn"
            onClick={() => onExplain(restaurant)}
          >
            Why Recommended?
          </button>
        )}

        <button
          className="secondary-card-btn"
          onClick={() => navigate(`/restaurants/${restaurant.id}`)}
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default RestaurantCard;
