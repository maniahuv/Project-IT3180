import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/hokhau";

export interface HoKhau {
  maHoKhau: number;
  chuHo: number; // ID of the head of household (maNhanKhau)
  soNha: string;
  ngayLap: string; // LocalDate serialized as string (e.g., "YYYY-MM-DD")
  ngayCapNhat?: string; // Optional, as it may be null
  dienTich: number;
  danhSachNhanKhau?: { maNhanKhau: number }[]; // Simplified reference to NhanKhau entities
  lichSuHoKhau?: { maLichSu: number }[]; // Simplified reference to LichSuHoKhau entities
}

export function fetchAllHoKhau() {
  return axios.get<HoKhau[]>(API_BASE_URL);
}

export function fetchHoKhauById(id: number) {
  return axios.get<HoKhau>(`${API_BASE_URL}/${id}`);
}

export function createHoKhau(data: HoKhau) {
  return axios.post<HoKhau>(API_BASE_URL, data);
}

export function updateHoKhau(id: number, data: HoKhau) {
  return axios.put<HoKhau>(`${API_BASE_URL}/${id}`, data);
}

export function deleteHoKhau(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}