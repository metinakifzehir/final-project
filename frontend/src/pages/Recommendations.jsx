import { useState } from "react";
import ExplanationPanel from "../components/ExplanationPanel";
import Navbar from "../components/Navbar";
import RestaurantCard from "../components/RestaurantCard";

const mockRestaurants = [
  {
    id: 1,
    name: "Ankara Kebapçısı",
    category: "Kebap",
    rating: 4.6,
    distance: 0.8,
    isOpen: true,
    summary: "Et kalitesi, hızlı servisi ve merkezi konumuyla öne çıkan popüler bir kebap restoranı.",
  },
  {
    id: 2,
    name: "Bistro Bahçelievler",
    category: "Cafe & Bistro",
    rating: 4.4,
    distance: 1.2,
    isOpen: true,
    summary: "Kahvaltı, tatlı ve kahve seçenekleriyle arkadaş buluşmaları için uygun bir mekan.",
  },
  {
    id: 3,
    name: "Ev Yemekleri Durağı",
    category: "Ev Yemeği",
    rating: 4.7,
    distance: 0.5,
    isOpen: false,
    summary: "Uygun fiyatlı, temiz ve günlük ev yemekleriyle özellikle öğle yemekleri için tercih ediliyor.",
  },
];

function Recommendations() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  return (
    <>
      <Navbar />

      <main style={styles.page} className="page-container">
        <section style={styles.hero} className="hero-section">
          <p style={styles.badge}>AI-Powered Restaurant Recommendations</p>
          <h1 style={styles.title} className="hero-title">Find the best restaurants around you</h1>
          <p style={styles.subtitle}>
            Get personalized restaurant suggestions based on your location,
            preferences and real user reviews.
          </p>
        </section>

        <section style={styles.content} className="content-grid">
          <aside style={styles.filters}>
            <h3>Filters</h3>

            <label style={styles.label}>Radius</label>
            <select style={styles.input}>
              <option>All</option>
                <option>1 km</option>
                <option>3 km</option>
                <option>5 km</option>
                <option>10 km</option>
                <option>15 km</option>
                <option>20 km</option>
            </select>

            <label style={styles.label}>Category</label>
            <select style={styles.input}>
              <option>All</option>
              <option>Kebap</option>
              <option>Burger</option>
              <option>Cafe</option>
              <option>Ev Yemeği</option>
            </select>

            <label style={styles.label}>Minimum Rating</label>
            <select style={styles.input}>
              <option>2.0+</option>
              <option>2.5+</option>
              <option>3.0+</option>
              <option>3.5+</option>
              <option>4.0+</option>
              <option>4.5+</option>
            </select>

            <label style={styles.label}>Top-K Results</label>
            <select style={styles.input}>
            <option>5</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
            </select>

            <label style={styles.label}>Minimum Review Count</label>
            <select style={styles.input}>
            <option>10+</option>
            <option>25+</option>
            <option>50+</option>
            <option>100+</option>
            </select>

            <button style={styles.filterBtn}>Get Recommendations</button>
          </aside>

          <section style={styles.list}>
            <h2 style={styles.sectionTitle}>Top Recommendations</h2>

            {mockRestaurants.map((restaurant) => (
                <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onExplain={setSelectedRestaurant}
                />
            ))}
            </section>
        </section>
      </main>
      <ExplanationPanel
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
        />
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#FAF7F2",
    padding: "50px 70px",
  },
  hero: {
    background: "linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)",
    color: "white",
    padding: "50px",
    borderRadius: "28px",
    marginBottom: "36px",
  },
  badge: {
    background: "rgba(255,255,255,0.22)",
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    marginBottom: "18px",
  },
  title: {
    fontSize: "44px",
    margin: "0 0 14px",
  },
  subtitle: {
    fontSize: "18px",
    maxWidth: "680px",
    lineHeight: "1.6",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    gap: "30px",
  },
  filters: {
    background: "white",
    borderRadius: "22px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.07)",
    height: "fit-content",
  },
  label: {
    display: "block",
    marginTop: "18px",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #ddd",
  },
  filterBtn: {
    width: "100%",
    marginTop: "24px",
    padding: "13px",
    background: "#FF6B35",
    color: "white",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
  },
  list: {
    display: "grid",
    gap: "20px",
  },
  sectionTitle: {
    marginTop: 0,
    color: "#222",
  },
};

export default Recommendations;