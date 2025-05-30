import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/khoanthu-dotthu";

export interface KhoanThuDotThu {
  idKhoanThuDotThu: number;
  khoanThu: { maKhoanThu: number }; // Simplified reference to KhoanThu entity
  dotThu: { maDotThu: number }; // Simplified reference to DotThu entity
}

export function fetchAllKhoanThuDotThu() {
  return axios.get<KhoanThuDotThu[]>(API_BASE_URL);
}

export function fetchKhoanThuDotThuById(id: number) {
  return axios.get<KhoanThuDotThu>(`${API_BASE_URL}/${id}`);
}

export function createKhoanThuDotThu(data: KhoanThuDotThu) {
  return axios.post<KhoanThuDotThu>(API_BASE_URL, data);
}

export function updateKhoanThuDotThu(id: number, data: KhoanThuDotThu) {
  return axios.put<KhoanThuDotThu>(`${API_BASE_URL}/${id}`, data);
}

export function deleteKhoanThuDotThu(id: number) {
  return axios.delete(`${API_BASE_URL}/${id}`);
}