import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant, onExplain }) {
  const navigate = useNavigate();

  const formatRatingCount = (count) => {
    if (!count) return "0";
    if (count >= 100) {
      return Math.floor(count / 100) * 100 + "+";
    }
    if (count >= 50) return "50+";
    if (count >= 10) return "10+";
    return count.toString();
  };

  const openGoogleMaps = (e) => {
    // Butonun tıklanma olayının diğer elementleri tetiklemesini engelle
    e.stopPropagation();
    if (!restaurant || !restaurant.id) return;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${restaurant.id}`,
      "_blank"
    );
  };

  return (
    // Kartın tamamına tıklanma özelliğini kaldırıyoruz
    <div className="restaurant-card-modern">
      <h3>{restaurant.name}</h3>
      <p>{restaurant.category}</p>

      {restaurant.summary && <p>{restaurant.summary}</p>}

      <div className="card-info">
        <span>⭐ {restaurant.rating} ({formatRatingCount(restaurant.rating_count)})</span>
        <span>📍 {restaurant.distance_km} km</span>
        {/* "Open/Closed" yazısı yerine Google Maps linki */}
        <a
          href="#"
          onClick={openGoogleMaps}
          className="map-link"
        >
          View on Map
        </a>
      </div>

      <div className="card-buttons">
        {onExplain && (
          <button
            className="primary-card-btn"
            onClick={(e) => {
              e.stopPropagation();
              onExplain(restaurant);
            }}
          >
            Why Recommended?
          </button>
        )}

        {/* Details butonunu geri getiriyoruz */}
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
