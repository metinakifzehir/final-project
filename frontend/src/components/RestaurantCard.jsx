import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant, onExplain }) {
  const navigate = useNavigate();

  return (
    <div className="restaurant-card-modern">
      <h3>{restaurant.name}</h3>
      <p>{restaurant.category}</p>

      <p>{restaurant.summary}</p>

      <div className="card-info">
        <span>⭐ {restaurant.rating}</span>
        <span>📍 {restaurant.distance} km</span>
        <span>{restaurant.isOpen ? "Open" : "Closed"}</span>
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