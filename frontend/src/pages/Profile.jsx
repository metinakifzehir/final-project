import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Link import'u ekle
import Navbar from "../components/Navbar";
import apiClient from "../api/api";
import { jwtDecode } from "jwt-decode";

function Profile() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.author_name || decoded.sub || "User");
      } catch (e) {
        console.error("Token decoding failed", e);
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await apiClient.get("/users/me/reviews");
        setReviews(response.data);
      } catch (err) {
        setError("Your reviews could not be loaded.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="main-bg">
      <Navbar />
      <main className="page-shell">
        <section className="page-hero">
          <div className="hero-badge">👤 User Profile</div>
          <h1>Hello, {userName}!</h1>
          <p>Here you can see your past restaurant reviews and ratings.</p>
        </section>

        <section className="detail-grid-modern" style={{ gridTemplateColumns: '1fr' }}>
          <div className="white-card">
            <h2>Your Review History ({reviews.length})</h2>

            {isLoading && <p>Loading your reviews...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {reviews.map((review, index) => (
                  <div key={index} className="review-box" style={{ borderLeft: '4px solid #ff6334', paddingLeft: '15px' }}>
                    {/* Restoran ismini Link bileşeni içine al */}
                    <Link to={`/restaurants/${review.restaurant_id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ margin: '0 0 5px 0', color: '#222', cursor: 'pointer' }}>
                        {review.restaurant_name}
                      </h3>
                    </Link>
                    <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                      <strong style={{ color: '#ff6334' }}>{review.rating}★</strong> - <small>{review.time_description}</small>
                    </p>
                    <p style={{ margin: 0, fontStyle: review.text ? 'normal' : 'italic', color: review.text ? '#444' : '#999' }}>
                      {review.text || "No written review provided."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && !error && <p>You haven't reviewed any restaurants yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;
