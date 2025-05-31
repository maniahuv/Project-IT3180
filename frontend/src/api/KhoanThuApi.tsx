import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/khoanthu";

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

export interface KhoanThu {
  maKhoanThu?: number;
  tenKhoanThu: string;
  loaiKhoanThu?: string; // Optional, as it may be null
  soTien?: number; // Using number for Float in TypeScript
  batBuoc: boolean;
  ghiChu?: string; // Optional, as it may be null
  nguoiTao?: { id: number }; // Simplified reference to TaiKhoan entity
  dotThus?: { maDotThu: number }[]; // Simplified reference to KhoanThuDotThu entities
}

export function fetchAllKhoanThu() {
  return axios.get<KhoanThu[]>(API_BASE_URL);
}

export function fetchKhoanThuById(id: number) {
  return axios.get<KhoanThu>(`${API_BASE_URL}/${id}`);
}

export function createKhoanThu(data: KhoanThu) {
  return axios.post<KhoanThu>(API_BASE_URL, data);
}

export function updateKhoanThu(id: number, data: KhoanThu) {
  return axios.put<KhoanThu>(`${API_BASE_URL}/${id}`, data);
}

export function deleteKhoanThu(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}