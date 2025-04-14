const BASE_URL = "http://127.0.0.1:8000/api";

const API = {
  BASE_URL: BASE_URL,
  
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

  // Produk
  PRODUK: `${BASE_URL}/produk/`,
  PRODUK_BY_ID: (id_produk) => `${BASE_URL}/produk/${id_produk}`,
  PRODUK_UPDATE: (id_produk) => `${BASE_URL}/produk/${id_produk}`,
  PRODUK_DELETE: (id_produk) => `${BASE_URL}/produk/${id_produk}`,
  VIEW_IMAGE: (filename) => `${BASE_URL}/produk/view_image/${filename}`,

  // Logistik
  LOGISTIK: `${BASE_URL}/logistik/`,
  LOGISTIK_BY_ID: (id) => `${BASE_URL}/logistik/${id}`,
  LOGISTIK_UPDATE: (id) => `${BASE_URL}/logistik/${id}`,
  LOGISTIK_DELETE: (id) => `${BASE_URL}/logistik/${id}`,

  // Produksi
  PRODUKSI: `${BASE_URL}/produksi/`,
  PRODUKSI_BY_ID: (id) => `${BASE_URL}/produksi/${id}`,
  PRODUKSI_UPDATE: (id) => `${BASE_URL}/produksi/${id}`,
  PRODUKSI_DELETE: (id) => `${BASE_URL}/produksi/${id}`,
};

export default API;
