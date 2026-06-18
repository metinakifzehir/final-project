import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import apiClient from "../api/api";

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (err) {
        setError("Restaurant details could not be loaded.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Google Maps linkini yeni formata göre güncelliyoruz
  const openGoogleMaps = () => {
    if (!restaurant || !restaurant.id) return;
    const placeId = restaurant.id;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${placeId}`,
      "_blank"
    );
  };

  if (isLoading) {
    return (
      <div className="main-bg">
        <Navbar />
        <main className="page-shell"><p>Loading restaurant details...</p></main>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="main-bg">
        <Navbar />
        <main className="page-shell">
          <section className="white-card">
            <h2>{error || "Restaurant not found."}</h2>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="main-bg">
      <Navbar />
      <main className="page-shell">
        <section className="page-hero">
          <div className="hero-badge">{restaurant.category}</div>
          <h1>{restaurant.name}</h1>
          <p>
            📍 {restaurant.address} · ⭐ {restaurant.rating} ({restaurant.rating_count} reviews)
          </p>
          <div className="detail-actions">
            <span className={restaurant.is_open ? "open-badge" : "closed-badge"}>
              {restaurant.is_open ? "Open Now" : "Closed"}
            </span>
            <button className="maps-btn" onClick={openGoogleMaps}>
              View on Google Maps
            </button>
          </div>
        </section>

        <section className="detail-grid-modern">
          <div className="white-card">
            <h2>Contact Information</h2>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Phone:</strong> {restaurant.phone_number}</p>
          </div>

          <div className="white-card">
            <h2>Recent User Reviews</h2>
            {restaurant.reviews && restaurant.reviews.length > 0 ? (
              restaurant.reviews.map((review, index) => (
                <div key={index} className="review-box">
                  <p><strong>{review.author_name}</strong> ({review.rating}★) - <small>{review.time_description}</small></p>
                  <p>“{review.text}”</p>
                </div>
              ))
            ) : (
              <p>No reviews found for this restaurant.</p>
            )}
          </div>

          <div className="white-card">
            <h2>Add Your Rating</h2>
            <select className="detail-input">
              <option>5 - Excellent</option>
              <option>4 - Good</option>
              <option>3 - Average</option>
              <option>2 - Poor</option>
              <option>1 - Bad</option>
            </select>
            <textarea
              className="detail-textarea"
              placeholder="Write your review..."
            />
            <button className="submit-review-btn">Submit Review</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RestaurantDetail;
