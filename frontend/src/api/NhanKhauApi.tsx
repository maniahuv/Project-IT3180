// src/api/nhankhauApi.tsx
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/nhankhau";

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

export interface NhanKhau {
  maNhanKhau?: number;
  hoTen: string;
  ngaySinh: string; // LocalDate will be serialized as string (e.g., "YYYY-MM-DD")
  gioiTinh: boolean; // true = male, false = female
  cmnd?: string; // Optional, as it may not be required for all records
  qhVoiChuHo?: string; // Relationship with head of household
  trangThai?: string; // Status
  hoKhau?: { maHoKhau: number }; // Simplified reference to HoKhau entity
}

export function fetchAllNhanKhau() {
  return axios.get<NhanKhau[]>(API_BASE_URL);
}

export function fetchNhanKhauById(id: number) {
  return axios.get<NhanKhau>(`${API_BASE_URL}/${id}`);
}

export function createNhanKhau(data: NhanKhau) {
  return axios.post<NhanKhau>(API_BASE_URL, data);
}

export function updateNhanKhau(id: number, data: NhanKhau) {
  return axios.put<NhanKhau>(`${API_BASE_URL}/${id}`, data);
}

export function deleteNhanKhau(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}