const BASE_URL = "http://127.0.0.1:8000/api";

const API = {
  // Auth
  LOGIN: `${BASE_URL}/login`,
  LOGOUT: `${BASE_URL}/logout`,
  ME: `${BASE_URL}/me`,

  // Pembeli
  PEMBELI: `${BASE_URL}/pembeli/`,
  PEMBELI_UPDATE: (id_pembeli) => `${BASE_URL}/pembeli/${id_pembeli}`,
  PEMBELI_DELETE: (id_pembeli) => `${BASE_URL}/pembeli/${id_pembeli}`,
  PEMBELI_BY_ID: (id_pembeli) => `${BASE_URL}/pembeli/${id_pembeli}`,

  // Users
  USERS: `${BASE_URL}/users/`,
  USER_BY_ID: (id_users) => `${BASE_URL}/users/${id_users}`,
  USER_DELETE: (id_users) => `${BASE_URL}/users/${id_users}`,

  // Informasi
  INFORMASI: `${BASE_URL}/informasi/`,
  INFORMASI_UPDATE: (id) => `${BASE_URL}/informasi/${id}`,
  INFORMASI_DELETE: (id) => `${BASE_URL}/informasi/${id}`,
  INFORMASI_FOTO: `${BASE_URL}/informasi/foto`,
  
  // Kalender Panen
  KALENDER_PANEN: `${BASE_URL}/kalender-panen/`,
  KALENDER_PANEN_UPDATE: (id) => `${BASE_URL}/kalender-panen/${id}`,
  KALENDER_PANEN_DELETE: (id) => `${BASE_URL}/kalender-panen/${id}`,
  
  // Prediksi Permintaan
  PREDIKSI_PERMINTAAN: `${BASE_URL}/prediksi-permintaan/`,
  PREDIKSI_PERMINTAAN_UPDATE: (id) => `${BASE_URL}/prediksi-permintaan/${id}`,
  PREDIKSI_PERMINTAAN_DELETE: (id) => `${BASE_URL}/prediksi-permintaan/${id}`
};

export default API;