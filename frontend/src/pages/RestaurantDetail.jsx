import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const mockRestaurants = {
  1: {
    name: "Ankara Kebapçısı",
    category: "Kebap",
    rating: 4.6,
    distance: 0.8,
    address: "Kızılay, Ankara",
    isOpen: true,
    priceRange: "$$",
    summary:
      "Known for meat quality, fast service and central location. It is a popular choice for users looking for traditional Turkish food.",
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
    isOpen: true,
    priceRange: "$$",
    summary:
      "A cozy bistro with breakfast, desserts and coffee options for casual meetings.",
    highlights: ["Breakfast Plate", "Cheesecake", "Latte"],
    reviews: [
      "Nice atmosphere for meeting friends.",
      "Desserts and coffee were very good.",
    ],
  },
  3: {
    name: "Burger Point Ankara",
    category: "Burger",
    rating: 4.3,
    distance: 1.7,
    address: "Çankaya, Ankara",
    isOpen: true,
    priceRange: "$$",
    summary:
      "A modern burger place with rich menu options and quick takeaway service.",
    highlights: ["Classic Burger", "Cheese Fries", "Milkshake"],
    reviews: [
      "Burger was juicy and fresh.",
      "Good option for quick dinner.",
    ],
  },
};

function RestaurantDetail() {
  const { id } = useParams();
  const restaurant = mockRestaurants[id];

  if (!restaurant) {
    return (
      <div className="main-bg">
        <Navbar />
        <main className="page-shell">
          <section className="white-card">
            <h2>Restaurant not found.</h2>
          </section>
        </main>
      </div>
    );
  }

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        restaurant.name + " " + restaurant.address
      )}`,
      "_blank"
    );
  };

  return (
    <div className="main-bg">
      <Navbar />

      <main className="page-shell">
        <section className="page-hero">
          <div className="hero-badge">{restaurant.category}</div>

          <h1>{restaurant.name}</h1>

          <p>
            📍 {restaurant.address} · ⭐ {restaurant.rating} ·{" "}
            {restaurant.distance} km away
          </p>

          <div className="detail-actions">
            <span className={restaurant.isOpen ? "open-badge" : "closed-badge"}>
              {restaurant.isOpen ? "Open Now" : "Closed"}
            </span>

            <button className="maps-btn" onClick={openGoogleMaps}>
              View on Google Maps
            </button>
          </div>
        </section>

        <section className="detail-grid-modern">
          <div className="white-card">
            <h2>Restaurant Summary</h2>
            <p>{restaurant.summary}</p>
          </div>

          <div className="white-card">
            <h2>Menu Highlights</h2>
            <div className="tag-list">
              {restaurant.highlights.map((item) => (
                <span key={item} className="food-tag">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="white-card">
            <h2>User Reviews</h2>
            {restaurant.reviews.map((review, index) => (
              <p key={index} className="review-box">
                “{review}”
              </p>
            ))}
          </div>

          <div className="white-card">
            <h2>Add Your Rating</h2>

            <select className="detail-input">
              <option>5 - Excellent</option>
              <option>4 - Good</option>
              <option>3 - Average</option>
              <option>2 - Poor</option>
              <option>1 - Bad</option>
            </select>

            <textarea
              className="detail-textarea"
              placeholder="Write your review..."
            />

            <button className="submit-review-btn">Submit Review</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RestaurantDetail;