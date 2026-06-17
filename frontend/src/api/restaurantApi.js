import axiosInstance from './axiosInstance';

// Öneri (recommendations) alma fonksiyonu
export const getRecommendations = async (recommendationData) => {
  // Artık merkezi axiosInstance'ı kullanıyoruz.
  // Bu instance, token'ı otomatik olarak header'a ekleyecektir.
  const response = await axiosInstance.post('/recommendations/', recommendationData);
  return response.data;
};

// Açıklama (explanation) alma fonksiyonu
export const getExplanation = async (explanationData) => {
  const response = await axiosInstance.post('/explanations/', explanationData);
  return response.data;
};
