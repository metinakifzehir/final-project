import { useState } from "react";
import Navbar from "../components/Navbar";
import ExplanationPanel from "../components/ExplanationPanel";
import RestaurantCard from "../components/RestaurantCard";
import { useRecommendations } from "../context/RecommendationContext"; // Context'i kullanmak için hook'u import et

const CUISINES = [
  "Döner", "Tatlı", "Pide & Lahmacun", "Sokak Lezzetleri", "Kebap",
  "Çiğ Köfte", "Burger", "Tavuk", "Fırın & Pastane", "Tost/Sandviç", "Pizza",
  "Kahve & İçecek", "Ev Yemekleri", "Köfte", "Cafe", "Dünya Mutfağı", "Meze",
  "Kahvaltı", "Börek", "Çorba", "Makarna", "Mantı", "Balık & Deniz Ürünleri",
  "Salata & Sağlık", "Dondurma", "Uzak Doğu", "Steak", "Tantuni"
];

function Recommendations() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Tüm state ve fonksiyonları context'ten alıyoruz
  const {
    restaurants,
    isLoading,
    error,
    hasFetched,
    handleGetRecommendations,
    selectedCuisines, setSelectedCuisines,
    radius, setRadius,
    minRating, setMinRating,
    minReviews, setMinReviews,
    topK, setTopK
  } = useRecommendations();

  const handleCuisineChange = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const handleToggleAllCuisines = () => {
    if (selectedCuisines.length === CUISINES.length) {
      setSelectedCuisines([]);
    } else {
      setSelectedCuisines([...CUISINES]);
    }
  };

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ margin: 0 }}>Cuisines</label>
                <button onClick={handleToggleAllCuisines} style={{ background: 'none', border: 'none', color: '#ff6334', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', padding: 0 }}>
                  {selectedCuisines.length === CUISINES.length ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px', background: '#fafafa' }}>
                {CUISINES.map((c) => (
                  <div key={c} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <input type="checkbox" id={`cuisine-${c}`} checked={selectedCuisines.includes(c)} onChange={() => handleCuisineChange(c)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                    <label htmlFor={`cuisine-${c}`} style={{ margin: 0, cursor: 'pointer', fontSize: '14px', color: '#555' }}>{c}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <label>Radius: {radius} km</label>
              <input type="range" min="0.5" max="20" step="0.5" value={radius} onChange={(e) => setRadius(e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Minimum Rating: {minRating}</label>
              <input type="range" min="1.0" max="5.0" step="0.1" value={minRating} onChange={(e) => setMinRating(e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Minimum Reviews: {minReviews}</label>
              <input type="range" min="0" max="500" step="10" value={minReviews} onChange={(e) => setMinReviews(e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Top-K Results: {topK}</label>
              <input type="range" min="3" max="20" step="1" value={topK} onChange={(e) => setTopK(e.target.value)} />
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

            {!isLoading && !error && restaurants.length > 0 && (
              <div className="cards-grid">
                {restaurants.map((restaurant) => (
                  <RestaurantCard
                    key={restaurant.id || restaurant.name}
                    restaurant={restaurant}
                    onExplain={setSelectedRestaurant}
                  />
                ))}
              </div>
            )}

            {/* hasFetched'i kullanarak ilk yüklemede mesajı göster */}
            {!isLoading && !error && restaurants.length === 0 && !hasFetched && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', width: '100%' }}>
                <p>Click "Get Recommendations" to allow location access and see your results.</p>
              </div>
            )}

            {!isLoading && !error && restaurants.length === 0 && hasFetched && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', width: '100%' }}>
                <p>No recommendations found for the selected filters.</p>
              </div>
            )}
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
