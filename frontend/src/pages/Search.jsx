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
          placeholder="Search kebap, burger, cafe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>All</option>
          <option>Kebap</option>
          <option>Cafe & Bistro</option>
          <option>Home Cooking</option>
          <option>Burger</option>
        </select>
      </section>
      <section className="results-modern"></section>
    </main>
  </div>
);
}

export default Search;