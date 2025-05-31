import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/tamtrutamvang";

axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export interface TamTruTamVang {
  id?: number;
  loai?: string; // Optional, as it may be null
  ngayBatDau?: string; // LocalDate serialized as string (e.g., "YYYY-MM-DD")
  ngayKetThuc?: string; // Optional, as it may be null
  lyDo?: string; // Optional, as it may be null
  maNhanKhau: number;
  nhanKhau: { maNhanKhau: number }; // Simplified reference to NhanKhau entity
}

export const fetchAllTamTruTamVang = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  console.log('TamTruTamVangApi - Sending request to /api/tamtrutamvang with token:', token.substring(0, 20) + '...');
  return axios.get('http://localhost:8080/api/tamtrutamvang', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export function fetchTamTruTamVangById(id: number) {
  return axios.get<TamTruTamVang>(`${API_BASE_URL}/${id}`);
}

export function createTamTruTamVang(data: TamTruTamVang) {
  return axios.post<TamTruTamVang>(API_BASE_URL, data);
}

export function updateTamTruTamVang(id: number, data: TamTruTamVang) {
  return axios.put<TamTruTamVang>(`${API_BASE_URL}/${id}`, data);
}

export function deleteTamTruTamVang(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}