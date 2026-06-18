import { createContext, useState, useContext } from 'react';
import apiClient from '../api/api';

const RecommendationContext = createContext();

export const useRecommendations = () => useContext(RecommendationContext);

export const RecommendationProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false); // Takip etmek için yeni state

  // Filtre state'lerini de buraya taşıyoruz
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [radius, setRadius] = useState(5.0);
  const [minRating, setMinRating] = useState(4.0);
  const [minReviews, setMinReviews] = useState(10);
  const [topK, setTopK] = useState(10);

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
          () => reject(new Error("Unable to retrieve your location. Please grant permission."))
        );
      }
    });
  };

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    // setRestaurants([]); // Sonuçları hemen temizleme, yeni sonuç gelince üzerine yaz

    try {
      const location = await getLocation();
      const payload = {
        latitude: location.latitude,
        longitude: location.longitude,
        radius_km: parseFloat(radius),
        min_rating: parseFloat(minRating),
        top_k: parseInt(topK, 10),
        categories: selectedCuisines.length > 0 ? selectedCuisines : undefined,
      };
      const response = await apiClient.post("/recommendations/", payload);
      setRestaurants(response.data.recommendations);
      setHasFetched(true); // Veri çekildi olarak işaretle
    } catch (err) {
      let errorMessage = err.message || "An unexpected error occurred.";
      if (err.response) {
        if (err.response.status === 401) errorMessage = "Please log in to get recommendations.";
        else if (err.response.status === 422) errorMessage = "Invalid or missing data sent to the server.";
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearRecommendations = () => {
    setRestaurants([]);
    setHasFetched(false);
    setError(null);
    setSelectedCuisines([]);
    setRadius(5.0);
    setMinRating(4.0);
    setMinReviews(10);
    setTopK(10);
  };

  const value = {
    restaurants,
    isLoading,
    error,
    hasFetched,
    handleGetRecommendations,
    clearRecommendations,
    // Filtreler ve setter'ları da context'e ekle
    selectedCuisines, setSelectedCuisines,
    radius, setRadius,
    minRating, setMinRating,
    minReviews, setMinReviews,
    topK, setTopK
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
};
