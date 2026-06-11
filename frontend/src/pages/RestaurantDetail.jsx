import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const mockRestaurants = {
  1: {
    name: "Ankara Kebapçısı",
    category: "Kebap",
    rating: 4.6,
    distance: 0.8,
    address: "Kızılay, Ankara",
    summary:
      "Et kalitesi, hızlı servisi ve merkezi konumuyla öne çıkan popüler bir kebap restoranı.",
    highlights: ["Adana Kebap", "Lahmacun", "Ayran"],
    reviews: [
      "Service was fast and the kebap was delicious.",
      "Good location and friendly staff.",
    ],
  },
  2: {
    name: "Bistro Bahçelievler",
    category: "Cafe & Bistro",
    rating: 4.4,
    distance: 1.2,
    address: "Bahçelievler, Ankara",
    summary:
      "Kahvaltı, tatlı ve kahve seçenekleriyle arkadaş buluşmaları için uygun bir mekan.",
    highlights: ["Breakfast Plate", "Cheesecake", "Latte"],
    reviews: [
      "Nice atmosphere for meeting friends.",
      "Desserts and coffee were very good.",
    ],
  },
  3: {
    name: "Ev Yemekleri Durağı",
    category: "Ev Yemeği",
    rating: 4.7,
    distance: 0.5,
    address: "Çankaya, Ankara",
    summary:
      "Uygun fiyatlı, temiz ve günlük ev yemekleriyle özellikle öğle yemekleri için tercih ediliyor.",
    highlights: ["Soup", "Rice", "Daily Meals"],
    reviews: [
      "Affordable and clean place.",
      "Great option for lunch.",
    ],
  },
};

function RestaurantDetail() {
  const { id } = useParams();
  const restaurant = mockRestaurants[id];

  if (!restaurant) {
    return (
      <>
        <Navbar />
        <main style={styles.page}>
          <h2>Restaurant not found.</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={styles.page} className="page-container">
        <section style={styles.header} className="restaurant-header">
          <div>
            <p style={styles.badge}>{restaurant.category}</p>
            <h1 style={styles.title}>{restaurant.name}</h1>
            <p style={styles.address}>📍 {restaurant.address}</p>
          </div>

          <div style={styles.ratingBox}>
            <span style={styles.rating}>⭐ {restaurant.rating}</span>
            <span>{restaurant.distance} km away</span>
          </div>
        </section>

         <button
            style={styles.mapsButton}
            onClick={() =>
                window.open(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    restaurant.name + " " + restaurant.address
                )}`,
                "_blank"
                )
            }
        >
            📍 View on Google Maps
        </button>

        <section style={styles.grid} className="restaurant-detail-grid">
          <div style={styles.card}>
            <h2>Restaurant Summary</h2>
            <p>{restaurant.summary}</p>
          </div>

          <div style={styles.card}>
            <h2>Menu Highlights</h2>
            <div style={styles.tags}>
              {restaurant.highlights.map((item) => (
                <span key={item} style={styles.tag}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <h2>User Reviews</h2>
            {restaurant.reviews.map((review, index) => (
              <p key={index} style={styles.review}>
                “{review}”
              </p>
            ))}
          </div>

          <div style={styles.card}>
            <h2>Add Your Rating</h2>
            <select style={styles.input}>
              <option>5 - Excellent</option>
              <option>4 - Good</option>
              <option>3 - Average</option>
              <option>2 - Poor</option>
              <option>1 - Bad</option>
            </select>

            <textarea
              style={styles.textarea}
              placeholder="Write your review..."
            />

            <button style={styles.button}>Submit Review</button>
          </div>
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
    borderRadius: "28px",
    padding: "45px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  badge: {
    background: "rgba(255,255,255,0.22)",
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    marginBottom: "14px",
  },
  title: {
    fontSize: "42px",
    margin: 0,
  },
  address: {
    fontSize: "17px",
    opacity: 0.95,
  },
  ratingBox: {
    background: "rgba(255,255,255,0.22)",
    padding: "20px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
  },
  rating: {
    fontSize: "26px",
    fontWeight: "bold",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
  },
  card: {
    background: "white",
    borderRadius: "22px",
    padding: "26px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    lineHeight: "1.6",
  },
  tags: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  tag: {
    background: "#FFF0E8",
    color: "#FF6B35",
    padding: "10px 14px",
    borderRadius: "999px",
    fontWeight: "600",
  },
  review: {
    background: "#FAF7F2",
    padding: "14px",
    borderRadius: "14px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    marginBottom: "14px",
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    marginBottom: "14px",
    resize: "vertical",
  },
  button: {
    background: "#FF6B35",
    color: "white",
    border: "none",
    padding: "13px 20px",
    borderRadius: "14px",
    cursor: "pointer",
  },
  mapsButton: {
    background: "#4285F4",
    color: "white",
    border: "none",
    padding: "14px 22px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "28px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
},
};

export default RestaurantDetail;