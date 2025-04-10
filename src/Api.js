const BASE_URL = "http://127.0.0.1:8000/api";

const API = {
  LOGIN: `${BASE_URL}/login`,
  LOGOUT: `${BASE_URL}/logout`,
  ME: `${BASE_URL}/me`,
  PEMBELI: `${BASE_URL}/pembeli/`,
  PEMBELI_UPDATE: (id_pembeli) => `${BASE_URL}/pembeli/${id_pembeli}`,
  PEMBELI_DELETE: (id_pembeli) => `${BASE_URL}/pembeli/${id_pembeli}`,
  PEMBELI_BY_ID: (id_pembeli) => `${BASE_URL}/pembeli/${id_pembeli}`,
};

export default API;