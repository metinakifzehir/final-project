function ExplanationPanel({ restaurant, onClose }) {
  if (!restaurant) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <p style={styles.badge}>Explanation</p>

        <h2 style={styles.title}>Why {restaurant.name}?</h2>

        <div style={styles.section}>
          <h4>✅ Why this is recommended</h4>
          <p>
            This restaurant matches your selected preferences and is located
            close to your current area. It also has a strong rating and positive
            review patterns.
          </p>
        </div>

        <div style={styles.section}>
          <h4>⭐ Highlights</h4>
          <p>{restaurant.summary}</p>
        </div>

        <div style={styles.section}>
          <h4>📍 Distance</h4>
          <p>{restaurant.distance} km away from your selected location.</p>
        </div>

        <div style={styles.section}>
          <h4>⚠️ Note</h4>
          <p>
            Since this is an AI-generated explanation, it should be considered
            as a helpful summary rather than a final decision.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modal: {
    width: "520px",
    background: "#fff",
    borderRadius: "24px",
    padding: "32px",
    position: "relative",
    boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
  },
  closeBtn: {
    position: "absolute",
    top: "18px",
    right: "22px",
    border: "none",
    background: "transparent",
    fontSize: "30px",
    cursor: "pointer",
    color: "#555",
  },
  badge: {
    display: "inline-block",
    background: "#FFF0E8",
    color: "#FF6B35",
    padding: "8px 14px",
    borderRadius: "999px",
    fontWeight: "700",
  },
  title: {
    marginTop: "18px",
    marginBottom: "24px",
    color: "#222",
  },
  section: {
    marginBottom: "18px",
    color: "#555",
    lineHeight: "1.6",
  },
};

export default ExplanationPanel;