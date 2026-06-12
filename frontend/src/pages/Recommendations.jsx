import { useState } from "react";
import Navbar from "../components/Navbar";
import ExplanationPanel from "../components/ExplanationPanel";
import RestaurantCard from "../components/RestaurantCard";

const mockRestaurants = [
  {
    id: 1,
    name: "Ankara Kebapçısı",
    category: "Kebap",
    rating: 4.6,
    distance: 0.8,
    isOpen: true,
    summary:
      "Known for meat quality, fast service and central location.",
  },
  {
    id: 2,
    name: "Bistro Bahçelievler",
    category: "Cafe & Bistro",
    rating: 4.4,
    distance: 1.2,
    isOpen: true,
    summary:
      "A cozy bistro with breakfast, desserts and coffee options.",
  },
  {
    id: 3,
    name: "Burger Point Ankara",
    category: "Burger",
    rating: 4.3,
    distance: 1.7,
    isOpen: true,
    summary:
      "A modern burger place with rich menu options and quick service.",
  },
];

function Recommendations() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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

            <label>Cuisine</label>
            <select>
              <option>All Cuisines</option>
              <option>Kebap</option>
              <option>Burger</option>
              <option>Cafe</option>
              <option>Home Cooking</option>
            </select>

            <label>Radius</label>
            <select>
              <option>All</option>
              <option>1 km</option>
              <option>3 km</option>
              <option>5 km</option>
              <option>10 km</option>
              <option>15 km</option>
              <option>20 km</option>
            </select>

            <label>Rating</label>
            <select>
              <option>2.0+</option>
              <option>2.5+</option>
              <option>3.0+</option>
              <option>3.5+</option>
              <option>4.0+</option>
              <option>4.5+</option>
            </select>

            <label>Minimum Reviews</label>
            <select>
              <option>10+</option>
              <option>25+</option>
              <option>50+</option>
              <option>100+</option>
            </select>

            <label>Top-K Results</label>
            <select>
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
            </select>

            <button>Get Recommendations</button>
          </aside>

          <section className="results-modern">
            <h2>Top Recommendations</h2>
            <p className="results-subtitle">AI-powered picks just for you</p>

            <div className="cards-grid">
              {mockRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onExplain={setSelectedRestaurant}
                />
              ))}
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