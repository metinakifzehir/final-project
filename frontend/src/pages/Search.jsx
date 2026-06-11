import { useState } from "react";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";

const allRestaurants = [
  {
    id: 1,
    name: "Ankara Kebapçısı",
    category: "Kebap",
    rating: 4.6,
    distance: 0.8,
    isOpen: true,
    summary:
      "A popular kebap restaurant known for meat quality, fast service and central location.",
  },
  {
    id: 2,
    name: "Bistro Bahçelievler",
    category: "Cafe & Bistro",
    rating: 4.4,
    distance: 1.2,
    isOpen: true,
    summary:
      "A cozy bistro with breakfast, desserts and coffee options for casual meetings.",
  },
  {
    id: 3,
    name: "Ev Yemekleri Durağı",
    category: "Home Cooking",
    rating: 4.7,
    distance: 0.5,
    isOpen: false,
    summary:
      "Affordable and clean restaurant offering daily homemade meals for lunch.",
  },
  {
    id: 4,
    name: "Burger Point Ankara",
    category: "Burger",
    rating: 4.3,
    distance: 1.7,
    isOpen: true,
    summary:
      "A modern burger place with rich menu options and quick takeaway service.",
  },
];

function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredRestaurants = allRestaurants.filter((restaurant) => {
    const matchesQuery =
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(query.toLowerCase());

    const matchesCategory =
      category === "All" || restaurant.category === category;

    return matchesQuery && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <main style={styles.page} className="page-container">
        <section style={styles.header} className="hero-section">
          <p style={styles.badge}>Restaurant Search</p>
          <h1 style={styles.title} className="hero-title">Search restaurants in Ankara</h1>
          <p style={styles.subtitle}>
            Find restaurants by name, category, rating or food preference.
          </p>

          <div style={styles.searchBox} className="search-box">
            <input
              type="text"
              placeholder="Search kebap, burger, cafe..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.searchInput}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.select}
            >
              <option>All</option>
              <option>Kebap</option>
              <option>Cafe & Bistro</option>
              <option>Home Cooking</option>
              <option>Burger</option>
            </select>
          </div>
        </section>

        <section style={styles.resultsHeader}>
          <h2 style={styles.sectionTitle}>
            {query ? `Results for "${query}"` : "All Restaurants"}
          </h2>

          <p style={styles.count}>{filteredRestaurants.length} restaurants found</p>
        </section>

        <section style={styles.list}>
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onExplain={() => {}}
              />
            ))
          ) : (
            <div style={styles.emptyBox}>
              <h3>No restaurants found</h3>
              <p>Try searching with another restaurant name or category.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FAF7F2",
    padding: "50px 70px",
  },
  header: {
    background: "linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)",
    color: "white",
    padding: "50px",
    borderRadius: "28px",
    marginBottom: "34px",
  },
  badge: {
    background: "rgba(255,255,255,0.22)",
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    marginBottom: "18px",
  },
  title: {
    fontSize: "42px",
    margin: "0 0 12px",
  },
  subtitle: {
    fontSize: "18px",
    lineHeight: "1.6",
    marginBottom: "28px",
  },
  searchBox: {
    display: "grid",
    gridTemplateColumns: "1fr 220px",
    gap: "16px",
    marginTop: "20px",
  },
  searchInput: {
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    fontSize: "16px",
    outline: "none",
  },
  select: {
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    fontSize: "16px",
    outline: "none",
  },
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: 0,
    color: "#222",
  },
  count: {
    color: "#777",
    fontWeight: "600",
  },
  list: {
    display: "grid",
    gap: "20px",
  },
  emptyBox: {
    background: "white",
    padding: "36px",
    borderRadius: "22px",
    textAlign: "center",
    color: "#666",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
};

export default Search;