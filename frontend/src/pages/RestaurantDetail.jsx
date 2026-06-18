import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import apiClient from "../api/api";

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const fetchDetails = async () => {
    if (!restaurant) setIsLoading(true);
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

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      const payload = { rating: parseInt(newRating, 10), text: newReviewText };
      await apiClient.post(`/restaurants/${id}/reviews`, payload);
      setSubmitMessage("Your review has been submitted successfully!");
      setNewReviewText("");
      setNewRating(5);
      setTimeout(() => {
        fetchDetails();
        setSubmitMessage("");
      }, 2000);
    } catch (err) {
      setSubmitMessage(err.response?.data?.detail || "Failed to submit review.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openGoogleMaps = () => {
    if (!restaurant || !restaurant.id) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${restaurant.id}`, "_blank");
  };

  if (isLoading) {
    return <div className="main-bg"><Navbar /><main className="page-shell"><p>Loading...</p></main></div>;
  }
  if (error || !restaurant) {
    return <div className="main-bg"><Navbar /><main className="page-shell"><section className="white-card"><h2>{error || "Not Found."}</h2></section></main></div>;
  }

  return (
    <div className="main-bg">
      <Navbar />
      <main className="page-shell">
        <section className="page-hero">
          <div className="hero-badge">{restaurant.category}</div>
          <h1>{restaurant.name}</h1>
          <p>📍 {restaurant.address} · ⭐ {restaurant.rating} ({restaurant.rating_count} reviews)</p>
          <div className="detail-actions">
            <span className={restaurant.is_open ? "open-badge" : "closed-badge"}>{restaurant.is_open ? "Open Now" : "Closed"}</span>
            <button className="maps-btn" onClick={openGoogleMaps}>View on Google Maps</button>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="white-card">
              <h2 style={{ color: '#222' }}>Contact Information</h2>
              <p><strong>Address:</strong> {restaurant.address}</p>
              <p><strong>Phone:</strong> {restaurant.phone_number}</p>
            </div>
            <div className="white-card">
              <h2 style={{ color: '#222' }}>Add Your Rating</h2>
              <form onSubmit={handleSubmitReview}>
                <select className="detail-input" value={newRating} onChange={(e) => setNewRating(e.target.value)} disabled={isSubmitting}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Bad</option>
                </select>
                <textarea className="detail-textarea" placeholder="Write your review..." value={newReviewText} onChange={(e) => setNewReviewText(e.target.value)} disabled={isSubmitting} />
                <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
                {submitMessage && <p style={{ marginTop: '10px', fontSize: '14px' }}>{submitMessage}</p>}
              </form>
            </div>
          </div>

          <div className="white-card">
            <h2 style={{ color: '#222' }}>Recent User Reviews</h2>
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
        </section>
      </main>
    </div>
  );
}

export default RestaurantDetail;
