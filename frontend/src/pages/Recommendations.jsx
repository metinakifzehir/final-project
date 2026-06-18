import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ExplanationPanel from "../components/ExplanationPanel";
import RestaurantCard from "../components/RestaurantCard";
import apiClient from "../api/api";

const CUISINES = [
  "All Cuisines",
  "Döner", "Tatlı", "Pide & Lahmacun", "Sokak Lezzetleri", "Kebap",
  "Çiğ Köfte", "Burger", "Tavuk", "Fırın & Pastane", "Tost/Sandviç",
  "Pizza", "Kahve & İçecek", "Ev Yemekleri", "Köfte", "Cafe",
  "Dünya Mutfağı", "Meze", "Kahvaltı", "Börek", "Çorba", "Makarna",
  "Mantı", "Balık & Deniz Ürünleri", "Salata & Sağlık", "Dondurma",
  "Uzak Doğu", "Steak", "Tantuni"
];

function Recommendations() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtre State'leri
  const [cuisine, setCuisine] = useState("All Cuisines");
  const [radius, setRadius] = useState(5.0);
  const [minRating, setMinRating] = useState(4.0);
  const [minReviews, setMinReviews] = useState(10);
  const [topK, setTopK] = useState(10);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            reject(new Error("Unable to retrieve your location. Please grant permission."));
          }
        );
      }
    });
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    setRestaurants([]);

    try {
      const location = await getLocation();

      const payload = {
        user_id: "100677076065329495898",
        latitude: location.latitude,
        longitude: location.longitude,
        radius_km: parseFloat(radius),
        min_rating: parseFloat(minRating),
        top_k: parseInt(topK, 10),
        // Sadece "All Cuisines" seçilmemişse kategoriyi gönder
        categories: cuisine !== "All Cuisines" ? [cuisine] : undefined,
      };

      const response = await apiClient.post("/recommendations/", payload);
      setRestaurants(response.data.recommendations);
    } catch (err) {
      let errorMessage = err.message || "An unexpected error occurred.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Please log in to get recommendations.";
        } else if (err.response.status === 422) {
          errorMessage = "Invalid or missing data sent to the server.";
          console.error("Validation Error:", err.response.data);
        }
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Sayfa ilk yüklendiğinde otomatik istek göndermiyoruz.
  }, []);

  return (
    <div className="main-bg">
      <Navbar />
      <main className="recommendations-page">
        <section className="hero-modern">
          <div className="hero-badge">
            ✨ AI-Powered Restaurant Recommendations
          </div>
          <h1>Find the best restaurants around you</h1>
          <p>
            Get personalized restaurant suggestions based on your location,
            preferences and real user reviews.
          </p>
        </section>

        <section className="content-modern">
          <aside className="filter-modern">
            <h3>Filters</h3>

            <div className="filter-group">
              <label>Cuisine</label>
              <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                {CUISINES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Radius: {radius} km</label>
              <input
                type="range"
                min="0.5" max="20" step="0.5"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Minimum Rating: {minRating}</label>
              <input
                type="range"
                min="1.0" max="5.0" step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Minimum Reviews: {minReviews}</label>
              <input
                type="range"
                min="0" max="500" step="10"
                value={minReviews}
                onChange={(e) => setMinReviews(e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Top-K Results: {topK}</label>
              <input
                type="range"
                min="3" max="20" step="1"
                value={topK}
                onChange={(e) => setTopK(e.target.value)}
              />
            </div>

            <button onClick={handleGetRecommendations} disabled={isLoading} style={{marginTop: '15px'}}>
              {isLoading ? "Getting Location..." : "Get Recommendations"}
            </button>
          </aside>

          <section className="results-modern">
            <h2>Top Recommendations</h2>
            <p className="results-subtitle">AI-powered picks just for you</p>

            {isLoading && <p>Getting your location and recommendations...</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="cards-grid">
              {!isLoading && !error && restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id || restaurant.name}
                    restaurant={restaurant}
                    onExplain={setSelectedRestaurant}
                  />
                ))
              ) : (
                !isLoading && !error && <p>Click "Get Recommendations" to allow location access and see your results.</p>
              )}
            </div>
          </section>
        </section>
        <ExplanationPanel
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
        />
      </main>
    </div>
  );
}

export default Recommendations;
