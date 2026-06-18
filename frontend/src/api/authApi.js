import apiClient from './api'; // axiosInstance yerine apiClient kullanıyoruz

// Kayıt olma (register) fonksiyonu
export const registerUser = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

// Giriş yapma (login) fonksiyonu
export const loginUser = async (userData) => {
  const response = await apiClient.post('/auth/login', userData);

  // Eğer cevapta access_token varsa, onu 'token' adıyla localStorage'a kaydet
  if (response.data && response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }

  return response.data; // Tüm yanıtı döndür
};

// Çıkış yapma (logout) fonksiyonu
export const logoutUser = () => {
  // localStorage'dan token'ı temizle
  localStorage.removeItem('token');
  // Kullanıcıyı giriş sayfasına yönlendir
  window.location.href = '/login';
};
