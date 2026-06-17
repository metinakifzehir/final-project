import axios from 'axios';

// 1. Backend API'sinin temel adresini tanımla
const API_BASE_URL = 'http://localhost:8000/api/v1';

// 2. Yeni bir Axios instance'ı oluştur
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// 3. Axios Interceptor (Araya Girici) Ekle
// Bu interceptor, her istek gönderilmeden hemen önce çalışır.
axiosInstance.interceptors.request.use(
  (config) => {
    // localStorage'dan token'ı al
    const token = localStorage.getItem('accessToken');

    // Eğer token varsa, isteğin Authorization başlığına ekle
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // İstek hatası durumunda ne olacağını belirt
    return Promise.reject(error);
  }
);

export default axiosInstance;
