import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";
import apiClient from "../api/api";

const CUISINES = [
  "Döner", "Tatlı", "Pide & Lahmacun", "Sokak Lezzetleri", "Kebap",
  "Çiğ Köfte", "Burger", "Tavuk", "Fırın & Pastane", "Tost/Sandviç", "Pizza",
  "Kahve & İçecek", "Ev Yemekleri", "Köfte", "Cafe", "Dünya Mutfağı", "Meze",
  "Kahvaltı", "Börek", "Çorba", "Makarna", "Mantı", "Balık & Deniz Ürünleri",
  "Salata & Sağlık", "Dondurma", "Uzak Doğu", "Steak", "Tantuni"
];

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  const [selectedCuisines, setSelectedCuisines] = useState([...CUISINES]);
  const [radius, setRadius] = useState(10.0);
  const [minRating, setMinRating] = useState(1.0);
  const [minReviews, setMinReviews] = useState(0);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            setLocation(loc);
            resolve(loc);
          },
          () => reject(new Error("Unable to retrieve your location. Please grant permission."))
        );
      }
    });
  };

  const handleCuisineChange = (cuisine) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  const handleToggleAllCuisines = () => {
    if (selectedCuisines.length === CUISINES.length) {
      setSelectedCuisines([]);
    } else {
      setSelectedCuisines([...CUISINES]);
    }
  };

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const current_location = location || await getLocation();
        const params = {
          query,
          latitude: current_location.latitude,
          longitude: current_location.longitude,
          radius_km: parseFloat(radius),
          min_rating: parseFloat(minRating),
          min_reviews: parseInt(minReviews, 10),
          categories: selectedCuisines.length > 0 ? selectedCuisines : undefined,
        };
        const response = await apiClient.get("/restaurants/search", { params });
        setResults(response.data);
      } catch (err) {
        setError(err.message || "An error occurred during the search.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(performSearch, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query, location, selectedCuisines, radius, minRating, minReviews]);

  return (
    <div className="main-bg">
      <Navbar />
      <main className="recommendations-page">
        <section className="hero-modern">
          <div className="hero-badge">🔍 Restaurant Search</div>
          <h1>Search restaurants in Ankara</h1>
          <p>Find restaurants by name and apply detailed filters.</p>

          <div style={{ marginTop: '30px', width: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            <input
              type="text"
              placeholder="Type a restaurant name to search near you..."
              className="main-search-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 22px',
                borderRadius: '14px',
                border: '1px solid #ddd',
                fontSize: '16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
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
                    <input type="checkbox" id={`search-cuisine-${c}`} checked={selectedCuisines.includes(c)} onChange={() => handleCuisineChange(c)} style={{ marginRight: '10px', cursor: 'pointer' }} />
                    <label htmlFor={`search-cuisine-${c}`} style={{ margin: 0, cursor: 'pointer', fontSize: '14px', color: '#555' }}>{c}</label>
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
          </aside>

          <section className="results-modern">
            <h2 style={{ color: '#222' }}>Search Results</h2>
            {query && <p className="results-subtitle">Showing results for "{query}"</p>}

            {isLoading && <p>Searching...</p>}
            {error && <p className="error-message">{error}</p>}

            {!isLoading && !error && (
              <div className="cards-grid">
                {results.length > 0 ? (
                  results.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onExplain={null}
                    />
                  ))
                ) : (
                  query.length >= 2 && <p>No results found. Try adjusting your filters.</p>
                )}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Search;
