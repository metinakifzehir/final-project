import { useState, useEffect } from "react";
import apiClient from "../api/api";

function ExplanationPanel({ restaurant, onClose }) {
  // State'i artık bir nesne olarak başlatıyoruz
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (restaurant) {
      const fetchExplanation = async () => {
        setIsLoading(true);
        setError(null);
        setExplanation(null); // Önceki açıklamayı temizle

        try {
          const payload = {
            restaurant_id: restaurant.id,
            distance_km: restaurant.distance_km,
          };
          const response = await apiClient.post("/explanations/", payload);
          // Gelen JSON nesnesini doğrudan state'e ata
          setExplanation(response.data);
        } catch (err) {
          setError("Açıklama alınırken bir hata oluştu.");
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchExplanation();
    }
  }, [restaurant]);

  if (!restaurant) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeBtn} onClick={onClose}>×</button>
        <p style={styles.badge}>Explanation</p>
        <h2 style={styles.title}>Why {restaurant.name}?</h2>

        {isLoading && <p>Generating explanation...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Açıklama verisi yüklendiğinde gösterilecek yeni yapı */}
        {explanation && !isLoading && (
          <>
            <div style={styles.section}>
              <h4>✅ Why this is recommended</h4>
              <p>{explanation.reason}</p>
            </div>

            <div style={styles.section}>
              <h4>⭐ Highlights</h4>
              {/* Highlights dizisini liste olarak göster */}
              <ul style={styles.highlightList}>
                {explanation.highlights.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={styles.section}>
              <h4>⚠️ Note</h4>
              <p>{explanation.warning}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Stilleri yeni highlight listesi için güncelle
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
  highlightList: {
    paddingLeft: '20px',
    margin: '8px 0 0',
  }
};

export default ExplanationPanel;
