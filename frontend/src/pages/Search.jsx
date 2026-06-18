import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";
import apiClient from "../api/api";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  // Konum bilgisini almak için fonksiyon
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setLocation(loc); // Konumu state'e kaydet
            resolve(loc);
          },
          () => {
            reject(new Error("Unable to retrieve your location. Please grant permission."));
          }
        );
      }
    });
  };

  // Debouncing ile arama yapmak için useEffect
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Eğer konum bilgisi henüz alınmadıysa, önce onu al
        const current_location = location || await getLocation();

        const params = {
          query,
          latitude: current_location.latitude,
          longitude: current_location.longitude,
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

    const delayDebounceFn = setTimeout(performSearch, 300);
    return () => clearTimeout(delayDebounceFn);

  }, [query, location]);

  return (
    <div className="main-bg">
      <Navbar />
      <main className="page-shell">
        <section className="page-hero">
          <div className="hero-badge">🔍 Restaurant Search</div>
          <h1>Search restaurants in Ankara</h1>
          <p>Find restaurants by name, cuisine or food preference.</p>
        </section>

        <section className="search-panel">
          <input
            type="text"
            placeholder="Search for a restaurant near you..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </section>

        <section className="results-modern">
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
                query.length >= 2 && <p>No results found for "{query}".</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Search;
