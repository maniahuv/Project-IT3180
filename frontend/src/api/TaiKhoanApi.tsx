// src/api/taikhoanApi.tsx
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/taikhoan";

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

export interface TaiKhoan {
  id?: number;
  username: string;
  password?: string; // Password may not be returned in GET responses for security
  vaiTro?: number;
  hoTen: string; // Matches the roles used in @PreAuthorize (e.g., 'TO_TRUONG', 'TO_PHO')
}


export function fetchAllTaiKhoan() {
  return axios.get<TaiKhoan[]>(API_BASE_URL);
}

export function fetchTaiKhoanById(id: number) {
  return axios.get<TaiKhoan>(`${API_BASE_URL}/${id}`);
}

export function createTaiKhoan(data: TaiKhoan) {
  return axios.post<TaiKhoan>(API_BASE_URL, data);
}

export function updateTaiKhoan(id: number, data: TaiKhoan) {
    console.log('updateTaiKhoan:',(data));
  return axios.put<TaiKhoan>(`${API_BASE_URL}/${id}`, data);
}

export function deleteTaiKhoan(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}