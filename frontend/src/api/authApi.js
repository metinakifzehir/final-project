import axiosInstance from './axiosInstance';

// Kayıt olma (register) fonksiyonu
export const registerUser = async (userData) => {
  // Artık merkezi axiosInstance'ı kullanıyoruz.
  // Temel URL'i veya token'ı düşünmemize gerek yok.
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// Giriş yapma (login) fonksiyonu
export const loginUser = async (userData) => {
  const response = await axiosInstance.post('/auth/login', userData);

  // Eğer cevapta access_token varsa, onu localStorage'a kaydet
  if (response.data && response.data.access_token) {
    localStorage.setItem('accessToken', response.data.access_token);
  }

  return response.data;
};

// Çıkış yapma (logout) fonksiyonu
export const logoutUser = () => {
  // localStorage'dan token'ı temizle
  localStorage.removeItem('accessToken');
  // İsteğe bağlı: Kullanıcıyı giriş sayfasına yönlendirebilirsiniz.
  // window.location.href = '/login';
};
