import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/dotthu";

// Add Axios interceptor to include token
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

export interface DotThu {
  maDotThu?: number;
  tenDotThu: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  trangThai?: string;
  khoanThus?: { maKhoanThuDotThu: number }[];
}

export function fetchAllDotThu() {
  return axios.get<DotThu[]>(API_BASE_URL);
}

export function fetchDotThuById(id: number) {
  return axios.get<DotThu>(`${API_BASE_URL}/${id}`);
}

export function createDotThu(data: DotThu) {
  return axios.post<DotThu>(API_BASE_URL, data);
}

export function updateDotThu(id: number, data: DotThu) {
  return axios.put<DotThu>(`${API_BASE_URL}/${id}`, data);
}

export function deleteDotThu(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}