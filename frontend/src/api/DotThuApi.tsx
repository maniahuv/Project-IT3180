import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/dotthu";

export interface DotThu {
  maDotThu: number;
  tenDotThu: string;
  ngayBatDau?: string; // LocalDate serialized as string (e.g., "YYYY-MM-DD")
  ngayKetThuc?: string; // Optional, as it may be null
  trangThai?: string; // Optional, as it may be null
  khoanThus?: { maKhoanThuDotThu: number }[]; // Simplified reference to KhoanThuDotThu entities
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